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
        // --- THAY ĐỔI Ở ĐÂY: Sử dụng product.id cho href ---
        <Link href={`/san-pham/${product.id}`} className="group block">
            <div className="border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 h-full">
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
                </div>
                <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[40px]">
                        {product.name}
                    </h3>
                    {product.category && (
                        <p className="mt-1 text-xs text-gray-500">{product.category}</p>
                    )}
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