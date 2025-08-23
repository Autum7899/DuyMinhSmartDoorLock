// src/data/products.ts
export type Product = {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    brand: string;
};

export const products: Product[] = [
    {
        id: 'kaadas-k20f',
        name: 'Khóa cửa vân tay Kaadas K20-F',
        price: 15500000,
        originalPrice: 17000000,
        imageUrl: '/images/product-1.jpg', // Ảnh sẽ được lưu trong public/images
        brand: 'Kaadas'
    },
    {
        id: 'bosch-idl101',
        name: 'Khóa Cửa Vân Tay Bosch IDL101 Plus',
        price: 13800000,
        imageUrl: '/images/product-2.jpg',
        brand: 'Bosch'
    },
    // Thêm 6-10 sản phẩm khác để danh sách trông đầy đặn
];