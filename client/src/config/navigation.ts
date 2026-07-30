// ═══════════════════════════════════════════════════════════
// 💎 LUX DIAMONDS — Navigation Configuration
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
    label: "Collections",
    href: "/collections",
    featured: true,
    image: "/images/collections/hero-collection.png",
    children: [
      {
        label: "Bridal Collection",
        href: "/collections/bridal",
        description: "For your most precious moments",
        image: "/images/collections/bridal.jpg",
      },
      {
        label: "Heritage Collection",
        href: "/collections/heritage",
        description: "Inspired by timeless artistry",
        image: "/images/collections/heritage.jpg",
      },
      {
        label: "Celestial Collection",
        href: "/collections/celestial",
        description: "Stars captured in diamonds",
        image: "/images/collections/celestial.jpg",
      },
      {
        label: "New Arrivals",
        href: "/collections/new-arrivals",
        description: "The latest masterpieces",
      },
    ],
  },
  {
    label: "Bespoke",
    href: "/design-your-own",
    featured: true,
    image: "/images/collections/hero-collection.png",
    children: [
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
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Bestsellers", href: "/collections/bestsellers" },
  ],
  about: [
    { label: "Our Story", href: "/about" },
    { label: "Craftsmanship", href: "/about/craftsmanship" },
    { label: "Diamond Guide", href: "/about/diamond-guide" },
    { label: "Sustainability", href: "/about/sustainability" },
    { label: "Press", href: "/about/press" },
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
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
};
