"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useGetBlogBySlugQuery } from "@/store/api/blogApi";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function JournalArticlePage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";
  const { data, isLoading, isError } = useGetBlogBySlugQuery(slug, { skip: !slug });
  const blog = data?.data;

  return (
    <div className="container-luxury py-16 md:py-24">
      <Link href="/journal" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-8">
        <ArrowLeft size={15} /> Back to Journal
      </Link>

      {isLoading ? (
        <div className="max-w-3xl animate-pulse">
          <div className="h-8 w-2/3 rounded bg-muted" />
          <div className="mt-6 aspect-[16/9] rounded-lg bg-muted" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-3 w-full rounded bg-muted" />)}
          </div>
        </div>
      ) : isError || !blog ? (
        <div className="max-w-3xl rounded-[2px] border border-border py-20 text-center text-muted-foreground">
          This article isn&apos;t available.{" "}
          <Link href="/journal" className="text-gold hover:underline">Browse the journal</Link>.
        </div>
      ) : (
        <article className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-luxury-wide text-gold font-semibold">
            {blog.author} · {formatDate(blog.createdAt)}
          </p>
          <h1 className="mt-3 font-heading text-4xl leading-[1.1] text-foreground md:text-5xl">
            {blog.title}
          </h1>
          {blog.excerpt && (
            <p className="mt-5 text-lg font-light leading-relaxed text-muted-foreground">{blog.excerpt}</p>
          )}

          {blog.coverImage && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-muted">
              <Image src={blog.coverImage} alt={blog.title} fill sizes="(max-width: 1024px) 100vw, 768px" className="object-cover" priority />
            </div>
          )}

          <div className="mt-8 whitespace-pre-line font-light leading-relaxed text-foreground/90">
            {blog.content}
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
              {blog.tags.map((t) => (
                <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{t}</span>
              ))}
            </div>
          )}
        </article>
      )}
    </div>
  );
}
