// src/app/admin/products/page.tsx
import React from 'react';
import { prisma } from '@/lib/db/prisma';
import Image from 'next/image';

export default async function ProductManagementPage() {
    const products = await prisma.products.findMany({
      select: {
        id: true,
        name: true,
        image_url: true,
        price_retail: true,
        quantity: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Quản lý sản phẩm</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Danh sách sản phẩm</h2>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                        + Thêm sản phẩm mới
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                                    Hình ảnh
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giá bán lẻ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số lượng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products?.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Image 
                                            src={product.image_url} 
                                            alt={product.name} 
                                            width={48} 
                                            height={48} 
                                            className="h-12 w-12 rounded-md object-cover shadow" 
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">${product.price_retail?.toString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900 transition-colors">
                                            Sửa
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 transition-colors">
                                            Xóa
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