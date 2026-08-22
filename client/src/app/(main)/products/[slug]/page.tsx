import type { Metadata } from "next";
import { cache } from "react";
import { siteConfig } from "@/config/site";
import { getCategoryMeta } from "@/config/categories";
import { ProductView } from "./ProductView";

type Params = { params: Promise<{ slug: string }> };

interface RawProduct {
  _id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  category?: string;
  subcategory?: string;
  gemstone?: string;
  metalType?: string;
  metalPurity?: string;
  weight?: number;
  caratWeight?: number;
  dimensions?: string;
  images?: string[];
  price?: number;
  discountPrice?: number;
  stock?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
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

// Turn a raw metalType enum ("white_gold") into readable text for descriptions.
const prettyMetal = (m?: string) =>
  m ? m.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "";

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

  const graph: object[] = [];

  if (product) {
    const productUrl = `${siteConfig.url}/products/${product._id}`;
    // Prefer the live sale price; fall back to the list price.
    const price = product.discountPrice ?? product.price;

    const productLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.images ?? [],
      description: (product.description || product.shortDescription || "")
        .replace(/\s+/g, " ")
        .trim(),
      sku: product.sku,
      mpn: product.sku,
      category: product.category,
      material: [product.metalPurity, prettyMetal(product.metalType)]
        .filter(Boolean)
        .join(" "),
      brand: { "@type": "Brand", name: siteConfig.name },
      url: productUrl,
    };

    if (typeof product.weight === "number" && product.weight > 0) {
      productLd.weight = {
        "@type": "QuantitativeValue",
        value: String(product.weight),
        unitCode: "GRM",
      };
    }
    if (product.dimensions) productLd.size = product.dimensions;

    // Offers — required for Product rich results and Google free listings.
    // Only emit when we actually have a numeric price.
    if (typeof price === "number" && price > 0) {
      const inStock = (product.stock ?? 0) > 0;
      const offer: Record<string, unknown> = {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "INR",
        price: String(price),
        // Prices are valid to the end of next year — refreshed on each revalidate.
        priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
        availability: inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@type": "Organization", name: siteConfig.name },
        // 30-day returns (siteConfig.features.easyReturns) — strengthens free listings.
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "IN",
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: siteConfig.features.easyReturns,
          returnMethod: "https://schema.org/ReturnByMail",
          returnFees: "https://schema.org/FreeReturn",
        },
      };
      // Free insured shipping kicks in above the threshold — only declare it
      // for qualifying pieces so the structured data stays truthful.
      if (siteConfig.features.freeShipping && price >= siteConfig.features.freeShippingThreshold) {
        offer.shippingDetails = {
          "@type": "OfferShippingDetails",
          shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "INR" },
          shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
        };
      }
      productLd.offers = offer;
    }

    // Aggregate rating — ONLY when genuine reviews exist (never fabricate).
    if ((product.ratingsQuantity ?? 0) > 0 && (product.ratingsAverage ?? 0) > 0) {
      productLd.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: String(product.ratingsAverage),
        reviewCount: String(product.ratingsQuantity),
      };
    }

    graph.push(productLd);

    // Breadcrumb: Home › Category › Product
    const cat = product.category ? getCategoryMeta(product.category) : undefined;
    const crumbs: Array<{ name: string; url: string }> = [
      { name: "Home", url: siteConfig.url },
    ];
    if (cat) {
      crumbs.push({ name: cat.title, url: `${siteConfig.url}/categories/${cat.slug}` });
    }
    crumbs.push({ name: product.name, url: productUrl });

    graph.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: c.url,
      })),
    });
  }

  return (
    <>
      {graph.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(node).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      <ProductView slug={slug} />
    </>
  );
}
