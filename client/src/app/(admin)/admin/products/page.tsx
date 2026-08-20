"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Filter, Edit, Trash2, Loader2, Download, X } from "lucide-react";
import { toast } from "sonner";
import { useGetProductsQuery, useDeleteProductMutation } from "@/store/api/productApi";
import { exportCsv } from "@/lib/export-csv";

const CATEGORIES = ["rings", "necklaces", "earrings", "bracelets", "watches"];
const METALS = [
  { value: "gold", label: "Yellow Gold" },
  { value: "white_gold", label: "White Gold" },
  { value: "rose_gold", label: "Rose Gold" },
  { value: "platinum", label: "Platinum" },
  { value: "silver", label: "Silver" },
];
const SORTS = [
  { value: "", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];
const LIMIT = 20;

function stockStatus(qty: number) {
  if (qty <= 0) return { label: "Out of Stock", cls: "bg-destructive/10 text-destructive" };
  if (qty <= 5) return { label: "Low Stock", cls: "bg-amber-500/10 text-amber-600" };
  return { label: "In Stock", cls: "bg-green-500/10 text-green-600" };
}

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [metalType, setMetalType] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isFetching } = useGetProductsQuery({
    search: searchTerm || undefined,
    category: category || undefined,
    metalType: metalType || undefined,
    sort: sort || undefined,
    page,
    limit: LIMIT,
  });
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const products = data?.data || [];
  const totalCount = data?.total || 0;
  const totalPages = data?.pages || 1;

  // Any filter/search change resets to the first page.
  const reset = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  const handleExport = () => {
    if (!products.length) return toast.error("Nothing to export");
    exportCsv(
      "products.csv",
      products.map((p) => ({
        name: p.name,
        sku: p.sku,
        category: typeof p.category === "object" ? p.category.name : p.category,
        metal: p.metalType,
        price: p.salePrice || p.basePrice,
        stock: p.stockQuantity ?? 0,
      })),
      [
        { key: "name", header: "Name" },
        { key: "sku", header: "SKU" },
        { key: "category", header: "Category" },
        { key: "metal", header: "Metal" },
        { key: "price", header: "Price (INR)" },
        { key: "stock", header: "Stock" },
      ]
    );
  };

  const activeFilters = [category, metalType, sort].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your jewellery collection, pricing, and inventory.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            <Download size={16} /> Export
          </button>
          <Link href="/admin/products/new" className="flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/10">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products or SKUs..."
              value={searchTerm}
              onChange={(e) => reset(() => setSearchTerm(e.target.value))}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto items-center">
            {isFetching && <Loader2 size={16} className="animate-spin text-gold" />}
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${showFilters || activeFilters ? "border-gold text-gold" : "border-border hover:bg-muted"}`}
            >
              <Filter size={16} /> Filter{activeFilters ? ` (${activeFilters})` : ""}
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="p-4 border-b border-border bg-muted/5 flex flex-wrap gap-4 items-end">
            <label className="text-xs space-y-1">
              <span className="block text-muted-foreground uppercase tracking-wider">Category</span>
              <select value={category} onChange={(e) => reset(() => setCategory(e.target.value))} className="bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold capitalize">
                <option value="">All</option>
                {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </label>
            <label className="text-xs space-y-1">
              <span className="block text-muted-foreground uppercase tracking-wider">Metal</span>
              <select value={metalType} onChange={(e) => reset(() => setMetalType(e.target.value))} className="bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold">
                <option value="">All</option>
                {METALS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </label>
            <label className="text-xs space-y-1">
              <span className="block text-muted-foreground uppercase tracking-wider">Sort</span>
              <select value={sort} onChange={(e) => reset(() => setSort(e.target.value))} className="bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold">
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
            {activeFilters > 0 && (
              <button
                onClick={() => reset(() => { setCategory(""); setMetalType(""); setSort(""); })}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive py-2"
              >
                <X size={13} /> Clear
              </button>
            )}
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium min-w-[300px]">Product</th>
                <th className="px-6 py-4 font-medium">SKU</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-gold mb-2" size={24} />
                    <p className="text-sm text-muted-foreground">Loading products...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    No products match your filters.
                  </td>
                </tr>
              ) : products.map((product) => {
                const qty = product.stockQuantity ?? 0;
                const st = stockStatus(qty);
                return (
                <tr key={product._id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
                        <Image
                          src={product.images[0]?.url || "/images/placeholder.png"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Stock: {qty} units</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{product.sku}</td>
                  <td className="px-6 py-4 capitalize">{typeof product.category === "object" ? product.category.name : product.category}</td>
                  <td className="px-6 py-4 font-medium">
                    ₹{(product.salePrice || product.basePrice).toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`${st.cls} px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold`}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="p-1.5 text-muted-foreground hover:text-foreground bg-background rounded border border-border"
                        aria-label="Edit product"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        disabled={isDeleting}
                        className="p-1.5 text-muted-foreground hover:text-destructive bg-background rounded border border-border disabled:opacity-50"
                        aria-label="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
          <p>
            Page {page} of {totalPages} · {totalCount} products
          </p>
          <div className="flex gap-1 items-center">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
              className="px-3 py-1 border border-border rounded disabled:opacity-40 hover:bg-muted transition-colors"
            >
              Prev
            </button>
            <span className="px-3 py-1 bg-gold text-onyx font-medium rounded">{page}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isFetching}
              className="px-3 py-1 border border-border rounded disabled:opacity-40 hover:bg-muted transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
