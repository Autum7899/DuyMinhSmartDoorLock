// src/app/admin/dashboard/page.tsx
import React from 'react';
import { prisma } from '@/lib/db/prisma';

interface DashboardCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 border-t-4 border-${color.split('-')[1]}-500`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            {icon}
        </div>
        <p className="text-4xl font-bold text-gray-900">{value}</p>
    </div>
);

// Trang Tổng quan (Server Component)
export default async function DashboardPage() {
    // Truy vấn trực tiếp từ cơ sở dữ liệu
    const totalProducts = await prisma.products.count();
    const totalOrders = await prisma.orders.count();

    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Tổng quan</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <DashboardCard
                    title="Tổng sản phẩm"
                    value={totalProducts}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L14 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                    }
                    color="from-blue-400 to-blue-600"
                />
                <DashboardCard
                    title="Tổng đơn hàng"
                    value={totalOrders}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L14 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                    }
                    color="from-green-400 to-green-600"
                />
            </div>
        </>
    );
}