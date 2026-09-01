// Prisma client for Cloudflare Workers.
//
// The native mongodb driver can't complete its TLS handshake on Workers
// (nodejs_compat limitation → "secureConnect timed out"), so the API talks to
// MongoDB Atlas through Prisma Accelerate over HTTPS. Same Atlas database and
// collections — no data migration.
//
// A fresh client is created per request (Workers are stateless); Accelerate
// pools the real DB connections on its side, so this is cheap.
import { PrismaClient } from "../generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

export function getPrisma(databaseUrl: string) {
  return new PrismaClient({ datasourceUrl: databaseUrl }).$extends(withAccelerate());
}

export type Db = ReturnType<typeof getPrisma>;

// The storefront expects Mongo-style `_id`; Prisma returns `id`. Recursively add
// `_id` (additive — keeps `id` too) to any object whose `id` is a 24-hex
// ObjectId. Skips Dates and non-ObjectId ids (e.g. Boutique.id = "surat").
export function sid<T>(v: T): T {
  if (v instanceof Date) return v;
  if (Array.isArray(v)) return v.map((x) => sid(x)) as unknown as T;
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) out[k] = sid(val);
    const id = out.id;
    if (typeof id === "string" && /^[a-f0-9]{24}$/.test(id) && out._id === undefined) {
      out._id = id;
    }
    return out as unknown as T;
  }
  return v;
}
