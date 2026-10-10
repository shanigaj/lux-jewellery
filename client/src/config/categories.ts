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
  | "coins"
  | "accessories"
  // Virtual bucket — the API resolves `diamonds` to every diamond-set piece
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
        q: "What is your exchange policy on rings?",
        a: "Each ring is made to order, so we do not accept change-of-mind returns — but every piece is covered by our lifetime exchange and buyback programme, with a complimentary first resize within 30 days. Any damaged or incorrect piece is always put right free of charge.",
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
        q: "Can I exchange earrings?",
        a: "Earrings are crafted to order and, for hygiene reasons, are not returnable — but they are covered by our lifetime exchange programme, and any damaged or incorrect piece is repaired or replaced free of charge.",
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

  // ── Additional necklace sub-categories ──
  mangalsutra: { slug: "mangalsutra", title: "Mangalsutra", description: "Sacred diamond mangalsutras, reimagined for the modern bride.", dbCategory: "necklaces", parent: "necklaces" },
  "tennis-necklaces": { slug: "tennis-necklaces", title: "Tennis Necklaces", description: "A continuous line of diamonds — timeless brilliance for the neckline.", dbCategory: "necklaces", parent: "necklaces" },
  "pearl-necklaces": { slug: "pearl-necklaces", title: "Pearl Necklaces", description: "Lustrous pearls paired with diamond accents.", dbCategory: "necklaces", parent: "necklaces" },

  // ── Additional ring sub-categories ──
  "halo-rings": { slug: "halo-rings", title: "Halo Rings", description: "A centre stone framed by a halo of diamonds for maximum sparkle.", dbCategory: "rings", parent: "rings" },

  // ── Additional earring sub-categories ──
  "ear-cuffs": { slug: "ear-cuffs", title: "Ear Cuffs", description: "Modern, no-piercing diamond ear cuffs.", dbCategory: "earrings", parent: "earrings" },
  "nose-pins": { slug: "nose-pins", title: "Nose Pins", description: "Delicate diamond nose pins and nose rings.", dbCategory: "earrings", parent: "earrings" },

  // ── Additional bracelet sub-categories ──
  "charm-bracelets": { slug: "charm-bracelets", title: "Charm Bracelets", description: "Personalisable charm bracelets in gold and diamond.", dbCategory: "bracelets", parent: "bracelets" },
  "chain-bracelets": { slug: "chain-bracelets", title: "Chain Bracelets", description: "Cuban, paperclip and link-chain bracelets in gold and platinum.", dbCategory: "bracelets", parent: "bracelets" },
  anklets: { slug: "anklets", title: "Anklets", description: "Fine gold and diamond anklets.", dbCategory: "bracelets", parent: "bracelets" },

  // ── Coins & bars ──
  coins: { slug: "coins", title: "Gold & Silver Coins", description: "Certified 24KT gold and 999 silver coins and bars for gifting and investment.", dbCategory: "coins", intro: "Invest in certified 24KT gold coins, deity coins and 999 silver bars from Sparenza & Co. — hallmarked, assured for purity and beautifully presented." },
  "gold-coins": { slug: "gold-coins", title: "Gold Coins", description: "Certified 24KT gold coins and bars.", dbCategory: "coins", parent: "coins" },
  "silver-coins": { slug: "silver-coins", title: "Silver Coins & Bars", description: "999 fine silver coins and bars.", dbCategory: "coins", parent: "coins" },

  // ── Accessories ──
  accessories: { slug: "accessories", title: "Accessories", description: "Cufflinks, brooches, tie pins and more — fine diamond accessories.", dbCategory: "accessories", intro: "Complete the look with Sparenza & Co. fine accessories — diamond cufflinks, brooches, tie pins, maang tikkas and hair pins, all crafted in gold and platinum." },
  cufflinks: { slug: "cufflinks", title: "Cufflinks", description: "Diamond and gold cufflinks for him.", dbCategory: "accessories", parent: "accessories" },
  brooch: { slug: "brooch", title: "Brooches", description: "Statement diamond brooches.", dbCategory: "accessories", parent: "accessories" },
  "tie-pin": { slug: "tie-pin", title: "Tie Pins", description: "Refined diamond tie pins.", dbCategory: "accessories", parent: "accessories" },
  "maang-tikka": { slug: "maang-tikka", title: "Maang Tikka", description: "Bridal diamond maang tikkas.", dbCategory: "accessories", parent: "accessories" },
  "hair-pins": { slug: "hair-pins", title: "Hair Pins", description: "Ornamental diamond hair pins.", dbCategory: "accessories", parent: "accessories" },
};

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return categoryMeta[slug];
}
