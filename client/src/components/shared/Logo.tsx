"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  showTagline?: boolean;
}

// Source asset is 1774 × 887 (2:1). We scale by height and let width follow.
const SIZES = {
  sm: { height: 60, width: 120 },
  md: { height: 76, width: 152 },
  lg: { height: 104, width: 208 },
} as const;

export function Logo({
  variant = "default",
  size = "md",
  className,
}: LogoProps) {
  const { width, height } = SIZES[size];

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center", className)}
      aria-label="Sparenza & Co. — Home"
    >
      <Image
        src="/images/logo-sparenza-v3.png"
        alt="Sparenza & Co. — Fine Jewels"
        width={width}
        height={height}
        priority
        className={cn(
          "object-contain transition-transform duration-500 group-hover:scale-[1.03]",
          // The mark is dark; invert it to white on dark backgrounds.
          variant === "light" && "brightness-0 invert"
        )}
      />
    </Link>
  );
}
