import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { journalArticles } from "@/config/journal-articles";
import { getJournalCovers, coverForArticle } from "@/lib/journal-covers";

export const metadata: Metadata = {
  title: "The Journal — Diamond Guides & Jewellery Stories",
  description:
    "Diamond buying guides, jewellery care, bridal advice and stories from the Sparenza atelier. Learn the 4Cs, BIS hallmarking, ring sizing and more.",
  alternates: { canonical: "/journal" },
};

// Refresh so CMS-published articles (if any) appear alongside the static ones.
export const revalidate = 300;

interface ApiBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  createdAt?: string;
}

async function getApiBlogs(): Promise<ApiBlog[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${api}/blogs?status=published`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data as ApiBlog[]) ?? [];
  } catch {
    return [];
  }
}

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

type Card = {
  key: string;
  href: string;
  title: string;
  excerpt?: string;
  meta: string;
  coverImage?: string;
  category?: string;
};

export default async function JournalPage() {
  const staticSlugs = new Set(journalArticles.map((a) => a.slug));
  const [apiBlogsRaw, covers] = await Promise.all([getApiBlogs(), getJournalCovers()]);
  const apiBlogs = apiBlogsRaw.filter((b) => !staticSlugs.has(b.slug));

  const staticCards: Card[] = journalArticles.map((a) => ({
    key: a.slug,
    href: `/journal/${a.slug}`,
    title: a.title,
    excerpt: a.excerpt,
    meta: `${a.category} · ${a.readMinutes} min read`,
    category: a.category,
    coverImage: coverForArticle(a.slug, covers),
  }));

  const apiCards: Card[] = apiBlogs.map((b) => ({
    key: b._id,
    href: `/journal/${b.slug}`,
    title: b.title,
    excerpt: b.excerpt,
    meta: `${b.author || "Sparenza"} · ${formatDate(b.createdAt)}`,
    coverImage: b.coverImage,
  }));

  const cards = [...apiCards, ...staticCards];

  return (
    <div className="container-luxury py-16 md:py-24">
      <div className="mb-14 max-w-2xl">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
          The Sparenza Journal
        </p>
        <h1 className="font-heading text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
          Stories &amp; <em className="italic text-primary">guides</em>
        </h1>
        <p className="mt-6 font-light leading-relaxed text-muted-foreground">
          Diamond buying guides, jewellery care, bridal advice and notes from behind the workbench —
          everything you need to buy fine jewellery with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.key} href={c.href} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
              {c.coverImage ? (
                <Image
                  src={c.coverImage}
                  alt={c.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-onyx to-onyx/85 px-6 text-center">
                  {c.category && (
                    <span className="text-[10px] uppercase tracking-luxury-wide text-gold">
                      {c.category}
                    </span>
                  )}
                  <span className="font-heading text-lg italic text-white/90 line-clamp-3">
                    {c.title}
                  </span>
                </div>
              )}
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-luxury text-gold font-medium">
              {c.meta}
            </p>
            <h2 className="mt-1 font-heading text-xl text-foreground transition-colors group-hover:text-gold">
              {c.title}
            </h2>
            {c.excerpt && (
              <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground line-clamp-2">
                {c.excerpt}
              </p>
            )}
            <span className="mt-3 inline-block text-sm font-medium text-gold">Read article →</span>
          </Link>
        ))}
      </div>

      <p className="sr-only">
        Published by {siteConfig.name} — fine diamond jewellery, Surat.
      </p>
    </div>
  );
}
