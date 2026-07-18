"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { removeFromCompare, clearCompare } from "@/store/slices/productSlice";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { EmptyState } from "@/components/shared/EmptyState";
import { ArrowRightLeft, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/shared/PriceDisplay";

export default function ComparePage() {
  const compareList = useAppSelector((state) => state.product.compareList);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-background min-h-screen">
      <div className="container-luxury py-8">
        <Breadcrumb
          items={[
            { label: "Compare Products" },
          ]}
        />
        
        <div className="flex items-center justify-between mt-8 mb-12">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl mb-2">
              Compare Products
            </h1>
            <p className="text-muted-foreground">
              {compareList.length} / 4 items selected
            </p>
          </div>
          {compareList.length > 0 && (
            <button 
              onClick={() => dispatch(clearCompare())}
              className="text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {compareList.length === 0 ? (
          <EmptyState
            icon={<ArrowRightLeft size={28} className="text-muted-foreground" />}
            title="Nothing to compare"
            description="Add products to your comparison list to see them side by side."
          />
        ) : (
          <div className="overflow-x-auto pb-8">
            <div className="min-w-[800px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="w-48 p-4 border-b border-border font-medium text-muted-foreground">Product</th>
                    {compareList.map(product => (
                      <th key={product._id} className="p-4 border-b border-border w-64 align-top">
                        <div className="relative group">
                          <button 
                            onClick={() => dispatch(removeFromCompare(product._id))}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                          <Link href={`/products/${product.slug}`} className="block">
                            <div className="relative aspect-square w-full rounded-md overflow-hidden bg-muted mb-4">
                              <Image 
                                src={product.thumbnail} 
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <h3 className="font-heading text-base line-clamp-2 hover:text-gold transition-colors">{product.name}</h3>
                            <div className="mt-2">
                              <PriceDisplay basePrice={product.basePrice} salePrice={product.salePrice} size="sm" />
                            </div>
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 border-b border-border font-medium text-xs uppercase tracking-wider text-muted-foreground">Category</td>
                    {compareList.map(p => (
                      <td key={p._id} className="p-4 border-b border-border text-sm">{p.category?.name}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-border font-medium text-xs uppercase tracking-wider text-muted-foreground">Metal</td>
                    {compareList.map(p => (
                      <td key={p._id} className="p-4 border-b border-border text-sm capitalize">{p.metalType.replace("_", " ")} ({p.metalPurity})</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-border font-medium text-xs uppercase tracking-wider text-muted-foreground">Diamond Shape</td>
                    {compareList.map(p => (
                      <td key={p._id} className="p-4 border-b border-border text-sm capitalize">{p.diamondSpecs?.shape || "N/A"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-border font-medium text-xs uppercase tracking-wider text-muted-foreground">Carat Weight</td>
                    {compareList.map(p => (
                      <td key={p._id} className="p-4 border-b border-border text-sm">{p.diamondSpecs?.caratWeight ? `${p.diamondSpecs.caratWeight} ct` : "N/A"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-border font-medium text-xs uppercase tracking-wider text-muted-foreground">Color / Clarity</td>
                    {compareList.map(p => (
                      <td key={p._id} className="p-4 border-b border-border text-sm">
                        {p.diamondSpecs ? `${p.diamondSpecs.color} / ${p.diamondSpecs.clarity}` : "N/A"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-border font-medium text-xs uppercase tracking-wider text-muted-foreground">Certificate</td>
                    {compareList.map(p => (
                      <td key={p._id} className="p-4 border-b border-border text-sm">{p.diamondSpecs?.certification || "N/A"}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
