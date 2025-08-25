// src/app/(root)/page.tsx
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/db/prisma';
import Link from 'next/link';

export const revalidate = 60; // ISR mỗi 60s (tuỳ chỉnh)

type ProductForCard = {
    id: number;
    name: string;
    image: string;
    category?: string | null;
    price: {
        agency: number;
        retail: number;
        retailWithInstall: number;
    };
    features?: string[];
};

async function getCategoriesWithProducts() {
    const categories = await prisma.categories.findMany({
        include: {
            products: {
                where: { quantity: { gt: 0 } },
                orderBy: { created_at: 'desc' },
                take: 8,
            },
        },
    });

    const sortOrder: { [key: string]: number } = {
        'facial&fingerprint lock': 1,
        'fingerprint lock': 2,
        'classic lock': 3,
    };

    categories.sort((a, b) => {
        const orderA = sortOrder[a.name] || 99;
        const orderB = sortOrder[b.name] || 99;
        return orderA - orderB;
    });

    return categories.map((category) => ({
        ...category,
        products: category.products.map(
            (p): ProductForCard => ({
                id: p.id,
                name: p.name,
                image: p.image_url,
                category: category.name,
                price: {
                    agency: Number(p.price_agency ?? 0),
                    retail: Number(p.price_retail ?? p.price_retail_with_install),
                    retailWithInstall: Number(p.price_retail_with_install),
                },
                features: Array.isArray(p.features) ? (p.features as string[]) : [],
            })
        ),
    }));
}

export default async function HomePage() {
    const categoriesWithProducts = await getCategoriesWithProducts();

    // --- THÊM BẢNG DỊCH TIÊU ĐỀ Ở ĐÂY ---
    const categoryTitleMap: { [key: string]: string } = {
        'classic lock': 'Khóa Cơ Truyền Thống',
        'facial&fingerprint lock': 'Khóa Nhận Diện Khuôn Mặt & Vân Tay',
        'fingerprint lock': 'Khóa Vân Tay Thông Minh',
    };

    return (
        <main>
            <HeroSection />
            {categoriesWithProducts.map((category) => {
                if (category.products.length === 0) return null;

                return (
                    <section
                        key={category.id}
                        id={category.name}
                        className="bg-white py-12"
                    >
                        <div className="container mx-auto px-4">
                            {/* --- THAY ĐỔI CÁCH HIỂN THỊ TIÊU ĐỀ --- */}
                            <h2 className="text-3xl font-bold text-center text-black mb-8">
                                {categoryTitleMap[category.name] || category.name}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {category.products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                );
            })}
        </main>
    );
}