'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { ViewedProduct } from '@/hooks/useRecentlyViewed';

const STORAGE_KEY = 'recentlyViewedProducts';

export default function RecentlyViewedProducts() {
    const [products, setProducts] = useState<ViewedProduct[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const loadProducts = () => {
        const storedItems = localStorage.getItem(STORAGE_KEY);
        setProducts(storedItems ? JSON.parse(storedItems) : []);
    };

    useEffect(() => {
        loadProducts();
        const handleStorageChange = () => loadProducts();
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (products.length === 0) {
        return null;
    }

    // --- THAY ĐỔI Ở ĐÂY: Bỏ `fixed bottom-5 right-5 z-50` và thay bằng `relative` ---
    return (
        <div ref={dropdownRef} className="relative">
            {/* --- THAY ĐỔI Ở ĐÂY: Đổi `bottom-full mb-2` thành `top-full mt-2 right-0` --- */}
            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-72 rounded-lg bg-white shadow-xl border border-gray-200 overflow-hidden z-20">
                    {products.length > 0 ? (
                        <ul>
                            {products.map((product) => (
                                <li key={product.id} className="border-b last:border-b-0">
                                    <Link
                                        href={product.href}
                                        className="flex items-center p-3 hover:bg-gray-50 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            width={48}
                                            height={48}
                                            className="w-12 h-12 object-contain rounded-md mr-3"
                                        />
                                        <p className="text-sm text-gray-700 font-medium line-clamp-2">
                                            {product.name}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-4 text-sm text-gray-500">Chưa có sản phẩm nào.</p>
                    )}
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-700 text-white font-semibold rounded-lg shadow-md hover:bg-red-800 transition-all duration-200"
            >
                Sản phẩm đã xem
                <ChevronDown
                    className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
        </div>
    );
}