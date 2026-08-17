"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Filter, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetProductsQuery, useDeleteProductMutation } from "@/store/api/productApi";

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useGetProductsQuery({ search: searchTerm, limit: 50 });
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const filteredProducts = data?.data || [];
  const totalCount = data?.total || 0;

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your jewellery collection, pricing, and inventory.
          </p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors">
          <Plus size={16} /> Add Product
        </Link>
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

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
              ) : filteredProducts.map((product: any) => (
                <tr key={product._id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
                        <Image 
                          src={product.images[0].url} 
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Stock: {product.stockQuantity || 12} units</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{product.sku}</td>
                  <td className="px-6 py-4 capitalize">{product.category?.name || product.category}</td>
                  <td className="px-6 py-4 font-medium">
                    ₹{(product.salePrice || product.basePrice).toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">
                      Active
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
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
          <p>Showing {filteredProducts.length} of {totalCount} products</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-border rounded disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 bg-gold text-onyx font-medium rounded">1</button>
            <button className="px-3 py-1 border border-border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
