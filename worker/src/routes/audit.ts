// GET /api/audit-logs (admin).
import { Hono } from "hono";
import { getPrisma, sid } from "../lib/db";
import { protect, authorize } from "../middleware/auth";
import type { AppEnv } from "../lib/env";

export const audit = new Hono<AppEnv>();

audit.get("/", protect, authorize("admin"), async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return c.json({ success: true, count: logs.length, data: sid(logs) });
});
