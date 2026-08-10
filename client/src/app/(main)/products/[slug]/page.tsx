import type { Metadata } from "next";
import { cache } from "react";
import { siteConfig } from "@/config/site";
import { ProductView } from "./ProductView";

type Params = { params: Promise<{ slug: string }> };

interface RawProduct {
  _id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  category?: string;
  gemstone?: string;
  metalType?: string;
  images?: string[];
}

const getProduct = cache(async (idOrSlug: string): Promise<RawProduct | null> => {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${api}/products/${encodeURIComponent(idOrSlug)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return { title: "Product Not Found", robots: { index: false, follow: false } };
  }
  const url = `/products/${product._id}`;
  const description = (product.shortDescription || product.description || siteConfig.description)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  const image = product.images?.[0];
  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description,
      url,
      type: "website",
      images: image ? [{ url: image, width: 1200, height: 1200, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${siteConfig.name}`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProduct(slug);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: product.images ?? [],
        description: (product.description || product.shortDescription || "").replace(/\s+/g, " ").trim(),
        sku: product.sku,
        category: product.category,
        material: product.metalType,
        brand: { "@type": "Brand", name: siteConfig.name },
        url: `${siteConfig.url}/products/${product._id}`,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductView slug={slug} />
    </>
  );
}
