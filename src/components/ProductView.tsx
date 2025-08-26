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
        if (!product.features || !Array.isArray(product.features) || product.features.length === 0) {
            return null;
        }

        const features = product.features as string[];

        return (
            <div className="border rounded-md p-4 mb-6">
                <h3 className="font-bold text-gray-600 flex items-center gap-2 mb-2">
                    <ListChecks size={20} />
                    Tính năng nổi bật
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                    {features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="bg-gray-100">
            <div className="">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* === CỘT BÊN TRÁI: HÌNH ẢNH SẢN PHẨM === */}
                        <div>ph
                            <div className="relative w-full max-w-lg mx-auto aspect-square p-4 flex items-center justify-center overflow-hidden rounded-lg border bg-white">
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    fill
                                    className="object-contain" // <-- CHUYỂN LẠI THÀNH object-contain
                                    priority
                                    sizes="(max-width: 768px) 100vw, 500px" // Cập nhật sizes cho phù hợp
                                />
                            </div>
                        </div>

                        {/* === CỘT BÊN PHẢI: THÔNG TIN SẢN PHẨM === */}
                        <div>
                             <h2 className="text-xl font-semibold mb-4 text-gray-400">{product.name}</h2>
                            <div className="mb-4">
                                <span className="text-3xl font-bold text-red-600">
                                    {formatPrice(priceWithInstall)}
                                </span>
                            </div>

                            <p className="mb-4 text-gray-400"><span className="font-semibold">Tình trạng:</span> <span className={product.quantity > 0 ? "text-green-600" : "text-red-600"}>{status}</span></p>

                            {renderFeatures()}

                            <div className="flex items-center gap-4 mb-6 text-gray-400">
                                <span className="font-semibold">Số lượng:</span>
                                <div className="flex items-center border rounded">
                                    <button className="px-3 py-1 text-lg">-</button>
                                    <span className="px-4 py-1 border-l border-r">1</span>
                                    <button className="px-3 py-1 text-lg">+</button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button className="w-full bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition-colors">
                                    <span className="font-bold text-lg">MUA NGAY</span>
                                    <span className="block text-xs">Giao tận nơi, nhận tại cửa hàng</span>
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                    <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                                        033 440 3206
                                        <span className="block text-xs">Tư vấn trực tuyến 24/7</span>
                                    </button>
                                    <button className="bg-blue-800 text-white p-2 rounded-md hover:bg-blue-900 transition-colors text-sm">
                                        098 221 6069
                                        <span className="block text-xs">Hỗ trợ kỹ thuật 24/7</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="mt-6 border border-yellow-300 bg-yellow-50 rounded-lg p-4">
                                <h3 className="font-bold text-lg text-yellow-800 text-center mb-3">Chính Sách Dịch Vụ Vàng – An Tâm Tuyệt Đối</h3>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex items-start gap-3">
                                        <ShieldCheck size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                                        <span><span className="font-semibold">Bảo hành 18 tháng:</span> Cam kết 1 đổi 1 trong suốt thời gian bảo hành nếu phát hiện bất kỳ lỗi nào từ nhà sản xuất.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Wrench size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                                        <span><span className="font-semibold">Bảo trì miễn phí:</span> Hỗ trợ kiểm tra, bảo trì định kỳ sau khi lắp đặt để đảm bảo khóa luôn hoạt động ổn định.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CircleCheck size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                                        <span><span className="font-semibold">Hỗ trợ lắp đặt tận nơi:</span> Đội ngũ kỹ thuật viên chuyên nghiệp, giàu kinh nghiệm sẽ hỗ trợ lắp đặt nhanh chóng, thẩm mỹ tại nhà.</span>
                                    </li>
                                     <li className="flex items-start gap-3">
                                        <Truck size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                                        <span><span className="font-semibold">Miễn phí vận chuyển toàn quốc:</span> Giao hàng tận tay dù bạn ở bất cứ đâu.</span>
                                    </li>
                                </ul>
                            </div>


                            <div className="mt-6 space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <MapPin size={16} className="text-gray-400 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-400"> Địa chỉ: </h4>
                                        <p className="text-gray-500">Số 10, Ngõ 192, Thái Thịnh, Đống Đa, Hà Nội</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Phone size={16} className="text-gray-400 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-400">TƯ VẤN HÀ NỘI</h4>
                                        <p className="text-gray-500">Tel: 033 440 3206</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {product.description && (
                        <div className="mt-12 border-t pt-8 px-8 pb-8">
                            <h2 className="text-2xl font-bold border-b-2 border-red-500 pb-2 mb-4 inline-block text-gray-400">MÔ TẢ SẢN PHẨM</h2>
                            <div className="prose max-w-none text-gray-500">
                                <p>{product.description}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
