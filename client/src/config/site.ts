// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Site Configuration
// ═══════════════════════════════════════════════════════════

export const siteConfig = {
  name: "Sparenza & Co.",
  shortName: "Sparenza",
  description:
    "Exceptional diamond jewellery crafted for those who appreciate the extraordinary. Each piece is a masterwork of precision and artistry.",
  tagline: "Crafted with Trust. Worn for Life.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sparenza.com",
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
    email: "contact@sparenza.com",
    // Primary number kept for any single-phone references; full list in `phones`.
    phone: "+91 63527 51091",
    phones: ["+91 99240 36623", "+91 63527 51091", "+91 63537 84310"],
    whatsapp: "+916353784310",
    address:
      "52, Shubham Park Society, Aakar Club Rd, Swagat Society, BRTS, Simada Gam, Nana Varachha, Surat, Gujarat 395011",
  },
  social: {
    instagram: "https://www.instagram.com/sparenzajewels/",
    pinterest: "https://pinterest.com/sparenza",
    facebook: "https://facebook.com/sparenza",
    twitter: "https://twitter.com/sparenza",
    youtube: "https://youtube.com/@sparenza",
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
