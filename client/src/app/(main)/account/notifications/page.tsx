"use client";

import { useEffect, useState } from "react";
import { Bell, Package, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useGetUserOrdersQuery } from "@/store/api/orderApi";

function relative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h} hr${h > 1 ? "s" : ""} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
}

interface Notif {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: typeof Package;
}

export default function NotificationsPage() {
  const { data } = useGetUserOrdersQuery();
  const [notifications, setNotifications] = useState<Notif[]>([]);

  // Notifications are derived from the user's real order activity.
  useEffect(() => {
    const orders = data?.orders ?? [];
    setNotifications(
      [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((o) => ({
          id: o._id,
          type: "order",
          title: `Order ${o.status.charAt(0).toUpperCase() + o.status.slice(1)}`,
          message: `Your order ${o.orderNumber} is ${o.status}.`,
          time: relative(o.createdAt),
          isRead: false,
          icon: Package,
        }))
    );
  }, [data]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl mb-2 flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-gold text-onyx text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-muted-foreground text-sm">
            Stay updated with your orders, appointments, and exclusive offers.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg"
          >
            <CheckCircle2 size={16} /> Mark all as read
          </button>
        )}
      </div>

      <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, backgroundColor: "rgba(196, 162, 101, 0)" }}
              animate={{
                opacity: 1,
                backgroundColor: notification.isRead ? "rgba(196, 162, 101, 0)" : "rgba(196, 162, 101, 0.05)",
              }}
              className={cn(
                "p-4 md:p-6 transition-colors duration-300 relative group",
                !notification.isRead && "bg-gold/5"
              )}
            >
              <div className="flex gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    notification.isRead
                      ? "bg-muted text-muted-foreground"
                      : "bg-gold text-onyx"
                  )}
                >
                  <notification.icon size={18} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h3
                      className={cn(
                        "text-sm font-medium",
                        !notification.isRead && "text-foreground"
                      )}
                    >
                      {notification.title}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {notification.message}
                  </p>
                  
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="mt-3 text-[11px] uppercase tracking-wider font-medium text-gold hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>

              {!notification.isRead && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gold rounded-r" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Bell size={48} className="text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground">You have no notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
}
