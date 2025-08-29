import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type ProductCardProps = {
    product: {
        id: number;
        name: string;
        image: string;
        category?: string | null;
        price: {
            agency: number;
            retail: number;
            retailWithInstall: number;
        };
        features?: string[];
    };
};

const formatVND = (value: number) =>
    value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

export default function ProductCard({ product }: ProductCardProps) {
    const originalPrice = product.price.retail > 0 ? product.price.retail : product.price.retailWithInstall;
    const salePrice = product.price.retailWithInstall;
    const hasDiscount = originalPrice > salePrice;
    const discountPercent = hasDiscount ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

    return (
        <Link href={`/san-pham/${product.id}`} className="group block">
            {/* Giữ h-full ở đây để các card trong grid có chiều cao bằng nhau */}
            <div className="border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 h-full flex flex-col">
                {/* --- THAY ĐỔI Ở ĐÂY --- */}
                {/* 1. Thêm 'aspect-square' để container này luôn là hình vuông */}
                <div className="relative w-full bg-gray-50 aspect-square">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={1000} // Giữ nguyên hoặc thay đổi cho phù hợp với kích thước thật
                        height={1000}
                        // 2. Thay đổi class để ảnh lấp đầy container vuông
                        // - Bỏ h-64
                        // - Thêm h-full để ảnh cao bằng container
                        // - Đổi object-contain thành object-cover để ảnh lấp đầy (an toàn hơn nếu ảnh không hoàn toàn vuông)
                        className="w-full h-full object-cover"
                        priority={false}
                        // Cân nhắc thêm sizes prop để tối ưu hình ảnh trên các màn hình
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {hasDiscount && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                            GIẢM {discountPercent}%
                        </div>
                    )}
                </div>
                {/* Thêm 'flex-grow' để phần content này lấp đầy không gian còn lại, đảm bảo footer của các card thẳng hàng */}
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[40px]">
                        {product.name}
                    </h3>
                    {product.category && (
                        <p className="mt-1 text-xs text-gray-500">{product.category}</p>
                    )}
                    {/* Thêm 'mt-auto' để đẩy phần giá và features xuống dưới cùng */}
                    <div className="mt-auto pt-3">
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-red-600">{formatVND(salePrice)}</span>
                            {hasDiscount && (
                                <span className="text-sm text-gray-400 line-through">{formatVND(originalPrice)}</span>
                            )}
                        </div>
                        {product.price.agency > 0 && (
                            <p className="mt-1 text-[11px] text-gray-500">
                                Giá đại lý: <span className="font-medium">{formatVND(product.price.agency)}</span>
                            </p>
                        )}
                        {!!product.features?.length && (
                            <div className="mt-3 flex flex-wrap gap-1">
                                {product.features!.slice(0, 6).map((f) => (
                                    <span key={f} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}