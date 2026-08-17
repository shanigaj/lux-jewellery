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
