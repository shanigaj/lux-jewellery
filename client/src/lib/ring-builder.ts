// Options + indicative pricing + enquiry message for the "Design Your Own Ring"
// configurator. Pricing is an INDICATIVE estimate only — the real quote is
// always given on enquiry (inquiry-based model, no checkout).

export type SettingId = "solitaire" | "halo" | "pave" | "three-stone" | "vintage";
export type MetalId = "platinum" | "white_gold" | "gold" | "rose_gold";
export type ShapeId =
  | "round" | "princess" | "oval" | "cushion" | "emerald" | "pear" | "marquise";

export interface Setting {
  id: SettingId;
  title: string;
  blurb: string;
  base: number; // indicative setting cost (INR)
}

export const SETTINGS: Setting[] = [
  { id: "solitaire", title: "Solitaire", blurb: "A single diamond, held to the light.", base: 60000 },
  { id: "halo", title: "Halo", blurb: "A ring of pavé encircles the centre stone.", base: 95000 },
  { id: "pave", title: "Pavé", blurb: "Diamonds set along the band for continuous fire.", base: 110000 },
  { id: "three-stone", title: "Three Stone", blurb: "Past, present and future.", base: 130000 },
  { id: "vintage", title: "Vintage", blurb: "Milgrain and filigree detailing.", base: 120000 },
];

export interface Metal {
  id: MetalId;
  name: string;
  swatch: string;
  band: string; // gradient stop for the preview band
  mult: number;
}

export const METALS: Metal[] = [
  { id: "platinum", name: "Platinum", swatch: "#D6D9DC", band: "#C9CDD2", mult: 1.15 },
  { id: "white_gold", name: "18K White Gold", swatch: "#E8E6E1", band: "#DAD7D0", mult: 1.0 },
  { id: "gold", name: "18K Yellow Gold", swatch: "#E7C15B", band: "#D8AE45", mult: 0.95 },
  { id: "rose_gold", name: "18K Rose Gold", swatch: "#E0A899", band: "#D3947F", mult: 1.0 },
];

export interface Shape {
  id: ShapeId;
  name: string;
  /** CSS clip-path (or "" for rounded shapes handled via border-radius). */
  clip: string;
  radius: string; // border-radius when clip is empty
  mult: number;
}

export const SHAPES: Shape[] = [
  { id: "round", name: "Round", clip: "", radius: "50%", mult: 1.15 },
  { id: "princess", name: "Princess", clip: "", radius: "6%", mult: 1.0 },
  { id: "oval", name: "Oval", clip: "", radius: "50% / 60%", mult: 1.05 },
  { id: "cushion", name: "Cushion", clip: "", radius: "30%", mult: 1.0 },
  { id: "emerald", name: "Emerald", clip: "polygon(22% 0,78% 0,100% 22%,100% 78%,78% 100%,22% 100%,0 78%,0 22%)", radius: "0", mult: 0.95 },
  { id: "pear", name: "Pear", clip: "polygon(50% 0, 90% 55%, 50% 100%, 10% 55%)", radius: "0 0 50% 50%", mult: 1.0 },
  { id: "marquise", name: "Marquise", clip: "polygon(50% 0, 78% 50%, 50% 100%, 22% 50%)", radius: "0", mult: 0.98 },
];

export const COLOURS = ["D", "E", "F", "G", "H", "I", "J"] as const;
export const CLARITIES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"] as const;
export const CUTS = ["Ideal", "Excellent", "Very Good"] as const;
export const RING_SIZES = ["4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9"] as const;

export const CARAT_MIN = 0.3;
export const CARAT_MAX = 5;
export const CARAT_STEP = 0.1;

const COLOUR_MULT: Record<string, number> = {
  D: 1.35, E: 1.28, F: 1.2, G: 1.12, H: 1.0, I: 0.9, J: 0.82,
};
const CLARITY_MULT: Record<string, number> = {
  FL: 1.5, IF: 1.4, VVS1: 1.3, VVS2: 1.22, VS1: 1.14, VS2: 1.06, SI1: 0.95, SI2: 0.85,
};
const CUT_MULT: Record<string, number> = {
  Ideal: 1.1, Excellent: 1.05, "Very Good": 1.0,
};

export interface RingConfig {
  setting: SettingId;
  metal: MetalId;
  shape: ShapeId;
  carat: number;
  colour: string;
  clarity: string;
  cut: string;
  size: string;
}

export const DEFAULT_CONFIG: RingConfig = {
  setting: "solitaire",
  metal: "platinum",
  shape: "round",
  carat: 1,
  colour: "F",
  clarity: "VS1",
  cut: "Excellent",
  size: "6",
};

/** Indicative estimate in INR. Deliberately rounded — final quote on enquiry. */
export function estimatePrice(c: RingConfig): number {
  const setting = SETTINGS.find((s) => s.id === c.setting)!;
  const metal = METALS.find((m) => m.id === c.metal)!;
  const shape = SHAPES.find((s) => s.id === c.shape)!;

  const settingCost = setting.base * metal.mult;
  const perCaratBase = 350000 * Math.pow(c.carat, 1.9);
  const diamondCost =
    perCaratBase *
    (COLOUR_MULT[c.colour] ?? 1) *
    (CLARITY_MULT[c.clarity] ?? 1) *
    (CUT_MULT[c.cut] ?? 1) *
    shape.mult;

  const total = settingCost + diamondCost;
  return Math.round(total / 1000) * 1000;
}

export function formatINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function buildRingEnquiry(c: RingConfig, estimate: number): string {
  const setting = SETTINGS.find((s) => s.id === c.setting)!;
  const metal = METALS.find((m) => m.id === c.metal)!;
  const shape = SHAPES.find((s) => s.id === c.shape)!;

  return [
    "Hello Sparenza & Co.,",
    "I've designed a ring and would like a quote:",
    "",
    "*Bespoke Ring*",
    `• Setting: ${setting.title}`,
    `• Metal: ${metal.name}`,
    `• Diamond: ${shape.name} • ${c.carat.toFixed(2)}ct • ${c.colour} • ${c.clarity} • ${c.cut} cut`,
    `• Ring size: US ${c.size}`,
    `• Indicative estimate: ${formatINR(estimate)}`,
    "",
    "Please share the final quote and available matching stones. Thank you!",
  ].join("\n");
}
