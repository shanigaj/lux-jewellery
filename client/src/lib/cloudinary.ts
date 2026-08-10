// Insert on-the-fly Cloudinary transforms so we deliver small, modern-format
// images instead of the original 8–9 MB PNG uploads.
//
//   f_auto  → best format per browser (AVIF / WebP)
//   q_auto  → automatic quality (visually lossless, much smaller)
//   c_limit → never upscale; only shrink to fit the width cap
//   w_1600  → cap the largest dimension (plenty for product detail views)

const IMAGE_TRANSFORM = "f_auto,q_auto,c_limit,w_1600";
const VIDEO_TRANSFORM = "q_auto";

function withTransform(url: string, transform: string): string {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  // Don't double-apply if a transform is already present right after /upload/.
  if (/\/upload\/(?:[^/]*(?:f_auto|q_auto)[^/]*)\//.test(url)) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
}

/** Optimise a Cloudinary image URL (no-op for non-Cloudinary URLs). */
export function optimizeCloudinaryImage(url: string): string {
  return withTransform(url, IMAGE_TRANSFORM);
}

/** Optimise a Cloudinary video URL (no-op for non-Cloudinary URLs). */
export function optimizeCloudinaryVideo(url: string): string {
  return withTransform(url, VIDEO_TRANSFORM);
}
