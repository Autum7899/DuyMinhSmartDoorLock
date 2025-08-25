// src/app/(root)/page.tsx
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/db/prisma';

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

async function getProducts(): Promise<ProductForCard[]> {
    const rows = await prisma.products.findMany({
        where: { quantity: { gt: 0 } },
        include: {
            categories: { select: { name: true } },
        },
        orderBy: { created_at: 'desc' },
        take: 12,
    });

    return rows.map((p) => ({
        id: p.id,
        name: p.name,
        image: p.image_url, // map sang prop 'image'
        category: p.categories?.name ?? null,
        price: {
            agency: Number(p.price_agency ?? 0),
            retail: Number(p.price_retail ?? p.price_retail_with_install),
            retailWithInstall: Number(p.price_retail_with_install),
        },
        features: Array.isArray(p.features) ? (p.features as unknown as string[]) : [],
    }));
}

export default async function HomePage() {
    const products = await getProducts();

    return (
        <main>
            <HeroSection />
            {/* --- THAY ĐỔI Ở ĐÂY --- */}
            <section className="bg-white py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-black mb-8">
                        Sản phẩm nổi bật
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}