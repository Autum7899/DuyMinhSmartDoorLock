import { Metadata } from 'next';
import Image from 'next/image';

// Metadata cho SEO
export const metadata: Metadata = {
    title: 'Chính Sách Đại Lý & Nhà Phân Phối | JW Smart Lock',
    description: 'Trở thành đối tác phân phối chính thức của JW (Zhongshan Junwei Intelligent Technology). Khám phá chính sách hỗ trợ, lợi ích và quy trình đăng ký để cùng phát triển với thương hiệu khóa thông minh hàng đầu.',
};

/*
  LƯU Ý QUAN TRỌNG:
  Trong một dự án Next.js thực tế, các thành phần <Header /> và <Navbar />
  nên được đặt trong file layout.tsx gốc (app/layout.tsx) để chúng xuất hiện
  trên tất cả các trang.

  Ở đây, tôi đặt chúng trực tiếp trong page.tsx để bạn dễ dàng hình dung và sử dụng.
*/

// --- Component chính của trang ---
export default function ChinhSachDaiLyPage() {
    return (
        <div className="bg-gray-50">
            <main>
                {/* Phần Banner */}
                <section className="relative h-64 md:h-80 w-full">
                    <Image
                        src="/images/banner-policy.jpg"
                        alt="Đối tác JW Smart Lock"
                        layout="fill"
                        objectFit="cover"
                        className="brightness-50"
                    />
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
                            Trở Thành Đối Tác Của JW
                        </h1>
                        <p className="text-lg md:text-xl mt-4 max-w-2xl text-center drop-shadow-md">
                            Cùng chúng tôi mang những giải pháp an ninh thông minh, chất lượng đến mọi nhà.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-12 md:py-20">

                    {/* Giới thiệu và Sứ mệnh */}
                    <section className="bg-white p-8 rounded-lg shadow-md mb-16 text-center">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Sứ Mệnh Của Chúng Tôi</h2>
                        <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
                            Với sứ mệnh <b className="font-semibold text-blue-600">&quot;Tạo ra những sản phẩm khóa thông minh chất lượng cao mà người dân bình thường đều có thể sử dụng&quot;</b>, JW không ngừng nỗ lực để trở thành nhà sản xuất ODM/OEM khóa thông minh chuyên nghiệp và uy tín. Chúng tôi mong muốn hợp tác với các đại lý và nhà phân phối có cùng tầm nhìn để phát triển bền vững.
                        </p>
                    </section>

                    {/* Lợi ích khi trở thành đại lý */}
                    <section>
                        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-12">Vì Sao Nên Chọn Đồng Hành Cùng JW?</h2>

                        <div className="space-y-12">
                            {/* Lợi ích 1 */}
                            <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-lg shadow-sm">
                                <div className="md:w-1/2">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Chất Lượng Tạo Dựng Danh Tiếng</h3>
                                    <p className="text-gray-600 mb-4">
                                        Sản phẩm của chúng tôi được chứng nhận bởi các cơ quan có thẩm quyền quốc gia, sở hữu hơn 50 chứng nhận uy tín và 100 bằng sáng chế thiết kế. Chúng tôi cam kết chất lượng đáng tin cậy đã giành được sự tin tưởng của khách hàng trên 30 quốc gia.
                                    </p>
                                </div>
                                <div className="md:w-1/2">
                                    <Image src="/images/certifications.jpg" alt="Chứng nhận chất lượng JW" width={500} height={350} className="rounded-lg object-cover" />
                                </div>
                            </div>

                            {/* Lợi ích 2 */}
                            <div className="flex flex-col md:flex-row-reverse items-center gap-8 bg-white p-8 rounded-lg shadow-sm">
                                <div className="md:w-1/2">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Năng Lực Sản Xuất Vượt Trội</h3>
                                    <p className="text-gray-600 mb-4">
                                        Nhà máy vận hành trên diện tích gần 4000m² với khoảng 300 nhân viên, đạt công suất thiết kế trên 10.000 bộ khóa thông minh mỗi tháng. Nguồn cung ổn định, đáp ứng mọi nhu cầu dự án và phân phối.
                                    </p>
                                </div>
                                <div className="md:w-1/2">
                                    <Image src="/images/factory.jpg" alt="Nhà máy sản xuất JW Smart Lock" width={500} height={350} className="rounded-lg object-cover" />
                                </div>
                            </div>

                            {/* Lợi ích 3 */}
                            <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-lg shadow-sm">
                                <div className="md:w-1/2">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Công Nghệ Tiên Phong & Hỗ Trợ Toàn Diện</h3>
                                    <p className="text-gray-600 mb-4">
                                        Chúng tôi luôn đi đầu với các dòng sản phẩm đa dạng từ khóa nhận diện khuôn mặt 3D, khóa vân tay một chạm đến khóa chuyên dụng cho cửa nhôm. Đối tác sẽ được cung cấp đầy đủ tài liệu marketing, hỗ trợ kỹ thuật và chính sách chiết khấu hấp dẫn để đảm bảo kinh doanh hiệu quả.
                                    </p>
                                </div>
                                <div className="md:w-1/2">
                                    <Image src="/images/lock-product-1.png" alt="Sản phẩm khóa thông minh JW" width={500} height={350} className="rounded-lg object-contain" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quy trình đăng ký */}
                    <section className="mt-16 bg-gray-100 py-12 rounded-lg">
                        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Quy Trình Hợp Tác Đơn Giản</h2>
                        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-4 text-center">
                            <div className="p-4">
                                <div className="mx-auto w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl font-bold mb-3">1</div>
                                <h3 className="text-lg font-bold text-gray-800">Liên Hệ & Tư Vấn</h3>
                            </div>
                            <div className="p-4">
                                <div className="mx-auto w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl font-bold mb-3">2</div>
                                <h3 className="text-lg font-bold text-gray-800">Gửi Hồ Sơ</h3>
                            </div>
                            <div className="p-4">
                                <div className="mx-auto w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl font-bold mb-3">3</div>
                                <h3 className="text-lg font-bold text-gray-800">Ký Hợp Đồng</h3>
                            </div>
                            <div className="p-4">
                                <div className="mx-auto w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl font-bold mb-3">4</div>
                                <h3 className="text-lg font-bold text-gray-800">Bắt Đầu Hợp Tác</h3>
                            </div>
                        </div>
                    </section>

                    {/* Thông tin liên hệ */}
                    <section className="mt-16 bg-gray-800 text-white rounded-lg p-8 shadow-lg">
                        <h2 className="text-3xl font-semibold text-center mb-6">Liên Hệ Để Nhận Chính Sách Tốt Nhất</h2>
                        <div className="flex flex-col md:flex-row justify-center items-center text-center gap-8">
                            <p className="max-w-3xl">
                                Hãy liên hệ ngay với phòng kinh doanh của chúng tôi để được tư vấn chi tiết về chính sách đại lý, các mức chiết khấu và nhận được sự hỗ trợ tốt nhất để bắt đầu hành trình kinh doanh của bạn.
                            </p>
                        </div>
                        <div className="mt-6 text-center">
                            <a href="tel:008613392676868" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                                Gọi Ngay: (0086) 133-9267-6868
                            </a>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}