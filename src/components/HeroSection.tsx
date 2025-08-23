// src/components/HeroSection.tsx
const HeroSection = () => {
    return (
        // Phần tử cha chứa ảnh nền
        // Bạn sẽ thay đổi style ở đây để thêm ảnh nền
        <section
            className="relative bg-gray-700 bg-cover bg-center text-white"
            style={{
                // Tạm thời dùng màu nền, sau này sẽ thay bằng ảnh
                backgroundImage: "url('/placeholder-hero.jpg')", // Hoặc một màu gradient
                height: '60vh', // Chiều cao có thể điều chỉnh
            }}
        >
            {/* Lớp phủ màu đen mờ để làm nổi bật chữ */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Nội dung */}
            <div className="relative container mx-auto px-4 h-full flex flex-col items-start justify-center">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 max-w-2xl">
                    An Toàn & Hiện Đại Cho Ngôi Nhà Của Bạn
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-2xl text-gray-200">
                    Khám phá các giải pháp khóa cửa thông minh hàng đầu, mang lại sự tiện nghi và bảo mật tuyệt đối.
                </p>
                <a
                    href="/khoa-cua-thong-minh"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                >
                    Xem Sản Phẩm Ngay
                </a>
            </div>
        </section>
    );
};

export default HeroSection;