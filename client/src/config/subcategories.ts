// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Sub-category scheme
// ───────────────────────────────────────────────────────────
// Real sub-categories derived from the actual catalogue. Each product is
// stamped with a `subcategory` slug (see server classification), so these
// filter/nav links show genuinely different sets.
//
// ORDER MATTERS: products are classified by first-match, most-specific first
// (e.g. an "Eternity Band" is Eternity, not a generic Wedding Band).
// ═══════════════════════════════════════════════════════════

export interface SubCategory {
  slug: string;
  label: string;
  /** Parent main category. */
  category: string;
  /** Name keywords used to classify products (first match wins, in list order). */
  keywords: string[];
}

export const subCategories: SubCategory[] = [
  // ── Rings ──
  { slug: "engagement-rings", label: "Engagement", category: "rings", keywords: ["engagement", "solitaire"] },
  { slug: "eternity-rings", label: "Eternity", category: "rings", keywords: ["eternity"] },
  { slug: "halo-rings", label: "Halo", category: "rings", keywords: ["halo"] },
  { slug: "cocktail-rings", label: "Cocktail & Statement", category: "rings", keywords: ["cocktail", "statement", "cluster", "three stone", "trilogy", "signet"] },
  { slug: "wedding-bands", label: "Bands", category: "rings", keywords: ["wedding", "band"] },

  // ── Necklaces ──
  { slug: "chokers", label: "Chokers", category: "necklaces", keywords: ["choker", "collar"] },
  { slug: "tennis-necklaces", label: "Tennis & Station", category: "necklaces", keywords: ["tennis", "station", "riviere", "rivière", "lariat"] },
  { slug: "pendants", label: "Pendants", category: "necklaces", keywords: ["pendant", "locket", "charm", "drop"] },
  { slug: "pearl-necklaces", label: "Pearl", category: "necklaces", keywords: ["pearl"] },
  { slug: "chains", label: "Chains", category: "necklaces", keywords: ["chain"] },

  // ── Earrings ──
  { slug: "ear-cuffs", label: "Ear Cuffs", category: "earrings", keywords: ["ear cuff", "climber", "threader"] },
  { slug: "hoop-earrings", label: "Hoops", category: "earrings", keywords: ["hoop", "huggie"] },
  { slug: "stud-earrings", label: "Studs", category: "earrings", keywords: ["stud"] },
  { slug: "drop-earrings", label: "Drops", category: "earrings", keywords: ["drop", "dangle", "chandelier"] },

  // ── Bracelets ──
  { slug: "tennis-bracelets", label: "Tennis", category: "bracelets", keywords: ["tennis"] },
  { slug: "cuffs", label: "Cuffs", category: "bracelets", keywords: ["cuff"] },
  { slug: "bangles", label: "Bangles", category: "bracelets", keywords: ["bangle", "kada"] },
  { slug: "charm-bracelets", label: "Charm & Beaded", category: "bracelets", keywords: ["charm", "beaded"] },
  { slug: "chain-bracelets", label: "Chains & Links", category: "bracelets", keywords: ["chain", "link", "cuban", "paperclip"] },
];

/** Sub-categories for one main category, in display order. */
export function subCategoriesFor(category: string): SubCategory[] {
  return subCategories.filter((s) => s.category === category);
}
