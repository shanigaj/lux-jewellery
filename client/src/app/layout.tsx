import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Providers } from "@/providers/Providers";
import SiteGuard from "@/components/shared/SiteGuard";
import Script from "next/script";
import { siteConfig } from "@/config/site";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Sparenza & Co. — Fine Jewels, Crafted with Trust",
    template: "%s | Sparenza & Co.",
  },
  description:
    "Exceptional diamond jewellery crafted for those who appreciate the extraordinary. Explore GIA-certified diamonds, handcrafted rings, necklaces, earrings, and bracelets.",
  keywords: [
    "luxury diamond jewellery",
    "diamond rings",
    "engagement rings",
    "GIA certified diamonds",
    "fine jewellery",
    "bridal jewellery",
  ],
  authors: [{ name: "Sparenza & Co." }],
  creator: "Sparenza & Co.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://sparenza.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Sparenza & Co.",
    title: "Sparenza & Co. — Fine Jewels, Crafted with Trust",
    description:
      "Exceptional diamond jewellery crafted for those who appreciate the extraordinary.",
    images: [
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "Sparenza & Co. — Fine Jewellery" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sparenza & Co. — Fine Jewels, Crafted with Trust",
    description:
      "Exceptional diamond jewellery crafted for those who appreciate the extraordinary.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Explicit mobile viewport: fit device width, allow the user to zoom (never
// disable pinch-zoom — it's an accessibility must), and paint under the
// status bar with the brand cream.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F7F3EC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const base = siteConfig.url;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": `${base}#store`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: base,
    telephone: siteConfig.contact.phones,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "52, Shubham Park Society, Aakar Club Rd, Swagat Society, BRTS, Simada Gam, Nana Varachha",
      addressLocality: "Surat",
      addressRegion: "Gujarat",
      postalCode: "395011",
      addressCountry: "IN",
    },
    image: `${base}/og-image.jpg`,
    logo: `${base}/icon.png`,
    priceRange: "$$$",
    openingHours: "Mo-Sa 10:00-20:00",
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.facebook,
      siteConfig.social.pinterest,
      siteConfig.social.youtube,
      siteConfig.social.twitter,
    ],
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}#website`,
    name: siteConfig.name,
    url: base,
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased" suppressHydrationWarning>
        <Script
          id="schema-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <SiteGuard />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
