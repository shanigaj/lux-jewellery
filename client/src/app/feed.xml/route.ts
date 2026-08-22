import { siteConfig } from "@/config/site";

// Google Merchant product feed (RSS 2.0 + g: namespace).
// Submit this URL in Merchant Center → Products → Feeds (scheduled fetch).
// Rebuilt hourly so price/stock changes propagate.
export const revalidate = 3600;

interface RawProduct {
  _id: string;
  name: string;
  sku?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  category?: string;
  metalType?: string;
  metalPurity?: string;
  gemstone?: string;
  images?: string[];
  stock?: number;
  weight?: number;
  caratWeight?: number;
  dimensions?: string;
}

// Map our storefront category to Google's product taxonomy so Merchant
// classifies each piece correctly.
const GOOGLE_CATEGORY: Record<string, string> = {
  rings: "Apparel & Accessories > Jewelry > Rings",
  necklaces: "Apparel & Accessories > Jewelry > Necklaces",
  earrings: "Apparel & Accessories > Jewelry > Earrings",
  bracelets: "Apparel & Accessories > Jewelry > Bracelets",
  watches: "Apparel & Accessories > Jewelry > Watches",
};

// Escape the five XML special characters for text nodes.
const xml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const money = (n: number) => `${n.toFixed(2)} INR`;

async function getProducts(): Promise<RawProduct[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${api}/products?limit=1000`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

function item(p: RawProduct): string {
  const base = siteConfig.url;
  const link = `${base}/products/${p._id}`;
  const listPrice = p.price ?? 0;
  const hasSale = typeof p.discountPrice === "number" && p.discountPrice > 0 && p.discountPrice < listPrice;
  const description = (p.description || siteConfig.description).replace(/\s+/g, " ").trim();
  const images = p.images ?? [];
  const googleCat = (p.category && GOOGLE_CATEGORY[p.category]) || "Apparel & Accessories > Jewelry";
  const availability = (p.stock ?? 0) > 0 ? "in_stock" : "out_of_stock";
  // Metal tone doubles as the product colour (a near-required attribute for
  // the Jewelry taxonomy). Title-cased, e.g. "Rose Gold".
  const color = p.metalType
    ? p.metalType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  const lines: string[] = [
    `    <item>`,
    `      <g:id>${xml(p._id)}</g:id>`,
    `      <title>${xml(p.name)}</title>`,
    `      <description>${xml(description)}</description>`,
    `      <link>${xml(link)}</link>`,
    `      <g:brand>${xml(siteConfig.name)}</g:brand>`,
    `      <g:condition>new</g:condition>`,
    `      <g:availability>${availability}</g:availability>`,
    `      <g:price>${money(listPrice)}</g:price>`,
    `      <g:google_product_category>${xml(googleCat)}</g:google_product_category>`,
    `      <g:age_group>adult</g:age_group>`,
  ];
  if (color) lines.push(`      <g:color>${xml(color)}</g:color>`);
  // Free insured shipping above the threshold — declared only for qualifying
  // pieces so the feed stays truthful; cheaper items use Merchant Center rates.
  if (siteConfig.features.freeShipping && listPrice >= siteConfig.features.freeShippingThreshold) {
    lines.push(
      `      <g:shipping><g:country>IN</g:country><g:service>Standard</g:service><g:price>0 INR</g:price></g:shipping>`
    );
  }
  if (p.category) lines.push(`      <g:product_type>${xml(p.category)}</g:product_type>`);
  if (hasSale) lines.push(`      <g:sale_price>${money(p.discountPrice as number)}</g:sale_price>`);
  if (p.sku) lines.push(`      <g:mpn>${xml(p.sku)}</g:mpn>`);
  if (images[0]) lines.push(`      <g:image_link>${xml(images[0])}</g:image_link>`);
  // Up to 10 additional images per Merchant spec.
  images.slice(1, 11).forEach((img) =>
    lines.push(`      <g:additional_image_link>${xml(img)}</g:additional_image_link>`)
  );
  if (p.metalType) {
    const material = [p.metalPurity, p.metalType.replace(/_/g, " ")].filter(Boolean).join(" ");
    lines.push(`      <g:material>${xml(material)}</g:material>`);
  }
  if (p.dimensions) lines.push(`      <g:size>${xml(p.dimensions)}</g:size>`);
  // Rich attributes surface as a spec table in Merchant / Shopping.
  const detail = (section: string, name: string, value: string) =>
    `      <g:product_detail><g:section_name>${xml(section)}</g:section_name><g:attribute_name>${xml(
      name
    )}</g:attribute_name><g:attribute_value>${xml(value)}</g:attribute_value></g:product_detail>`;
  if (typeof p.weight === "number" && p.weight > 0) lines.push(detail("Details", "Weight", `${p.weight} g`));
  if (typeof p.caratWeight === "number" && p.caratWeight > 0)
    lines.push(detail("Details", "Total Carat Weight", `${p.caratWeight} ct`));
  if (p.gemstone) lines.push(detail("Details", "Gemstone", p.gemstone));
  lines.push(`    </item>`);
  return lines.join("\n");
}

export async function GET() {
  const products = await getProducts();
  const items = products.filter((p) => (p.price ?? 0) > 0).map(item).join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${xml(siteConfig.name)}</title>
    <link>${xml(siteConfig.url)}</link>
    <description>${xml(siteConfig.description)}</description>
${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
