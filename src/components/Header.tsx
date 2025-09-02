'use client'; 

import Link from 'next/link';
import { Phone, User, ShoppingCart, Menu, X } from 'lucide-react';
import SearchBar from './SearchBar';
import { useState } from 'react';
import Image from 'next/image';
import RecentlyViewedProducts from './RecentlyViewedProducts';
import { useCart } from '@/app/contexts/CartContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartCount } = useCart();

    const brandNameStyle = "text-yellow-400 [text-shadow:-1px_-1px_0_#fff,1px_-1px_0_#fff,-1px_1px_0_#fff,1px_1px_0_#fff]";

    return (
        <header className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
            {/* Desktop Header */}
            <div className="container mx-auto px-4">
                <div className="hidden md:flex items-center justify-between h-24">
                    {/* Logo và Tên thương hiệu */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-4 no-underline text-white">
                            <div className="text-left">
                                {/* --- DESKTOP: Increased font size from text-xl to text-3xl --- */}
                                <div className={`font-bold text-3xl tracking-wide font-etna ${brandNameStyle}`}>Duy Minh</div>
                                {/* --- DESKTOP: Increased font size from text-xs to text-sm --- */}
                                <div className="text-sm text-gray-300">Smart Door Lock</div>
                            </div>
                            <Image src="/logo.png" alt="Duy Minh Smart Door Lock Logo" width={60} height={60} style={{ objectFit: 'contain' }} />
                        </Link>
                    </div>

                    {/* Phần giữa: Search và Dropdown */}
                    <div className="flex-grow flex items-center justify-center space-x-4 mx-8">
                        <SearchBar />
                        <RecentlyViewedProducts />
                    </div>
                    {/* Phần bên phải: Hotline và Icons */}
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <Phone className="h-8 w-8" />
                            <div className="text-left">
                                <p className="font-bold text-lg leading-tight">098.221.6069</p>
                                <p className="text-xs">Hỗ trợ mua hàng</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/gio-hang" className="relative">
                                <ShoppingCart className="h-7 w-7 hover:text-yellow-300" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between h-16">
                    {/* Logo và Tên thương hiệu (rút gọn) */}
                    <Link href="/" className="flex items-center space-x-2 no-underline text-white">
                        <Image src="/logo.png" alt="Duy Minh Smart Door Lock Logo" width={40} height={40} style={{ objectFit: 'contain' }} />
                        <div>
                             {/* --- MOBILE: Increased font size from text-base to text-lg --- */}
                            <div className={`font-etna text-lg ${brandNameStyle}`}>Duy Minh</div>
                            {/* --- MOBILE: Increased font size from text-xs to text-sm --- */}
                            <div className="text-sm text-gray-300">Smart Door Lock</div>
                        </div>
                    </Link>
                    
                    {/* Icons bên phải trên mobile */}
                    <div className="flex items-center gap-4">
                        <Link href="/gio-hang" className="relative">
                            <ShoppingCart className="h-7 w-7" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
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
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;