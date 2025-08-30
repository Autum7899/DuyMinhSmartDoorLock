// src/app/admin/orders/page.tsx
import React from 'react';
import { prisma } from '@/lib/db/prisma';
import { order_status } from '@prisma/client';

export default async function OrderManagementPage() {
    const orders = await prisma.orders.findMany({
      select: {
        id: true,
        customer_name: true,
        total_amount: true,
        status: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const getStatusColor = (status: order_status) => {
        switch (status) {
            case 'NEW':
                return 'bg-blue-500 text-white';
            case 'CONFIRMED':
                return 'bg-green-500 text-white';
            case 'FINISHED':
                return 'bg-gray-500 text-white';
            case 'CANCELLED':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Quản lý đơn hàng</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Danh sách đơn hàng</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                                    ID Đơn hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khách hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tổng tiền
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders?.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.customer_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">${order.total_amount.toString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 transition-colors">
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}