"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutStepsProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: "Shipping" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Review" },
];

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center gap-0 max-w-lg mx-auto">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={false}
              animate={{
                backgroundColor:
                  currentStep >= step.id
                    ? "var(--color-gold, #C4A265)"
                    : "transparent",
                borderColor:
                  currentStep >= step.id
                    ? "var(--color-gold, #C4A265)"
                    : "var(--color-border)",
              }}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                currentStep >= step.id ? "text-onyx" : "text-muted-foreground"
              )}
            >
              {currentStep > step.id ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check size={18} />
                </motion.div>
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </motion.div>
            <span
              className={cn(
                "text-xs uppercase tracking-wider mt-2 font-medium transition-colors",
                currentStep >= step.id
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className="w-16 sm:w-24 h-px bg-border mx-2 mb-6 relative overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: currentStep > step.id ? "100%" : "0%",
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 bg-gold"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
