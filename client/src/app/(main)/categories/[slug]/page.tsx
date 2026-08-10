import type { Metadata } from "next";
import { getCategoryMeta } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { CategoryView } from "./CategoryView";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCategoryMeta(slug);
  if (!meta) {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }
  const url = `/categories/${slug}`;
  const title = meta.title;
  return {
    title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: meta.description,
      url,
      type: "website",
    },
    twitter: {
      title: `${title} | ${siteConfig.name}`,
      description: meta.description,
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  return <CategoryView slug={slug} />;
}
