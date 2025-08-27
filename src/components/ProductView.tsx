'use client';

import { useEffect, useState } from 'react';
import { products } from '@prisma/client';
import Image from 'next/image';
import { MapPin, Phone, ShieldCheck, Wrench, Truck, CircleCheck, ListChecks, ShoppingCart } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

import Notification from '@/components/Notification';
import CheckoutModal from '@/components/CheckoutModal'; // <-- IMPORT MODAL

type ProductViewProps = Omit<products, 'price_agency' | 'price_retail' | 'price_retail_with_install'> & {
    price_agency: number;
    price_retail: number;
    price_retail_with_install: number;
};


const formatPrice = (price: number | bigint) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price));
};

export default function ProductView({ product }: { product: ProductViewProps }) {
    const { addProduct } = useRecentlyViewed();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [notification, setNotification] = useState<{ 
    show: boolean; 
    message: string; 
    product?: { name: string; image_url: string }; // <-- Changed from 'any' to a specific type
    quantity?: number; 
} | null>(null);
    
    // State để quản lý modal Mua Ngay
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        addProduct({
            id: product.id,
            name: product.name,
            image: product.image_url,
            href: `/san-pham/${product.id}`
        });
    }, [product, addProduct]);

    const handleAddToCart = () => {
        const itemToAdd = {
            id: product.id,
            name: product.name,
            image_url: product.image_url,
            price: Number(product.price_retail_with_install),
        };
        addToCart(itemToAdd, quantity);

        setNotification({
            show: true,
            message: 'Đã thêm vào giỏ hàng thành công!',
            product: { name: product.name, image_url: product.image_url },
            quantity: quantity,
        });
    };
    
    const handleOrderSuccess = (message: string) => {
        setNotification({
            show: true,
            message: message, // Hiển thị thông báo thành công từ server
        });
    }

    const handleQuantityChange = (amount: number) => {
        const newQuantity = quantity + amount;
        if (newQuantity > 0 && newQuantity <= product.quantity) {
            setQuantity(newQuantity);
        }
    };
    
    const renderFeatures = () => {
        if (!product.features || !Array.isArray(product.features) || product.features.length === 0) return null;
        const features = product.features as string[];
        return (
            <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                    <ListChecks size={20} /> Tính năng nổi bật
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-500">
                    {features.map((feature, index) => <li key={index}>{feature}</li>)}
                </ul>
            </div>
        );
    };

    return (
        <>
            <div className="bg-gray-50 pb-8 md:pb-12">
                <div className="container mx-auto px-4">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                            {/* Cột trái: Hình ảnh */}
                            <div className="flex flex-col items-center">
                                <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
                                    <Image src={product.image_url} alt={product.name} fill className="object-contain p-2" priority sizes="(max-width: 768px) 100vw, 448px"/>
                                </div>
                            </div>
                            {/* Cột phải: Thông tin */}
                            <div className="flex flex-col space-y-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
                                <div>
                                    <div className="mb-2">
                                        <span className="text-3xl md:text-4xl font-bold text-red-600">{formatPrice(Number(product.price_retail_with_install))}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        <span className="font-semibold">Tình trạng:</span> 
                                        <span className={product.quantity > 0 ? "text-green-600" : "text-red-600"}>{product.quantity > 0 ? "Còn hàng" : "Hết hàng"}</span>
                                        {product.quantity > 0 && <span className="ml-2">(Còn {product.quantity} sản phẩm)</span>}
                                    </p>
                                </div>
                                {renderFeatures()}
                                <div className="space-y-4">
                                    {product.quantity > 0 && (
                                        <div className="flex items-center gap-4 text-gray-600">
                                            <span className="font-semibold">Số lượng:</span>
                                            <div className="flex items-center border rounded-md">
                                                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="px-3 py-1 text-xl hover:bg-gray-100 rounded-l-md disabled:opacity-50">-</button>
                                                <span className="px-4 py-1 border-x">{quantity}</span>
                                                <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.quantity} className="px-3 py-1 text-xl hover:bg-gray-100 rounded-r-md disabled:opacity-50">+</button>
                                            </div>
                                        </div>
                                    )}
                                    {/* --- THAY ĐỔI Ở ĐÂY: Thêm nút MUA NGAY --- */}
                                    {/* --- CẬP NHẬT Ở ĐÂY: Tinh chỉnh lại thiết kế 2 nút --- */}
<div className="flex flex-col sm:flex-row gap-3 items-stretch"> {/* Thêm items-stretch */}
    {/* Nút MUA NGAY (Nút chính) */}
    <button
        onClick={() => setIsModalOpen(true)}
        className="w-full sm:w-3/5 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg text-center flex flex-col justify-center"
    >
        <span className="font-bold text-lg leading-tight">MUA NGAY</span>
        <span className="text-xs font-normal opacity-90">Giao hàng, lắp đặt tận nơi</span>
    </button>
    
    {/* Nút Thêm vào giỏ (Nút phụ - kiểu "outline") */}
    <button
        onClick={handleAddToCart}
        className="w-full sm:w-2/5 bg-transparent border-2 border-blue-600 text-blue-600 p-3 rounded-lg transition-all duration-200 hover:bg-blue-600 hover:text-white hover:shadow-md flex items-center justify-center gap-2"
    >
        <ShoppingCart size={18} />
        <span className="font-semibold text-sm">Thêm vào giỏ</span>
    </button>
</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                        <button className="bg-gray-800 text-white p-2 rounded-md hover:bg-black transition-colors text-sm"><span>033 440 3206</span><span className="block text-xs font-light">Tư vấn 24/7</span></button>
                                        <button className="bg-gray-800 text-white p-2 rounded-md hover:bg-black transition-colors text-sm"><span>098 221 6069</span><span className="block text-xs font-light">Hỗ trợ kỹ thuật</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Phần mô tả và chính sách */}
                        {/* ... (Giữ nguyên phần còn lại) ... */}
                    </div>
                </div>
            </div>

            {/* Hiển thị Notification */}
            {notification?.show && (
                <Notification
                    message={notification.message}
                    product={notification.product}
                    quantity={notification.quantity}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Hiển thị Modal Mua Ngay */}
            {isModalOpen && (
                <CheckoutModal
                    product={product}
                    quantity={quantity}
                    onClose={() => setIsModalOpen(false)}
                    onOrderSuccess={handleOrderSuccess}
                />
            )}
        </>
    );
}

