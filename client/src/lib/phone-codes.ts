// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Country dial codes for the phone selector
// ───────────────────────────────────────────────────────────
// A compact, practical list for a Surat jewellery house (India default
// plus the destinations that actually come up for NRI / export buyers).
// Each entry: ISO code, display name, dial code, flag emoji.
// ═══════════════════════════════════════════════════════════

export interface DialCode {
  iso: string;
  name: string;
  dial: string; // includes leading "+"
  flag: string;
}

export const DIAL_CODES: DialCode[] = [
  { iso: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { iso: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { iso: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { iso: "AE", name: "UAE", dial: "+971", flag: "🇦🇪" },
  { iso: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { iso: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { iso: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { iso: "QA", name: "Qatar", dial: "+974", flag: "🇶🇦" },
  { iso: "KW", name: "Kuwait", dial: "+965", flag: "🇰🇼" },
  { iso: "OM", name: "Oman", dial: "+968", flag: "🇴🇲" },
  { iso: "BH", name: "Bahrain", dial: "+973", flag: "🇧🇭" },
  { iso: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿" },
  { iso: "HK", name: "Hong Kong", dial: "+852", flag: "🇭🇰" },
  { iso: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { iso: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { iso: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { iso: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { iso: "IT", name: "Italy", dial: "+39", flag: "🇮🇹" },
  { iso: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭" },
  { iso: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
  { iso: "CN", name: "China", dial: "+86", flag: "🇨🇳" },
  { iso: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭" },
  { iso: "NP", name: "Nepal", dial: "+977", flag: "🇳🇵" },
  { iso: "LK", name: "Sri Lanka", dial: "+94", flag: "🇱🇰" },
  { iso: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
];

export const DEFAULT_DIAL = "+91";

// Dial codes sorted longest-first so "+971" matches before "+9"/"+1".
const DIALS_BY_LEN = [...new Set(DIAL_CODES.map((d) => d.dial))].sort(
  (a, b) => b.length - a.length
);

/** Split a stored phone string into { dial, number }. Falls back to the
 *  default dial code when no recognisable prefix is present. */
export function parsePhone(value: string): { dial: string; number: string } {
  const raw = (value || "").trim();
  if (!raw) return { dial: DEFAULT_DIAL, number: "" };
  if (raw.startsWith("+")) {
    const compact = raw.replace(/\s+/g, "");
    const match = DIALS_BY_LEN.find((d) => compact.startsWith(d));
    if (match) {
      return { dial: match, number: compact.slice(match.length) };
    }
  }
  // No "+"; treat the whole thing as the national number.
  return { dial: DEFAULT_DIAL, number: raw };
}

/** Combine a dial code and national number into a single stored string. */
export function joinPhone(dial: string, number: string): string {
  const n = (number || "").trim();
  if (!n) return "";
  return `${dial} ${n}`.trim();
}
