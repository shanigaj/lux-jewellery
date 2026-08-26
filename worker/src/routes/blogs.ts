// Blogs — reads public, writes admin.
import { Hono } from "hono";
import { getPrisma, sid } from "../lib/db";
import { protect, authorize } from "../middleware/auth";
import { logAudit } from "../lib/audit";
import type { AppEnv } from "../lib/env";
import type { BlogStatus } from "../generated/prisma";

export const blogs = new Hono<AppEnv>();

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const FIELDS = ["title", "slug", "excerpt", "content", "coverImage", "author", "status", "tags"] as const;

blogs.get("/", async (c) => {
  const status = c.req.query("status");
  const prisma = getPrisma(c.env.DATABASE_URL);
  const list = await prisma.blog.findMany({
    where: status ? { status: status as BlogStatus } : {},
    orderBy: { createdAt: "desc" },
  });
  return c.json({ success: true, count: list.length, data: sid(list) });
});

blogs.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const blog = await prisma.blog.update({ where: { slug }, data: { views: { increment: 1 } } });
    return c.json({ success: true, data: sid(blog) });
  } catch {
    return c.json({ success: false, message: "Blog not found" }, 404);
  }
});

blogs.post("/", protect, authorize("admin"), async (c) => {
  const body = await c.req.json();
  const slug = body.slug ? slugify(body.slug) : slugify(body.title || "");
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage,
        author: body.author,
        status: body.status,
        tags: body.tags,
      },
    });
    await logAudit(c, "Created Blog", blog.title);
    return c.json({ success: true, data: sid(blog) }, 201);
  } catch (e) {
    return c.json({ success: false, message: (e as Error).message }, 400);
  }
});

blogs.put("/:id", protect, authorize("admin"), async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const data: Record<string, unknown> = {};
  for (const f of FIELDS) if (body[f] !== undefined) data[f] = body[f];
  if (data.title && !data.slug) data.slug = slugify(String(data.title));
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const blog = await prisma.blog.update({ where: { id }, data });
    return c.json({ success: true, data: sid(blog) });
  } catch {
    return c.json({ success: false, message: "Blog not found" }, 404);
  }
});

blogs.delete("/:id", protect, authorize("admin"), async (c) => {
  const id = c.req.param("id");
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const blog = await prisma.blog.delete({ where: { id } });
    await logAudit(c, "Deleted Blog", blog.title);
    return c.json({ success: true, message: "Blog deleted" });
  } catch {
    return c.json({ success: false, message: "Blog not found" }, 404);
  }
});
