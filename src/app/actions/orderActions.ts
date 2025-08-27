'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

// Định nghĩa kiểu dữ liệu cho form
type FormData = {
    customerName: string;
    phoneNumber: string;
    address: string;
    note?: string;
};

// Định nghĩa kiểu dữ liệu cho sản phẩm (đơn lẻ)
type ProductData = {
    id: number;
    quantity: number;
    price: number;
};

// NEW: Định nghĩa kiểu dữ liệu cho sản phẩm trong giỏ hàng
type CartItemData = {
    id: number;
    quantity: number;
    price: number;
    name: string; // Thêm name để revalidate path nếu cần
};


export async function createDirectOrder(formData: FormData, productData: ProductData) {
    try {
        // Kiểm tra số lượng tồn kho trước khi tạo đơn hàng
        const product = await prisma.products.findUnique({
            where: { id: productData.id },
        });

        if (!product || product.quantity < productData.quantity) {
            return { success: false, message: 'Sản phẩm không đủ số lượng hoặc không tồn tại.' };
        }

        const totalAmount = productData.price * productData.quantity;

        // Sử dụng transaction để đảm bảo cả 2 thao tác cùng thành công hoặc thất bại
        await prisma.$transaction(async (tx) => {
            // 1. Tạo đơn hàng mới
            const newOrder = await tx.orders.create({
                data: {
                    customer_name: formData.customerName,
                    phone_number: formData.phoneNumber,
                    address: formData.address,
                    note: formData.note,
                    total_amount: totalAmount,
                    status: 'NEW', // Trạng thái mặc định là MỚI
                },
            });

            // 2. Tạo chi tiết đơn hàng (order item)
            await tx.order_items.create({
                data: {
                    order_id: newOrder.id,
                    product_id: productData.id,
                    quantity: productData.quantity,
                    price_at_purchase: productData.price,
                },
            });

            // 3. Cập nhật lại số lượng tồn kho của sản phẩm
            await tx.products.update({
                where: { id: productData.id },
                data: {
                    quantity: {
                        decrement: productData.quantity,
                    },
                },
            });
        });

        // Xóa cache của trang sản phẩm để cập nhật số lượng tồn kho
        revalidatePath(`/san-pham/${productData.id}`);

        return { success: true, message: 'Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm.' };

    } catch (error) {
        console.error('Error creating direct order:', error);
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' };
    }
}


// --- NEW: ACTION ĐỂ TẠO ĐƠN HÀNG TỪ GIỎ HÀNG ---
export async function createOrderFromCart(formData: FormData, cartItems: CartItemData[]) {
    try {
        const productIds = cartItems.map(item => item.id);

        // Lấy thông tin tất cả sản phẩm trong giỏ hàng MỘT LẦN DUY NHẤT
        const productsInCart = await prisma.products.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
            select: {
                id: true,
                quantity: true,
                name: true,
            },
        });

        // Chuyển danh sách sản phẩm thành một Map để truy cập nhanh hơn
        const productMap = new Map(productsInCart.map(p => [p.id, p]));

        // --- BẮT ĐẦU TRANSACTION ---
        // Tăng thời gian chờ và timeout để xử lý các trường hợp cao điểm
        const result = await prisma.$transaction(async (tx) => {
            // 1. Kiểm tra tồn kho (sử dụng dữ liệu đã lấy trước đó)
            for (const item of cartItems) {
                const product = productMap.get(item.id);
                if (!product || product.quantity < item.quantity) {
                    throw new Error(`Sản phẩm "${product?.name || item.name}" không đủ số lượng.`);
                }
            }

            // 2. Tính tổng số tiền
            const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            // 3. Tạo một bản ghi 'orders'
            const newOrder = await tx.orders.create({
                data: {
                    customer_name: formData.customerName,
                    phone_number: formData.phoneNumber,
                    address: formData.address,
                    note: formData.note,
                    total_amount: totalAmount,
                    status: 'NEW',
                },
            });

            // 4. Tạo các bản ghi 'order_items' tương ứng
            await tx.order_items.createMany({
                data: cartItems.map(item => ({
                    order_id: newOrder.id,
                    product_id: item.id,
                    quantity: item.quantity,
                    price_at_purchase: item.price,
                })),
            });

            // 5. Cập nhật số lượng tồn kho cho từng sản phẩm (Promise.all)
            await Promise.all(
                cartItems.map(item =>
                    tx.products.update({
                        where: { id: item.id },
                        data: {
                            quantity: {
                                decrement: item.quantity,
                            },
                        },
                    }),
                ),
            );

            return { orderId: newOrder.id };
        }, {
            maxWait: 10000, // Tăng thời gian chờ lên 10s
            timeout: 15000, // Tăng thời gian thực thi lên 15s
        });
        // --- KẾT THÚC TRANSACTION ---


        // Revalidate các trang sản phẩm liên quan
        // Dùng Promise.all để chạy song song, tránh block không cần thiết
        await Promise.all(
            cartItems.map(item => revalidatePath(`/san-pham/${item.id}`))
        );
        revalidatePath('/(root)/gio-hang'); // Revalidate trang giỏ hàng

        return { success: true, message: 'Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm.' };
    } catch (error: any) {
        console.error('Error creating order from cart:', error);
        return { success: false, message: error.message || 'Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.' };
    }
}