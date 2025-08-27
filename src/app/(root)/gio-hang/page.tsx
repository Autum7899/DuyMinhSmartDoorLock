'use client';

import { useCart } from '@/app/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';

// Hàm định dạng giá tiền, không thay đổi
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();

    return (
        // **THAY ĐỔI 1: Luôn giữ lại div bao ngoài này để đảm bảo có nền xám nhạt**
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* **THAY ĐỔI 2: Sử dụng toán tử ba ngôi để render có điều kiện** */}
                {/* Nếu giỏ hàng trống, render giao diện "trống". Ngược lại, render danh sách sản phẩm. */}
                {cartItems.length === 0 ? (
                    // Giao diện khi giỏ hàng trống, được làm nổi bật hơn
                    <div className="max-w-2xl mx-auto py-16 text-center">
                        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Giỏ hàng của bạn đang trống</h1>
                        <p className="text-gray-600 mb-8">Có vẻ như bạn chưa thêm sản phẩm nào. Hãy bắt đầu mua sắm ngay!</p>
                        <Link
                            href="/"
                            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                        >
                            Khám phá sản phẩm
                        </Link>
                    </div>
                ) : (
                    // Giao diện khi giỏ hàng có sản phẩm (giữ nguyên logic cũ)
                    <>
                        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">Giỏ Hàng</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                            
                            {/* Danh sách sản phẩm trong giỏ (Cột trái) */}
                            <div className="lg:col-span-8">
                                <div className="bg-white rounded-lg shadow">
                                    <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
                                        <h2 className="text-lg font-semibold text-gray-700">
                                            {cartItems.length} sản phẩm trong giỏ
                                        </h2>
                                        <button onClick={clearCart} className="text-sm font-medium text-red-500 hover:text-red-700">
                                            Xóa tất cả
                                        </button>
                                    </div>
                                    
                                    <div className="divide-y divide-gray-200">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 px-6 py-5">
                                                <div className="w-28 h-28 relative flex-shrink-0">
                                                    <Image
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        layout="fill"
                                                        className="object-contain rounded-md"
                                                    />
                                                </div>
                                                
                                                <div className="flex-grow text-center md:text-left">
                                                    <Link href={`/san-pham/${item.id}`} className="font-bold text-gray-800 hover:text-blue-700 text-lg">
                                                        {item.name}
                                                    </Link>
                                                    <p className="text-gray-600 text-sm mt-1">{formatPrice(item.price)}</p>
                                                </div>

                                                <div className="flex items-center gap-4 md:gap-6 mt-4 md:mt-0">
                                                    <div className="flex items-center border rounded-md">
                                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1.5 text-lg hover:bg-gray-100 disabled:opacity-50" disabled={item.quantity <= 1}>-</button>
                                                        <span className="px-4 py-1.5 border-x font-medium">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1.5 text-lg hover:bg-gray-100">+</button>
                                                    </div>
                                                    <p className="font-bold text-gray-900 w-32 text-right text-lg">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-600" aria-label="Xóa sản phẩm">
                                                        <Trash2 size={22} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Tóm tắt đơn hàng (Cột phải) */}
                            <div className="lg:col-span-4">
                                <div className="bg-white rounded-lg shadow p-6 sticky top-28">
                                    <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-4 mb-4">
                                        Tóm Tắt Đơn Hàng
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-gray-700">
                                            <span>Tạm tính</span>
                                            <span className="font-medium">{formatPrice(totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-700">
                                            <span>Phí vận chuyển</span>
                                            <span className="font-medium text-green-600">Miễn phí</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg text-gray-900">
                                            <span>Tổng cộng</span>
                                            <span className="text-red-600 text-xl">{formatPrice(totalPrice)}</span>
                                        </div>
                                    </div>
                                    <button className="w-full bg-red-600 text-white mt-6 py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105">
                                        ĐẶT HÀNG
                                    </button>
                                    <p className="text-xs text-gray-500 text-center mt-3">Nhân viên sẽ liên hệ để xác nhận đơn hàng của bạn.</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}