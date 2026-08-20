"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UploadCloud, X, Sparkles, Wand2, Loader2 } from "lucide-react";
import {
  useUploadMultipleImagesMutation,
  useEnhanceImageMutation,
} from "@/store/api/mediaApi";

interface ProductImageUploaderProps {
  /** Current Cloudinary image URLs. */
  value: string[];
  /** Called with the new URL list on any add / remove / enhance. */
  onChange: (urls: string[]) => void;
}

/**
 * Uploads product images straight to Cloudinary and lets the admin polish each
 * one with AI: "Enhance" (fast Cloudinary auto-improve) or "Studio" (gpt-image-1
 * turns an ordinary snap into a clean studio product shot). The parent form only
 * ever deals with the final URL list.
 */
export function ProductImageUploader({ value, onChange }: ProductImageUploaderProps) {
  const [uploadImages, { isLoading: isUploading }] = useUploadMultipleImagesMutation();
  const [enhanceImage] = useEnhanceImageMutation();
  const [busyIdx, setBusyIdx] = useState<number | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("images", f));
      const res = await uploadImages(fd).unwrap();
      onChange([...value, ...res.data.map((d) => d.url)]);
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e?.data?.message || "Upload failed");
    }
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const enhance = async (i: number, mode: "enhance" | "studio") => {
    setBusyIdx(i);
    const toastId = toast.loading(
      mode === "studio" ? "Generating studio photo… (~30s)" : "Enhancing…"
    );
    try {
      const res = await enhanceImage({ imageUrl: value[i], mode }).unwrap();
      onChange(value.map((u, idx) => (idx === i ? res.data.url : u)));
      toast.success(mode === "studio" ? "Studio photo ready" : "Image enhanced", {
        id: toastId,
      });
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e?.data?.message || "Enhancement failed", { id: toastId });
    } finally {
      setBusyIdx(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/5 hover:bg-muted/10 transition-colors relative">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
        />
        {isUploading ? (
          <Loader2 className="mx-auto text-gold mb-4 animate-spin" size={32} />
        ) : (
          <UploadCloud className="mx-auto text-muted-foreground mb-4" size={32} />
        )}
        <p className="text-sm font-medium mb-1">
          {isUploading ? "Uploading…" : "Click or drag images to upload"}
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, WEBP up to 10MB — then polish with AI below
        </p>
      </div>

      {/* Previews + per-image AI actions */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-square border border-border rounded-lg overflow-hidden group"
            >
              <Image src={url} alt={`Product image ${index + 1}`} fill className="object-cover" />

              {busyIdx === index && (
                <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                  <Loader2 className="animate-spin text-white" size={22} />
                </div>
              )}

              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Remove image"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X size={12} />
              </button>

              {index === 0 && (
                <span className="absolute top-1 left-1 bg-gold text-onyx text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded z-10">
                  Primary
                </span>
              )}

              {/* AI actions */}
              <div className="absolute bottom-1 inset-x-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  type="button"
                  onClick={() => enhance(index, "enhance")}
                  disabled={busyIdx !== null}
                  title="Auto-improve & sharpen (fast)"
                  className="flex-1 flex items-center justify-center gap-1 text-[10px] font-medium bg-background/90 backdrop-blur-sm rounded py-1 hover:bg-background disabled:opacity-50"
                >
                  <Sparkles size={11} /> Enhance
                </button>
                <button
                  type="button"
                  onClick={() => enhance(index, "studio")}
                  disabled={busyIdx !== null}
                  title="AI studio product photo"
                  className="flex-1 flex items-center justify-center gap-1 text-[10px] font-medium bg-gold text-onyx rounded py-1 hover:bg-gold-light disabled:opacity-50"
                >
                  <Wand2 size={11} /> Studio
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
