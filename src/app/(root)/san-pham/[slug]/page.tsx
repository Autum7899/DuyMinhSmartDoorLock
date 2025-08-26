import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { cache } from "react";
// Thay đổi icon Gift thành ListChecks
import { MapPin, Phone, ShieldCheck, Wrench, Truck, CircleCheck, ListChecks } from 'lucide-react';

interface ProductPageProps {
    params: {
        slug: string;
    };
}

const getProduct = cache(async (slug: string) => {
    const productId = parseInt(slug);
    if (isNaN(productId)) {
        return null;
    }
    
    const product = await prisma.products.findUnique({
        where: { id: productId },
    });
    return product;
});

export async function generateMetadata({ params: { slug } }: ProductPageProps): Promise<Metadata> {
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: "Sản phẩm không tồn tại",
        };
    }

    return {
        title: product.name,
        description: product.description ?? undefined,
        openGraph: {
            images: [{ url: product.image_url }],
        },
    };
}

const formatPrice = (price: number | bigint) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price));
};

export default async function ProductPage({ params: { slug } }: ProductPageProps) {
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }
    
    const priceWithInstall = Number(product.price_retail_with_install);
    const status = product.quantity > 0 ? "Còn hàng" : "Hết hàng";

    // Đổi tên hàm và nội dung để phù hợp với "Tính năng"
    const renderFeatures = () => {
        if (!product.features || !Array.isArray(product.features) || product.features.length === 0) {
            return null;
        }

        const features = product.features as string[];

        return (
            // Thay đổi style của khung: bỏ viền đỏ, dùng viền xám mặc định
            <div className="border rounded-md p-4 mb-6">
                {/* Thay đổi icon, tiêu đề và màu sắc */}
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
        <div className="bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* === CỘT BÊN TRÁI: HÌNH ẢNH SẢN PHẨM === */}
                        <div>
                            <h1 className="text-xl font-semibold mb-4 text-gray-400">{product.name}</h1>
                            <div className="border rounded-lg p-2">
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    width={600}
                                    height={600}
                                    className="w-full h-auto object-contain rounded-md"
                                    priority
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

                            {/* Gọi hàm renderFeatures mới */}
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
                                        090 776 1102
                                        <span className="block text-xs">Tư vấn trực tuyến 24/7</span>
                                    </button>
                                    <button className="bg-blue-800 text-white p-2 rounded-md hover:bg-blue-900 transition-colors text-sm">
                                        084 568 1080
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
                                        <h4 className="font-bold text-gray-400">Chi nhánh Hà Nội</h4>
                                        <p className="text-gray-500">Nhà vườn 03, KĐT Tinh thành, Vĩnh Hưng, Hoàng Mai, Hà Nội</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Phone size={16} className="text-gray-400 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-400">TƯ VẤN HÀ NỘI</h4>
                                        <p className="text-gray-500">Tel: 090 776 1102</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {product.description && (
                        <div className="mt-12 border-t pt-8">
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