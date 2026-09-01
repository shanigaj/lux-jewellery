// Orders. All routes require auth; listing all + status updates require admin.
import { Hono } from "hono";
import { getPrisma, sid } from "../lib/db";
import { protect, authorize } from "../middleware/auth";
import type { AppEnv } from "../lib/env";
import { Prisma } from "../generated/prisma";

export const orders = new Hono<AppEnv>();
orders.use("*", protect);

// POST /api/orders
orders.post("/", async (c) => {
  const body = await c.req.json();
  const u = c.get("user")!;
  const now = new Date();
  const orderNumber = `LUX-${Date.now().toString(36).toUpperCase()}`;

  const items = (body.items || []).map((it: any) => ({
    product: it.product && /^[a-f0-9]{24}$/i.test(String(it.product)) ? String(it.product) : undefined,
    name: it.name,
    thumbnail: it.thumbnail,
    sku: it.sku,
    metalType: it.metalType,
    metalPurity: it.metalPurity,
    size: it.size,
    quantity: it.quantity,
    unitPrice: it.unitPrice,
    totalPrice: it.totalPrice,
  }));

  const sa = body.shippingAddress;
  const prisma = getPrisma(c.env.DATABASE_URL);
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: u.id,
      items,
      shippingAddress: sa
        ? {
            firstName: sa.firstName,
            lastName: sa.lastName,
            email: sa.email,
            phone: sa.phone,
            addressLine1: sa.addressLine1,
            addressLine2: sa.addressLine2,
            city: sa.city,
            state: sa.state,
            postalCode: sa.postalCode,
            country: sa.country,
          }
        : undefined,
      payment: {
        method: body.paymentMethod,
        transactionId: body.transactionId,
        status: "completed",
        amount: body.totalAmount,
        currency: "INR",
        paidAt: now,
      },
      subtotal: body.subtotal,
      shippingCost: body.shippingCost ?? 0,
      taxAmount: body.taxAmount,
      taxRate: body.taxRate ?? 0.18,
      couponDiscount: body.couponDiscount ?? 0,
      giftCardAmount: body.giftCardAmount ?? 0,
      totalAmount: body.totalAmount,
      couponCode: body.couponCode,
      giftCardCode: body.giftCardCode,
      status: "confirmed",
      timeline: [
        {
          status: "confirmed",
          title: "Order Confirmed",
          description: "Your order has been placed successfully",
          timestamp: now,
          isCompleted: true,
        },
      ],
      customerNote: body.customerNote,
      emailSent: true,
      smsSent: true,
    },
  });
  console.log(`Order ${orderNumber} confirmed for ${sa?.email ?? "—"}`);
  return c.json({ success: true, order: sid(order) }, 201);
});

// GET /api/orders/myorders
orders.get("/myorders", async (c) => {
  const u = c.get("user")!;
  const prisma = getPrisma(c.env.DATABASE_URL);
  const list = await prisma.order.findMany({ where: { userId: u.id }, orderBy: { createdAt: "desc" } });
  return c.json({ success: true, orders: sid(list) });
});

// GET /api/orders (admin)
orders.get("/", authorize("admin"), async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const list = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  const users = await prisma.user.findMany({
    where: { id: { in: [...new Set(list.map((o) => o.userId))] } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const umap = new Map(users.map((u) => [u.id, u]));
  const data = list.map((o) => ({ ...o, user: umap.get(o.userId) ?? o.userId }));
  return c.json({ success: true, orders: sid(data) });
});

// GET /api/orders/:id — by _id or orderNumber (any signed-in user, as before).
orders.get("/:id", async (c) => {
  const id = c.req.param("id");
  const or: Prisma.OrderWhereInput[] = [{ orderNumber: id }];
  if (/^[a-f0-9]{24}$/i.test(id)) or.push({ id });
  const prisma = getPrisma(c.env.DATABASE_URL);
  const order = await prisma.order.findFirst({ where: { OR: or } });
  if (!order) return c.json({ success: false, message: "Order not found" }, 404);
  return c.json({ success: true, order: sid(order) });
});

// PUT /api/orders/:id/status (admin)
orders.put("/:id/status", authorize("admin"), async (c) => {
  const id = c.req.param("id");
  const { status, trackingNumber } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  const order = await prisma.order.findUnique({ where: { id } }).catch(() => null);
  if (!order) return c.json({ success: false, message: "Order not found" }, 404);

  const now = new Date();
  const titles: Record<string, string> = {
    processing: "Processing",
    shipped: "Shipped",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  const timeline = (order.timeline || []).map((s) => ({ ...s, isCompleted: true }));
  timeline.push({
    status,
    title: titles[status] || status,
    description: `Order status updated to ${status}`,
    timestamp: now,
    isCompleted: true,
  });

  const data: Record<string, unknown> = { status, timeline };
  if (trackingNumber) data.trackingNumber = trackingNumber;
  if (status === "delivered") data.deliveredAt = now;
  if (status === "shipped") console.log(`Shipping notification for order ${order.orderNumber}`);

  const updated = await prisma.order.update({ where: { id }, data });
  return c.json({ success: true, order: sid(updated) });
});
