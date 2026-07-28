// Helpers for the "Book an Appointment" experience.
// The booking is inquiry-based: the confirmation is delivered as a pre-filled
// WhatsApp message (see lib/whatsapp.ts) — no payment or backend booking engine.

export type ExperienceType = "in-store" | "virtual" | "styling";

export interface Experience {
  id: ExperienceType;
  title: string;
  duration: string;
  blurb: string;
}

export const EXPERIENCES: Experience[] = [
  {
    id: "in-store",
    title: "Private Boutique Visit",
    duration: "45–60 min",
    blurb: "A one-to-one appointment with a diamond specialist at the boutique of your choice.",
  },
  {
    id: "virtual",
    title: "Virtual Consultation",
    duration: "30 min",
    blurb: "Meet a specialist over a video call from anywhere — pieces presented live on camera.",
  },
  {
    id: "styling",
    title: "Personal Styling Session",
    duration: "60 min",
    blurb: "Curated pieces selected around your occasion, wardrobe and story.",
  },
];

export interface Boutique {
  id: string;
  name: string;
  city: string;
  address: string;
}

export const BOUTIQUES: Boutique[] = [
  { id: "surat", name: "Surat Flagship", city: "Surat", address: "123 Diamond Avenue, Surat" },
  { id: "mumbai", name: "Mumbai Boutique", city: "Mumbai", address: "Kala Ghoda, Fort, Mumbai" },
  { id: "delhi", name: "Delhi Boutique", city: "New Delhi", address: "DLF Emporio, Vasant Kunj" },
  { id: "bengaluru", name: "Bengaluru Boutique", city: "Bengaluru", address: "UB City, Vittal Mallya Road" },
];

export const INTERESTS = [
  "Engagement Rings",
  "Bridal & Wedding Bands",
  "High Jewellery",
  "Diamond Necklaces",
  "Earrings & Studs",
  "Fine Watches",
  "Bespoke / Design Your Own",
  "Repairs & Services",
  "Something else",
] as const;

export const TIME_SLOTS = [
  "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
] as const;

/** Next `count` selectable days, starting tomorrow (boutiques closed same-day). */
export function upcomingDays(count = 14): Date[] {
  const days: Date[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 1; i <= count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export function formatDayLabel(d: Date): { weekday: string; day: string; month: string } {
  return {
    weekday: d.toLocaleDateString("en-IN", { weekday: "short" }),
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleDateString("en-IN", { month: "short" }),
  };
}

/** ISO date (yyyy-mm-dd) in local time — used as a stable value/key. */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function to12Hour(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export interface AppointmentDetails {
  experience: ExperienceType;
  boutiqueId?: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // 24h HH:mm
  name: string;
  email: string;
  phone: string;
  interest: string;
  notes?: string;
}

/** Compose a human-readable appointment request for WhatsApp. */
export function buildAppointmentMessage(a: AppointmentDetails): string {
  const exp = EXPERIENCES.find((e) => e.id === a.experience);
  const boutique = a.boutiqueId ? BOUTIQUES.find((b) => b.id === a.boutiqueId) : undefined;
  const prettyDate = new Date(`${a.date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const lines: string[] = [
    "Hello LUX DIAMONDS,",
    "I'd like to request an appointment:",
    "",
    `*${exp?.title ?? a.experience}*`,
    `• Date: ${prettyDate}`,
    `• Time: ${to12Hour(a.time)}`,
  ];

  if (a.experience === "virtual") lines.push("• Format: Video consultation");
  if (boutique) lines.push(`• Boutique: ${boutique.name} — ${boutique.address}`);

  lines.push(
    `• Interest: ${a.interest}`,
    "",
    "My details:",
    `• Name: ${a.name}`,
    `• Email: ${a.email}`,
    `• Phone: ${a.phone}`
  );

  if (a.notes?.trim()) lines.push(`• Notes: ${a.notes.trim()}`);

  lines.push("", "Please confirm availability. Thank you!");
  return lines.join("\n");
}
