// src/app/(root)/page.tsx
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/db/prisma';

export const revalidate = 60;

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

    const categoryTitleMap: { [key: string]: string } = {
        'classic lock': 'Khóa Cơ Truyền Thống',
        'facial&fingerprint lock': 'Khóa Nhận Diện Khuôn Mặt & Vân Tay',
        'fingerprint lock': 'Khóa Vân Tay Thông Minh',
    };

    return (
        <div className="bg-gray-50">
            <HeroSection />

            <div id="products" className="space-y-20 py-12">
                {categoriesWithProducts.map((category) => {
                    if (category.products.length === 0) return null;

                    return (
                        <section
                            key={category.id}
                            id={category.name}
                            className="scroll-mt-24"
                        >
                            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                                {/* Tiêu đề danh mục */}
                                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 relative">
                                    <span className="px-4 py-2 rounded-lg bg-white shadow-sm">
                                        {categoryTitleMap[category.name] || category.name}
                                    </span>
                                </h2>

                                {/* Lưới sản phẩm */}
                                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {category.products.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
