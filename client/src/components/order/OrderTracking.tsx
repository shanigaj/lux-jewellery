"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IOrderTimeline, TOrderStatus } from "@/types/order.types";
import {
  ClipboardCheck,
  Settings,
  Truck,
  MapPin,
  PackageCheck,
  XCircle,
  RotateCcw,
} from "lucide-react";

interface OrderTrackingProps {
  timeline: IOrderTimeline[];
  currentStatus: TOrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

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
}: OrderTrackingProps) {
  return (
    <div className="space-y-6">
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
