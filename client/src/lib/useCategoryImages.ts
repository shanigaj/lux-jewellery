"use client";

// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Category imagery, sourced live from the DB
// ───────────────────────────────────────────────────────────
// The storefront no longer ships hard-coded stock photos. Every
// decorative "category" image (home tiles, mega-menu, hero
// banners, review/instagram art) is resolved at render time from
// real catalogue photography stored on the products in MongoDB.
//
// Where a category has no piece with genuine (Cloudinary) art yet,
// we fall back to a single neutral placeholder — never a stock photo.
// ═══════════════════════════════════════════════════════════

import { useMemo } from "react";
import { useGetProductsQuery } from "@/store/api/productApi";
import { hasRealImage } from "@/lib/product-image";
import type { IProduct } from "@/types/product.types";

/** The only static image left for imagery: a neutral, brand-agnostic fallback. */
export const PLACEHOLDER_IMAGE = "/images/placeholder.png";

const categorySlugOf = (p: IProduct): string =>
  typeof p.category === "string" ? p.category : p.category?.slug ?? "";

export interface CategoryImages {
  /** Every product in the catalogue (adapted read shape). */
  products: IProduct[];
  /** Only pieces that carry genuine, distinct photography. */
  realProducts: IProduct[];
  /** Flat list of real product image URLs (for galleries / decorative grids). */
  realImages: string[];
  /** A sensible general hero image (first real piece), else placeholder. */
  heroImage: string;
  /** Representative image for a DB category bucket (rings, necklaces, …). */
  imageFor: (dbCategory: string) => string;
  /** Nth real image, wrapping around — handy for decorative grids. */
  imageAt: (index: number) => string;
  isLoading: boolean;
}

/**
 * Single source of truth for category imagery across the storefront.
 * Reuses the `{ limit: 1000 }` product query (shared RTK cache entry),
 * so mounting this hook in several components costs one network request.
 */
export function useCategoryImages(enabled: boolean = true): CategoryImages {
  // Only category + images + name are needed (per-category counts and the
  // decorative image grids), so project to those fields — this trims the
  // full-catalogue response from ~2.3MB to a few hundred KB, which was the
  // dominant main-thread cost on the homepage.
  //
  // `enabled` lets callers defer this heavy ~1000-row fetch until it is
  // actually needed (e.g. the mega-menu, which only shows imagery on open),
  // so pages that never open the menu don't pay for it. Shared RTK cache
  // means the first enabled caller fetches once for everyone.
  const { data, isLoading } = useGetProductsQuery(
    {
      limit: 1000,
      fields: "category,images,name",
    },
    { skip: !enabled }
  );

  return useMemo(() => {
    const products = data?.data ?? [];
    const realProducts = products.filter(hasRealImage);
    const realImages = realProducts.map((p) => p.thumbnail);
    const heroImage = realImages[0] ?? PLACEHOLDER_IMAGE;

    const imageFor = (dbCategory: string): string =>
      realProducts.find((p) => categorySlugOf(p) === dbCategory)?.thumbnail ??
      PLACEHOLDER_IMAGE;

    const imageAt = (index: number): string =>
      realImages.length > 0
        ? realImages[((index % realImages.length) + realImages.length) % realImages.length]
        : PLACEHOLDER_IMAGE;

    return {
      products,
      realProducts,
      realImages,
      heroImage,
      imageFor,
      imageAt,
      isLoading,
    };
  }, [data, isLoading]);
}
