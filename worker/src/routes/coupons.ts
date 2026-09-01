// Coupons + gift-card validation. All routes require auth; CRUD requires admin.
import { Hono } from "hono";
import { getPrisma, sid } from "../lib/db";
import { protect, authorize } from "../middleware/auth";
import { logAudit } from "../lib/audit";
import type { AppEnv } from "../lib/env";

export const coupons = new Hono<AppEnv>();
coupons.use("*", protect);

coupons.post("/validate", async (c) => {
  const { code, orderAmount } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  const coupon = await prisma.coupon.findFirst({
    where: { code: String(code || "").toUpperCase(), isActive: true, expiresAt: { gt: new Date() } },
  });
  if (!coupon) return c.json({ success: false, message: "Invalid or expired coupon" }, 400);
  if (coupon.usedCount >= coupon.usageLimit) {
    return c.json({ success: false, message: "Coupon usage limit reached" }, 400);
  }
  if (orderAmount < coupon.minOrderAmount) {
    return c.json({ success: false, message: `Minimum order amount is ₹${coupon.minOrderAmount}` }, 400);
  }
  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.discountValue;
  }
  return c.json({ success: true, coupon: sid(coupon), discount });
});

coupons.post("/giftcards/validate", async (c) => {
  const { code } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  const giftCard = await prisma.giftCard.findFirst({
    where: { code: String(code || "").toUpperCase(), isActive: true, expiresAt: { gt: new Date() } },
  });
  if (!giftCard) return c.json({ success: false, message: "Invalid or expired gift card" }, 400);
  if (giftCard.balance <= 0) {
    return c.json({ success: false, message: "Gift card has no remaining balance" }, 400);
  }
  return c.json({ success: true, giftCard: sid(giftCard) });
});

coupons.get("/", authorize("admin"), async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const list = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return c.json({ success: true, count: list.length, data: sid(list) });
});

coupons.post("/", authorize("admin"), async (c) => {
  const body = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: String(body.code || "").toUpperCase(),
        discountType: body.discountType,
        discountValue: body.discountValue,
        minOrderAmount: body.minOrderAmount,
        maxDiscount: body.maxDiscount,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : new Date(),
        isActive: body.isActive,
        usageLimit: body.usageLimit,
      },
    });
    await logAudit(c, "Created Coupon", coupon.code);
    return c.json({ success: true, data: sid(coupon) }, 201);
  } catch (e) {
    return c.json({ success: false, message: (e as Error).message }, 400);
  }
});

coupons.put("/:id", authorize("admin"), async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const data: Record<string, unknown> = {};
  for (const f of ["discountType", "discountValue", "minOrderAmount", "maxDiscount", "isActive", "usageLimit"]) {
    if (body[f] !== undefined) data[f] = body[f];
  }
  if (body.code !== undefined) data.code = String(body.code).toUpperCase();
  if (body.expiresAt !== undefined) data.expiresAt = new Date(body.expiresAt);
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const coupon = await prisma.coupon.update({ where: { id }, data });
    return c.json({ success: true, data: sid(coupon) });
  } catch {
    return c.json({ success: false, message: "Coupon not found" }, 404);
  }
});

coupons.delete("/:id", authorize("admin"), async (c) => {
  const id = c.req.param("id");
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const coupon = await prisma.coupon.delete({ where: { id } });
    await logAudit(c, "Deleted Coupon", coupon.code);
    return c.json({ success: true, message: "Coupon deleted" });
  } catch {
    return c.json({ success: false, message: "Coupon not found" }, 404);
  }
});
