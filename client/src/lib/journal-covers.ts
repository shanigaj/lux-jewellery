import { cache } from "react";

// ═══════════════════════════════════════════════════════════
// Journal cover imagery — sourced live from the catalogue.
// ───────────────────────────────────────────────────────────
// The storefront never ships stock photos; every decorative image
// is real catalogue photography. Each static Journal article is
// mapped to a jewellery category, and we pull one genuine product
// photo for that category from the live API to use as its cover.
// Server-only (used from server components) so covers are in the
// initial HTML for search engines and social cards.
// ═══════════════════════════════════════════════════════════

// The categories we pull a representative photo for.
const COVER_CATEGORIES = ["diamonds", "rings", "necklaces", "earrings", "bracelets"] as const;
type CoverCategory = (typeof COVER_CATEGORIES)[number];

// Article slug → the jewellery category whose photography best fits it.
const SLUG_TO_CATEGORY: Record<string, CoverCategory> = {
  "the-4cs-of-diamonds-explained": "diamonds",
  "lab-grown-vs-natural-diamonds": "diamonds",
  "how-to-choose-an-engagement-ring": "rings",
  "understanding-bis-hallmarking": "bracelets",
  "gia-vs-igi-certification": "diamonds",
  "gold-purity-22k-18k-14k": "necklaces",
  "how-to-measure-ring-size-at-home": "rings",
  "caring-for-your-diamond-jewellery": "earrings",
  "diamond-shapes-guide": "diamonds",
  "solitaire-halo-three-stone-settings": "rings",
  "platinum-vs-white-gold": "rings",
  "jewellery-for-indian-weddings": "necklaces",
  "jewellery-buyback-and-value": "bracelets",
  "how-made-to-order-jewellery-is-crafted": "earrings",
};

function isRealUrl(u?: string): u is string {
  return typeof u === "string" && /^https?:\/\//i.test(u);
}

async function fetchCategoryImage(category: CoverCategory): Promise<string | undefined> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(
      `${api}/products?category=${category}&limit=1&fields=category,images`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return undefined;
    const json = await res.json();
    const first = json?.data?.[0]?.images?.[0];
    return isRealUrl(first) ? first : undefined;
  } catch {
    return undefined;
  }
}

// One product photo per category, resolved once per request/build.
export const getJournalCovers = cache(async (): Promise<Record<string, string>> => {
  const entries = await Promise.all(
    COVER_CATEGORIES.map(async (c) => [c, await fetchCategoryImage(c)] as const)
  );
  const map: Record<string, string> = {};
  for (const [c, url] of entries) if (url) map[c] = url;
  return map;
});

// The cover image URL for a given article slug, or undefined if none is
// available (the page then shows the branded gradient placeholder).
export function coverForArticle(slug: string, covers: Record<string, string>): string | undefined {
  const category = SLUG_TO_CATEGORY[slug] ?? "diamonds";
  return covers[category] ?? covers["diamonds"] ?? Object.values(covers)[0];
}
