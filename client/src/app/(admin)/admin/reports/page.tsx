"use client";

import { useMemo } from "react";
import { Download, FileText, TrendingUp, ShoppingBag, Package, Wallet } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useGetAllOrdersQuery } from "@/store/api/orderApi";
import { useGetProductsQuery } from "@/store/api/productApi";

function inr(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export default function AdminReportsPage() {
  const { data: orderData } = useGetAllOrdersQuery();
  const { data: productData } = useGetProductsQuery({ limit: 200 });

  const orders = useMemo(() => orderData?.orders ?? [], [orderData]);
  const products = useMemo(() => productData?.data ?? [], [productData]);

  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + (o.totalAmount || 0), 0), [orders]);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const inventoryValue = useMemo(
    () => products.reduce((s, p) => s + (p.basePrice || 0) * (p.stockQuantity || 0), 0),
    [products]
  );

  // Real revenue + order count for the last 7 calendar months.
  const monthly = useMemo(() => {
    const now = new Date();
    const buckets: { month: string; revenue: number; orders: number; key: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        month: d.toLocaleString("en-IN", { month: "short" }),
        key: `${d.getFullYear()}-${d.getMonth()}`,
        revenue: 0,
        orders: 0,
      });
    }
    const idx = new Map(buckets.map((b, i) => [b.key, i]));
    for (const o of orders) {
      const d = new Date(o.createdAt);
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      const i = idx.get(k);
      if (i !== undefined) {
        buckets[i].revenue += o.totalAmount || 0;
        buckets[i].orders += 1;
      }
    }
    return buckets;
  }, [orders]);

  const exportOrdersCsv = () => {
    const rows = [
      ["Order Number", "Customer", "Email", "Amount", "Status", "Date"],
      ...orders.map((o) => [
        o.orderNumber,
        [o.shippingAddress?.firstName, o.shippingAddress?.lastName].filter(Boolean).join(" "),
        o.shippingAddress?.email ?? "",
        String(o.totalAmount ?? 0),
        o.status,
        new Date(o.createdAt).toLocaleDateString("en-IN"),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const kpis = [
    { name: "Total Revenue", value: inr(totalRevenue), icon: Wallet },
    { name: "Total Orders", value: orders.length.toLocaleString("en-IN"), icon: ShoppingBag },
    { name: "Avg Order Value", value: inr(avgOrderValue), icon: TrendingUp },
    { name: "Inventory Value", value: inr(inventoryValue), icon: Package },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Financial Reports</h1>
          <p className="text-sm text-muted-foreground">Live business metrics from your store data.</p>
        </div>
        <button onClick={exportOrdersCsv} className="flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors">
          <Download size={16} /> Export Sales CSV
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-foreground mb-3">
              <k.icon size={18} />
            </div>
            <p className="text-xs text-muted-foreground">{k.name}</p>
            <p className="font-heading text-2xl mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Report exports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: "Sales Summary", desc: "All orders with customer & totals", action: exportOrdersCsv, type: "CSV" },
          { name: "Inventory Valuation", desc: `${products.length} products • ${inr(inventoryValue)} on hand`, action: undefined, type: "Live" },
          { name: "Customer LTV", desc: "Lifetime value from order history", action: undefined, type: "Live" },
        ].map((report, idx) => (
          <div key={idx} className="bg-card border border-border rounded-xl p-5 hover:border-gold/50 transition-colors group">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground mb-4 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
              <FileText size={18} />
            </div>
            <h3 className="font-medium mb-1">{report.name}</h3>
            <p className="text-xs text-muted-foreground mb-4">{report.desc}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{report.type}</span>
              {report.action && (
                <button onClick={report.action} className="text-gold hover:underline text-xs font-medium flex items-center gap-1">
                  <Download size={14} /> Export
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Monthly revenue chart */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm mt-2">
        <h2 className="font-heading text-lg mb-8">Revenue & Orders (last 7 months)</h2>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "currentColor", opacity: 0.5 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "currentColor", opacity: 0.5 }} />
              <Tooltip cursor={{ fill: "currentColor", opacity: 0.05 }} contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }} />
              <Bar dataKey="revenue" name="Revenue (₹)" fill="#C4A265" radius={[4, 4, 0, 0]} />
              <Bar dataKey="orders" name="Orders" fill="#888888" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
