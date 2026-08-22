import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Fine Jewellery — Shop All",
  description:
    "Browse the full Sparenza & Co. collection of diamond rings, necklaces, earrings and bracelets. GIA-certified diamonds, handcrafted and delivered insured across India.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: `Fine Jewellery — Shop All | ${siteConfig.name}`,
    description:
      "Browse the full Sparenza & Co. collection of diamond rings, necklaces, earrings and bracelets.",
    url: "/products",
    type: "website",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
