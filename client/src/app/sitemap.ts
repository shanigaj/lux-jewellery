import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { categoryMeta } from "@/config/categories";
import { journalArticles } from "@/config/journal-articles";

// Refresh the product list hourly so newly-added pieces appear.
export const revalidate = 3600;

// Pull the WHOLE catalogue (paginated) so every product is in the sitemap —
// not just the first 1,000. Only id + updatedAt are requested (fields
// projection) to keep each page light. A single sitemap holds up to 50k URLs,
// which comfortably covers the current catalogue.
async function getProducts(): Promise<Array<{ _id: string; updatedAt?: string }>> {
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const PER = 2000;
  const SAFETY_MAX_PAGES = 30; // 30 × 2,000 = 60k URLs hard ceiling
  const fetchPage = (page: number) =>
    fetch(`${api}/products?fields=updatedAt&limit=${PER}&page=${page}`, {
      next: { revalidate: 3600 },
    })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);

  try {
    const first = await fetchPage(1);
    if (!first) return [];
    let all: Array<{ _id: string; updatedAt?: string }> = first.data ?? [];
    const pages = Math.min(Number(first.pages) || 1, SAFETY_MAX_PAGES);
    if (pages > 1) {
      const rest = await Promise.all(
        Array.from({ length: pages - 1 }, (_, i) => fetchPage(i + 2))
      );
      for (const r of rest) if (r?.data) all = all.concat(r.data);
    }
    return all;
  } catch {
    return [];
  }
}

async function getBlogs(): Promise<Array<{ slug: string; updatedAt?: string }>> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${api}/blogs?status=published`, { next: { revalidate: 3600 } });
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
    ["/journal", 0.7, "weekly"],
    ["/about", 0.6, "monthly"],
    ["/about/craftsmanship", 0.5, "monthly"],
    ["/about/sustainability", 0.5, "monthly"],
    ["/contact", 0.6, "monthly"],
    ["/faq", 0.5, "monthly"],
    ["/shipping-returns", 0.4, "yearly"],
    ["/refund-policy", 0.3, "yearly"],
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

  // Static, always-available Journal articles (server-rendered for SEO).
  const articleRoutes: MetadataRoute.Sitemap = journalArticles.map((a) => ({
    url: `${base}/journal/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const articleSlugs = new Set(journalArticles.map((a) => a.slug));
  const blogs = await getBlogs();
  const blogRoutes: MetadataRoute.Sitemap = blogs
    .filter((b) => !articleSlugs.has(b.slug))
    .map((b) => ({
      url: `${base}/journal/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...articleRoutes, ...blogRoutes];
}
