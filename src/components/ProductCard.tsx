import React from 'react';
import Image from 'next/image';
import { IProduct } from '@/types';

// Component nhỏ để hiển thị icon ngôi sao
const StarIcon = ({ fill }: { fill: string }) => (
    <svg className="w-4 h-4" fill={fill} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.446a1 1 0 00-1.175 0l-3.365 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.051 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" /></svg>
);

const ProductCard = ({ product }: { product: IProduct & { _id: string } }) => {
    // Sử dụng giá từ schema bạn cung cấp
    const originalPrice = product.price.retail;
    const salePrice = product.price.retailWithInstall;

    const discountPercent = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    return (
        <div className="group relative border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            {/* Ảnh và tag giảm giá */}
            <div className="relative bg-gray-50">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={600}
                    className="w-full h-100 object-contain"
                />
                {discountPercent > 0 && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                        GIẢM {discountPercent}%
                    </div>
                )}
                {/* Nút thêm vào giỏ hàng - chỉ hiện khi hover */}
                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-full bg-red-500 text-white text-sm font-semibold py-2 rounded-md hover:bg-red-600 transition-colors">
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-gray-800 text-sm leading-tight h-10 mb-2">
                    {product.name}
                </h3>

                <div className="mt-auto">
                    {/* Giá tiền */}
                    <div className="flex items-baseline gap-2 mb-2">
                        <p className="text-base font-bold text-red-600">{formatCurrency(salePrice)}</p>
                        <p className="text-xs text-gray-500 line-through">{formatCurrency(originalPrice)}</p>
                    </div>

                    {/* Đánh giá */}
                    {(product.rating !== undefined && product.reviewCount !== undefined) && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} fill={i < Math.round(product.rating!) ? "#FBBF24" : "#D1D5DB"} />
                                ))}
                            </div>
                            <span>({product.reviewCount} đánh giá)</span>
                        </div>
                    )}

                    {/* Tính năng */}
                    {product.features && (
                        <div className="flex flex-wrap gap-1">
                            {product.features.map((feature) => (
                                <span key={feature} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                    {feature}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;