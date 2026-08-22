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
  | "watches"
  // Virtual bucket — the API resolves `diamonds` to every diamond-set piece
  // across the catalogue rather than a stored category.
  | "diamonds";

export interface CategoryMeta {
  slug: string;
  title: string;
  description: string;
  dbCategory: TDbCategory;
  /** Parent top-level slug — used for breadcrumbs on sub-categories. */
  parent?: string;
  /** Longer SEO intro copy shown below the listing header (top categories). */
  intro?: string;
  /** Genuine FAQs — rendered visibly AND emitted as FAQPage structured data. */
  faqs?: Array<{ q: string; a: string }>;
}


export const categoryMeta: Record<string, CategoryMeta> = {
  // ── Rings ──
  rings: {
    slug: "rings",
    title: "Rings",
    description:
      "From solitaires to eternity bands — diamond rings crafted to mark life's most precious moments.",
    dbCategory: "rings",
    intro:
      "Explore the Sparenza & Co. collection of diamond rings — from classic solitaires and engagement rings to eternity bands and statement cocktail rings. Each ring is handcrafted in your choice of 18K gold, rose gold, white gold or platinum and set with certified diamonds. Every piece ships insured and is backed by our lifetime exchange promise.",
    faqs: [
      {
        q: "Are Sparenza diamond rings certified?",
        a: "Yes. Our diamonds are certified for cut, colour, clarity and carat, and each ring is supplied with its certification so you know exactly what you're buying.",
      },
      {
        q: "Can I choose the metal and ring size?",
        a: "Most rings can be made in 18K yellow gold, rose gold, white gold or platinum, and crafted to your ring size. Use our size guide, or book a free appointment for a precise fitting.",
      },
      {
        q: "What is your returns and exchange policy on rings?",
        a: "Rings can be returned within 30 days in their original condition, and every piece is covered by our lifetime exchange programme.",
      },
    ],
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
    intro:
      "Discover diamond necklaces from Sparenza & Co. — delicate pendants for everyday wear, fine gold and platinum chains, contemporary chokers and red-carpet statement pieces. Each necklace is handcrafted with certified diamonds and delivered insured, with our lifetime exchange promise.",
    faqs: [
      {
        q: "What necklace length should I choose?",
        a: "Pendant necklaces sit beautifully at 16–18 inches for most necklines, while longer 20–24 inch chains layer well. See our size guide, or ask our team for a recommendation.",
      },
      {
        q: "Which metals are available for necklaces?",
        a: "Our necklaces are crafted in 18K yellow gold, rose gold, white gold and platinum. Metal availability is shown on each product page.",
      },
      {
        q: "Do necklaces come with certification?",
        a: "Yes — every diamond necklace is supplied with certification for its diamonds and ships in protective, insured packaging.",
      },
    ],
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
    intro:
      "Shop diamond earrings from Sparenza & Co. — timeless studs for everyday brilliance, modern hoops, graceful drops and dramatic chandelier styles. Handcrafted in 18K gold and platinum with certified diamonds, every pair ships insured and carries our lifetime exchange promise.",
    faqs: [
      {
        q: "Are the earrings suitable for sensitive ears?",
        a: "Our earrings are made from solid 18K gold and platinum, which are well tolerated by most sensitive skin. Posts and fittings are finished to the same high standard.",
      },
      {
        q: "Do diamond studs come as a matched pair?",
        a: "Yes. Diamond stud earrings are carefully matched for carat, colour and clarity so the pair looks balanced, and are supplied with certification.",
      },
      {
        q: "Can I return earrings?",
        a: "Earrings can be returned within 30 days in unworn, original condition, subject to hygiene checks, and are covered by our lifetime exchange programme.",
      },
    ],
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
    intro:
      "Browse diamond bracelets from Sparenza & Co. — iconic tennis bracelets matched stone by stone, sculptural bangles and bold modern cuffs. Handcrafted in 18K gold and platinum with certified diamonds, each bracelet is delivered insured with our lifetime exchange promise.",
    faqs: [
      {
        q: "How do I find my bracelet size?",
        a: "Measure your wrist and add roughly 1.5–2 cm for a comfortable fit, or consult our size guide. Tennis bracelets can often be adjusted by adding or removing links.",
      },
      {
        q: "What makes a tennis bracelet special?",
        a: "A tennis bracelet is a continuous line of individually set, closely matched diamonds. We hand-match every stone for carat, colour and clarity so the line is seamless.",
      },
      {
        q: "Is delivery insured?",
        a: "Yes. Every bracelet ships in secure, insured packaging, and all diamond pieces are supplied with certification.",
      },
    ],
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

  // ── Diamonds (virtual — diamond-set pieces from across the catalogue) ──
  diamonds: {
    slug: "diamonds",
    title: "Diamonds",
    description:
      "Our finest diamond jewellery — hand-selected brilliance drawn from every collection.",
    dbCategory: "diamonds",
    intro:
      "Explore Sparenza & Co.'s finest diamond jewellery — a curated selection of certified-diamond rings, necklaces, earrings and bracelets drawn from across our collections. Every piece is handcrafted, supplied with diamond certification, delivered insured and backed by our lifetime exchange promise.",
    faqs: [
      {
        q: "What certification do your diamonds carry?",
        a: "Our diamonds are graded on the 4Cs — cut, colour, clarity and carat — and each piece is supplied with its certification.",
      },
      {
        q: "What are the 4Cs of a diamond?",
        a: "The 4Cs are Cut (how well the diamond is faceted and reflects light), Colour (how near-colourless it is), Clarity (freedom from inclusions) and Carat (weight). Together they determine a diamond's quality and value.",
      },
      {
        q: "Do you offer certified diamonds across all jewellery types?",
        a: "Yes. You'll find certified-diamond pieces across our rings, necklaces, earrings and bracelets, each crafted in 18K gold or platinum.",
      },
    ],
  },

  // ── Watches (kept for existing links; no longer surfaced on the storefront) ──
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
