// src/app/(admin)/dashboard/page.tsx
import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { $Enums } from "@prisma/client";
import {
    Package,
    ClipboardList,
    BellRing,
    ArrowRight,
} from "lucide-react";

type Theme = "blue" | "green" | "violet";

const THEME: Record<Theme, { border: string; ring: string; icon: string }> = {
    blue: { border: "border-blue-500", ring: "ring-blue-100", icon: "text-blue-600" },
    green: { border: "border-green-500", ring: "ring-green-100", icon: "text-green-600" },
    violet: { border: "border-violet-500", ring: "ring-violet-100", icon: "text-violet-600" },
};

function StatCard(props: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    theme: Theme;
    href?: string;
}) {
    const { title, value, icon, theme, href } = props;
    const content = (
        <div
            className={[
                "bg-white p-6 rounded-xl shadow-lg",
                "ring-1",
                THEME[theme].ring,
                "border-t-4",
                THEME[theme].border,
                "transition-transform duration-300 hover:scale-[1.02]",
            ].join(" ")}
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-700">{title}</h3>
                <div className={["h-9 w-9 rounded-lg bg-gray-50 flex items-center justify-center", THEME[theme].icon].join(" ")}>
                    {icon}
                </div>
            </div>
            <div className="text-4xl font-bold tracking-tight text-gray-900">{value}</div>
            {href && (
                <div className="mt-4 text-sm text-gray-600 flex items-center gap-1">
                    Xem chi tiết <ArrowRight className="h-4 w-4" />
                </div>
            )}
        </div>
    );

    return href ? (
        <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 rounded-xl">
            {content}
        </Link>
    ) : (
        content
    );
}

export default async function DashboardPage() {
    // Truy vấn DB
    const [totalProducts, totalOrders, newCount, newOrders] = await Promise.all([
        prisma.products.count(),
        prisma.orders.count(),
        prisma.orders.count({ where: { status: $Enums.order_status.NEW } }),
        prisma.orders.findMany({
            where: { status: $Enums.order_status.NEW },
            select: { id: true, customer_name: true, total_amount: true, created_at: true },
            orderBy: { created_at: "desc" },
            take: 5,
        }),
    ]);

    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Tổng quan</h1>

            {/* Thông báo NEW orders */}
            {newCount > 0 ? (
                <div className="mb-8 rounded-xl border border-yellow-300 bg-yellow-50 p-4">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 text-yellow-600">
                            <BellRing className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-yellow-800">
                                    Bạn có <span className="underline">{newCount}</span> đơn hàng <span className="font-bold">NEW</span> cần xử lý
                                </p>
                                <Link
                                    href="/admin/orders"
                                    className="inline-flex items-center gap-1 rounded-lg bg-yellow-600 px-3 py-1.5 text-white text-sm hover:bg-yellow-700"
                                >
                                    Xem đơn hàng <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <div className="mt-3 overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="text-left text-yellow-900/80">
                                    <tr>
                                        <th className="py-1 pr-4 font-medium">Mã</th>
                                        <th className="py-1 pr-4 font-medium">Khách hàng</th>
                                        <th className="py-1 pr-4 font-medium">Tổng</th>
                                        <th className="py-1 pr-4 font-medium">Thời gian</th>
                                    </tr>
                                    </thead>
                                    <tbody className="text-yellow-900">
                                    {newOrders.map((o) => (
                                        <tr key={o.id} className="border-t border-yellow-200/70">
                                            <td className="py-2 pr-4">#{o.id}</td>
                                            <td className="py-2 pr-4">{o.customer_name}</td>
                                            <td className="py-2 pr-4 font-semibold">
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(
                                                    Number(o.total_amount ?? 0)
                                                )}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {o.created_at && new Date(o.created_at).toLocaleString("vi-VN")}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {newCount > newOrders.length && (
                                <div className="mt-2 text-xs text-yellow-800/80">
                                    Và còn {newCount - newOrders.length} đơn NEW khác…
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-emerald-800 font-medium">Không có đơn hàng NEW nào. Mọi thứ đều ổn ✅</p>
                </div>
            )}

            {/* Thống kê nhanh */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard
                    title="Tổng sản phẩm"
                    value={totalProducts}
                    icon={<Package className="h-5 w-5" />}
                    theme="blue"
                    href="/admin/products"
                />
                <StatCard
                    title="Tổng đơn hàng"
                    value={totalOrders}
                    icon={<ClipboardList className="h-5 w-5" />}
                    theme="green"
                    href="/admin/orders"
                />
                <StatCard
                    title="Đơn hàng NEW"
                    value={newCount}
                    icon={<BellRing className="h-5 w-5" />}
                    theme="violet"
                    href="/admin/orders"
                />
            </div>
        </>
    );
}
