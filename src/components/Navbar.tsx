'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation'; // Import hook để lấy đường dẫn hiện tại
import { useRouter } from 'next/navigation'; // Import hook để điều hướng

// Danh sách link điều hướng chính
const navLinks = [
    { href: '/', label: 'TRANG CHỦ' },
    { href: '/tin-tuc', label: 'TIN TỨC' },
    { href: '/chinh-sach', label: 'CHÍNH SÁCH ĐẠI LÝ' },
    { href: '/lien-he', label: 'LIÊN HỆ' },
];

// Định nghĩa danh mục sản phẩm với slug để tạo ID
const categories = [
    { slug: 'facial&fingerprint lock', label: 'Khóa nhận diện khuôn mặt' },
    { slug: 'fingerprint lock', label: 'Khóa vân tay' },
    { slug: 'classic lock', label: 'Khóa Truyền thống' },
];

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname(); // Lấy đường dẫn hiện tại
    const router = useRouter(); // Dùng để điều hướng

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

    const handleCategoryClick = (slug: string) => {
        setIsDropdownOpen(false);
        // Nếu không phải đang ở trang chủ, chuyển hướng về trang chủ trước
        if (pathname !== '/') {
            router.push(`/#${slug}`);
        }
    };

    return (
        <header className="bg-white shadow-sm z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center h-16">
                    <div ref={dropdownRef} className="relative border-r border-gray-200 pr-6 mr-6">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 text-xs sm:text-sm md:text-[15px] font-semibold text-gray-800 hover:text-red-600 transition-colors"
                        >
                            <Menu size={20} />
                            <span>DANH MỤC SẢN PHẨM</span>
                            <ChevronDown
                                size={16}
                                className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                                <ul className="py-1">
                                    {categories.map((category) => (
                                        <li key={category.slug}>
                                            <Link
                                                href={`/#${category.slug}`}
                                                onClick={() => handleCategoryClick(category.slug)}
                                                className="block px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 cursor-pointer"
                                            >
                                                {category.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <nav className="flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href}>
                                <div className="text-gray-700 hover:text-red-600 transition-colors cursor-pointer text-xs sm:text-sm md:text-[15px] font-medium">
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