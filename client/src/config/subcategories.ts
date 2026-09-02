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
  /** Short, single-line blurb shown under the label in the header mega-menu. */
  description: string;
  /** Name keywords used to classify products (first match wins, in list order). */
  keywords: string[];
}

export const subCategories: SubCategory[] = [
  // ── Rings ──
  { slug: "engagement-rings", label: "Engagement", category: "rings", description: "Solitaires & diamond rings to propose with", keywords: ["engagement", "solitaire"] },
  { slug: "eternity-rings", label: "Eternity", category: "rings", description: "An unbroken circle of diamonds, set all around", keywords: ["eternity"] },
  { slug: "halo-rings", label: "Halo", category: "rings", description: "A centre stone framed in sparkling pavé", keywords: ["halo"] },
  { slug: "cocktail-rings", label: "Cocktail & Statement", category: "rings", description: "Bold statement rings for standout moments", keywords: ["cocktail", "statement", "cluster", "three stone", "trilogy", "signet"] },
  { slug: "wedding-bands", label: "Bands", category: "rings", description: "Classic and diamond-set wedding bands", keywords: ["wedding", "band"] },

  // ── Necklaces ──
  { slug: "chokers", label: "Chokers", category: "necklaces", description: "Close-fitting necklaces that frame the neckline", keywords: ["choker", "collar"] },
  { slug: "tennis-necklaces", label: "Tennis & Station", category: "necklaces", description: "A continuous line of diamonds, endlessly elegant", keywords: ["tennis", "station", "riviere", "rivière", "lariat"] },
  { slug: "pendants", label: "Pendants", category: "necklaces", description: "Delicate drops for effortless everyday shine", keywords: ["pendant", "locket", "charm", "drop"] },
  { slug: "pearl-necklaces", label: "Pearl", category: "necklaces", description: "Timeless pearls, classic and modern", keywords: ["pearl"] },
  { slug: "chains", label: "Chains", category: "necklaces", description: "Fine gold and platinum chains to layer", keywords: ["chain"] },

  // ── Earrings ──
  { slug: "ear-cuffs", label: "Ear Cuffs", category: "earrings", description: "Modern cuffs, climbers and threaders", keywords: ["ear cuff", "climber", "threader"] },
  { slug: "hoop-earrings", label: "Hoops", category: "earrings", description: "From petite huggies to bold statement hoops", keywords: ["hoop", "huggie"] },
  { slug: "stud-earrings", label: "Studs", category: "earrings", description: "Everyday diamond studs, perfectly matched", keywords: ["stud"] },
  { slug: "drop-earrings", label: "Drops", category: "earrings", description: "Graceful drops and dramatic chandeliers", keywords: ["drop", "dangle", "chandelier"] },

  // ── Bracelets ──
  { slug: "tennis-bracelets", label: "Tennis", category: "bracelets", description: "A flexible line of diamonds around the wrist", keywords: ["tennis"] },
  { slug: "cuffs", label: "Cuffs", category: "bracelets", description: "Sculptural open cuffs that make a statement", keywords: ["cuff"] },
  { slug: "bangles", label: "Bangles", category: "bracelets", description: "Solid bangles and kadas in gold & diamond", keywords: ["bangle", "kada"] },
  { slug: "charm-bracelets", label: "Charm & Beaded", category: "bracelets", description: "Playful charm and beaded bracelets", keywords: ["charm", "beaded"] },
  { slug: "chain-bracelets", label: "Chains & Links", category: "bracelets", description: "Cuban, paperclip and link-chain bracelets", keywords: ["chain", "link", "cuban", "paperclip"] },
];

/** Sub-categories for one main category, in display order. */
export function subCategoriesFor(category: string): SubCategory[] {
  return subCategories.filter((s) => s.category === category);
}
