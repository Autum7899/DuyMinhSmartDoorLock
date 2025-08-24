// src/components/Header.tsx
'use client'; // Thêm dòng này ở đầu file vì chúng ta đang dùng useState

import Link from 'next/link';
import { ChevronDown, Phone, User, ShoppingCart, Menu, X } from 'lucide-react';
import SearchBar from './SearchBar';
import { useState } from 'react';
import Image from 'next/image';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
            {/* Desktop Header */}
            <div className="container mx-auto px-4">
                <div className="hidden md:flex items-center justify-between h-24">
                    {/* Logo và Tên thương hiệu */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-4 no-underline text-white">
                            <div className="text-left">
                                <div className="font-bold text-xl tracking-wide">Duy Minh</div>
                                <div className="text-xs text-gray-300">Smart Door Lock</div>
                            </div>
                            <Image src="/logo.png" alt="Duy Minh Smart Door Lock Logo" width={60} height={60} style={{ objectFit: 'contain' }} />
                        </Link>
                    </div>

                    {/* Phần giữa: Search và Dropdown */}
                    <div className="flex-grow flex items-center justify-center space-x-4 mx-8">
                        <SearchBar />
                        <button className="flex items-center bg-red-700 hover:bg-red-800 px-4 py-2.5 rounded-md transition-colors whitespace-nowrap">
                            <span>Sản phẩm đã xem</span>
                            <ChevronDown className="h-5 w-5 ml-2" />
                        </button>
                    </div>

                    {/* Phần bên phải: Hotline và Icons */}
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <Phone className="h-8 w-8" />
                            <div className="text-left">
                                <p className="font-bold text-lg leading-tight">033.440.3206</p>
                                <p className="text-xs">Hỗ trợ mua hàng</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/tai-khoan"><User className="h-7 w-7 hover:text-yellow-300" /></Link>
                            <Link href="/gio-hang"><ShoppingCart className="h-7 w-7 hover:text-yellow-300" /></Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between h-16">
                    {/* Logo và Tên thương hiệu (rút gọn) */}
                    <Link href="/" className="flex items-center space-x-2 no-underline text-white">
                        <Image src="/logo.png" alt="Duy Minh Smart Door Lock Logo" width={40} height={40} style={{ objectFit: 'contain' }} />
                        <div>
                            <div className="font-bold text-base">Duy Minh</div>
                            <div className="text-xs text-gray-300">Smart Door Lock</div>
                        </div>
                    </Link>

                    {/* Hamburger Menu Icon */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                        {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu (Dropdown) */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-700">
                    <div className="container mx-auto px-4 pt-2 pb-4 space-y-4">
                        <SearchBar />
                        <div className="flex items-center space-x-2">
                            <Phone className="h-6 w-6" />
                            <div>
                                <p className="font-bold text-base leading-tight">033.440.3206</p>
                                <p className="text-xs">Hỗ trợ mua hàng</p>
                            </div>
                        </div>
                        <Link href="/tai-khoan" className="flex items-center space-x-2"><User /><span>Tài khoản</span></Link>
                        <Link href="/gio-hang" className="flex items-center space-x-2"><ShoppingCart /><span>Giỏ hàng</span></Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;