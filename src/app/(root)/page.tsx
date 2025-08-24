// src/app/(root)/page.tsx

import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/types";

// --- DỮ LIỆU MẪU ĐÃ CẬP NHẬT THEO THIẾT KẾ MỚI NHẤT ---
const sampleProducts: (IProduct & { _id: string })[] = [
    {
        _id: '1',
        name: 'Khóa Cửa Vân Tay IBC A2 V70Max.Face ID',
        image: '/images/product-1.png', // Thay bằng ảnh của bạn
        category: 'Khóa cửa thông minh',
        price: {
            agency: 5450000,
            retail: 7990000,          // Giá gốc để gạch ngang
            retailWithInstall: 6499000, // Giá bán chính
        },
        quantity: 10,
        // Dữ liệu giả cho các trường còn thiếu trong schema
        rating: 5,
        reviewCount: 25,
        features: ['Vân tay', 'Thẻ từ', 'Mật khẩu', 'Chìa cơ'],
    },
    {
        _id: '2',
        name: 'Khóa Cửa Thông Minh V-80 3D Pro',
        image: '/images/product-2.png',
        category: 'Khóa cửa thông minh',
        price: {
            agency: 3850000,
            retail: 6500000,
            retailWithInstall: 5490000,
        },
        quantity: 10,
        rating: 4.5,
        reviewCount: 18,
        features: ['Vân tay', 'App Tuya', 'Thẻ từ'],
    },
    {
        _id: '3',
        name: 'Khóa Cửa Điện Tử Q-32 3D Camera',
        image: '/images/product-3.png',
        category: 'Khóa cửa cao cấp',
        price: {
            agency: 4599000,
            retail: 6990000,
            retailWithInstall: 5499000,
        },
        quantity: 10,
        rating: 4,
        reviewCount: 32,
        features: ['Camera', 'Vân tay', 'Mật khẩu'],
    },
    {
        _id: '4',
        name: 'Khóa Vân Tay Cửa Nhôm M-12 3D Slim',
        image: '/images/product-4.png',
        category: 'Khóa cửa nhôm',
        price: {
            agency: 4450000,
            retail: 5950000,
            retailWithInstall: 5353000,
        },
        quantity: 10,
        rating: 5,
        reviewCount: 12,
        features: ['Chống nước', 'Vân tay', 'Thẻ từ'],
    },
];

export default function HomePage() {
    return (
        <main className="bg-gray-50">
             <HeroSection />
            {/* Phần hiển thị sản phẩm */}
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Sản phẩm nổi bật</h2>

                {/* Lưới sản phẩm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sampleProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </section>
        </main>
    );
}