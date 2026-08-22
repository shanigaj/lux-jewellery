import type { Metadata } from "next";
import { cache } from "react";
import { siteConfig } from "@/config/site";
import { JournalArticleView } from "./JournalArticleView";

type Params = { params: Promise<{ slug: string }> };

interface RawBlog {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

const getBlog = cache(async (slug: string): Promise<RawBlog | null> => {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${api}/blogs/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) {
    return { title: "Article Not Found", robots: { index: false, follow: false } };
  }
  const url = `/journal/${blog.slug}`;
  const description = (blog.excerpt || blog.content || siteConfig.description)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  const image = blog.coverImage;
  return {
    title: blog.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${blog.title} | ${siteConfig.name}`,
      description,
      url,
      type: "article",
      images: image ? [{ url: image, width: 1200, height: 630, alt: blog.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} | ${siteConfig.name}`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function JournalArticlePage({ params }: Params) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  const graph: object[] = [];
  if (blog) {
    const url = `${siteConfig.url}/journal/${blog.slug}`;
    graph.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: blog.title,
      description: (blog.excerpt || "").replace(/\s+/g, " ").trim(),
      image: blog.coverImage ? [blog.coverImage] : undefined,
      author: { "@type": "Organization", name: blog.author || siteConfig.name },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: { "@type": "ImageObject", url: `${siteConfig.url}/icon.png` },
      },
      datePublished: blog.createdAt,
      dateModified: blog.updatedAt || blog.createdAt,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
    });

    graph.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Journal", item: `${siteConfig.url}/journal` },
        { "@type": "ListItem", position: 3, name: blog.title, item: url },
      ],
    });
  }

  return (
    <>
      {graph.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(node).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      <JournalArticleView slug={slug} />
    </>
  );
}
