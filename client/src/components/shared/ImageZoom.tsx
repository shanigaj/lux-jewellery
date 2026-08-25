"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import cloudinaryLoader from "@/lib/cloudinary-loader";
import { cn } from "@/lib/utils";
import { ZoomIn } from "lucide-react";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  zoomLevel?: number;
}

export function ImageZoom({ src, alt, className, zoomLevel = 2 }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-crosshair group rounded-xl", className)}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Base Image */}
      <Image
        src={src}
        alt={alt}
        fill
        loader={cloudinaryLoader}
        sizes="(max-width: 768px) 100vw, 50vw"
        className={cn(
          "object-cover transition-opacity duration-300",
          isZoomed ? "opacity-0" : "opacity-100"
        )}
        priority
      />

      {/* Zoom Icon Hint */}
      {!isZoomed && (
        <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={20} />
        </div>
      )}

      {/* Zoomed Image layer */}
      <div
        className={cn(
          "absolute inset-0 bg-no-repeat bg-cover transition-opacity duration-300",
          isZoomed ? "opacity-100" : "opacity-0"
        )}
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
          backgroundSize: `${zoomLevel * 100}%`,
        }}
      />
    </div>
  );
}
