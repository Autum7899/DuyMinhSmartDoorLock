// src/app/(admin)/layout.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Boxes,
    Package,
    ClipboardList,
    ChevronRight,
    X,
    LucideIcon,
} from "lucide-react";

type NavItemConfig = { label: string; href: string; icon: LucideIcon };

// LƯU Ý: URL KHÔNG chứa tên route group "(admin)"
const NAV_ITEMS: NavItemConfig[] = [
    { label: "Tổng quan", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Danh mục sản phẩm", href: "/admin/categories", icon: Boxes },
    { label: "Sản phẩm", href: "/admin/products", icon: Package },
    { label: "Đơn hàng", href: "/admin/orders", icon: ClipboardList },
];

function NavItem({ label, icon: Icon, href }: NavItemConfig) {
    const pathname = usePathname();
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={[
                "group flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-all",
                isActive
                    ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5",
            ].join(" ")}
        >
      <span className="flex items-center gap-3">
        <Icon className="h-5 w-5 shrink-0" />
        <span className="font-medium">{label}</span>
      </span>
            {isActive && (
                <ChevronRight className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            )}
        </Link>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        // Dùng min-h thay vì h-screen để có thể cao hơn màn hình khi nội dung dài
        <div className="min-h-screen  bg-gray-100 text-gray-800 antialiased">
            {/* THÂN TRANG: sidebar + nội dung */}
            <div className="flex min-h-screen  items-stretch">
                {/* Sidebar (mobile overlay + desktop cố định) */}
                <aside
                    className={[
                        "fixed inset-y-0 left-0 z-40 w-72 transform bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl transition-transform duration-300",
                        "md:static md:translate-x-0 md:w-72 md:flex md:flex-col",
                        open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                    ].join(" ")}
                >
                    {/* Brand */}
                    <div className="flex items-center justify-between px-5 py-5">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-2xl bg-white/10 ring-1 ring-white/10 backdrop-blur-sm flex items-center justify-center">
                                <LayoutDashboard className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">Admin</h2>
                                <p className="text-xs text-gray-300/80">Control Panel</p>
                            </div>
                        </div>
                        {/* Close button on mobile */}
                        <button
                            onClick={() => setOpen(false)}
                            className="rounded-lg p-2 text-gray-300 hover:bg-white/10 hover:text-white md:hidden"
                            aria-label="Close sidebar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="mx-5 mb-4 h-px bg-white/10" />

                    {/* Nav */}
                    <nav className="space-y-2 px-4">
                        {NAV_ITEMS.map((item) => (
                            <NavItem key={item.href} {...item} />
                        ))}
                    </nav>

                    {/* Footer nhỏ – tự đẩy xuống đáy nhờ flex-col */}
                    <div className="mt-auto p-5 text-xs text-gray-300/70">
                        <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                            <p className="font-medium text-gray-100">Tip</p>
                            <p className="mt-1">Dùng sidebar để chuyển nhanh giữa các mục quản trị.</p>
                        </div>
                    </div>
                </aside>

                {/* Nội dung */}
                <div className="flex-1 w-full">
                    <main className="p-6">{children}</main>
                </div>

                {/* Overlay cho mobile khi mở sidebar */}
                {open && (
                    <button
                        aria-label="Close sidebar overlay"
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
                    />
                )}
            </div>
        </div>
    );
}