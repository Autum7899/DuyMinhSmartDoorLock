// src/components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Youtube, MessageCircle } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-10">
                {/* Phần trên của footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Cột 1: Logo và Giới thiệu */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Image src="/logo.png" alt="Duy Minh Logo" width={50} height={50} />
                            <div>
                                <div className="font-bold text-lg font-etna ">Duy Minh</div>
                                <div className="text-xs text-gray-300">Smart Door Lock</div>
                            </div>
                        </Link>
                        <p className="text-gray-400">
                            Chuyên cung cấp và lắp đặt khóa cửa thông minh, khóa vân tay, khóa điện tử chính hãng với giá tốt nhất.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/profile.php?id=61579515821610" aria-label="Facebook" className="text-gray-400 hover:text-white"><Facebook /></a>
                            <a href="#" aria-label="Youtube" className="text-gray-400 hover:text-white"><Youtube /></a>
                            <a href="#" aria-label="Zalo" className="text-gray-400 hover:text-white"><MessageCircle /></a>
                        </div>
                    </div>

                    {/* Cột 2: Chính sách */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">CHÍNH SÁCH</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Chính sách bảo hành</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Chính sách vận chuyển</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Chính sách đổi trả</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Điều khoản dịch vụ</a></li>
                        </ul>
                    </div>

                    {/* Cột 3: Liên kết nhanh */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">HỖ TRỢ KHÁCH HÀNG</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Hướng dẫn mua hàng</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Câu hỏi thường gặp</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Liên hệ</a></li>
                        </ul>
                    </div>

                    {/* Cột 4: Thông tin liên hệ */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">THÔNG TIN LIÊN HỆ</h3>
                        <address className="not-italic space-y-2 text-gray-400">
                            <p><strong>Địa chỉ:</strong> Số 10, Ngõ 192, Thái Thịnh, Đống Đa, Hà Nội</p>
                            <p><strong>Hotline:</strong> <a href="tel:0982216069" className="hover:text-white">0982216069</a></p>
                            <p><strong>Email:</strong> <a href="jwsmartlock@gmail.com" className="hover:text-white">jwsmartlock@gmail.com</a></p>
                        </address>
                    </div>

                </div>
            </div>

            {/* Phần dưới của footer (Copyright) */}
            <div className="bg-gray-900 text-center py-4">
                <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Bản quyền thuộc về Duy Minh Smart Door Lock.</p>
            </div>
        </footer>
    );
};

export default Footer;