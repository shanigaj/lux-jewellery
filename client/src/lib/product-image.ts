import type { IProduct } from "@/types/product.types";

// Some seed/top-up products have no photography yet and fall back to the
// neutral placeholder, which reads as "repeated images" when many are shown
// together. Real catalogue pieces have their own remote (Cloudinary/ImageKit)
// photography. This flags the pieces with genuine, distinct art.
export function hasRealImage(product: Pick<IProduct, "thumbnail" | "images">): boolean {
  const thumb =
    product?.thumbnail ||
    (Array.isArray(product?.images)
      ? typeof product.images[0] === "string"
        ? product.images[0]
        : product.images[0]?.url
      : undefined);
  return typeof thumb === "string" && /^https?:\/\//i.test(thumb);
}

/**
 * Flags wearable luxury jewellery pieces for homepage showcase.
 * Strictly excludes bullion, coins, silver/gold bars/biscuits which
 * detract from the high-end jewellery aesthetic on the homepage.
 */
export function isShowcaseJewellery(
  product: Pick<IProduct, "category"> & { name?: string }
): boolean {
  const c = product?.category as unknown;
  const slug = (
    c && typeof c === "object"
      ? (c as { slug?: string; name?: string }).slug || (c as { name?: string }).name
      : typeof c === "string"
      ? c
      : ""
  )?.toLowerCase().trim() || "";

  // Strictly exclude non-wearable bullion, coins, bars, biscuits, accessories
  if (
    slug === "coins" ||
    slug === "coin" ||
    slug === "bullion" ||
    slug === "bars" ||
    slug === "accessories"
  ) {
    return false;
  }

  const name = (product?.name || "").toLowerCase();
  if (
    /\b(coin|bar|biscuit|bullion|cufflink|hair pin|brooch)\b/i.test(name) ||
    name.includes("silver bar") ||
    name.includes("gold bar") ||
    name.includes("999 silver") ||
    name.includes("999 gold") ||
    name.includes("gram")
  ) {
    return false;
  }

  return true;
}

// Fine jewellery categories that take precedence on the homepage
const CORE_CATEGORY_ORDER = ["rings", "necklaces", "earrings", "bracelets"];

// Round-robin across categories so a showcase (Featured, Best Sellers) shows a
// variety of pieces instead of being dominated by whichever category happens to
// lead the catalogue order. Ranking within each category is preserved — we just
// interleave one piece per category in turn until `count` is reached.
export function diversifyByCategory<T extends Pick<IProduct, "category">>(
  products: T[],
  count: number
): T[] {
  const keyOf = (p: T): string => {
    const c = p.category as unknown;
    if (c && typeof c === "object") {
      const o = c as { slug?: string; name?: string };
      return o.slug || o.name || "misc";
    }
    return typeof c === "string" ? c : "misc";
  };

  const buckets = new Map<string, T[]>();
  const discoveredOrder: string[] = [];
  for (const p of products) {
    const k = keyOf(p);
    if (!buckets.has(k)) {
      buckets.set(k, []);
      discoveredOrder.push(k);
    }
    buckets.get(k)!.push(p);
  }

  // Ensure Rings, Necklaces, Earrings, Bracelets always come first in order
  const order: string[] = [
    ...CORE_CATEGORY_ORDER.filter((k) => buckets.has(k)),
    ...discoveredOrder.filter((k) => !CORE_CATEGORY_ORDER.includes(k)),
  ];

  const result: T[] = [];
  let progressed = true;
  while (result.length < count && progressed) {
    progressed = false;
    for (const k of order) {
      const bucket = buckets.get(k)!;
      const next = bucket.shift();
      if (next) {
        result.push(next);
        progressed = true;
        if (result.length >= count) break;
      }
    }
  }
  return result;
}
