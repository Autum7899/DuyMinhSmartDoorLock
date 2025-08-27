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

// Định nghĩa kiểu dữ liệu cho sản phẩm
type ProductData = {
    id: number;
    quantity: number;
    price: number;
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