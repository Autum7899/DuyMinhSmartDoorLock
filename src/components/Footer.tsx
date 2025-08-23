// src/components/Footer.tsx
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-12">
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4">VỀ CHÚNG TÔI</h3>
                    <p className="text-gray-400">Chuyên cung cấp và lắp đặt khóa cửa thông minh, khóa vân tay, khóa điện tử chính hãng với giá tốt nhất.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4">CHÍNH SÁCH</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white">Chính sách bảo hành</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Chính sách vận chuyển</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Chính sách đổi trả</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4">THÔNG TIN LIÊN HỆ</h3>
                    <p className="text-gray-400">Địa chỉ: Số 10</p>
                    <p className="text-gray-400">Email: contact@yourstore.com</p>
                </div>
            </div>
            <div className="bg-gray-900 text-center py-4">
                <p className="text-gray-500">&copy; 2025 Bản quyền thuộc về YourStore.</p>
            </div>
        </footer>
    );
};

export default Footer;