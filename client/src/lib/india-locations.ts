// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — India location data + PIN-code lookup
// ───────────────────────────────────────────────────────────
// Used by the admin "Create walk-in order" form so the admin can
// pick State / Country from dropdowns and have City / State /
// Country auto-filled from a 6-digit PIN code (via the free,
// public India Post pincode API). City is a typeable dropdown
// (datalist) because the number of Indian cities is unbounded.
// ═══════════════════════════════════════════════════════════

// 28 states + 8 union territories (official names, matching India Post).
export const INDIAN_STATES: string[] = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// India first (the store's home market), then common export destinations.
export const COUNTRIES: string[] = [
  "India",
  "United Arab Emirates",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Singapore",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Oman",
  "Bahrain",
  "Nepal",
  "Sri Lanka",
  "Bangladesh",
  "Germany",
  "France",
  "Other",
];

// Fallback city suggestions (Gujarat-heavy + metros) shown before any
// PIN-code lookup. The field stays typeable, so any city can be entered.
export const MAJOR_CITIES: string[] = [
  "Surat",
  "Ahmedabad",
  "Vadodara",
  "Rajkot",
  "Bhavnagar",
  "Gandhinagar",
  "Jamnagar",
  "Junagadh",
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Indore",
  "Nagpur",
  "Chandigarh",
  "Kochi",
];

export interface PincodeResult {
  city: string; // District (e.g. "Surat")
  state: string;
  country: string;
  areas: string[]; // Post-office / locality names for the PIN
}

/**
 * Look up an Indian 6-digit PIN code via the public India Post API.
 * Returns null on any failure (network, not found) so the caller can
 * fall back to manual entry. Only the PIN (non-personal) is sent.
 */
export async function lookupPincode(pin: string): Promise<PincodeResult | null> {
  if (!/^\d{6}$/.test(pin)) return null;
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const entry = Array.isArray(json) ? json[0] : null;
    const offices = entry?.PostOffice;
    if (!entry || entry.Status !== "Success" || !Array.isArray(offices) || !offices.length) {
      return null;
    }
    const first = offices[0];
    const areas = Array.from(
      new Set(offices.map((p: { Name?: string }) => p.Name).filter(Boolean) as string[])
    );
    return {
      city: first.District || first.Division || first.Block || "",
      state: first.State || "",
      country: first.Country || "India",
      areas,
    };
  } catch {
    return null;
  }
}
