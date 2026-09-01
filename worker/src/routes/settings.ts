// Site settings singleton. GET public (seeds defaults on first read); PUT admin.
import { Hono } from "hono";
import { getPrisma, sid, type Db } from "../lib/db";
import { protect, authorize } from "../middleware/auth";
import { logAudit } from "../lib/audit";
import type { AppEnv } from "../lib/env";

export const settings = new Hono<AppEnv>();

const EDITABLE = [
  "storeName", "supportEmail", "supportPhone", "address", "currency",
  "timezone", "freeShippingThreshold", "announcements", "boutiques", "timeSlots",
] as const;

const DEFAULT_ADDRESS =
  "52, Shubham Park Society, Aakar Club Rd, Swagat Society, BRTS, Simada Gam, Nana Varachha, Surat, Gujarat 395011";
const DEFAULT_ANNOUNCEMENTS = [
  "Complimentary worldwide shipping on orders above ₹50,000",
  "Every diamond is GIA certified — Authenticity guaranteed",
  "Lifetime exchange & buyback on all collections",
];
const DEFAULT_BOUTIQUES = [
  { id: "surat", name: "Surat Flagship", city: "Surat", address: "123 Diamond Avenue, Surat" },
  { id: "mumbai", name: "Mumbai Boutique", city: "Mumbai", address: "Kala Ghoda, Fort, Mumbai" },
  { id: "delhi", name: "Delhi Boutique", city: "New Delhi", address: "DLF Emporio, Vasant Kunj" },
  { id: "bengaluru", name: "Bengaluru Boutique", city: "Bengaluru", address: "UB City, Vittal Mallya Road" },
];
const DEFAULT_TIMESLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

async function getOrCreate(prisma: Db) {
  const existing = await prisma.settings.findUnique({ where: { key: "site" } });
  if (existing) return existing;
  return prisma.settings.create({
    data: {
      key: "site",
      address: DEFAULT_ADDRESS,
      announcements: DEFAULT_ANNOUNCEMENTS,
      boutiques: DEFAULT_BOUTIQUES,
      timeSlots: DEFAULT_TIMESLOTS,
    },
  });
}

settings.get("/", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const doc = await getOrCreate(prisma);
  return c.json({ success: true, data: sid(doc) });
});

settings.put("/", protect, authorize("admin"), async (c) => {
  const body = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  await getOrCreate(prisma);
  const data: Record<string, unknown> = {};
  for (const f of EDITABLE) if (body[f] !== undefined) data[f] = body[f];
  const doc = await prisma.settings.update({ where: { key: "site" }, data });
  await logAudit(c, "Updated Settings");
  return c.json({ success: true, data: sid(doc) });
});
