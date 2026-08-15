// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Navigation Configuration
// ═══════════════════════════════════════════════════════════

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  featured?: boolean;
  description?: string;
  image?: string;
}

export const mainNavigation: NavItem[] = [
  {
    label: "Rings",
    href: "/categories/rings",
    image: "/images/hero-ring.png",
    children: [
      {
        label: "Engagement Rings",
        href: "/categories/engagement-rings",
        description: "Begin your forever with brilliance",
      },
      {
        label: "Wedding Bands",
        href: "/categories/wedding-bands",
        description: "Symbols of eternal commitment",
      },
      {
        label: "Solitaire Rings",
        href: "/categories/solitaire-rings",
        description: "Timeless single-stone elegance",
      },
      {
        label: "Eternity Rings",
        href: "/categories/eternity-rings",
        description: "An unbroken circle of diamonds",
      },
      {
        label: "Cocktail Rings",
        href: "/categories/cocktail-rings",
        description: "Bold statements of luxury",
      },
    ],
  },
  {
    label: "Necklaces",
    href: "/categories/necklaces",
    image: "/images/products/necklace.png",
    children: [
      {
        label: "Pendants",
        href: "/categories/pendants",
        description: "Delicate drops of brilliance",
      },
      {
        label: "Chains",
        href: "/categories/chains",
        description: "Refined everyday luxury",
      },
      {
        label: "Chokers",
        href: "/categories/chokers",
        description: "Bold and contemporary",
      },
      {
        label: "Statement Necklaces",
        href: "/categories/statement-necklaces",
        description: "Masterpieces that captivate",
      },
    ],
  },
  {
    label: "Earrings",
    href: "/categories/earrings",
    image: "/images/products/earrings.png",
    children: [
      {
        label: "Studs",
        href: "/categories/studs",
        description: "Classic diamond brilliance",
      },
      {
        label: "Hoops",
        href: "/categories/hoops",
        description: "Modern elegance redefined",
      },
      {
        label: "Drop Earrings",
        href: "/categories/drop-earrings",
        description: "Graceful movement and light",
      },
      {
        label: "Chandelier",
        href: "/categories/chandelier-earrings",
        description: "Red carpet worthy drama",
      },
    ],
  },
  {
    label: "Bracelets",
    href: "/categories/bracelets",
    image: "/images/products/bracelet.png",
    children: [
      {
        label: "Tennis Bracelets",
        href: "/categories/tennis-bracelets",
        description: "An icon of diamond luxury",
      },
      {
        label: "Bangles",
        href: "/categories/bangles",
        description: "Sculptural beauty",
      },
      {
        label: "Cuffs",
        href: "/categories/cuffs",
        description: "Architectural elegance",
      },
    ],
  },
  {
    label: "Discover",
    href: "/about",
    featured: true,
    image: "/images/collections/hero-collection.png",
    children: [
      {
        label: "Our Story",
        href: "/about",
        description: "The people and values behind Sparenza & Co.",
      },
      {
        label: "Contact Us",
        href: "/contact",
        description: "Visit, call or message our Surat boutique",
      },
      {
        label: "Design Your Own Ring",
        href: "/design-your-own",
        description: "Compose a ring stone by stone",
      },
      {
        label: "Book an Appointment",
        href: "/book-appointment",
        description: "A private boutique or virtual consultation",
      },
    ],
  },
];

export const footerNavigation = {
  shop: [
    { label: "Rings", href: "/categories/rings" },
    { label: "Necklaces", href: "/categories/necklaces" },
    { label: "Earrings", href: "/categories/earrings" },
    { label: "Bracelets", href: "/categories/bracelets" },
    { label: "All Jewellery", href: "/products" },
  ],
  about: [
    { label: "Our Story", href: "/about" },
    { label: "Craftsmanship", href: "/about/craftsmanship" },
    { label: "Sustainability", href: "/about/sustainability" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Shipping & Returns", href: "/shipping-returns" },
    { label: "FAQ", href: "/faq" },
    { label: "Care Instructions", href: "/care" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};
