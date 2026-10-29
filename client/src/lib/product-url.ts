// ═══════════════════════════════════════════════════════════
// Product URL helpers — keyword-rich slugs without a DB change.
//
// A product URL is `/products/<name-slug>-<objectId>`, e.g.
//   /products/the-sherbi-ring-6ac4f49ee6516d2b2cb9a0f5
// The human-readable name slug carries the keywords for SEO; the trailing
// 24-char hex ObjectId is the stable lookup key, so names can change without
// breaking links and no slug uniqueness/backfill is required. The old bare-id
// URL (`/products/<objectId>`) still resolves and 301-redirects to this form.
// ═══════════════════════════════════════════════════════════

/** Kebab-case a product name for use in a URL (ASCII, lowercase, capped). */
export function slugifyName(name: string): string {
  return (name || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics → single dash
    .replace(/^-+|-+$/g, "") // trim dashes
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/** Build the canonical pretty URL slug from a product's name + id. */
export function productSlug(name: string, id: string): string {
  const s = slugifyName(name);
  return s ? `${s}-${id}` : id;
}

/** Pull the 24-hex ObjectId back out of a URL param (pretty slug or bare id). */
export function extractProductId(param: string): string {
  const m = (param || "").match(/([a-f0-9]{24})$/i);
  return m ? m[1] : param;
}
