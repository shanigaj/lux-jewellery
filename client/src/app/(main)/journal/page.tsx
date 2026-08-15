"use client";

import Link from "next/link";
import Image from "next/image";
import { useGetBlogsQuery } from "@/store/api/blogApi";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function JournalPage() {
  const { data, isLoading } = useGetBlogsQuery({ status: "published" });
  const blogs = data?.data ?? [];

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
          Diamond guides, styling notes and stories from behind the workbench.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] rounded-lg bg-muted" />
              <div className="mt-4 h-4 w-2/3 rounded bg-muted" />
              <div className="mt-2 h-3 w-1/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="rounded-[2px] border border-border py-20 text-center text-muted-foreground">
          No articles published yet — check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b) => (
            <Link key={b._id} href={`/journal/${b.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                {b.coverImage ? (
                  <Image
                    src={b.coverImage}
                    alt={b.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gold/40 font-heading text-2xl">
                    Sparenza &amp; Co.
                  </div>
                )}
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-luxury text-gold font-medium">
                {b.author} · {formatDate(b.createdAt)}
              </p>
              <h2 className="mt-1 font-heading text-xl text-foreground group-hover:text-gold transition-colors">
                {b.title}
              </h2>
              {b.excerpt && (
                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground line-clamp-2">
                  {b.excerpt}
                </p>
              )}
              <span className="mt-3 inline-block text-sm font-medium text-gold">Read article →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
