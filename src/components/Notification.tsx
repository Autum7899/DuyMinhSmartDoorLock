// src/components/Notification.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, CheckCircle } from 'lucide-react';

type NotificationProps = {
    product: {
        name: string;
        image_url: string;
    };
    quantity: number;
    onClose: () => void;
};

export default function Notification({ product, quantity, onClose }: NotificationProps) {
    const [isVisible, setIsVisible] = useState(false);

    // Hiệu ứng xuất hiện và tự động đóng sau 5 giây
    useEffect(() => {
        // Bắt đầu animation xuất hiện
        setIsVisible(true);

        // Đặt hẹn giờ để tự động đóng
        const timer = setTimeout(() => {
            handleClose();
        }, 5000); // 5 giây

        // Dọn dẹp hẹn giờ khi component bị hủy
        return () => clearTimeout(timer);
    }, []);

    // Hàm xử lý đóng thông báo
    const handleClose = () => {
        setIsVisible(false);
        // Đợi animation kết thúc (300ms) rồi mới gọi hàm onClose của component cha
        setTimeout(onClose, 300);
    };

    return (
        <div
            className={`
                fixed bottom-5 right-5 w-full max-w-sm bg-white shadow-2xl rounded-lg p-4 flex items-start gap-4 z-[100]
                transition-all duration-300 ease-in-out
                ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            {/* Icon thành công */}
            <CheckCircle className="text-green-500 h-7 w-7 flex-shrink-0 mt-1" />

            {/* Nội dung thông báo */}
            <div className="flex-grow">
                <h4 className="font-bold text-gray-900">Thêm vào giỏ hàng thành công!</h4>
                <div className="flex items-center gap-3 mt-2">
                    <div className="relative w-14 h-14 bg-gray-100 rounded">
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            layout="fill"
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-500">Số lượng: {quantity}</p>
                    </div>
                </div>
            </div>

            {/* Nút đóng */}
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1 -mt-1 -mr-1">
                <X size={20} />
            </button>
        </div>
    );
}