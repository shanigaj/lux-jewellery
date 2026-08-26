// /api/reviews — admin review moderation. (Per-product review endpoints live in
// routes/products.ts.)
import { Hono } from "hono";
import { getPrisma, sid } from "../lib/db";
import { protect, authorize } from "../middleware/auth";
import { logAudit } from "../lib/audit";
import type { AppEnv } from "../lib/env";

export const reviews = new Hono<AppEnv>();
reviews.use("*", protect, authorize("admin"));

reviews.get("/", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const revs = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  const userIds = [...new Set(revs.map((r) => r.userId))];
  const productIds = [...new Set(revs.map((r) => r.productId))];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstName: true, email: true },
  });
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, sku: true },
  });
  const umap = new Map(users.map((u) => [u.id, u]));
  const pmap = new Map(products.map((p) => [p.id, p]));
  const data = revs.map((r) => ({
    ...r,
    user: umap.get(r.userId) ?? r.userId,
    product: pmap.get(r.productId) ?? r.productId,
  }));
  return c.json({ status: "success", count: data.length, data: sid(data) });
});

reviews.put("/:id", async (c) => {
  const id = c.req.param("id");
  const { isApproved } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  let updated;
  try {
    updated = await prisma.review.update({ where: { id }, data: { isApproved } });
  } catch {
    return c.json({ status: "error", message: "Review not found" }, 404);
  }
  await logAudit(c, isApproved ? "Approved Review" : "Rejected Review", updated.id);

  if (isApproved) {
    const agg = await prisma.review.aggregate({
      where: { productId: updated.productId, isApproved: true },
      _avg: { rating: true },
      _count: true,
    });
    if (agg._count > 0) {
      await prisma.product.update({
        where: { id: updated.productId },
        data: { ratingsAverage: agg._avg.rating ?? 0, ratingsQuantity: agg._count },
      });
    }
  }
  return c.json({ status: "success", data: sid(updated) });
});
