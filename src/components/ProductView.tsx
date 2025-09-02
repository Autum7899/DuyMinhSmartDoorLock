'use client';

import { useEffect, useMemo, useState } from 'react';
import { products } from '@prisma/client';
import Image from 'next/image';
import { ListChecks, ShoppingCart } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

import Notification from '@/components/Notification';
import CheckoutModal from '@/components/CheckoutModal';

type ProductViewProps = Omit<
    products,
    'price_agency' | 'price_retail' | 'price_retail_with_install'
> & {
    price_agency: number;
    price_retail: number;
    price_retail_with_install: number;
};

const formatPrice = (price: number | bigint) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(Number(price));
};

export default function ProductView({ product }: { product: ProductViewProps }) {
    const { addProduct } = useRecentlyViewed();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        product?: { name: string; image_url: string };
        quantity?: number;
    } | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const productForRecentlyViewed = useMemo(
        () => ({
            id: product.id,
            name: product.name,
            image: product.image_url,
            href: `/san-pham/${product.id}`,
        }),
        [product.id, product.name, product.image_url],
    );

    useEffect(() => {
        addProduct(productForRecentlyViewed);
    }, [productForRecentlyViewed, addProduct]);

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
            message: message,
        });
    };

    const handleQuantityChange = (amount: number) => {
        const newQuantity = quantity + amount;
        if (newQuantity > 0 && newQuantity <= product.quantity) {
            setQuantity(newQuantity);
        }
    };

    const renderFeatures = () => {
        if (!product.features || !Array.isArray(product.features) || product.features.length === 0)
            return null;
        const features = product.features as string[];
        return (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 md:p-4 shadow-sm">
                <h3 className="mb-2.5 flex items-center gap-1.5 text-sm font-semibold text-blue-800">
                    <ListChecks size={16} className="text-blue-600" />
                    Tính năng nổi bật
                </h3>
                <ul className="list-disc list-inside space-y-1 text-[13px] leading-5 text-blue-700">
                    {features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <>
            <div className="bg-gray-50 py-6 md:py-8">
                <div className="container mx-auto px-3 md:px-4">
                    <div className="bg-white p-5 md:p-6 rounded-lg shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
                            {/* Cột trái: Hình ảnh */}
                            <div className="flex flex-col items-center">
                                <div className="relative w-full max-w-sm md:max-w-md mx-auto aspect-square flex items-center justify-center">
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-1.5 md:p-2"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 380px"
                                    />
                                </div>
                            </div>

                            {/* Cột phải: Thông tin */}
                            <div className="flex flex-col">
                                <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                                    {product.name}
                                </h1>

                                <div className="mb-4">
                  <span className="text-2xl md:text-3xl font-bold text-red-600 block mb-1.5">
                    {formatPrice(Number(product.price_retail_with_install))}
                  </span>
                                    <p className="text-gray-600 text-sm">
                                        <span className="font-semibold">Tình trạng:</span>{' '}
                                        <span className={product.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                                        {product.quantity > 0 && (
                                            <span className="ml-1.5">(Còn {product.quantity} sản phẩm)</span>
                                        )}
                                    </p>
                                </div>

                                {renderFeatures()}

                                {/* Chính sách bảo hành & dịch vụ (vàng) */}
                                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 mb-5 shadow-sm">
                                    <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-amber-800">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      ⭐
                    </span>
                                        Chính sách bảo hành & dịch vụ
                                    </h3>
                                    <ul className="list-disc list-inside space-y-1.5 text-[13px] leading-5 text-amber-700">
                                        <li>
                                            Bảo hành <strong className="text-amber-900">18 tháng</strong> – 1 đổi 1 nếu lỗi nhà sản xuất
                                        </li>
                                        <li>Bảo trì miễn phí tận tâm sau lắp đặt</li>
                                        <li>Miễn phí lắp đặt & vận chuyển trên toàn quốc</li>
                                    </ul>
                                </div>

                                <div>
                                    {product.quantity > 0 && (
                                        <div className="flex items-center gap-3 text-gray-600 mb-3">
                                            <span className="font-semibold text-sm">Số lượng:</span>
                                            <div className="flex items-center border rounded-md">
                                                <button
                                                    onClick={() => handleQuantityChange(-1)}
                                                    disabled={quantity <= 1}
                                                    className="px-2 py-1 text-lg hover:bg-gray-100 rounded-l-md disabled:opacity-50"
                                                >
                                                    -
                                                </button>
                                                <span className="px-3 py-1 border-x text-sm">{quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(1)}
                                                    disabled={quantity >= product.quantity}
                                                    className="px-2 py-1 text-lg hover:bg-gray-100 rounded-r-md disabled:opacity-50"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-2.5 items-stretch mb-5">
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="w-full sm:w-3/5 bg-red-600 text-white p-2.5 rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-[1.01] shadow-md text-center flex flex-col justify-center"
                                        >
                                            <span className="font-bold text-base leading-tight">MUA NGAY</span>
                                            <span className="text-[11px] font-normal opacity-90">
                        Giao hàng, lắp đặt tận nơi
                      </span>
                                        </button>

                                        <button
                                            onClick={handleAddToCart}
                                            className="w-full sm:w-2/5 bg-transparent border-2 border-blue-600 text-blue-600 p-2.5 rounded-lg transition-all duration-200 hover:bg-blue-600 hover:text-white hover:shadow-md flex items-center justify-center gap-1.5"
                                        >
                                            <ShoppingCart size={16} />
                                            <span className="font-semibold text-sm">Thêm vào giỏ</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <button className="bg-gray-800 text-white p-1.5 rounded-md hover:bg-black transition-colors text-sm">
                                            <span>033 440 3206</span>
                                            <span className="block text-[11px] font-light">Tư vấn 24/7</span>
                                        </button>
                                        <button className="bg-gray-800 text-white p-1.5 rounded-md hover:bg-black transition-colors text-sm">
                                            <span>098 221 6069</span>
                                            <span className="block text-[11px] font-light">Hỗ trợ kỹ thuật</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phần mô tả sản phẩm */}
                        {product.description && (
                            <div className="mt-6 border-t pt-5">
                                <h2 className="text-lg font-bold text-gray-800 mb-2.5">Mô tả sản phẩm</h2>
                                <p className="text-gray-600 text-[13px] leading-6 whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {notification?.show && (
                <Notification
                    message={notification.message}
                    product={notification.product}
                    quantity={notification.quantity}
                    onClose={() => setNotification(null)}
                />
            )}

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
