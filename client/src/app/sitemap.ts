import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { categoryMeta } from "@/config/categories";

// Refresh the product list hourly so newly-added pieces appear.
export const revalidate = 3600;

async function getProducts(): Promise<Array<{ _id: string; updatedAt?: string }>> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${api}/products?limit=1000`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticPaths: Array<[string, number, MetadataRoute.Sitemap[number]["changeFrequency"]]> = [
    ["", 1, "daily"],
    ["/products", 0.9, "daily"],
    ["/about", 0.6, "monthly"],
    ["/contact", 0.6, "monthly"],
    ["/faq", 0.5, "monthly"],
    ["/shipping-returns", 0.4, "yearly"],
    ["/privacy", 0.3, "yearly"],
    ["/terms", 0.3, "yearly"],
    ["/size-guide", 0.4, "yearly"],
    ["/care", 0.4, "yearly"],
    ["/book-appointment", 0.6, "monthly"],
    ["/design-your-own", 0.6, "monthly"],
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map(([p, priority, changeFrequency]) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = Object.keys(categoryMeta).map((slug) => ({
    url: `${base}/categories/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const products = await getProducts();
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/products/${p._id}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
