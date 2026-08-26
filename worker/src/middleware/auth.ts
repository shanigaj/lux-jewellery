// Auth middleware (Hono) — JWT in an httpOnly `jwt` cookie; the signed-in user
// is loaded from Mongo (via Prisma Accelerate) onto the context as `user`.
import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { getPrisma } from "../lib/db";
import { verifyToken } from "../lib/jwt";
import type { AppEnv } from "../lib/env";
import type { Role } from "../generated/prisma";

export const optionalAuth = createMiddleware<AppEnv>(async (c, next) => {
  const token = getCookie(c, "jwt");
  if (token) {
    try {
      const { id } = await verifyToken(token, c.env.JWT_SECRET);
      const prisma = getPrisma(c.env.DATABASE_URL);
      const user = await prisma.user.findUnique({ where: { id } });
      if (user) c.set("user", user);
    } catch {
      // ignore — proceed as guest
    }
  }
  await next();
});

export const protect = createMiddleware<AppEnv>(async (c, next) => {
  const token = getCookie(c, "jwt");
  if (!token) {
    return c.json({ success: false, message: "Not authorized to access this route" }, 401);
  }
  try {
    const { id } = await verifyToken(token, c.env.JWT_SECRET);
    const prisma = getPrisma(c.env.DATABASE_URL);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return c.json({ success: false, message: "User no longer exists" }, 401);
    }
    c.set("user", user);
    await next();
  } catch {
    return c.json({ success: false, message: "Not authorized, token failed" }, 401);
  }
});

export const authorize = (...roles: Role[]) =>
  createMiddleware<AppEnv>(async (c, next) => {
    const user = c.get("user");
    if (!user || !roles.includes(user.role)) {
      return c.json(
        { success: false, message: `User role ${user?.role} is not authorized to access this route` },
        403
      );
    }
    await next();
  });
