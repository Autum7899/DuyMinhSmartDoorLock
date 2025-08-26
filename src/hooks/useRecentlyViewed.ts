import { useCallback } from 'react';

// Định nghĩa cấu trúc dữ liệu cho một sản phẩm (bạn có thể tùy chỉnh)
export type ViewedProduct = {
    id: number;
    name: string;
    image: string;
    href: string; // Đường dẫn đến trang sản phẩm
};

const STORAGE_KEY = 'recentlyViewedProducts';
const MAX_PRODUCTS = 5; // Số lượng sản phẩm tối đa cần lưu

export const useRecentlyViewed = () => {
    const addProduct = useCallback((product: ViewedProduct) => {
        if (typeof window === 'undefined') return;

        // 1. Lấy danh sách hiện tại từ localStorage
        const storedItems = localStorage.getItem(STORAGE_KEY);
        let products: ViewedProduct[] = storedItems ? JSON.parse(storedItems) : [];

        // 2. Xóa sản phẩm nếu đã tồn tại để đưa nó lên đầu
        products = products.filter((p) => p.id !== product.id);

        // 3. Thêm sản phẩm mới vào đầu danh sách
        products.unshift(product);

        // 4. Giới hạn số lượng sản phẩm
        const updatedProducts = products.slice(0, MAX_PRODUCTS);

        // 5. Lưu lại vào localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));

        // Gửi một sự kiện để các component khác (nếu có) có thể lắng nghe và cập nhật
        window.dispatchEvent(new Event('storage'));
    }, []);

    return { addProduct };
};