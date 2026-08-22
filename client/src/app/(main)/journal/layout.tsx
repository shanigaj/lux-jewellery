import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "The Sparenza Journal — Diamond Guides & Styling",
  description:
    "Diamond buying guides, jewellery styling notes and stories from behind the workbench — expert advice from the Sparenza & Co. atelier.",
  alternates: { canonical: "/journal" },
  openGraph: {
    title: `The Sparenza Journal | ${siteConfig.name}`,
    description:
      "Diamond buying guides, jewellery styling notes and stories from behind the workbench.",
    url: "/journal",
    type: "website",
  },
};

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
