'use client'; // Thêm dòng này để sử dụng hook

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, ChevronDown } from 'lucide-react';

// Danh sách link điều hướng
const navLinks = [
    { href: '/', label: 'TRANG CHỦ' },
    { href: '/tin-tuc', label: 'TIN TỨC' },
    { href: '/chinh-sach', label: 'CHÍNH SÁCH ĐẠI LÝ' },
    { href: '/lien-he', label: 'LIÊN HỆ' },
];

// Danh sách danh mục sản phẩm
const categories = [
    { href: '/danh-muc/khoa-van-tay', label: 'Khóa vân tay' },
    { href: '/danh-muc/khoa-nhan-dien-khuon-mat', label: 'Khóa nhận diện khuôn mặt' },
    { href: '/danh-muc/khoa-truyen-thong', label: 'Khóa Truyền thống' },
];

const Navbar = () => {
    // State để quản lý trạng thái đóng/mở của dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Xử lý việc đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center h-16">
                    {/* Phần Danh mục sản phẩm */}
                    <div ref={dropdownRef} className="relative border-r border-gray-200 pr-6 mr-6">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="
                flex items-center gap-3
                text-xs sm:text-sm md:text-[15px]
                font-semibold text-gray-800
                hover:text-red-600 transition-colors
              "
                        >
                            <Menu size={20} />
                            <span>DANH MỤC SẢN PHẨM</span>
                            <ChevronDown
                                size={16}
                                className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Menu Dropdown */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                                <ul className="py-1">
                                    {categories.map((category) => (
                                        <li key={category.href}>
                                            <Link href={category.href}>
                                                <div
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="
                            block px-4 py-2
                            text-xs sm:text-sm
                            text-gray-700 hover:bg-gray-100 hover:text-red-600 cursor-pointer
                          "
                                                >
                                                    {category.label}
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Phần Link điều hướng */}
                    <nav className="flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href}>
                                <div
                                    className="
                    text-gray-700 hover:text-red-600 transition-colors cursor-pointer
                    text-xs sm:text-sm md:text-[15px] font-medium
                  "
                                >
                                    {link.label}
                                </div>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
