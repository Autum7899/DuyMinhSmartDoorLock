// src/components/Header.tsx
import Link from 'next/link';
import { ChevronDown, Phone, User, ShoppingCart } from 'lucide-react';
import SearchBar from './SearchBar'; // Import component SearchBar

const Header = () => {
    return (
        <header className="bg-gray-800 text-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-24">

                    {/* Logo và Tên thương hiệu */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-4 no-underline text-white">
                            {/* Phần văn bản */}
                            <div className="text-left">
                                <div className="font-bold text-xl tracking-wide">Duy Minh</div>
                                <div className="text-xs text-gray-300">Smart Door Lock</div>
                            </div>

                            {/* Logo */}
                            <img
                                src="/logo.png"
                                alt="Duy Minh Smart Door Lock Logo"
                                style={{ height: '60px', objectFit: 'contain' }}
                            />
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
                        {/* Hotline */}
                        <div className="flex items-center space-x-2">
                            <Phone className="h-8 w-8" />
                            <div className="text-left">
                                <p className="font-bold text-lg leading-tight">033.440.3206</p>
                                <p className="text-xs">Hỗ trợ mua hàng</p>
                            </div>
                        </div>

                        {/* Icons Người dùng và Giỏ hàng */}
                        <div className="flex items-center space-x-4">
                            <Link href="/tai-khoan" aria-label="Tài khoản">
                                <User className="h-7 w-7 hover:text-yellow-300" />
                            </Link>
                            <Link href="/gio-hang" aria-label="Giỏ hàng">
                                <ShoppingCart className="h-7 w-7 hover:text-yellow-300" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;