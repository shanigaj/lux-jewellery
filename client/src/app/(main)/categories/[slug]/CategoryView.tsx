"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductGrid } from "@/components/product/ProductGrid";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useGetProductsQuery } from "@/store/api/productApi";
import { useCategoryImages } from "@/lib/useCategoryImages";
import { getCategoryMeta } from "@/config/categories";

// Number of curated pieces surfaced on each category landing page.
const PRODUCTS_PER_CATEGORY = 5;

export function CategoryView({ slug }: { slug: string }) {
  const meta = getCategoryMeta(slug);

  // Hooks must run unconditionally — skip the query when the slug is unknown.
  const { data, isLoading, isFetching } = useGetProductsQuery(
    { category: meta?.dbCategory ?? "all", limit: PRODUCTS_PER_CATEGORY },
    { skip: !meta }
  );

  // Hero art comes straight from real catalogue photography for this family.
  const { imageFor } = useCategoryImages();

  if (!meta) {
    notFound();
  }

  const products = data?.data ?? [];
  const totalCount = data?.total ?? 0;

  return (
    <div className="bg-background min-h-screen">
      {/* ── Hero Banner (category-based image) ── */}
      <div className="relative bg-onyx text-white overflow-hidden">
        <Image
          src={imageFor(meta.dbCategory)}
          alt={meta.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/70 to-onyx/30" />
        <div className="container-luxury relative z-10 py-20 md:py-28 text-center">
          <AnimatedSection animation="fadeUp">
            <p className="text-[10px] uppercase tracking-luxury text-gold font-medium mb-4">
              Sparenza &amp; Co.
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4">
              {meta.title}
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
              {meta.description}
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="container-luxury py-8">
        <Breadcrumb
          items={[
            { label: "Jewellery", href: "/products" },
            ...(meta.parent
              ? [
                  {
                    label: meta.parent.replace(/-/g, " "),
                    href: `/categories/${meta.parent}`,
                  },
                ]
              : []),
            { label: meta.title },
          ]}
        />

        {/* ── Section heading ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-6 mb-10 pb-4 border-b border-border">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl text-foreground">
              Featured in {meta.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              A curated selection of {PRODUCTS_PER_CATEGORY} signature pieces.
            </p>
          </div>
          <Link
            href={`/products?category=${meta.dbCategory}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:gap-3 transition-all"
          >
            View all {totalCount > 0 ? `${totalCount} ` : ""}
            {meta.title}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* ── Product grid (5 pieces) ── */}
        <ProductGrid products={products} isLoading={isLoading || isFetching} />
      </div>
    </div>
  );
}
