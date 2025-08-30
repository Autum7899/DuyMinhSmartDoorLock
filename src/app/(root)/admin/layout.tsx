// src/app/admin/layout.tsx
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
    label: string;
    icon: React.ReactNode;
    href: string;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, href }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`w-full text-left p-3 rounded-md transition-colors duration-200 flex items-center ${
                isActive ? 'bg-gray-700 text-white shadow-md' : 'hover:bg-gray-700 hover:text-white'
            }`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </Link>
    );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800 antialiased">
            <div className="flex flex-col md:flex-row min-h-screen">
                {/* Sidebar */}
                <aside className="bg-gray-900 text-white w-full md:w-64 p-6 space-y-6 shadow-2xl z-10">
                    <h2 className="text-3xl font-bold mb-6 text-indigo-400">Dashboard</h2>
                    <nav className="space-y-3">
                        <NavItem
                            label="Tổng quan"
                            href="/admin/dashboard"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L14 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                </svg>
                            }
                        />
                        <NavItem
                            label="Danh mục sản phẩm"
                            href="/admin/categories"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            }
                        />
                        <NavItem
                            label="Sản phẩm"
                            href="/admin/products"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75V4h1.75a.75.75 0 010 1.5H11.5V7a.75.75 0 01-1.5 0V5.5H8.25a.75.75 0 010-1.5H10V2.75a.75.75 0 01.75-.75zM10 18a.75.75 0 01-.75-.75V15h-1.75a.75.75 0 010-1.5H8.5V12a.75.75 0 011.5 0v1.5h1.75a.75.75 0 010 1.5H10V17.25a.75.75 0 01-.75.75zM4 10a.75.75 0 01.75-.75H7a.75.75 0 010 1.5H4.75A.75.75 0 014 10zM16 10a.75.75 0 01-.75-.75H13a.75.75 0 010 1.5h2.25A.75.75 0 0116 10z" clipRule="evenodd" />
                                </svg>
                            }
                        />
                        <NavItem
                            label="Đơn hàng"
                            href="/admin/orders"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2h4.586A2 2 0 0112 3.414L14.586 6A2 2 0 0115 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM9 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm-1 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                </svg>
                            }
                        />
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}