// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Category Page Metadata
// ───────────────────────────────────────────────────────────
// Every category / sub-category slug used in the header
// (see `navigation.ts`) maps to a landing page rendered by
// `app/(main)/categories/[slug]/page.tsx`.
//
// `dbCategory` is the top-level bucket products are stored under
// (the Product model enum), so a sub-category like
// "engagement-rings" still resolves to real "rings" products.
// ═══════════════════════════════════════════════════════════

export type TDbCategory =
  | "rings"
  | "necklaces"
  | "earrings"
  | "bracelets"
  | "watches";

export interface CategoryMeta {
  slug: string;
  title: string;
  description: string;
  dbCategory: TDbCategory;
  /** Parent top-level slug — used for breadcrumbs on sub-categories. */
  parent?: string;
}


export const categoryMeta: Record<string, CategoryMeta> = {
  // ── Rings ──
  rings: {
    slug: "rings",
    title: "Rings",
    description:
      "From solitaires to eternity bands — diamond rings crafted to mark life's most precious moments.",
    dbCategory: "rings",
  },
  "engagement-rings": {
    slug: "engagement-rings",
    title: "Engagement Rings",
    description: "Begin your forever with a brilliance that lasts a lifetime.",
    dbCategory: "rings",
    parent: "rings",
  },
  "wedding-bands": {
    slug: "wedding-bands",
    title: "Wedding Bands",
    description: "Symbols of eternal commitment, finished by hand.",
    dbCategory: "rings",
    parent: "rings",
  },
  "solitaire-rings": {
    slug: "solitaire-rings",
    title: "Solitaire Rings",
    description: "Timeless single-stone elegance that never fades.",
    dbCategory: "rings",
    parent: "rings",
  },
  "eternity-rings": {
    slug: "eternity-rings",
    title: "Eternity Rings",
    description: "An unbroken circle of diamonds — love without end.",
    dbCategory: "rings",
    parent: "rings",
  },
  "cocktail-rings": {
    slug: "cocktail-rings",
    title: "Cocktail Rings",
    description: "Bold statements of luxury for the moments that matter.",
    dbCategory: "rings",
    parent: "rings",
  },

  // ── Necklaces ──
  necklaces: {
    slug: "necklaces",
    title: "Necklaces",
    description:
      "Pendants, chains and statement pieces — diamonds designed to draw every eye.",
    dbCategory: "necklaces",
  },
  pendants: {
    slug: "pendants",
    title: "Pendants",
    description: "Delicate drops of brilliance for everyday luxury.",
    dbCategory: "necklaces",
    parent: "necklaces",
  },
  chains: {
    slug: "chains",
    title: "Chains",
    description: "Refined everyday luxury in gold and platinum.",
    dbCategory: "necklaces",
    parent: "necklaces",
  },
  chokers: {
    slug: "chokers",
    title: "Chokers",
    description: "Bold and contemporary — jewellery that commands attention.",
    dbCategory: "necklaces",
    parent: "necklaces",
  },
  "statement-necklaces": {
    slug: "statement-necklaces",
    title: "Statement Necklaces",
    description: "Masterpieces that captivate from across the room.",
    dbCategory: "necklaces",
    parent: "necklaces",
  },

  // ── Earrings ──
  earrings: {
    slug: "earrings",
    title: "Earrings",
    description:
      "Studs, hoops and chandeliers — diamond earrings for every occasion.",
    dbCategory: "earrings",
  },
  studs: {
    slug: "studs",
    title: "Studs",
    description: "Classic diamond brilliance, worn every day.",
    dbCategory: "earrings",
    parent: "earrings",
  },
  hoops: {
    slug: "hoops",
    title: "Hoops",
    description: "Modern elegance redefined in precious metals.",
    dbCategory: "earrings",
    parent: "earrings",
  },
  "drop-earrings": {
    slug: "drop-earrings",
    title: "Drop Earrings",
    description: "Graceful movement and light with every turn.",
    dbCategory: "earrings",
    parent: "earrings",
  },
  "chandelier-earrings": {
    slug: "chandelier-earrings",
    title: "Chandelier Earrings",
    description: "Red-carpet-worthy drama in cascading diamonds.",
    dbCategory: "earrings",
    parent: "earrings",
  },

  // ── Bracelets ──
  bracelets: {
    slug: "bracelets",
    title: "Bracelets",
    description:
      "Tennis bracelets, bangles and cuffs — sculptural diamond beauty for the wrist.",
    dbCategory: "bracelets",
  },
  "tennis-bracelets": {
    slug: "tennis-bracelets",
    title: "Tennis Bracelets",
    description: "An icon of diamond luxury, perfectly matched stone by stone.",
    dbCategory: "bracelets",
    parent: "bracelets",
  },
  bangles: {
    slug: "bangles",
    title: "Bangles",
    description: "Sculptural beauty that stacks with everything you own.",
    dbCategory: "bracelets",
    parent: "bracelets",
  },
  cuffs: {
    slug: "cuffs",
    title: "Cuffs",
    description: "Architectural elegance with a bold, modern silhouette.",
    dbCategory: "bracelets",
    parent: "bracelets",
  },

  // ── Watches ──
  watches: {
    slug: "watches",
    title: "Luxury Watches",
    description:
      "Swiss craftsmanship set with diamonds — timepieces that are heirlooms in the making.",
    dbCategory: "watches",
  },
};

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return categoryMeta[slug];
}
