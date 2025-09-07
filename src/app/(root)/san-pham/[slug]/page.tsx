// src/app/(root)/san-pham/[slug]/page.tsx
import { notFound } from 'next/navigation';
import ProductView from '@/components/ProductView';
// import RecentlyViewedProducts from '@/components/RecentlyViewedProducts'; // Removed for now to match original display
import { slugify } from '@/lib/utils';
import { Product } from '@/models/productModel';
import { Metadata } from 'next';

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

export async function generateMetadata(props: ProductPageProps): Promise<Metadata> {
    const slug = props.params.slug;
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

export default async function ProductPage(props: ProductPageProps) {
  const slug = props.params.slug;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Re-introducing the data transformation to fix display issues.
  const plainProduct = {
    ...product,
    price_agency: Number(product.price_agency),
    price_retail: Number(product.price_retail),
    price_retail_with_install: Number(product.price_retail_with_install),
  };

  return <ProductView product={plainProduct} />;
}