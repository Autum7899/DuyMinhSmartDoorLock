'use client';

import { Search, Loader2 } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Định nghĩa lại kiểu Product cho phù hợp với dữ liệu từ API
type Product = {
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

// Hàm định dạng tiền tệ
const formatVND = (value: number) =>
    value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Sử dụng useEffect để gọi API mỗi khi `query` thay đổi (với debounce)
    useEffect(() => {
        // --- Sửa ở đây: Bắt đầu tìm kiếm từ 1 ký tự ---
        if (query.trim().length < 1) {
            setResults([]);
            return;
        }

        // Debounce: Chờ 300ms sau khi người dùng ngừng gõ rồi mới tìm kiếm
        const searchTimer = setTimeout(() => {
            const fetchResults = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data: Product[] = await response.json();
                    setResults(data);
                } catch (error) {
                    console.error("Failed to fetch search results:", error);
                    setResults([]); // Xóa kết quả cũ nếu có lỗi
                } finally {
                    setIsLoading(false);
                }
            };

            fetchResults();
        }, 100);

        return () => clearTimeout(searchTimer);
    }, [query]);

    // Xử lý việc ẩn dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsDropdownVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if (!isDropdownVisible) setIsDropdownVisible(true);
    };

    return (
        <div ref={searchContainerRef} className="relative w-full max-w-lg">
            <form className="relative">
                <input
                    type="text"
                    placeholder="Bạn muốn tìm sản phẩm nào?"
                    className="w-full pl-4 pr-12 py-2.5 text-base text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setIsDropdownVisible(true)}
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="absolute right-0 top-0 h-full px-4 bg-red-600 hover:bg-red-700 text-white rounded-r-md
                               flex items-center justify-center transition-colors"
                    aria-label="Tìm kiếm"
                >
                    <Search className="h-5 w-5" />
                </button>
            </form>

            {/* Dropdown Hiển thị kết quả tìm kiếm */}
            {/* --- THAY ĐỔI DUY NHẤT Ở ĐÂY: query.length > 0 --- */}
            {isDropdownVisible && query.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-5 w-5 text-gray-400 animate-spin mr-2" />
                            <span className="text-sm text-gray-500">Đang tìm kiếm...</span>
                        </div>
                    ) : results.length > 0 ? (
                        <ul>
                            <li className="p-3 text-sm font-semibold text-gray-700 border-b">
                                Sản phẩm gợi ý
                            </li>
                            {results.map((product) => (
                                <li key={product.id}>
                                    <Link
                                        href={`/san-pham/${product.id}`}
                                        className="flex items-center p-3 hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsDropdownVisible(false)}
                                    >
                                        <div className="relative w-14 h-14 mr-4 flex-shrink-0">
                                            <Image
                                                src={product.image || '/images/placeholder.png'}
                                                alt={product.name}
                                                fill
                                                sizes="56px"
                                                className="object-contain"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                                {product.name}
                                            </p>
                                            {product.price.retailWithInstall > 0 ? (
                                                <p className="text-sm font-bold text-red-600">
                                                    {formatVND(product.price.retailWithInstall)}
                                                </p>
                                            ) : (
                                                <p className="text-sm font-bold text-red-600">Liên hệ</p>
                                            )}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-4 text-sm text-gray-500">Không tìm thấy sản phẩm nào.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;