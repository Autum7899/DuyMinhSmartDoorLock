// Cấu trúc giá từ model Mongoose
export interface IPrice {
    agency: number;
    retail: number;
    retailWithInstall: number;
}

// Cấu trúc sản phẩm hoàn chỉnh cho frontend
export interface IProduct {
    name: string;
    image: string;
    category: string;
    price: IPrice;
    quantity: number;
    description?: string;
    // Các trường dưới đây chưa có trong schema, cần thêm vào để hiển thị đầy đủ
    rating?: number;       // Số sao đánh giá
    reviewCount?: number;  // Số lượng đánh giá
    features?: string[];   // Mảng các tính năng
}