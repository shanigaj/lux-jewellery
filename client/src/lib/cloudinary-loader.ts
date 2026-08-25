import type { ImageLoaderProps } from "next/image";

// Custom next/image loader for Cloudinary-hosted product imagery.
//
// Without it, next/image routes these URLs through Vercel's image optimizer,
// which re-fetches and re-encodes an image Cloudinary has *already* optimised
// (f_auto/q_auto). That adds a slow "first hit" transform per unique image and
// burns the monthly optimization quota — the main reason product photos crawl
// in on the live site.
//
// With it, the browser pulls each image straight from Cloudinary's global CDN
// at the exact width next/image asks for. The existing crop/aspect params
// (c_fill, g_auto, ar_1:1 on thumbnails; c_limit on detail views) are preserved
// and quality stays q_auto, so nothing about how images LOOK changes — they just
// arrive far quicker and correctly sized.
//
// Non-Cloudinary sources (the local placeholder, data URIs, other hosts) are
// returned untouched so they keep working via the normal path.

const PARAM_TOKEN = /^(c_|w_|h_|f_|q_|ar_|g_|e_|dpr_|b_|r_|fl_|x_|y_|z_|o_|a_)/;

/**
 * A Cloudinary transform segment is a comma-joined list of param tokens such as
 * "c_fill,g_auto,w_800". A version ("v1787247650") or a plain path segment is not.
 */
function isTransformSegment(seg: string): boolean {
  return seg.split(",").some((t) => PARAM_TOKEN.test(t));
}

export default function cloudinaryLoader({ src, width }: ImageLoaderProps): string {
  if (
    typeof src !== "string" ||
    !src.includes("res.cloudinary.com") ||
    !src.includes("/upload/")
  ) {
    return src;
  }

  const marker = "/upload/";
  const idx = src.indexOf(marker);
  const head = src.slice(0, idx);
  const tail = src.slice(idx + marker.length);
  const segments = tail.split("/");

  // Always force f_auto/q_auto + the requested width; keep any crop/gravity/aspect.
  if (segments.length > 0 && isTransformSegment(segments[0])) {
    const kept = segments[0]
      .split(",")
      .filter(Boolean)
      .filter((p) => !/^w_/.test(p) && !/^f_/.test(p) && !/^q_/.test(p));
    segments[0] = [...kept, "f_auto", "q_auto", `w_${width}`].join(",");
    return `${head}${marker}${segments.join("/")}`;
  }

  // No transform present (e.g. ".../upload/v123/path"): insert a safe default.
  return `${head}${marker}f_auto,q_auto,c_limit,w_${width}/${tail}`;
}
