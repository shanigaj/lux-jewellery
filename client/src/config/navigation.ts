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

import { subCategoriesFor } from "@/config/subcategories";

// The hover menu now offers the real, catalogue-derived sub-categories (each is
// a genuinely different set of products). Where a category has none (Diamonds),
// it falls back to by-metal links.
const METALS = [
  { label: "Yellow Gold", value: "gold" },
  { label: "White Gold", value: "white_gold" },
  { label: "Rose Gold", value: "rose_gold" },
  { label: "Platinum", value: "platinum" },
];

const categoryMenu = (cat: string, title: string): NavItem[] => {
  const shopAll: NavItem = {
    label: `Shop All ${title}`,
    href: `/categories/${cat}`,
    description: `The complete ${title.toLowerCase()} collection`,
  };
  const subs = subCategoriesFor(cat);
  if (subs.length === 0) {
    return [
      shopAll,
      ...METALS.map((m) => ({
        label: m.label,
        href: `/products?category=${cat}&metal=${m.value}`,
        description: `${title} crafted in ${m.label.toLowerCase()}`,
      })),
    ];
  }
  return [
    shopAll,
    ...subs.map((s) => ({
      label: s.label,
      href: `/products?category=${cat}&subcategory=${s.slug}`,
      description: s.description,
    })),
  ];
};

export const mainNavigation: NavItem[] = [
  { label: "Rings", href: "/categories/rings", children: categoryMenu("rings", "Rings") },
  { label: "Necklaces", href: "/categories/necklaces", children: categoryMenu("necklaces", "Necklaces") },
  { label: "Earrings", href: "/categories/earrings", children: categoryMenu("earrings", "Earrings") },
  { label: "Bracelets", href: "/categories/bracelets", children: categoryMenu("bracelets", "Bracelets") },
  { label: "Diamonds", href: "/categories/diamonds", children: categoryMenu("diamonds", "Diamonds") },
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
