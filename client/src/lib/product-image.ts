import type { IProduct } from "@/types/product.types";

// Seed/top-up products reuse a single local stock photo per category
// (e.g. "/images/products/earrings.png"), which reads as "repeated images"
// when many are shown together. Real catalogue pieces have their own remote
// (Cloudinary) photography. This flags the pieces with genuine, distinct art.
export function hasRealImage(product: Pick<IProduct, "thumbnail" | "images">): boolean {
  const thumb =
    product?.thumbnail ||
    (Array.isArray(product?.images) ? product.images[0]?.url : undefined);
  return typeof thumb === "string" && /^https?:\/\//i.test(thumb);
}
