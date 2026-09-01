// Products (+ nested product reviews). Reads public; writes admin-only.
// The product list is cached in KV, invalidated by bumping a version stamp.
import { Hono } from "hono";
import { getPrisma, sid } from "../lib/db";
import { protect, authorize } from "../middleware/auth";
import type { AppEnv } from "../lib/env";
import { Prisma, type Category, type MetalType } from "../generated/prisma";

export const products = new Hono<AppEnv>();

async function bumpProductCache(kv: KVNamespace) {
  await kv.put("products:v", String(Date.now()));
}

const WRITABLE = [
  "name", "sku", "description", "price", "discountPrice", "category", "subcategory",
  "metalType", "metalPurity", "gemstone", "weight", "diamondCarat", "dimensions",
  "images", "videos", "stock", "isFeatured",
] as const;

// GET /api/products — list with filter/search/sort/pagination (public, cached).
products.get("/", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const kv = c.env.CACHE;

  const ver = (await kv.get("products:v")) || "0";
  const cacheKey = `products:${ver}:${new URL(c.req.url).search}`.slice(0, 500);
  const cached = await kv.get(cacheKey, "json");
  if (cached) return c.json(cached);

  const page = Number(c.req.query("page") || 1);
  const limit = Number(c.req.query("limit") || 12);
  const search = c.req.query("search");
  const category = c.req.query("category");
  const subcategory = c.req.query("subcategory");
  const metalTypes = c.req.queries("metalType");
  const minPrice = c.req.query("minPrice");
  const maxPrice = c.req.query("maxPrice");
  const sort = c.req.query("sort");
  const fields = c.req.query("fields");

  const where: Prisma.ProductWhereInput = {};
  if (category) {
    if (category === "diamonds") {
      where.OR = [
        { gemstone: { contains: "diamond", mode: "insensitive" } },
        { name: { contains: "diamond", mode: "insensitive" } },
      ];
    } else {
      where.category = category as Category;
    }
  }
  if (subcategory) where.subcategory = subcategory;
  if (metalTypes && metalTypes.length) where.metalType = { in: metalTypes as MetalType[] };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };

  let select: Prisma.ProductSelect | undefined;
  if (fields) {
    select = { id: true };
    for (const f of fields.split(",").map((s) => s.trim()).filter(Boolean)) {
      (select as Record<string, boolean>)[f] = true;
    }
  }

  const skip = (page - 1) * limit;
  const list = await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take: limit,
    ...(select ? { select } : {}),
  });
  const total = await prisma.product.count({ where });

  const responseData = {
    status: "success",
    count: list.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: sid(list),
  };
  c.executionCtx.waitUntil(kv.put(cacheKey, JSON.stringify(responseData), { expirationTtl: 600 }));
  return c.json(responseData);
});

// POST /api/products (admin)
products.post("/", protect, authorize("admin"), async (c) => {
  const body = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const created = await prisma.product.create({
      data: {
        name: body.name,
        sku: String(body.sku || "").toUpperCase(),
        description: body.description,
        price: body.price,
        discountPrice: body.discountPrice,
        category: body.category,
        subcategory: body.subcategory,
        metalType: body.metalType,
        metalPurity: body.metalPurity,
        gemstone: body.gemstone,
        weight: body.weight,
        diamondCarat: body.diamondCarat,
        dimensions: body.dimensions,
        images: body.images,
        videos: body.videos,
        stock: body.stock,
        isFeatured: body.isFeatured,
      },
    });
    await bumpProductCache(c.env.CACHE);
    return c.json({ status: "success", data: sid(created) }, 201);
  } catch (e) {
    return c.json({ status: "error", message: (e as Error).message }, 400);
  }
});

// GET /api/products/:productId/reviews (public)
products.get("/:productId/reviews", async (c) => {
  const productId = c.req.param("productId");
  const prisma = getPrisma(c.env.DATABASE_URL);
  let revs;
  try {
    revs = await prisma.review.findMany({
      where: { productId, isApproved: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return c.json({ status: "success", count: 0, data: [] });
  }
  const users = await prisma.user.findMany({
    where: { id: { in: [...new Set(revs.map((r) => r.userId))] } },
    select: { id: true, firstName: true, lastName: true },
  });
  const umap = new Map(users.map((u) => [u.id, u]));
  const data = revs.map((r) => ({ ...r, user: umap.get(r.userId) ?? r.userId }));
  return c.json({ status: "success", count: data.length, data: sid(data) });
});

// POST /api/products/:productId/reviews (signed-in users)
products.post("/:productId/reviews", protect, async (c) => {
  const productId = c.req.param("productId");
  const userId = c.get("user")!.id;
  const { rating, comment } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const already = await prisma.review.findFirst({ where: { productId, userId } });
    if (already) {
      return c.json({ status: "error", message: "You have already reviewed this product" }, 400);
    }
    const review = await prisma.review.create({ data: { productId, userId, rating, comment } });
    return c.json(
      { status: "success", message: "Review submitted for moderation", data: sid(review) },
      201
    );
  } catch (e) {
    return c.json({ status: "error", message: (e as Error).message }, 400);
  }
});

// GET /api/products/:id (public)
products.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = getPrisma(c.env.DATABASE_URL);
  const product = await prisma.product.findUnique({ where: { id } }).catch(() => null);
  if (!product) return c.json({ status: "error", message: "Product not found" }, 404);
  return c.json({ status: "success", data: sid(product) });
});

// PUT /api/products/:id (admin)
products.put("/:id", protect, authorize("admin"), async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const data: Record<string, unknown> = {};
  for (const f of WRITABLE) if (body[f] !== undefined) data[f] = body[f];
  if (data.sku) data.sku = String(data.sku).toUpperCase();
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const updated = await prisma.product.update({ where: { id }, data });
    await bumpProductCache(c.env.CACHE);
    return c.json({ status: "success", data: sid(updated) });
  } catch {
    return c.json({ status: "error", message: "Product not found" }, 404);
  }
});

// DELETE /api/products/:id (admin)
products.delete("/:id", protect, authorize("admin"), async (c) => {
  const id = c.req.param("id");
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    await prisma.product.delete({ where: { id } });
    await bumpProductCache(c.env.CACHE);
    return c.json({ status: "success", message: "Product deleted" });
  } catch {
    return c.json({ status: "error", message: "Product not found" }, 404);
  }
});
