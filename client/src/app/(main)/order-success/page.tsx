"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, Mail, Smartphone, Home } from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "LUX-XXXXXX";

  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number; color: string }>>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: -(Math.random() * 200 + 50),
        delay: Math.random() * 0.5,
        size: Math.random() * 6 + 4,
        color: ["#C4A265", "#D4AF37", "#FFD700", "#B8860B", "#DAA520"][Math.floor(Math.random() * 5)],
      }))
    );
  }, []);

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Confetti Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{
            opacity: [1, 1, 0],
            x: p.x,
            y: p.y,
            scale: [1, 1.2, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            delay: p.delay,
            ease: "easeOut",
          }}
          className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}

      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
          >
            <CheckCircle size={48} className="text-green-500" />
          </motion.div>
        </div>
        {/* Pulse ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 1 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1.5, repeat: 2, delay: 0.5 }}
          className="absolute inset-0 rounded-full border-2 border-green-500/30"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center max-w-md"
      >
        <h1 className="font-heading text-3xl md:text-4xl mb-3">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your purchase. Your luxury piece is being prepared with the utmost care.
        </p>

        {/* Order Number */}
        <div className="bg-muted/30 border border-border rounded-xl p-6 mb-8">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            Order Number
          </p>
          <p className="font-heading text-2xl text-gold">{orderNumber}</p>
          <p className="text-xs text-muted-foreground mt-3">
            Estimated delivery: 5-7 business days
          </p>
        </div>

        {/* Notification Confirmation */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-2 bg-muted/30 p-3 rounded-lg"
          >
            <Mail size={16} className="text-gold" />
            <div className="text-left">
              <p className="text-xs font-medium">Email Sent</p>
              <p className="text-[10px] text-muted-foreground">Confirmation email</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-2 bg-muted/30 p-3 rounded-lg"
          >
            <Smartphone size={16} className="text-gold" />
            <div className="text-left">
              <p className="text-xs font-medium">SMS Sent</p>
              <p className="text-[10px] text-muted-foreground">Order updates</p>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href={`/orders/${orderNumber}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-onyx dark:bg-gold text-white dark:text-onyx text-sm uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors"
          >
            <Package size={16} /> Track Order
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 border border-border text-sm uppercase tracking-widest font-medium hover:border-gold transition-colors"
          >
            <Home size={16} /> Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
