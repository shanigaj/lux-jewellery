"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { IOrderTimeline, TOrderStatus } from "@/types/order.types";
import {
  ClipboardCheck,
  Settings,
  Truck,
  MapPin,
  PackageCheck,
  XCircle,
  RotateCcw,
  BellRing,
} from "lucide-react";

interface OrderTrackingProps {
  timeline: IOrderTimeline[];
  currentStatus: TOrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
  /** Used only to namespace the "notify me" preference in localStorage. */
  orderNumber?: string;
}

const FINAL_STATUSES: TOrderStatus[] = ["cancelled", "returned", "refunded"];

const statusIcons: Record<string, React.ElementType> = {
  pending: ClipboardCheck,
  confirmed: ClipboardCheck,
  processing: Settings,
  shipped: Truck,
  out_for_delivery: MapPin,
  delivered: PackageCheck,
  cancelled: XCircle,
  returned: RotateCcw,
  refunded: RotateCcw,
};

export function OrderTracking({
  timeline,
  currentStatus,
  trackingNumber,
  estimatedDelivery,
  orderNumber,
}: OrderTrackingProps) {
  const storageKey = orderNumber ? `lux_order_notify_${orderNumber}` : undefined;
  const [notifyEnabled, setNotifyEnabled] = useState(false);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    // One-time read of a browser-only value after mount (avoids SSR/hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotifyEnabled(window.localStorage.getItem(storageKey) === "1");
  }, [storageKey]);

  const handleNotifyToggle = (checked: boolean) => {
    setNotifyEnabled(checked);
    if (storageKey) window.localStorage.setItem(storageKey, checked ? "1" : "0");
    toast.success(
      checked ? "You'll be notified of every status update." : "Status update notifications turned off."
    );
  };

  const completedCount = timeline.filter((s) => s.isCompleted).length;
  const progressPercent =
    timeline.length > 0 ? Math.round((completedCount / timeline.length) * 100) : 0;
  const isFinalStatus = FINAL_STATUSES.includes(currentStatus);

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      {!isFinalStatus && timeline.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
            <span>Order Progress</span>
            <span className="tabular-nums">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      )}

      {/* Notify me toggle */}
      <div className="flex items-center justify-between gap-4 bg-muted/30 border border-border rounded-xl p-4">
        <div className="flex items-center gap-3">
          <BellRing size={16} className="text-gold shrink-0" />
          <div>
            <p className="text-sm font-medium">Notify me about status changes</p>
            <p className="text-xs text-muted-foreground">Get an update the moment this order moves.</p>
          </div>
        </div>
        <Switch checked={notifyEnabled} onCheckedChange={handleNotifyToggle} />
      </div>

      {/* Tracking Info Bar */}
      {(trackingNumber || estimatedDelivery) && (
        <div className="flex flex-wrap gap-4 bg-muted/30 border border-border rounded-xl p-4 text-sm">
          {trackingNumber && (
            <div>
              <span className="text-muted-foreground">Tracking: </span>
              <span className="font-medium">{trackingNumber}</span>
            </div>
          )}
          {estimatedDelivery && (
            <div>
              <span className="text-muted-foreground">Est. Delivery: </span>
              <span className="font-medium">{estimatedDelivery}</span>
            </div>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Vertical Line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />

        {timeline.map((step, index) => {
          const Icon = statusIcons[step.status] || ClipboardCheck;
          const isActive = step.isCompleted;
          const isCurrent = index === timeline.findIndex((s) => !s.isCompleted) - 1 ||
            (index === timeline.length - 1 && step.isCompleted);

          return (
            <motion.div
              key={step.status}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative pb-8 last:pb-0",
                !isActive && "opacity-40"
              )}
            >
              {/* Circle */}
              <div
                className={cn(
                  "absolute -left-8 w-[30px] h-[30px] rounded-full flex items-center justify-center border-2 bg-background z-10",
                  isActive
                    ? "border-gold bg-gold text-onyx"
                    : "border-border text-muted-foreground"
                )}
              >
                <Icon size={14} />
              </div>

              {/* Pulse on current */}
              {isCurrent && isActive && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -left-8 w-[30px] h-[30px] rounded-full border-2 border-gold z-0"
                />
              )}

              {/* Content */}
              <div className="ml-4">
                <h4
                  className={cn(
                    "text-sm font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </p>
                {step.timestamp && isActive && (
                  <p className="text-[11px] text-gold mt-1">
                    {new Date(step.timestamp).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
