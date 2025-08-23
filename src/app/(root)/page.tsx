// src/app/(root)/page.tsx
import HeroSection from "@/components/HeroSection";

export default function HomePage() {
    return (
        <main className="bg-white">
            <HeroSection />

            {/* Các phần khác của trang chủ sẽ được thêm vào đây */}
            {/* Ví dụ: Phần hiển thị sản phẩm nổi bật */}
            <div className="container mx-auto px-4 py-12 bg-white">
                <h2 className="text-3xl font-bold text-center text-black">Sản phẩm nổi bật</h2>
                {/* ... Lưới sản phẩm ... */}
            </div>
        </main>
    );
}