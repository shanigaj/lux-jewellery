"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import {
  TrendingUp,
  Package,
  CreditCard,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react";

import { useGetProductsQuery } from "@/store/api/productApi";
import { useGetAllOrdersQuery, type IOrder } from "@/store/api/orderApi";

// Dynamically import heavy chart components
const AdminAreaChart = dynamic(
  () => import("@/components/admin/Charts").then((mod) => mod.AdminAreaChart),
  { ssr: false, loading: () => <div className="w-full h-full animate-pulse bg-muted/50 rounded-lg"></div> }
);

const AdminBarChart = dynamic(
  () => import("@/components/admin/Charts").then((mod) => mod.AdminBarChart),
  { ssr: false, loading: () => <div className="w-full h-full animate-pulse bg-muted/50 rounded-lg"></div> }
);

const LOW_STOCK_THRESHOLD = 3;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatINR(amount: number) {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function AdminDashboardPage() {
  // Products are public — always available. Pull a wide page for aggregation.
  const { data: productData } = useGetProductsQuery({ limit: 100 });
  // Orders require admin auth; guard against undefined / 401.
  const { data: orderData } = useGetAllOrdersQuery();

  const products = useMemo(() => productData?.data ?? [], [productData]);
  const totalProducts = productData?.total ?? products.length;
  const orders: IOrder[] = useMemo(() => orderData?.orders ?? [], [orderData]);

  // ── Derived stats ──
  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    [orders]
  );
  const lowStockCount = useMemo(
    () => products.filter((p) => (p.stockQuantity ?? 0) <= LOW_STOCK_THRESHOLD).length,
    [products]
  );

  // ── Revenue by weekday (last 7 days) ──
  const revenueData = useMemo(() => {
    const buckets = new Array(7).fill(0);
    const now = Date.now();
    orders.forEach((o) => {
      const t = new Date(o.createdAt).getTime();
      if (Number.isNaN(t)) return;
      if (now - t <= 7 * 24 * 60 * 60 * 1000) {
        buckets[new Date(o.createdAt).getDay()] += o.totalAmount || 0;
      }
    });
    // Present Mon→Sun for readability
    const order = [1, 2, 3, 4, 5, 6, 0];
    return order.map((d) => ({ name: WEEKDAYS[d], total: buckets[d] }));
  }, [orders]);

  // ── Products by category ──
  const salesData = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const name =
        typeof p.category === "object" ? p.category?.name ?? "Other" : (p.category as string) ?? "Other";
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).map(([name, sales]) => ({ name, sales }));
  }, [products]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [orders]
  );

  const stats = [
    { title: "Total Revenue", value: formatINR(totalRevenue), icon: CreditCard, trend: `${orders.length} orders`, isPositive: true },
    { title: "Total Orders", value: orders.length.toLocaleString("en-IN"), icon: ShoppingBag, trend: "All time", isPositive: true },
    { title: "Total Products", value: totalProducts.toLocaleString("en-IN"), icon: Package, trend: "In catalogue", isPositive: true },
    { title: "Low Stock", value: lowStockCount.toLocaleString("en-IN"), icon: AlertTriangle, trend: `≤ ${LOW_STOCK_THRESHOLD} left`, isPositive: lowStockCount === 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Monitor your store&apos;s performance and recent activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select aria-label="Select date range" className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-gold">
            <option>All time</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
          <button className="bg-onyx dark:bg-gold text-white dark:text-onyx px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
              <stat.icon size={120} className="text-foreground" />
            </div>

            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </h3>
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <stat.icon size={16} className="text-foreground" />
              </div>
            </div>
            <div className="relative z-10">
              <p className="font-heading text-2xl mb-1">{stat.value}</p>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.isPositive ? "text-green-500" : "text-red-500"}`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-4 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg">Revenue (last 7 days)</h3>
            <button aria-label="More options" className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <AdminAreaChart data={revenueData} />
          </div>
        </div>

        {/* Category Chart */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg">Products by Category</h3>
          </div>
          <div className="h-[300px] w-full">
            {salesData.length > 0 ? (
              <AdminBarChart data={salesData} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                No products yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-heading text-lg">Recent Orders</h3>
          <a href="/admin/orders" className="text-sm text-gold hover:underline font-medium">View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const customer =
                    [order.shippingAddress?.firstName, order.shippingAddress?.lastName]
                      .filter(Boolean)
                      .join(" ") || "Guest";
                  return (
                    <tr key={order._id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{order.orderNumber}</td>
                      <td className="px-6 py-4">{customer}</td>
                      <td className="px-6 py-4 text-muted-foreground">{relativeTime(order.createdAt)}</td>
                      <td className="px-6 py-4 text-right font-medium text-foreground">
                        {formatINR(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold
                          ${order.status === 'delivered' ? 'bg-green-500/10 text-green-600' : ''}
                          ${order.status === 'shipped' ? 'bg-gold/10 text-gold' : ''}
                          ${order.status === 'processing' ? 'bg-blue-500/10 text-blue-600' : ''}
                          ${order.status === 'pending' ? 'bg-orange-500/10 text-orange-600' : ''}
                          ${order.status === 'cancelled' ? 'bg-red-500/10 text-red-600' : ''}
                        `}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
