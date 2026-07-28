import { IProduct } from "@/types/product.types";

const STORAGE_KEY = "lux_recently_viewed";
const MAX_ITEMS = 10;

export function getRecentlyViewed(): IProduct[] {
  if (typeof window === "undefined") return [];
  try {
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
