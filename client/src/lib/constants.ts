// ═══════════════════════════════════════════════════════════
// 💎 LUX DIAMONDS — Application Constants
// ═══════════════════════════════════════════════════════════

export const DIAMOND_SHAPES = [
  { value: "round", label: "Round Brilliant" },
  { value: "princess", label: "Princess" },
  { value: "oval", label: "Oval" },
  { value: "cushion", label: "Cushion" },
  { value: "emerald", label: "Emerald" },
  { value: "pear", label: "Pear" },
  { value: "marquise", label: "Marquise" },
  { value: "radiant", label: "Radiant" },
  { value: "asscher", label: "Asscher" },
  { value: "heart", label: "Heart" },
] as const;

export const DIAMOND_CUTS = [
  { value: "ideal", label: "Ideal" },
  { value: "excellent", label: "Excellent" },
  { value: "very_good", label: "Very Good" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
] as const;

export const DIAMOND_CLARITY = [
  { value: "FL", label: "FL — Flawless" },
  { value: "IF", label: "IF — Internally Flawless" },
  { value: "VVS1", label: "VVS1" },
  { value: "VVS2", label: "VVS2" },
  { value: "VS1", label: "VS1" },
  { value: "VS2", label: "VS2" },
  { value: "SI1", label: "SI1" },
  { value: "SI2", label: "SI2" },
] as const;

export const DIAMOND_COLORS = [
  { value: "D", label: "D — Colorless" },
  { value: "E", label: "E — Colorless" },
  { value: "F", label: "F — Colorless" },
  { value: "G", label: "G — Near Colorless" },
  { value: "H", label: "H — Near Colorless" },
  { value: "I", label: "I — Near Colorless" },
  { value: "J", label: "J — Near Colorless" },
] as const;

export const METAL_TYPES = [
  { value: "gold", label: "Yellow Gold" },
  { value: "white_gold", label: "White Gold" },
  { value: "rose_gold", label: "Rose Gold" },
  { value: "platinum", label: "Platinum" },
  { value: "silver", label: "Silver" },
] as const;

export const METAL_PURITIES = [
  { value: "24K", label: "24K Pure Gold" },
  { value: "22K", label: "22K Gold" },
  { value: "18K", label: "18K Gold" },
  { value: "14K", label: "14K Gold" },
  { value: "950Pt", label: "950 Platinum" },
] as const;

export const CERTIFICATIONS = [
  { value: "GIA", label: "GIA" },
  { value: "IGI", label: "IGI" },
  { value: "AGS", label: "AGS" },
  { value: "HRD", label: "HRD" },
] as const;

export const RING_SIZES = [
  "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5",
  "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12",
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
  { value: "bestselling", label: "Bestselling" },
] as const;

export const ORDER_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "returned",
  REFUNDED: "refunded",
} as const;

export const PAYMENT_METHODS = {
  STRIPE: "stripe",
  RAZORPAY: "razorpay",
  COD: "cod",
} as const;

export const ITEMS_PER_PAGE = 12;
export const MAX_CART_ITEMS = 20;
export const MAX_WISHLIST_ITEMS = 50;
export const FREE_SHIPPING_THRESHOLD = 50000; // INR
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
