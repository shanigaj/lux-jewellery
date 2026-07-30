// ═══════════════════════════════════════════════════════════
// 💎 LUX DIAMONDS — Site Configuration
// ═══════════════════════════════════════════════════════════

export const siteConfig = {
  name: "Sparenza & Co.",
  shortName: "Sparenza",
  description:
    "Exceptional diamond jewellery crafted for those who appreciate the extraordinary. Each piece is a masterwork of precision and artistry.",
  tagline: "Crafted with Trust. Worn for Life.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://luxdiamonds.com",
  ogImage: "/images/og-image.jpg",
  creator: "Sparenza & Co.",
  keywords: [
    "luxury diamond jewellery",
    "diamond rings",
    "diamond necklaces",
    "diamond earrings",
    "bridal jewellery",
    "engagement rings",
    "solitaire diamonds",
    "GIA certified diamonds",
    "fine jewellery",
    "luxury accessories",
  ],
  contact: {
    email: "concierge@luxdiamonds.com",
    phone: "+91 98765 43210",
    whatsapp: "+919876543210",
    address: "The Diamond Quarter, Mumbai, India",
  },
  social: {
    instagram: "https://instagram.com/luxdiamonds",
    pinterest: "https://pinterest.com/luxdiamonds",
    facebook: "https://facebook.com/luxdiamonds",
    twitter: "https://twitter.com/luxdiamonds",
    youtube: "https://youtube.com/@luxdiamonds",
  },
  features: {
    freeShipping: true,
    freeShippingThreshold: 50000, // INR
    lifetimeExchange: true,
    certifiedDiamonds: true,
    insuredDelivery: true,
    easyReturns: 30, // days
  },
} as const;

export type SiteConfig = typeof siteConfig;
