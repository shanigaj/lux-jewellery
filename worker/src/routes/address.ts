// Saved addresses (embedded in the user doc). Mounted under /api/auth/addresses.
import { Hono } from "hono";
import { getPrisma, sid } from "../lib/db";
import { protect } from "../middleware/auth";
import type { AppEnv } from "../lib/env";
import type { Address } from "../generated/prisma";

export const addressRoutes = new Hono<AppEnv>();
addressRoutes.use("*", protect);

// A 24-hex ObjectId (4-byte time + 8-byte random) — new embedded addresses need
// one so the frontend can edit/delete them by id.
function genObjectId(): string {
  const ts = Math.floor(Date.now() / 1000).toString(16).padStart(8, "0");
  let r = "";
  for (const b of crypto.getRandomValues(new Uint8Array(8))) r += b.toString(16).padStart(2, "0");
  return ts + r;
}

function ensureSingleDefault(addresses: Address[], defaultId?: string) {
  const hasDefault = addresses.some((a) => a.isDefault);
  if (!hasDefault && addresses.length > 0) addresses[0].isDefault = true;
  if (defaultId) addresses.forEach((a) => { a.isDefault = a.id === defaultId; });
}

const FIELDS = ["label", "fullName", "phone", "line1", "line2", "city", "state", "postalCode", "country"] as const;

addressRoutes.get("/", (c) => {
  const u = c.get("user")!;
  return c.json({ success: true, data: sid(u.addresses ?? []) });
});

addressRoutes.post("/", async (c) => {
  const u = c.get("user")!;
  const body = await c.req.json();
  const addresses = (u.addresses ?? []).map((a) => ({ ...a }));
  const makeDefault = body.isDefault || addresses.length === 0;
  const added: Address = {
    id: genObjectId(),
    label: body.label,
    fullName: body.fullName,
    phone: body.phone,
    line1: body.line1,
    line2: body.line2,
    city: body.city,
    state: body.state,
    postalCode: body.postalCode,
    country: body.country ?? "India",
    isDefault: false,
  };
  addresses.push(added);
  ensureSingleDefault(addresses, makeDefault ? added.id! : undefined);
  const prisma = getPrisma(c.env.DATABASE_URL);
  await prisma.user.update({ where: { id: u.id }, data: { addresses } });
  return c.json({ success: true, data: sid(addresses) }, 201);
});

addressRoutes.put("/:addrId", async (c) => {
  const u = c.get("user")!;
  const addrId = c.req.param("addrId");
  const addresses = (u.addresses ?? []).map((a) => ({ ...a }));
  const addr = addresses.find((a) => a.id === addrId);
  if (!addr) return c.json({ success: false, message: "Address not found" }, 404);
  const body = await c.req.json();
  for (const f of FIELDS) if (body[f] !== undefined) (addr as Record<string, unknown>)[f] = body[f];
  if (body.isDefault) ensureSingleDefault(addresses, addr.id!);
  else ensureSingleDefault(addresses);
  const prisma = getPrisma(c.env.DATABASE_URL);
  await prisma.user.update({ where: { id: u.id }, data: { addresses } });
  return c.json({ success: true, data: sid(addresses) });
});

addressRoutes.delete("/:addrId", async (c) => {
  const u = c.get("user")!;
  const addrId = c.req.param("addrId");
  const current = u.addresses ?? [];
  if (!current.some((a) => a.id === addrId)) {
    return c.json({ success: false, message: "Address not found" }, 404);
  }
  const addresses = current.filter((a) => a.id !== addrId).map((a) => ({ ...a }));
  ensureSingleDefault(addresses);
  const prisma = getPrisma(c.env.DATABASE_URL);
  await prisma.user.update({ where: { id: u.id }, data: { addresses } });
  return c.json({ success: true, data: sid(addresses) });
});
