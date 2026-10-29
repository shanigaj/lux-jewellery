import type { Metadata } from "next";
import { cache } from "react";
import { permanentRedirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getCategoryMeta } from "@/config/categories";
import { productSlug, extractProductId } from "@/lib/product-url";
import { ProductView } from "./ProductView";

type Params = { params: Promise<{ slug: string }> };

// Render on-demand once, then serve from the (KV-backed) incremental cache and
// revalidate every 5 minutes — so crawlers/visitors get a fast, cacheable page
// instead of an uncacheable `no-store` SSR response. Live price/stock is still
// refreshed client-side in ProductView, so cached HTML never shows stale data.
//
// An empty generateStaticParams (+ dynamicParams) is what actually enables ISR
// here: with 10,500 products we don't prerender any at build, but each slug is
// cached on its first request and revalidated — without this the route stays
// fully dynamic (no-store) and `revalidate` is ignored.
export const revalidate = 300;
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

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
  diamondCarat?: number;
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
    // The URL param is a pretty slug ("<name>-<id>") or a bare id; look up by id.
    const id = extractProductId(idOrSlug);
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${api}/products/${encodeURIComponent(id)}`, {
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

// Singular, human type label per top-level category (for titles/descriptions).
const CATEGORY_SINGULAR: Record<string, string> = {
  rings: "Ring",
  necklaces: "Necklace",
  earrings: "Earrings",
  bracelets: "Bracelet",
  coins: "Coin",
  accessories: "Accessory",
  watches: "Watch",
};

// Trim to a max length on a word boundary (no mid-word cut), dropping a dangling
// separator so the result still reads cleanly.
const clampWord = (s: string, max: number): string => {
  const clean = s.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,–—-]+$/, "");
};

// A unique, keyword-rich descriptor for a piece — reuses the catalogue's own
// "Diamond Ring In 18Kt Yellow Gold"-style line when present, else builds one
// from the structured fields (gemstone + type + metal).
function productDescriptor(p: RawProduct): string {
  const fromCatalogue = (p.description || p.shortDescription || "").replace(/\s+/g, " ").trim();
  if (fromCatalogue) return fromCatalogue;
  const type = (p.category && CATEGORY_SINGULAR[p.category]) || "Jewellery";
  const metal = [p.metalPurity, prettyMetal(p.metalType)].filter(Boolean).join(" ");
  return [p.gemstone, type, metal && `in ${metal}`].filter(Boolean).join(" ");
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return { title: "Product Not Found", robots: { index: false, follow: false } };
  }
  const url = `/products/${productSlug(product.name, product._id)}`;
  const image = product.images?.[0];

  // Unique, keyword-rich title: "<Name> – <Diamond Ring in 18Kt Yellow Gold> | Sparenza & Co."
  // Clamp only the core (name + descriptor) so the brand suffix is always kept
  // whole — never a dangling separator.
  const descriptor = productDescriptor(product);
  const titleCore = descriptor ? `${product.name} – ${descriptor}` : product.name;
  // Budget keeps full descriptors (metal/gemstone) intact for indexing; only a
  // pathologically long name is trimmed. SERPs truncate by pixel width anyway.
  const title = `${clampWord(titleCore, 85)} | ${siteConfig.name}`;

  // Unique meta description built per product (name + descriptor + price + value
  // props) so no two product pages share the same snippet — the main lever
  // against "thin / duplicate content, currently not indexed".
  const price = product.discountPrice ?? product.price;
  const priceStr = typeof price === "number" && price > 0 ? `₹${price.toLocaleString("en-IN")}.` : "";
  const carat = product.diamondCarat ? `${product.diamondCarat} ct ` : "";
  const description = clampWord(
    [
      `${product.name} — ${carat}${descriptor || siteConfig.description}.`,
      priceStr,
      "Handcrafted by Sparenza & Co. · certified · insured delivery · lifetime exchange. Enquire today.",
    ]
      .filter(Boolean)
      .join(" "),
    160
  );

  const ogTitle = clampWord(descriptor ? `${product.name} – ${descriptor}` : product.name, 90);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${ogTitle} | ${siteConfig.name}`,
      description,
      url,
      type: "website",
      images: image ? [{ url: image, width: 1200, height: 1200, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${ogTitle} | ${siteConfig.name}`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProduct(slug);

  // Consolidate on the canonical pretty URL: a bare-id or stale-name slug is
  // 301'd to "<name>-<id>" so old indexed links pass their equity forward.
  if (product) {
    const canonical = productSlug(product.name, product._id);
    if (slug !== canonical) permanentRedirect(`/products/${canonical}`);
  }

  const graph: object[] = [];

  if (product) {
    const productUrl = `${siteConfig.url}/products/${productSlug(product.name, product._id)}`;
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
      const offer: Record<string, unknown> = {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "INR",
        price: String(price),
        // Prices are valid to the end of next year — refreshed on each revalidate.
        priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
        // Enquiry / made-to-order catalogue — every piece is available to order,
        // so this must match the visible page (which no longer shows out-of-stock).
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@type": "Organization", name: siteConfig.name },
        // Every piece is made to order, so change-of-mind returns are not
        // offered — declare that truthfully rather than a return window.
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "IN",
          returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
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

    // Google's Product snippet requires offers, review, or aggregateRating.
    // This is a price-on-request catalogue (prices are shared via personal
    // consultation), so pieces without a price or genuine rating would emit an
    // "invalid Product" that clutters Search Console for no benefit. Only
    // present the Product node when it can actually satisfy those requirements;
    // otherwise the breadcrumb below (plus the page's <h1>, meta and visible
    // content) still describe the piece fully.
    if (productLd.offers || productLd.aggregateRating) {
      graph.push(productLd);
    }

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
      <ProductView productId={extractProductId(slug)} />
    </>
  );
}
