"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useGetProductsQuery } from "@/store/api/productApi";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { IProduct } from "@/types/product.types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const { data, isLoading, isFetching } = useGetProductsQuery(query ? { search: query } : undefined, { skip: !query });
  const products = data?.data || [];

  return (
    <div className="bg-background min-h-screen">
      <div className="container-luxury py-8">
        <Breadcrumb
          items={[
            { label: "Search Results" },
          ]}
        />
        
        <div className="mt-8 mb-12 text-center">
          <h1 className="font-heading text-3xl md:text-4xl mb-4">
            Search Results
          </h1>
          <p className="text-muted-foreground">
            {isLoading || isFetching ? (
              "Searching..."
            ) : products.length > 0 ? (
              <>Showing {products.length} results for &quot;<span className="text-foreground font-medium">{query}</span>&quot;</>
            ) : (
              <>No results found for &quot;<span className="text-foreground font-medium">{query}</span>&quot;</>
            )}
          </p>
        </div>

        <ProductGrid products={products} isLoading={isLoading || isFetching} />
      </div>
    </div>
  );
}
