// src/app/(root)/san-pham/[slug]/page.tsx
import { notFound } from 'next/navigation';
import ProductView from '@/components/ProductView';
import { slugify } from '@/lib/utils';
import { Metadata } from 'next';

// This type now correctly represents the data fetched from the API
type Product = {
    id: number;
    name: string;
    image_url: string;
    description: string | null;
    price_agency: number;
    price_retail: number;
    price_retail_with_install: number;
    quantity: number;
    category_id: number | null;
    created_at: string;
    updated_at: string;
};

type ProductPageProps = {
  params: {
    slug: string;
  };
};

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${getBaseUrl()}/api/products`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

async function getProductBySlug(slug: string): Promise<Product | undefined> {
    const products = await getProducts();
    return products.find(p => slugify(p.name) === slug);
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const slug = params.slug;
    const product = await getProductBySlug(slug);

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

export default async function ProductPage({ params }: ProductPageProps) {
  const slug = params.slug;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // The API already returns numbers, so direct assignment is fine.
  // The ProductView component expects these properties.
  const productForView = {
      ...product,
      // Ensure description is not undefined, which can happen with JSON
      description: product.description ?? null,
  };

  return <ProductView product={productForView} />;
}