import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Providers } from "@/providers/Providers";
import Script from "next/script";
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
    default: "LUX DIAMONDS — Where Brilliance Meets Artistry",
    template: "%s | LUX DIAMONDS",
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
  authors: [{ name: "LUX DIAMONDS" }],
  creator: "LUX DIAMONDS",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://luxdiamonds.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "LUX DIAMONDS",
    title: "LUX DIAMONDS — Where Brilliance Meets Artistry",
    description:
      "Exceptional diamond jewellery crafted for those who appreciate the extraordinary.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LUX DIAMONDS",
    description:
      "Exceptional diamond jewellery crafted for those who appreciate the extraordinary.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: "LUX DIAMONDS",
    description: "Exceptional diamond jewellery crafted for those who appreciate the extraordinary.",
    url: "https://luxdiamonds.com",
    telephone: "+91 80000 00000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Diamond Avenue",
      addressLocality: "Surat",
      addressRegion: "Gujarat",
      postalCode: "395007",
      addressCountry: "IN"
    },
    image: "https://luxdiamonds.com/og-image.jpg",
    priceRange: "$$$",
    sameAs: [
      "https://instagram.com/luxdiamonds",
      "https://facebook.com/luxdiamonds"
    ]
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased" suppressHydrationWarning>
        <Script
          id="schema-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
