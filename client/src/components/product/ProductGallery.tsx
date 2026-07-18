"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IProductImage } from "@/types/product.types";
import { ImageZoom } from "@/components/shared/ImageZoom";
import { cn } from "@/lib/utils";
import { Play, Rotate3D, Camera } from "lucide-react";

interface ProductGalleryProps {
  images: IProductImage[];
  video?: string;
}

type TabType = "image" | "video" | "360";

export function ProductGallery({ images, video }: ProductGalleryProps) {
  const [activeTab, setActiveTab] = useState<TabType>("image");
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Default to placeholder if no images
  const safeImages = images.length > 0 ? images : [
    { _id: "default", url: "/images/hero-ring.png", publicId: "default", altText: "Product Image", sortOrder: 1, isDefault: true }
  ];

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

        {video && (
          <button
            onClick={() => setActiveTab("video")}
            className={cn(
              "relative aspect-square w-20 md:w-full rounded-md overflow-hidden border-2 transition-all shrink-0 flex items-center justify-center bg-muted",
              activeTab === "video"
                ? "border-gold text-gold"
                : "border-transparent text-muted-foreground opacity-60 hover:opacity-100"
            )}
          >
            <Play size={24} />
          </button>
        )}

        <button
          onClick={() => setActiveTab("360")}
          className={cn(
            "relative aspect-square w-20 md:w-full rounded-md overflow-hidden border-2 transition-all shrink-0 flex items-center justify-center bg-muted",
            activeTab === "360"
              ? "border-gold text-gold"
              : "border-transparent text-muted-foreground opacity-60 hover:opacity-100"
          )}
        >
          <Rotate3D size={24} />
        </button>
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

          {activeTab === "video" && (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center bg-black"
            >
              <video
                src={video || "/videos/jewelry-video.mp4"}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {activeTab === "360" && (
            <motion.div
              key="360"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-muted"
            >
              {/* Fake 360 Viewer with infinite pan animation */}
              <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-3/4 h-3/4"
                >
                  <Image
                    src={safeImages[0].url}
                    alt="360 View"
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </motion.div>
                
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-background/80 backdrop-blur-md rounded-full border border-border shadow-luxury">
                  <Rotate3D size={20} className="text-gold" />
                  <span className="text-xs font-medium uppercase tracking-wider">Drag to Rotate</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View mode indicators */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <div className="bg-background/80 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 border border-border shadow-sm">
            {activeTab === "image" && <Camera size={14} />}
            {activeTab === "video" && <Play size={14} />}
            {activeTab === "360" && <Rotate3D size={14} />}
            <span className="text-[10px] uppercase tracking-wider font-medium">
              {activeTab === "image" ? `${activeImageIdx + 1}/${safeImages.length}` : activeTab}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
