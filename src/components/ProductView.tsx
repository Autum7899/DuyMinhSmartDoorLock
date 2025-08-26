'use client';

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { products } from '@prisma/client';
import Image from 'next/image';
import { MapPin, Phone, ShieldCheck, Wrench, Truck, CircleCheck, ListChecks } from 'lucide-react';

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

    useEffect(() => {
        addProduct({
            id: product.id,
            name: product.name,
            image: product.image_url,
            href: `/san-pham/${product.id}`
        });
    }, [product, addProduct]);

    const priceWithInstall = Number(product.price_retail_with_install);
    const status = product.quantity > 0 ? "Còn hàng" : "Hết hàng";

    const renderFeatures = () => {
        if (!product.features || !Array.isArray(product.features) || product.features.length === 0) return null;
        const features = product.features as string[];
        return (
            <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                    <ListChecks size={20} />
                    Tính năng nổi bật
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-500">
                    {features.map((feature, index) => <li key={index}>{feature}</li>)}
                </ul>
            </div>
        );
    };

    // --- THAY ĐỔI Ở ĐÂY: Bỏ padding top (py) thành padding bottom (pb) ---
    return (
        <div className="bg-gray-50 pb-8 md:pb-12">
            <div className="container mx-auto px-4">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                        {/* === CỘT BÊN TRÁI: HÌNH ẢNH SẢN PHẨM === */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-2"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 448px"
                                />
                            </div>
                        </div>

                        {/* === CỘT BÊN PHẢI: THÔNG TIN SẢN PHẨM === */}
                        <div className="flex flex-col space-y-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>

                            {/* Khối giá và tình trạng */}
                            <div>
                                <div className="mb-2">
                                    <span className="text-3xl md:text-4xl font-bold text-red-600">
                                        {formatPrice(priceWithInstall)}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm"><span className="font-semibold">Tình trạng:</span> <span className={product.quantity > 0 ? "text-green-600" : "text-red-600"}>{status}</span></p>
                            </div>

                            {renderFeatures()}

                            {/* Khối CTA: Số lượng và các nút Mua */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-gray-600">
                                    <span className="font-semibold">Số lượng:</span>
                                    <div className="flex items-center border rounded-md">
                                        <button className="px-3 py-1 text-xl hover:bg-gray-100 rounded-l-md">-</button>
                                        <span className="px-4 py-1 border-x">1</span>
                                        <button className="px-3 py-1 text-xl hover:bg-gray-100 rounded-r-md">+</button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button className="w-full bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition-colors shadow">
                                        <span className="font-bold text-lg">MUA NGAY</span>
                                        <span className="block text-xs font-light">Giao tận nơi hoặc nhận tại cửa hàng</span>
                                    </button>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                                            <span>033 440 3206</span>
                                            <span className="block text-xs font-light">Tư vấn trực tuyến 24/7</span>
                                        </button>
                                        <button className="bg-blue-800 text-white p-2 rounded-md hover:bg-blue-900 transition-colors text-sm">
                                            <span>098 221 6069</span>
                                            <span className="block text-xs font-light">Hỗ trợ kỹ thuật 24/7</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === KHỐI CHÍNH SÁCH VÀ THÔNG TIN THÊM (Đưa ra ngoài grid 2 cột) === */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 border-t pt-8">
                        <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-4 h-fit">
                            <h3 className="font-bold text-lg text-yellow-800 text-center mb-3">Chính Sách Dịch Vụ Vàng</h3>
                            <ul className="space-y-3 text-sm text-gray-700">
                                <li className="flex items-start gap-3"><ShieldCheck size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" /><span><span className="font-semibold">Bảo hành 18 tháng 1 đổi 1</span> nếu có lỗi từ nhà sản xuất.</span></li>
                                <li className="flex items-start gap-3"><Wrench size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" /><span><span className="font-semibold">Bảo trì miễn phí</span> định kỳ sau khi lắp đặt.</span></li>
                                <li className="flex items-start gap-3"><CircleCheck size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" /><span><span className="font-semibold">Hỗ trợ lắp đặt tận nơi</span> nhanh chóng, chuyên nghiệp.</span></li>
                                <li className="flex items-start gap-3"><Truck size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" /><span><span className="font-semibold">Miễn phí vận chuyển</span> toàn quốc.</span></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-gray-500 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-gray-700">Địa chỉ cửa hàng:</h4>
                                    <p className="text-gray-500">Số 10, Ngõ 192, Thái Thịnh, Đống Đa, Hà Nội</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone size={18} className="text-gray-500 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-gray-700">TƯ VẤN & MUA HÀNG</h4>
                                    <p className="text-gray-500">Hotline: 033 440 3206</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {product.description && (
                        <div className="mt-10 border-t pt-8">
                            <h2 className="text-2xl font-bold border-b-2 border-red-500 pb-2 mb-4 inline-block text-gray-800">Mô Tả Sản Phẩm</h2>
                            <div className="prose max-w-none text-gray-600">
                                <p>{product.description}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}