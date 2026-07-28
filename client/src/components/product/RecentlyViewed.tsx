"use client";

import { useEffect, useState } from "react";
import { IProduct } from "@/types/product.types";
import { getRecentlyViewed } from "@/lib/recently-viewed";
import { RelatedProducts } from "@/components/product/RelatedProducts";

interface RecentlyViewedProps {
  /** Exclude the product currently being viewed from its own history strip. */
  excludeId?: string;
}

export function RecentlyViewed({ excludeId }: RecentlyViewedProps) {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    // One-time read of a browser-only value after mount (avoids SSR/hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProducts(getRecentlyViewed().filter((p) => p._id !== excludeId));
  }, [excludeId]);

  if (products.length === 0) return null;

  return <RelatedProducts products={products} title="Recently Viewed" />;
}
