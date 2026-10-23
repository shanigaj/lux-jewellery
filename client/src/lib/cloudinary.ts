// On-the-fly ImageKit transforms so we deliver small, modern-format images
// instead of the original multi-MB uploads. (The function names are kept from
// the old Cloudinary setup so every call site keeps working unchanged; only the
// URL scheme behind them moved from Cloudinary to ImageKit.)
//
// ImageKit transforms live in a `?tr=` query:
//   f-auto   → best format per browser (AVIF / WebP)
//   q-auto   → automatic quality (visually lossless, much smaller)
//   c-at_max → never upscale; only shrink to fit the width cap (≈ Cloudinary c_limit)
//   w-1600   → cap the largest dimension (plenty for product detail views)
// The next/image loader (cloudinary-loader.ts) later swaps in the exact
// responsive width, keeping any crop/aspect intent set here.

const IK_HOST = "ik.imagekit.io";

function isIk(url: string): boolean {
  return typeof url === "string" && url.includes(IK_HOST);
}

/** Set the ?tr= transform on an ImageKit URL (no-op for non-ImageKit URLs). */
function withTr(url: string, tr: string): string {
  if (!isIk(url)) return url;
  const base = url.split("?")[0];
  return `${base}?tr=${tr}`;
}

const IMAGE_TRANSFORM = "c-at_max,w-1600,f-auto,q-auto";

/** Optimise an image URL (no-op for non-ImageKit URLs). */
export function optimizeCloudinaryImage(url: string): string {
  return withTr(url, IMAGE_TRANSFORM);
}

// Square, subject-aware auto-crop for product thumbnails / cards, so mixed
// source aspect ratios all present as a tidy consistent tile.
//   ar-1-1 + fo-auto → crop to a 1:1 fill, keeping the piece (auto focus) in frame
const THUMB_TRANSFORM = "ar-1-1,fo-auto,w-800,f-auto,q-auto";

/** Auto-cropped, optimised square thumbnail (no-op for non-ImageKit URLs). */
export function productThumb(url: string): string {
  return withTr(url, THUMB_TRANSFORM);
}

const VIDEO_TRANSFORM = "q-auto";

/** Optimise a video URL (no-op for non-ImageKit URLs). */
export function optimizeCloudinaryVideo(url: string): string {
  return withTr(url, VIDEO_TRANSFORM);
}
