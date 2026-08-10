"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IProductImage } from "@/types/product.types";
import { ImageZoom } from "@/components/shared/ImageZoom";
import { cn } from "@/lib/utils";
import { Play, Camera } from "lucide-react";

interface ProductGalleryProps {
  images: IProductImage[];
  videos?: string[];
  video?: string;
}

type TabType = "image" | "video";

export function ProductGallery({ images, videos, video }: ProductGalleryProps) {
  const [activeTab, setActiveTab] = useState<TabType>("image");
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);

  // Default to placeholder if no images
  const safeImages = images.length > 0 ? images : [
    { _id: "default", url: "/images/hero-ring.png", publicId: "default", altText: "Product Image", sortOrder: 1, isDefault: true }
  ];

  // Support one or many product videos (falls back to the legacy single `video`).
  const allVideos = (videos && videos.length > 0 ? videos : video ? [video] : []).filter(Boolean);

  return (
    <div className="flex flex-col md:flex-row gap-4 lg:gap-6 sticky top-24">
      {/* Thumbnails - Left side on desktop, bottom on mobile */}
      <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-20 lg:w-24 shrink-0">
        {safeImages.map((img, idx) => (
          <button
            key={img._id}
            onClick={() => {
              setActiveTab("image");
              setActiveImageIdx(idx);
            }}
            className={cn(
              "relative aspect-square w-20 md:w-full rounded-md overflow-hidden border-2 transition-all shrink-0",
              activeTab === "image" && activeImageIdx === idx
                ? "border-gold"
                : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <Image src={img.url} alt={img.altText} fill className="object-cover" />
          </button>
        ))}

        {allVideos.map((src, idx) => (
          <button
            key={`vid-${idx}`}
            onClick={() => {
              setActiveTab("video");
              setActiveVideoIdx(idx);
            }}
            className={cn(
              "relative aspect-square w-20 md:w-full rounded-md overflow-hidden border-2 transition-all shrink-0 flex items-center justify-center bg-muted",
              activeTab === "video" && activeVideoIdx === idx
                ? "border-gold text-gold"
                : "border-transparent text-muted-foreground opacity-60 hover:opacity-100"
            )}
          >
            <video src={src} muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
            <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm">
              <Play size={14} className="ml-0.5" />
            </span>
          </button>
        ))}
      </div>

      {/* Main View Area */}
      <div className="order-1 md:order-2 flex-1 relative aspect-square md:aspect-[4/5] bg-muted/30 rounded-xl overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "image" && (
            <motion.div
              key={`img-${activeImageIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <ImageZoom
                src={safeImages[activeImageIdx].url}
                alt={safeImages[activeImageIdx].altText}
                className="w-full h-full"
              />
            </motion.div>
          )}

          {activeTab === "video" && allVideos.length > 0 && (
            <motion.div
              key={`video-${activeVideoIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center bg-black"
            >
              <video
                src={allVideos[activeVideoIdx]}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-full object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* View mode indicators */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <div className="bg-background/80 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 border border-border shadow-sm">
            {activeTab === "image" && <Camera size={14} />}
            {activeTab === "video" && <Play size={14} />}
            <span className="text-[10px] uppercase tracking-wider font-medium">
              {activeTab === "image"
                ? `${activeImageIdx + 1}/${safeImages.length}`
                : `Video ${activeVideoIdx + 1}/${allVideos.length}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
