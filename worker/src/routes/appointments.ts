// Appointments — booking allows guests (linked to the user if signed in).
import { Hono } from "hono";
import { getPrisma, sid } from "../lib/db";
import { protect, optionalAuth, authorize } from "../middleware/auth";
import { logAudit } from "../lib/audit";
import type { AppEnv } from "../lib/env";

export const appointments = new Hono<AppEnv>();

appointments.post("/", optionalAuth, async (c) => {
  const body = await c.req.json();
  const u = c.get("user");
  const prisma = getPrisma(c.env.DATABASE_URL);
  const appt = await prisma.appointment.create({
    data: {
      experience: body.experience,
      boutiqueId: body.boutiqueId,
      date: body.date,
      time: body.time,
      name: body.name,
      email: body.email,
      phone: body.phone,
      interest: body.interest,
      notes: body.notes,
      status: body.status,
      userId: u?.id,
    },
  });
  return c.json({ success: true, data: sid(appt) }, 201);
});

appointments.get("/mine", protect, async (c) => {
  const u = c.get("user")!;
  const prisma = getPrisma(c.env.DATABASE_URL);
  const items = await prisma.appointment.findMany({
    where: { userId: u.id },
    orderBy: { createdAt: "desc" },
  });
  return c.json({ success: true, count: items.length, data: sid(items) });
});

appointments.get("/", protect, authorize("admin"), async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const items = await prisma.appointment.findMany({ orderBy: { createdAt: "desc" } });
  return c.json({ success: true, count: items.length, data: sid(items) });
});

appointments.put("/:id/status", protect, authorize("admin"), async (c) => {
  const id = c.req.param("id");
  const { status } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const appt = await prisma.appointment.update({ where: { id }, data: { status } });
    await logAudit(c, "Updated Appointment", appt.name);
    return c.json({ success: true, data: sid(appt) });
  } catch {
    return c.json({ success: false, message: "Appointment not found" }, 404);
  }
});
