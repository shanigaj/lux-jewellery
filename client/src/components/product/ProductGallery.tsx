"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IProductImage } from "@/types/product.types";
import cloudinaryLoader from "@/lib/cloudinary-loader";
import { ImageZoom } from "@/components/shared/ImageZoom";
import { cn } from "@/lib/utils";
import { Play, Camera, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: IProductImage[];
  videos?: string[];
  video?: string;
}

type TabType = "image" | "video";

const AUTOPLAY_MS = 4000;

// Normalise every gallery image to a consistent, subject-aware crop so mixed
// source framing (ring-on-hand vs ring-on-white with lots of background) all
// present at the SAME size. Replaces the stored transform segment with
// c_fill,g_auto,ar_<ar>; the cloudinary loader re-adds f_auto/q_auto/width and
// keeps these crop params. No-op for non-Cloudinary URLs (e.g. placeholder).
const PARAM_TOKEN = /(^|,)(c_|w_|h_|f_|q_|ar_|g_|e_|dpr_|b_|r_|fl_|x_|y_|z_|o_|a_)/;
function galleryCrop(url: string, ar: string): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  const [head, tail] = url.split("/upload/");
  const segs = tail.split("/");
  const crop = `c_fill,g_auto,ar_${ar}`;
  if (segs.length > 1 && PARAM_TOKEN.test(segs[0])) segs[0] = crop;
  else segs.unshift(crop);
  return `${head}/upload/${segs.join("/")}`;
}

export function ProductGallery({ images, videos, video }: ProductGalleryProps) {
  const [activeTab, setActiveTab] = useState<TabType>("image");
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // Default to placeholder if no images
  const safeImages = images.length > 0 ? images : [
    { _id: "default", url: "/images/placeholder.png", publicId: "default", altText: "Product Image", sortOrder: 1, isDefault: true }
  ];

  // Support one or many product videos (falls back to the legacy single `video`).
  const allVideos = (videos && videos.length > 0 ? videos : video ? [video] : []).filter(Boolean);

  const showImage = useCallback((idx: number) => {
    setActiveTab("image");
    setActiveImageIdx(((idx % safeImages.length) + safeImages.length) % safeImages.length);
  }, [safeImages.length]);

  const step = useCallback((dir: number) => showImage(activeImageIdx + dir), [activeImageIdx, showImage]);

  // Auto-advance the image carousel (pauses on hover/touch and while a video plays).
  useEffect(() => {
    if (activeTab !== "image" || paused || safeImages.length <= 1) return;
    const t = setInterval(() => {
      setActiveImageIdx((i) => (i + 1) % safeImages.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [activeTab, paused, safeImages.length]);

  // Touch swipe on the main view (mobile).
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current != null && activeTab === "image") {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    }
    touchStartX.current = null;
    // Resume autoplay a little after the user stops interacting.
    setTimeout(() => setPaused(false), 2500);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 lg:gap-6 lg:sticky lg:top-24">
      {/* Thumbnails - Left side on desktop, bottom on mobile */}
      <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-20 lg:w-24 shrink-0">
        {safeImages.map((img, idx) => (
          <button
            key={img._id}
            onClick={() => showImage(idx)}
            className={cn(
              "relative aspect-square w-20 md:w-full rounded-md overflow-hidden border-2 transition-all shrink-0",
              activeTab === "image" && activeImageIdx === idx
                ? "border-gold"
                : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <Image src={galleryCrop(img.url, "1:1")} alt={img.altText} fill loader={cloudinaryLoader} sizes="96px" className="object-cover" />
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

      {/* Main View Area — fixed aspect so every image renders at the same size */}
      <div
        className="order-1 md:order-2 flex-1 relative aspect-square md:aspect-[4/5] bg-muted/30 rounded-xl overflow-hidden group"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
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
                src={galleryCrop(safeImages[activeImageIdx].url, "4:5")}
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

        {/* Prev / Next arrows (image mode, when there's more than one) */}
        {activeTab === "image" && safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm text-foreground md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm text-foreground md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Dot indicators (mobile-friendly) */}
        {activeTab === "image" && safeImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {safeImages.map((img, idx) => (
              <button
                key={`dot-${img._id}`}
                type="button"
                aria-label={`Go to image ${idx + 1}`}
                onClick={() => showImage(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  activeImageIdx === idx ? "w-5 bg-gold" : "w-1.5 bg-background/70 border border-border"
                )}
              />
            ))}
          </div>
        )}

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
