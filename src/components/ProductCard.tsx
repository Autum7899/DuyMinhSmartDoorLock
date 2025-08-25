// src/components/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link'; // THÊM DÒNG NÀY
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

// Icon star đơn giản
const StarIcon = ({ fill }: { fill: string }) => (
    <svg className="w-4 h-4" fill={fill} viewBox="0 0 20 20" aria-hidden="true">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.449a1 1 0 00-.364 1.118l1.287 3.955c.3.922-.755 1.688-1.54 1.118l-3.369-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.783.57-1.838-.196-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L.965 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"/>
    </svg>
);

// Hàm chuyển đổi tên thành slug (ví dụ: "Sản Phẩm A" -> "san-pham-a")
const slugify = (text: string) => {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};


const formatVND = (value: number) =>
    value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

export default function ProductCard({ product }: ProductCardProps) {
    const originalPrice = product.price.retail > 0 ? product.price.retail : product.price.retailWithInstall;
    const salePrice = product.price.retailWithInstall;
    const hasDiscount = originalPrice > salePrice;
    const discountPercent = hasDiscount ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

    // Tạo slug từ tên sản phẩm
    const productSlug = slugify(product.name);

    return (
        // --- THAY ĐỔI 1: Bọc toàn bộ card trong thẻ Link ---
        <Link href={`/san-pham/${productSlug}`} className="group block">
            <div className="border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 h-full">
                {/* Ảnh */}
                <div className="relative bg-gray-50">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-64 object-contain"
                        priority={false}
                    />

                    {hasDiscount && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                            GIẢM {discountPercent}%
                        </div>
                    )}

                    {/* --- THAY ĐỔI 2: XÓA NÚT THÊM VÀO GIỎ --- */}
                </div>

                {/* Nội dung */}
                <div className="p-4">
                    {/* Rating demo */}
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[40px]">
                        {product.name}
                    </h3>

                    {product.category && (
                        <p className="mt-1 text-xs text-gray-500">{product.category}</p>
                    )}

                    {/* Giá */}
                    <div className="mt-3">
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
                    </div>

                    {/* Features */}
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
        </Link>
    );
}