import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";
import ProductView from "@/components/ProductView";


interface ProductPageProps {
    params: {
        slug: string;
    };
}

const getProduct = cache(async (slug: string) => {
    const productId = parseInt(slug);
    if (isNaN(productId)) {
        return null;
    }
    
    const product = await prisma.products.findUnique({
        where: { id: productId },
    });
    return product;
});

export async function generateMetadata({ params: { slug } }: ProductPageProps): Promise<Metadata> {
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: "Sản phẩm không tồn tại",
        };
    }

    return {
        title: product.name,
        description: product.description ?? undefined,
        openGraph: {
            images: [{ url: product.image_url }],
        },
    };
}

export default async function ProductPage({ params: { slug } }: ProductPageProps) {
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const plainProduct = {
        ...product,
        price_agency: Number(product.price_agency),
        price_retail: Number(product.price_retail),
        price_retail_with_install: Number(product.price_retail_with_install),
    };

    return <ProductView product={plainProduct} />;
}
