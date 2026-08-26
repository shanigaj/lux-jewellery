// Fire-and-forget audit trail writer. Never throws into the request path.
import type { Context } from "hono";
import { getPrisma } from "./db";
import type { AppEnv } from "./env";

export async function logAudit(c: Context<AppEnv>, action: string, target?: string) {
  try {
    const u = c.get("user");
    const userName = u
      ? [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || "Admin"
      : "System";
    const prisma = getPrisma(c.env.DATABASE_URL);
    await prisma.auditLog.create({
      data: {
        action,
        target,
        userName,
        role: u?.role,
        ip: c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "",
      },
    });
  } catch {
    // best-effort
  }
}
