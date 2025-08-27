'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { X, Loader2 } from 'lucide-react';
import { createDirectOrder } from '@/app/actions/orderActions';

// Hàm định dạng giá tiền
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

type ProductInfo = {
    id: number;
    name: string;
    image_url: string;
    price_retail_with_install: number;
};

type CheckoutModalProps = {
    product: ProductInfo;
    quantity: number;
    onClose: () => void;
    onOrderSuccess: (message: string) => void;
};

export default function CheckoutModal({ product, quantity, onClose, onOrderSuccess }: CheckoutModalProps) {
    const [formData, setFormData] = useState({
        customerName: '',
        phoneNumber: '',
        address: '',
        note: '',
    });
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.customerName || !formData.phoneNumber || !formData.address) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc (*).');
            return;
        }

        startTransition(async () => {
            const result = await createDirectOrder(formData, {
                id: product.id,
                quantity: quantity,
                price: product.price_retail_with_install,
            });

            if (result.success) {
                onOrderSuccess(result.message);
                onClose(); // Đóng lại khi thành công
            } else {
                setError(result.message);
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
            <div
                className="bg-white w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[calc(100vh-100px)]"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">Thông tin đặt hàng</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>

                {/* Body có thể cuộn */}
                <div className="overflow-y-auto p-6 space-y-6 flex-grow">
                    {/* Thông tin sản phẩm */}
                    <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
                        <div className="w-20 h-20 relative flex-shrink-0">
                            <Image src={product.image_url} alt={product.name} layout="fill" className="object-contain" />
                        </div>
                        <div className="flex-grow">
                            <p className="font-semibold text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-600">Số lượng: {quantity}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-red-600">
                                {formatPrice(product.price_retail_with_install * quantity)}
                            </p>
                        </div>
                    </div>

                    {/* Form điền thông tin */}
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                            {/* NEW: Thêm font-semibold và text-gray-800 */}
                            <input type="text" name="customerName" id="customerName" required value={formData.customerName} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-800"/>
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                            {/* NEW: Thêm font-semibold và text-gray-800 */}
                            <input type="tel" name="phoneNumber" id="phoneNumber" required value={formData.phoneNumber} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-800"/>
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng <span className="text-red-500">*</span></label>
                            {/* NEW: Thêm font-semibold và text-gray-800 */}
                            <input type="text" name="address" id="address" required value={formData.address} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-800"/>
                        </div>
                        <div>
                            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (tùy chọn)</label>
                            {/* NEW: Thêm font-semibold và text-gray-800 */}
                            <textarea name="note" id="note" rows={3} value={formData.note} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-800"></textarea>
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </form>
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 rounded-b-lg flex-shrink-0">
                    <button 
                        type="submit" 
                        form="checkout-form"
                        disabled={isPending}
                        className="w-full bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition-colors shadow font-bold text-lg flex items-center justify-center disabled:bg-gray-400"
                    >
                        {isPending ? <Loader2 className="animate-spin" /> : 'XÁC NHẬN ĐẶT HÀNG'}
                    </button>
                </div>
            </div>
        </div>
    );
}