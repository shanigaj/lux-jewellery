"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductSort } from "@/components/product/ProductSort";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/shared/Pagination";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useGetProductsQuery } from "@/store/api/productApi";

// Static banner art — the listing page no longer pulls the full 1,000-item
// catalogue just to derive a hero image (that fetch was pure overhead here).
const HERO_IMAGE = "/images/hero.webp";

const titleCase = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function ProductsPageInner() {
  const searchParams = useSearchParams();

  const metalParam = searchParams.get("metal");
  const [filters, setFilters] = useState<{
    category: string;
    subcategory?: string;
    sort: string;
    page: number;
    metalType?: string[];
  }>({
    category: searchParams.get("category") || "all",
    subcategory: searchParams.get("subcategory") || undefined,
    sort: searchParams.get("sort") || "featured",
    metalType: metalParam ? [metalParam] : [],
    page: 1,
  });

  // Keep category / subcategory / sort / metal in sync with the URL (arriving
  // from a category page's "View all" or the header's mega-menu links).
  // Previously the page ignored `?category=…` entirely and always showed everything.
  useEffect(() => {
    const category = searchParams.get("category") || "all";
    const subcategory = searchParams.get("subcategory") || undefined;
    const sort = searchParams.get("sort") || "featured";
    const metal = searchParams.get("metal");
    // Syncing URL params into local filter state (URL is the external source here).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters((f) => ({
      ...f,
      category,
      subcategory,
      sort,
      metalType: metal ? [metal] : [],
      page: 1,
    }));
  }, [searchParams]);

  const { data, isLoading, isFetching } = useGetProductsQuery(filters);
  const products = data?.data || [];
  const totalPages = data?.pages || 1;
  const totalCount = data?.total || 0;

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header Banner */}
      <div className="bg-onyx text-white py-12 md:py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx to-transparent" />
        <div className="container-luxury relative z-10 text-center">
          <AnimatedSection animation="fadeUp">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4">
              {filters.category === "all"
                ? "Fine Jewellery Collection"
                : titleCase(filters.category)}
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
              Discover our masterfully crafted pieces, where exceptional diamonds meet extraordinary design.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="container-luxury py-6">
        <Breadcrumb
          items={[
            { label: "Jewellery", href: "/products" },
            { label: filters.category === "all" ? "All Collections" : titleCase(filters.category) },
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24">
              <ProductFilters filters={filters} setFilters={(f) => setFilters({ ...f, page: 1 })} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{products.length}</span> of <span className="font-medium text-foreground">{totalCount}</span> results
              </p>
              <ProductSort
                value={filters.sort || "featured"}
                onChange={(sort) => setFilters({ ...filters, sort, page: 1 })}
              />
            </div>

            {/* Grid */}
            <ProductGrid products={products} isLoading={isLoading || isFetching} />

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-16 border-t border-border pt-8">
                <Pagination
                  currentPage={filters.page || 1}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageInner />
    </Suspense>
  );
}
