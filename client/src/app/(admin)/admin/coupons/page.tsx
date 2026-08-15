"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Copy, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
} from "@/store/api/couponApi";

const emptyForm = {
  code: "",
  discountType: "percentage" as "percentage" | "flat",
  discountValue: 10,
  minOrderAmount: 0,
  usageLimit: 100,
  expiresAt: "",
  isActive: true,
};

export default function AdminCouponsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading } = useGetCouponsQuery();
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const coupons = useMemo(() => {
    const now = Date.now();
    return (data?.data ?? [])
      .filter((c) => c.code.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((c) => ({
        ...c,
        status:
          !c.isActive
            ? "inactive"
            : new Date(c.expiresAt).getTime() < now
            ? "expired"
            : "active",
      }));
  }, [data, searchTerm]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code ${code} copied!`);
  };

  const handleDelete = async (id: string, code: string) => {
    try {
      await deleteCoupon(id).unwrap();
      toast.success(`Coupon ${code} deleted`);
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  const handleCreate = async () => {
    if (!form.code.trim() || !form.expiresAt) {
      toast.error("Code and expiry date are required");
      return;
    }
    try {
      await createCoupon({
        ...form,
        code: form.code.trim().toUpperCase(),
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount),
        usageLimit: Number(form.usageLimit),
      }).unwrap();
      toast.success("Coupon created");
      setShowForm(false);
      setForm(emptyForm);
    } catch (e) {
      toast.error((e as { data?: { message?: string } })?.data?.message || "Failed to create coupon");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Coupons & Discounts</h1>
          <p className="text-sm text-muted-foreground">Create and manage promotional campaigns.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors"
        >
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/10">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search coupon codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium text-right">Discount</th>
                <th className="px-6 py-4 font-medium text-right">Min Order</th>
                <th className="px-6 py-4 font-medium text-center">Usage</th>
                <th className="px-6 py-4 font-medium">Valid Until</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">Loading coupons…</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">No coupons yet — create your first campaign.</td></tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-muted/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-foreground bg-muted px-2 py-1 rounded">{coupon.code}</span>
                        <button onClick={() => handleCopyCode(coupon.code)} className="text-muted-foreground hover:text-gold transition-colors p-1" title="Copy code">
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue.toLocaleString("en-IN")}`}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">₹{coupon.minOrderAmount.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-foreground">{coupon.usedCount} / {coupon.usageLimit}</span>
                        <div className="w-16 h-1.5 bg-border rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-gold" style={{ width: `${Math.min(100, (coupon.usedCount / (coupon.usageLimit || 1)) * 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(coupon.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold
                        ${coupon.status === "active" ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDelete(coupon._id, coupon.code)} className="p-1.5 text-muted-foreground hover:text-destructive bg-background rounded border border-border" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card border border-border rounded-xl shadow-luxury-lg w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl">Create Coupon</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-muted rounded" aria-label="Close"><X size={18} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Code</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="LUXE20" className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Type</label>
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as "percentage" | "flat" })} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold">
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Value</label>
                  <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Min Order ₹</label>
                  <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Usage Limit</label>
                  <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold" />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Expires At</label>
                <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={isCreating} className="flex-1 py-2 bg-onyx dark:bg-gold text-white dark:text-onyx rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors disabled:opacity-50">
                {isCreating ? "Creating…" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
