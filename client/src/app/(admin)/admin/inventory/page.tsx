"use client";

import { useState } from "react";
import { AlertTriangle, TrendingDown, Search, ArrowRight, Download, Loader2 } from "lucide-react";
import { useGetProductsQuery } from "@/store/api/productApi";

export default function AdminInventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useGetProductsQuery({ search: searchTerm, limit: 100 });
  const fetchedProducts = data?.data || [];

  // Create mock inventory data derived from products (for testing UI, normally this comes from backend stock fields)
  const inventory = fetchedProducts.map(p => {
    const stock = p.stockQuantity ?? Math.floor(Math.random() * 50);
    const reorderLevel = p.lowStockThreshold ?? 10;
    const status = stock === 0 ? "out_of_stock" : stock <= reorderLevel ? "low_stock" : "in_stock";
    return { ...p, stock, reorderLevel, status };
  });

  const lowStockCount = inventory.filter(i => i.status === "low_stock").length;
  const outOfStockCount = inventory.filter(i => i.status === "out_of_stock").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Inventory Management</h1>
          <p className="text-sm text-muted-foreground">
            Monitor stock levels and manage reorder points.
          </p>
        </div>
        <button className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm border-l-4 border-l-green-500">
          <p className="text-sm text-muted-foreground mb-2">Total Units in Stock</p>
          <p className="font-heading text-3xl">
            {inventory.reduce((acc, curr) => acc + curr.stock, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm border-l-4 border-l-orange-500 flex justify-between items-center group cursor-pointer hover:bg-muted/10 transition-colors">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Low Stock Alerts</p>
            <div className="flex items-end gap-3">
              <p className="font-heading text-3xl text-orange-500">{lowStockCount}</p>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <TrendingDown size={14} /> action required
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
            <ArrowRight size={20} />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm border-l-4 border-l-red-500 flex justify-between items-center group cursor-pointer hover:bg-muted/10 transition-colors">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Out of Stock</p>
            <div className="flex items-end gap-3">
              <p className="font-heading text-3xl text-red-500">{outOfStockCount}</p>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <AlertTriangle size={14} /> critical
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/10">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search SKU or Product Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <select className="w-full sm:w-auto bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-gold">
            <option value="all">All Inventory</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">SKU</th>
                <th className="px-6 py-4 font-medium min-w-[250px]">Product Name</th>
                <th className="px-6 py-4 font-medium text-right">In Stock</th>
                <th className="px-6 py-4 font-medium text-right">Reorder Level</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-gold mb-2" size={24} />
                    <p className="text-sm text-muted-foreground">Loading inventory...</p>
                  </td>
                </tr>
              ) : inventory.map((item: any) => (
                <tr key={item._id || item.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{item.sku}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-mono font-medium ${item.stock === 0 ? 'text-red-500' : item.stock <= item.reorderLevel ? 'text-orange-500' : ''}`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-muted-foreground">{item.reorderLevel}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold
                      ${(() => {
                        const getStatusColor = (stock: number, lowStock: number) => {
                          if (stock === 0) return "bg-red-500/10 text-red-500 border-red-500/20";
                          if (stock <= lowStock) return "bg-orange-500/10 text-orange-500 border-orange-500/20";
                          return "bg-green-500/10 text-green-500 border-green-500/20";
                        };
                        return getStatusColor(item.stock, item.reorderLevel);
                      })()}
                    `}>
                      {item.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs uppercase tracking-wider font-medium text-gold hover:underline">
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
