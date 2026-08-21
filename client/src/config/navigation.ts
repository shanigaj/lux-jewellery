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
  // Top-level links map straight to real catalogue categories. (The old
  // sub-menus — "Engagement Rings", "Studs", … — had no distinct products, so
  // every one of them opened the same list; they've been removed.)
  { label: "Rings", href: "/categories/rings" },
  { label: "Necklaces", href: "/categories/necklaces" },
  { label: "Earrings", href: "/categories/earrings" },
  { label: "Bracelets", href: "/categories/bracelets" },
  { label: "Diamonds", href: "/categories/diamonds" },
  {
    label: "Discover",
    href: "/about",
    featured: true,
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
    { label: "Diamonds", href: "/categories/diamonds" },
    { label: "All Jewellery", href: "/products" },
  ],
  about: [
    { label: "Our Story", href: "/about" },
    { label: "Craftsmanship", href: "/about/craftsmanship" },
    { label: "Sustainability", href: "/about/sustainability" },
    { label: "Journal", href: "/journal" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Shipping & Returns", href: "/shipping-returns" },
    { label: "FAQ", href: "/faq" },
    { label: "Care Instructions", href: "/care" },
  ],
  legal: [
    { label: "Return & Refund Policy", href: "/refund-policy" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};
