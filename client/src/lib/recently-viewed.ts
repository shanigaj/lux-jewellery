import { IProduct } from "@/types/product.types";

// Bumped to _v2 after the ImageKit migration: the old key cached whole product
// snapshots whose image URLs pointed at the retired Cloudinary host, so replayed
// history showed broken images. Dropping the legacy key lets the strip rebuild
// from fresh (ImageKit) snapshots.
const STORAGE_KEY = "lux_recently_viewed_v2";
const LEGACY_KEYS = ["lux_recently_viewed"];
const MAX_ITEMS = 10;

export function getRecentlyViewed(): IProduct[] {
  if (typeof window === "undefined") return [];
  try {
    // Clear any superseded caches so stale (dead-image) snapshots can't resurface.
    LEGACY_KEYS.forEach((k) => window.localStorage.removeItem(k));
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as IProduct[]) : [];
  } catch {
    return [];
  }
}

/** Records a product view, most-recent-first, deduped, capped at MAX_ITEMS. */
export function addRecentlyViewed(product: IProduct): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentlyViewed().filter((p) => p._id !== product._id);
    const updated = [product, ...existing].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable (private mode / quota) — skip silently
  }
}
