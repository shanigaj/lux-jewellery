import type { ImageLoaderProps } from "next/image";

// Custom next/image loader for ImageKit-hosted product imagery.
//
// Without it, next/image routes these URLs through the Next image optimizer,
// which re-fetches and re-encodes an image ImageKit has *already* optimised
// (f-auto/q-auto). That adds a slow "first hit" transform per unique image and
// burns the optimization quota — the main reason product photos crawl in.
//
// With it, the browser pulls each image straight from ImageKit's global CDN at
// the exact width next/image asks for. Any crop/focus/aspect intent a helper
// already set (c-at_max; ar-1-1 + fo-auto on thumbnails; cm-pad_resize on the
// gallery) is preserved — we only drop the old width/format/quality tokens and
// re-add f-auto, q-auto and the requested width, so nothing about how images
// LOOK changes; they just arrive correctly sized.
//
// ImageKit transforms live in a `?tr=` query (comma-separated tokens).
// Non-ImageKit sources (the local placeholder, data URIs, other hosts) are
// returned untouched so they keep working via the normal path.

// Tokens the loader owns and re-derives per request (width/format/quality/dpr).
const OWNED_TOKEN = /^(w|h|f|q|dpr)-/;

export default function cloudinaryLoader({ src, width }: ImageLoaderProps): string {
  if (typeof src !== "string" || !src.includes("ik.imagekit.io")) {
    return src;
  }

  const [base, query = ""] = src.split("?");

  // Preserve any crop/focus/aspect/background tokens already on the URL.
  const params = new URLSearchParams(query);
  const kept = (params.get("tr") || "")
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t && !OWNED_TOKEN.test(t));

  const tr = [...kept, `w-${width}`, "f-auto", "q-auto"].join(",");
  return `${base}?tr=${tr}`;
}
