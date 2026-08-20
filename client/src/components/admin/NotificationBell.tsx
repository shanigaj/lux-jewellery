"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bell, ShoppingBag, CalendarDays, Star } from "lucide-react";
import { useGetAllOrdersQuery } from "@/store/api/orderApi";
import { useGetAllAppointmentsQuery } from "@/store/api/appointmentApi";
import { useGetAllReviewsQuery } from "@/store/api/reviewApi";

interface Notif {
  id: string;
  icon: typeof Bell;
  text: string;
  href: string;
  time?: string;
}

function ago(iso?: string) {
  if (!iso) return "";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Admin notifications — derived from pending orders, appointment requests and
 * reviews awaiting moderation (no dedicated notifications backend needed). */
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const { data: orders } = useGetAllOrdersQuery();
  const { data: appts } = useGetAllAppointmentsQuery();
  const { data: reviews } = useGetAllReviewsQuery();

  const notifs = useMemo<Notif[]>(() => {
    const list: Notif[] = [];

    for (const o of orders?.orders ?? []) {
      if (o.status === "pending") {
        const name = [o.shippingAddress?.firstName, o.shippingAddress?.lastName].filter(Boolean).join(" ") || "Guest";
        list.push({ id: `o-${o._id}`, icon: ShoppingBag, text: `New order ${o.orderNumber} from ${name}`, href: "/admin/orders", time: o.createdAt });
      }
    }
    for (const a of (appts?.data ?? []) as unknown as Array<Record<string, unknown>>) {
      if (a.status === "pending") {
        const name = (a.name as string) || (a.fullName as string) || (a.email as string) || "A client";
        list.push({ id: `a-${a._id}`, icon: CalendarDays, text: `Appointment request from ${name}`, href: "/admin/appointments", time: a.createdAt as string });
      }
    }
    for (const r of (reviews?.data ?? []) as unknown as Array<Record<string, unknown>>) {
      if (r.isApproved === undefined || r.isApproved === null) {
        list.push({ id: `r-${r._id}`, icon: Star, text: `Review awaiting moderation`, href: "/admin/reviews", time: r.createdAt as string });
      }
    }
    return list
      .sort((x, y) => new Date(y.time || 0).getTime() - new Date(x.time || 0).getTime())
      .slice(0, 12);
  }, [orders, appts, reviews]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const count = notifs.length;

  return (
    <div ref={boxRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${count ? ` (${count})` : ""}`}
        className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
      >
        <Bell size={18} />
        {count > 0 && <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center text-[9px] font-bold bg-destructive text-white rounded-full border-2 border-card">{count > 9 ? "9+" : count}</span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <p className="font-medium text-sm">Notifications</p>
            <span className="text-xs text-muted-foreground">{count} pending</span>
          </div>
          {count === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">You&apos;re all caught up 🎉</div>
          ) : (
            <ul className="max-h-96 overflow-y-auto divide-y divide-border">
              {notifs.map((n) => (
                <li key={n.id}>
                  <Link href={n.href} onClick={() => setOpen(false)} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                    <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-foreground"><n.icon size={15} /></span>
                    <span className="min-w-0">
                      <span className="block text-sm text-foreground">{n.text}</span>
                      {n.time && <span className="block text-xs text-muted-foreground">{ago(n.time)}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
