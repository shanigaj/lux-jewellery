"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, TrendingDown, Search, ArrowRight, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetProductsQuery, useUpdateProductMutation } from "@/store/api/productApi";
import { exportCsv } from "@/lib/export-csv";
import { Modal } from "@/components/admin/Modal";
import type { IProduct } from "@/types/product.types";

type StatusFilter = "all" | "low" | "out";

export default function AdminInventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [editing, setEditing] = useState<IProduct | null>(null);
  const [newStock, setNewStock] = useState("");

  const { data, isLoading } = useGetProductsQuery({ search: searchTerm || undefined, limit: 200 });
  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation();
  const fetchedProducts = data?.data || [];

  const inventory = useMemo(
    () =>
      fetchedProducts.map((p) => {
        const stock = p.stockQuantity ?? 0;
        const reorderLevel = p.lowStockThreshold ?? 5;
        const status = stock === 0 ? "out_of_stock" : stock <= reorderLevel ? "low_stock" : "in_stock";
        return { product: p, stock, reorderLevel, status };
      }),
    [fetchedProducts]
  );

  const lowStockCount = inventory.filter((i) => i.status === "low_stock").length;
  const outOfStockCount = inventory.filter((i) => i.status === "out_of_stock").length;
  const totalUnits = inventory.reduce((acc, curr) => acc + curr.stock, 0);

  const visible = inventory.filter((i) => {
    if (statusFilter === "low") return i.status === "low_stock";
    if (statusFilter === "out") return i.status === "out_of_stock";
    return true;
  });

  const openEdit = (p: IProduct) => {
    setEditing(p);
    setNewStock(String(p.stockQuantity ?? 0));
  };

  const saveStock = async () => {
    if (!editing) return;
    const stock = Number(newStock);
    if (!Number.isFinite(stock) || stock < 0) return toast.error("Enter a valid stock number");
    try {
      await updateProduct({ id: editing._id, body: { stock } }).unwrap();
      toast.success("Stock updated");
      setEditing(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update stock");
    }
  };

  const handleExport = () => {
    if (!inventory.length) return toast.error("Nothing to export");
    exportCsv(
      "inventory.csv",
      inventory.map((i) => ({
        sku: i.product.sku,
        name: i.product.name,
        stock: i.stock,
        reorder: i.reorderLevel,
        status: i.status.replace(/_/g, " "),
      })),
      [
        { key: "sku", header: "SKU" },
        { key: "name", header: "Product" },
        { key: "stock", header: "In Stock" },
        { key: "reorder", header: "Reorder Level" },
        { key: "status", header: "Status" },
      ]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Inventory Management</h1>
          <p className="text-sm text-muted-foreground">Monitor stock levels and manage reorder points.</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setStatusFilter("all")}
          className={`text-left bg-card border border-border rounded-xl p-6 shadow-sm border-l-4 border-l-green-500 transition-colors ${statusFilter === "all" ? "ring-2 ring-green-500/30" : "hover:bg-muted/10"}`}
        >
          <p className="text-sm text-muted-foreground mb-2">Total Units in Stock</p>
          <p className="font-heading text-3xl">{totalUnits.toLocaleString()}</p>
        </button>
        <button
          onClick={() => setStatusFilter("low")}
          className={`text-left bg-card border border-border rounded-xl p-6 shadow-sm border-l-4 border-l-orange-500 flex justify-between items-center group transition-colors ${statusFilter === "low" ? "ring-2 ring-orange-500/30" : "hover:bg-muted/10"}`}
        >
          <div>
            <p className="text-sm text-muted-foreground mb-2">Low Stock Alerts</p>
            <div className="flex items-end gap-3">
              <p className="font-heading text-3xl text-orange-500">{lowStockCount}</p>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><TrendingDown size={14} /> action required</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
            <ArrowRight size={20} />
          </div>
        </button>
        <button
          onClick={() => setStatusFilter("out")}
          className={`text-left bg-card border border-border rounded-xl p-6 shadow-sm border-l-4 border-l-red-500 flex justify-between items-center group transition-colors ${statusFilter === "out" ? "ring-2 ring-red-500/30" : "hover:bg-muted/10"}`}
        >
          <div>
            <p className="text-sm text-muted-foreground mb-2">Out of Stock</p>
            <div className="flex items-end gap-3">
              <p className="font-heading text-3xl text-red-500">{outOfStockCount}</p>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><AlertTriangle size={14} /> critical</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
            <ArrowRight size={20} />
          </div>
        </button>
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="w-full sm:w-auto bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-gold"
          >
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
                <tr><td colSpan={6} className="px-6 py-12 text-center"><Loader2 className="animate-spin mx-auto text-gold mb-2" size={24} /><p className="text-sm text-muted-foreground">Loading inventory...</p></td></tr>
              ) : visible.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm">No items match this view.</td></tr>
              ) : visible.map((item) => (
                <tr key={item.product._id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{item.product.sku}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{item.product.name}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-mono font-medium ${item.stock === 0 ? "text-red-500" : item.stock <= item.reorderLevel ? "text-orange-500" : ""}`}>{item.stock}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-muted-foreground">{item.reorderLevel}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${item.stock === 0 ? "bg-red-500/10 text-red-500" : item.stock <= item.reorderLevel ? "bg-orange-500/10 text-orange-500" : "bg-green-500/10 text-green-500"}`}>
                      {item.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEdit(item.product)} className="text-xs uppercase tracking-wider font-medium text-gold hover:underline">
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Update stock">
        {editing && (
          <div className="space-y-4">
            <div>
              <p className="font-medium">{editing.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{editing.sku}</p>
            </div>
            <label className="block text-sm space-y-1">
              <span className="text-muted-foreground">Units in stock</span>
              <input
                type="number"
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold"
                autoFocus
              />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={saveStock} disabled={isSaving} className="flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors disabled:opacity-50">
                {isSaving && <Loader2 size={14} className="animate-spin" />} Save
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
