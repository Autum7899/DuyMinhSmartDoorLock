import { slugify } from '@/lib/utils';
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
    value.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    });

export default function ProductCard({ product }: ProductCardProps) {
    const originalPrice =
        product.price.retail > 0 ? product.price.retail : product.price.retailWithInstall;
    const salePrice = product.price.retailWithInstall;
    const hasDiscount = originalPrice > salePrice;
    const discountPercent = hasDiscount
        ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
        : 0;

    return (
        <Link href={`/san-pham/${slugify(product.name)}`} className="group block">
            {/* Card */}
            <div className="h-full flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:border-blue-500">
                {/* Ảnh */}
                <div className="relative w-full aspect-square bg-gray-50">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={1000}
                        height={1000}
                        className="w-full h-full object-contain p-3"
                        priority={false}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {hasDiscount && (
                        <div className="absolute top-2 right-2 rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white shadow">
                            -{discountPercent}%
                        </div>
                    )}
                </div>

                {/* Nội dung */}
                <div className="flex flex-col flex-grow p-4">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[40px]">
                        {product.name}
                    </h3>
                    {product.category && (
                        <p className="mt-1 text-xs text-gray-500">{product.category}</p>
                    )}

                    <div className="mt-auto pt-3">
                        <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-red-600">
                {formatVND(salePrice)}
              </span>
                            {hasDiscount && (
                                <span className="text-sm text-gray-400 line-through">
                  {formatVND(originalPrice)}
                </span>
                            )}
                        </div>
                        {!!product.features?.length && (
                            <div className="mt-3 flex flex-wrap gap-1">
                                {product.features.slice(0, 6).map((f) => (
                                    <span
                                        key={f}
                                        className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700"
                                    >
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
