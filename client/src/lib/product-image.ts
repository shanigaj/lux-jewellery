import type { IProduct } from "@/types/product.types";

// Some seed/top-up products have no photography yet and fall back to the
// neutral placeholder, which reads as "repeated images" when many are shown
// together. Real catalogue pieces have their own remote (Cloudinary)
// photography. This flags the pieces with genuine, distinct art.
export function hasRealImage(product: Pick<IProduct, "thumbnail" | "images">): boolean {
  const thumb =
    product?.thumbnail ||
    (Array.isArray(product?.images) ? product.images[0]?.url : undefined);
  return typeof thumb === "string" && /^https?:\/\//i.test(thumb);
}

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
  const order: string[] = [];
  for (const p of products) {
    const k = keyOf(p);
    if (!buckets.has(k)) {
      buckets.set(k, []);
      order.push(k);
    }
    buckets.get(k)!.push(p);
  }

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
