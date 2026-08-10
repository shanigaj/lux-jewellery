"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  animation?: "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "fadeIn" | "scaleIn" | "slideUp";
  delay?: number;
  duration?: number;
  once?: boolean;
}

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
};

export function AnimatedSection({
  children,
  className,
  animation = "fadeUp",
  delay = 0,
  duration = 0.7,
  once = true,
  ...props
}: AnimatedSectionProps) {
  return (
    <motion.div
      // `animate` (mount-triggered) instead of `whileInView`: the IntersectionObserver
      // behind whileInView doesn't reliably fire on a hard reload under Next 16, which
      // left above-the-fold sections stuck at opacity:0 (invisible content). Animating on
      // mount guarantees the content always reveals while keeping the fade/slide effect.
      initial="hidden"
      animate="visible"
      variants={animations[animation]}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Staggered children container
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger item
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
