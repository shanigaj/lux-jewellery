// Reference data for the Size Guide (ring / bracelet / necklace).
// Static reference tables — no backend needed.

export interface RingSizeRow {
  us: string;
  uk: string;
  india: string;
  diameterMm: number;
  circumferenceMm: number;
}

// India sizing here follows the common jewellers' numeric scale (BIS-adjacent), not a legal standard.
export const RING_SIZES: RingSizeRow[] = [
  { us: "4", uk: "H", india: "8", diameterMm: 14.9, circumferenceMm: 46.8 },
  { us: "4.5", uk: "I", india: "9", diameterMm: 15.3, circumferenceMm: 48.0 },
  { us: "5", uk: "J½", india: "10", diameterMm: 15.7, circumferenceMm: 49.3 },
  { us: "5.5", uk: "K½", india: "11", diameterMm: 16.1, circumferenceMm: 50.6 },
  { us: "6", uk: "L½", india: "12", diameterMm: 16.5, circumferenceMm: 51.9 },
  { us: "6.5", uk: "M½", india: "13", diameterMm: 16.9, circumferenceMm: 53.1 },
  { us: "7", uk: "N½", india: "14", diameterMm: 17.3, circumferenceMm: 54.4 },
  { us: "7.5", uk: "O½", india: "15", diameterMm: 17.7, circumferenceMm: 55.7 },
  { us: "8", uk: "P½", india: "16", diameterMm: 18.1, circumferenceMm: 57.0 },
  { us: "8.5", uk: "Q½", india: "17", diameterMm: 18.5, circumferenceMm: 58.3 },
  { us: "9", uk: "R½", india: "18", diameterMm: 18.9, circumferenceMm: 59.5 },
  { us: "9.5", uk: "S½", india: "19", diameterMm: 19.4, circumferenceMm: 60.8 },
  { us: "10", uk: "T½", india: "20", diameterMm: 19.8, circumferenceMm: 62.1 },
];

export interface BraceletSizeRow {
  label: string;
  wristCm: string;
  bandCm: string;
}

export const BRACELET_SIZES: BraceletSizeRow[] = [
  { label: "XS", wristCm: "14 – 15", bandCm: "16" },
  { label: "S", wristCm: "15 – 16", bandCm: "17" },
  { label: "M", wristCm: "16 – 17", bandCm: "18" },
  { label: "L", wristCm: "17 – 18.5", bandCm: "19.5" },
  { label: "XL", wristCm: "18.5 – 20", bandCm: "21" },
];

export interface NecklaceLengthRow {
  inches: number;
  name: string;
  sitsAt: string;
}

export const NECKLACE_LENGTHS: NecklaceLengthRow[] = [
  { inches: 14, name: "Collar", sitsAt: "Tight, at the base of the neck" },
  { inches: 16, name: "Choker", sitsAt: "Just below the throat" },
  { inches: 18, name: "Princess", sitsAt: "At or just below the collarbone — most versatile" },
  { inches: 20, name: "Matinee", sitsAt: "At the top of the bust" },
  { inches: 24, name: "Opera", sitsAt: "At the breastbone, can be doubled" },
  { inches: 36, name: "Rope", sitsAt: "Below the bust, often layered or knotted" },
];

/** Convert a piece of string / tailor's tape circumference (mm) to the nearest US ring size. */
export function nearestUsRingSize(circumferenceMm: number): string {
  let closest = RING_SIZES[0];
  let smallestDiff = Math.abs(RING_SIZES[0].circumferenceMm - circumferenceMm);
  for (const row of RING_SIZES) {
    const diff = Math.abs(row.circumferenceMm - circumferenceMm);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closest = row;
    }
  }
  return closest.us;
}
