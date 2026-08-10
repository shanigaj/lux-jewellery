// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Currency, Date & Number Formatters
// ═══════════════════════════════════════════════════════════

/**
 * Format price in Indian Rupees
 */
export function formatPrice(
  amount: number,
  currency: string = "INR",
  locale: string = "en-IN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format price with compact notation (e.g., ₹1.5L)
 */
export function formatPriceCompact(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return formatPrice(amount);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (!originalPrice || !salePrice || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Format date to readable string
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-IN", options ?? defaultOptions);
}

/**
 * Format date relative to now (e.g., "2 hours ago")
 */
export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
}

/**
 * Format carat weight
 */
export function formatCarat(carat: number): string {
  return `${carat.toFixed(2)} ct`;
}

/**
 * Format weight in grams
 */
export function formatWeight(grams: number): string {
  return `${grams.toFixed(2)} g`;
}

/**
 * Format star rating
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Generate order number display
 */
export function formatOrderNumber(orderNumber: string): string {
  return `#${orderNumber.toUpperCase()}`;
}

/**
 * Pluralize word
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : plural ?? `${singular}s`;
}
