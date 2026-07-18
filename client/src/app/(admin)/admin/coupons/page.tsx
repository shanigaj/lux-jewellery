"use client";

import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Copy, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

// Mock Coupons
const mockCoupons = [
  {
    id: "1",
    code: "LUXE20",
    discountType: "percentage",
    discountValue: 20,
    minOrderValue: 100000,
    usageLimit: 100,
    usedCount: 45,
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    status: "active"
  },
  {
    id: "2",
    code: "WELCOME10K",
    discountType: "fixed",
    discountValue: 10000,
    minOrderValue: 50000,
    usageLimit: 500,
    usedCount: 312,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "active"
  },
  {
    id: "3",
    code: "DIWALI50",
    discountType: "percentage",
    discountValue: 15,
    minOrderValue: 200000,
    usageLimit: 50,
    usedCount: 50,
    startDate: "2025-10-01",
    endDate: "2025-11-15",
    status: "expired"
  }
];

export default function AdminCouponsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCoupons = mockCoupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code ${code} copied!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Coupons & Discounts</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage promotional campaigns.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors">
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
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            <Filter size={16} /> Filter
          </button>
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
                <th className="px-6 py-4 font-medium">Validity</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-foreground bg-muted px-2 py-1 rounded">
                        {coupon.code}
                      </span>
                      <button 
                        onClick={() => handleCopyCode(coupon.code)}
                        className="text-muted-foreground hover:text-gold transition-colors p-1"
                        title="Copy code"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {coupon.discountType === 'percentage' 
                      ? `${coupon.discountValue}%` 
                      : `₹${coupon.discountValue.toLocaleString("en-IN")}`}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">
                    ₹{coupon.minOrderValue.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-medium text-foreground">{coupon.usedCount} / {coupon.usageLimit}</span>
                      <div className="w-16 h-1.5 bg-border rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-gold" 
                          style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    <div>{new Date(coupon.startDate).toLocaleDateString("en-IN")} -</div>
                    <div>{new Date(coupon.endDate).toLocaleDateString("en-IN")}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold
                      ${coupon.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}
                    `}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-muted-foreground hover:text-foreground bg-background rounded border border-border">
                        <Edit size={14} />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-destructive bg-background rounded border border-border">
                        <Trash2 size={14} />
                      </button>
                    </div>
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
