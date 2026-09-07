import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getJournalArticle, journalArticleSlugs } from "@/config/journal-articles";
import { getJournalCovers, coverForArticle } from "@/lib/journal-covers";
import { ArticleBlocks } from "../ArticleBlocks";
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

// Pre-render the static article routes at build time.
export function generateStaticParams() {
  return journalArticleSlugs.map((slug) => ({ slug }));
}

const getApiBlog = cache(async (slug: string): Promise<RawBlog | null> => {
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

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;

  const article = getJournalArticle(slug);
  if (article) {
    const url = `/journal/${article.slug}`;
    return {
      title: article.title,
      description: article.excerpt,
      alternates: { canonical: url },
      openGraph: {
        title: `${article.title} | ${siteConfig.name}`,
        description: article.excerpt,
        url,
        type: "article",
        publishedTime: article.date,
      },
      twitter: {
        card: "summary_large_image",
        title: `${article.title} | ${siteConfig.name}`,
        description: article.excerpt,
      },
    };
  }

  const blog = await getApiBlog(slug);
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
  const article = getJournalArticle(slug);

  // Real catalogue photo for the static article's cover (hero + JSON-LD).
  const articleCover = article ? coverForArticle(slug, await getJournalCovers()) : undefined;

  // Resolve the values used for the Article JSON-LD from whichever source has
  // the piece (static content layer first, then the CMS/API).
  const blog = article ? null : await getApiBlog(slug);

  const graph: object[] = [];
  const found = article
    ? {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        author: article.author,
        coverImage: articleCover,
        datePublished: article.date,
        dateModified: article.date,
      }
    : blog
      ? {
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt || "",
          author: blog.author || siteConfig.name,
          coverImage: blog.coverImage,
          datePublished: blog.createdAt,
          dateModified: blog.updatedAt || blog.createdAt,
        }
      : null;

  if (found) {
    const url = `${siteConfig.url}/journal/${found.slug}`;
    graph.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: found.title,
      description: (found.excerpt || "").replace(/\s+/g, " ").trim(),
      image: found.coverImage ? [found.coverImage] : undefined,
      author: { "@type": "Organization", name: found.author },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: { "@type": "ImageObject", url: `${siteConfig.url}/icon.png` },
      },
      datePublished: found.datePublished,
      dateModified: found.dateModified,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
    });
    graph.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Journal", item: `${siteConfig.url}/journal` },
        { "@type": "ListItem", position: 3, name: found.title, item: url },
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

      {article ? (
        <div className="container-luxury py-16 md:py-24">
          <Link
            href="/journal"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold"
          >
            <ArrowLeft size={15} /> Back to Journal
          </Link>

          <article className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
              {article.category} · {article.readMinutes} min read · {formatDate(article.date)}
            </p>
            <h1 className="mt-3 font-heading text-4xl leading-[1.1] text-foreground md:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 text-lg font-light leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>

            {articleCover && (
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                <Image
                  src={articleCover}
                  alt={article.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 768px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <ArticleBlocks blocks={article.blocks} />

            {article.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6">
                {article.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-10 rounded-[2px] border border-border bg-card p-8">
              <h2 className="mb-2 font-heading text-xl text-foreground">
                Ready to create your piece?
              </h2>
              <p className="mb-4 font-light leading-relaxed text-muted-foreground">
                Every Sparenza piece is made to order — certified, BIS hallmarked, and backed by
                lifetime exchange &amp; buyback.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link
                  href="/book-appointment"
                  className="rounded-full bg-gold px-6 py-2.5 font-medium text-onyx transition-colors hover:bg-gold-light"
                >
                  Book a Consultation
                </Link>
                <Link
                  href="/products"
                  className="rounded-full border border-border px-6 py-2.5 font-medium text-foreground transition-colors hover:border-gold hover:text-gold"
                >
                  Explore the Collection
                </Link>
              </div>
            </div>
          </article>
        </div>
      ) : (
        <JournalArticleView slug={slug} />
      )}
    </>
  );
}
