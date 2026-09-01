// Auth — Hono + Prisma Accelerate. Passwords use PBKDF2 (legacy bcrypt is
// verified and upgraded on login).
import { Hono } from "hono";
import type { Context } from "hono";
import { setCookie, deleteCookie, getCookie } from "hono/cookie";
import { getPrisma, sid } from "../lib/db";
import { signToken, verifyToken } from "../lib/jwt";
import { hashPassword, verifyPassword, needsRehash } from "../lib/password";
import { randomHex, sha256Hex } from "../lib/cryptoutil";
import { sendEmail } from "../lib/email";
import { protect, authorize } from "../middleware/auth";
import { addressRoutes } from "./address";
import type { AppEnv, Bindings } from "../lib/env";
import type { User } from "../generated/prisma";

export const auth = new Hono<AppEnv>();

function cookieOpts(env: Bindings, maxAge: number) {
  const isProd = env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "None" : "Lax") as "None" | "Lax",
    path: "/",
    maxAge,
  };
}

async function sendToken(c: Context<AppEnv>, user: User) {
  const token = await signToken(user.id, c.env.JWT_SECRET, "15m");
  const refresh = await signToken(user.id, c.env.JWT_REFRESH_SECRET, "7d");
  setCookie(c, "jwt", token, cookieOpts(c.env, 15 * 60));
  setCookie(c, "jwtRefresh", refresh, cookieOpts(c.env, 7 * 24 * 60 * 60));
  return c.json({
    success: true,
    user: {
      id: user.id,
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
}

const genOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

auth.post("/register", async (c) => {
  const { firstName, lastName, email, password } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  if (await prisma.user.findUnique({ where: { email } })) {
    return c.json({ success: false, message: "User already exists" }, 400);
  }
  const otp = genOtp();
  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: await hashPassword(password),
      otp,
      otpExpire: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
  return c.json(
    { success: true, message: "Registration successful. Please verify OTP.", mockOtp: otp },
    201
  );
});

auth.post("/verify-otp", async (c) => {
  const { email, otp } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  const user = await prisma.user.findFirst({ where: { email, otp, otpExpire: { gt: new Date() } } });
  if (!user) return c.json({ success: false, message: "Invalid or expired OTP" }, 400);
  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, otp: null, otpExpire: null },
  });
  user.isVerified = true;
  return sendToken(c, user);
});

auth.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) {
    return c.json({ success: false, message: "Please provide an email and password" }, 400);
  }
  const prisma = getPrisma(c.env.DATABASE_URL);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) return c.json({ success: false, message: "Invalid credentials" }, 401);
  if (!(await verifyPassword(password, user.password))) {
    return c.json({ success: false, message: "Invalid credentials" }, 401);
  }
  if (needsRehash(user.password)) {
    await prisma.user.update({ where: { id: user.id }, data: { password: await hashPassword(password) } });
  }
  if (!user.isVerified) {
    const otp = genOtp();
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpire: new Date(Date.now() + 10 * 60 * 1000) },
    });
    return c.json(
      { success: false, message: "Please verify your email", needsVerification: true, mockOtp: otp },
      403
    );
  }
  return sendToken(c, user);
});

auth.post("/refresh", async (c) => {
  const rt = getCookie(c, "jwtRefresh");
  if (!rt) return c.json({ success: false, message: "No refresh token provided" }, 401);
  try {
    const { id } = await verifyToken(rt, c.env.JWT_REFRESH_SECRET);
    const prisma = getPrisma(c.env.DATABASE_URL);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return c.json({ success: false, message: "User not found" }, 401);
    return sendToken(c, user);
  } catch {
    return c.json({ success: false, message: "Invalid refresh token" }, 401);
  }
});

auth.post("/logout", (c) => {
  const opts = cookieOpts(c.env, 0);
  deleteCookie(c, "jwt", opts);
  deleteCookie(c, "jwtRefresh", opts);
  return c.json({ success: true, message: "Logged out successfully" });
});

auth.post("/forgot-password", async (c) => {
  const { email } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return c.json({ success: true, message: "If an account exists, a reset email will be sent." });
  }
  const resetToken = randomHex(20);
  const hashed = await sha256Hex(resetToken);
  await prisma.user.update({
    where: { id: user.id },
    data: { resetPasswordToken: hashed, resetPasswordExpire: new Date(Date.now() + 10 * 60 * 1000) },
  });
  const clientUrl = (c.env.CLIENT_URL || "http://localhost:3000").split(",")[0].trim();
  const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;
  try {
    await sendEmail(c.env, {
      to: user.email,
      subject: "Reset your Sparenza & Co. password",
      html: `
          <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto">
            <h2 style="color:#111">Reset your password</h2>
            <p>We received a request to reset your Sparenza &amp; Co. password. This link is valid for 10 minutes.</p>
            <p style="margin:28px 0">
              <a href="${resetUrl}" style="background:#111;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none">Reset password</a>
            </p>
            <p style="color:#666;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
          </div>`,
    });
  } catch {
    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: null, resetPasswordExpire: null },
    });
    return c.json({ success: false, message: "Could not send reset email. Please try again." }, 500);
  }
  return c.json({ success: true, message: "If an account exists, a reset email has been sent." });
});

auth.post("/reset-password", async (c) => {
  const { token, password } = await c.req.json().catch(() => ({}) as any);
  if (!token || !password || String(password).length < 6) {
    return c.json(
      { success: false, message: "A valid token and a password (min 6 chars) are required." },
      400
    );
  }
  const hashed = await sha256Hex(token);
  const prisma = getPrisma(c.env.DATABASE_URL);
  const user = await prisma.user.findFirst({
    where: { resetPasswordToken: hashed, resetPasswordExpire: { gt: new Date() } },
  });
  if (!user) return c.json({ success: false, message: "This reset link is invalid or has expired." }, 400);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(password), resetPasswordToken: null, resetPasswordExpire: null },
  });
  return c.json({ success: true, message: "Password reset. You can now sign in." });
});

auth.get("/me", protect, (c) => {
  const u = c.get("user")!;
  return c.json({
    success: true,
    data: {
      _id: u.id,
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone,
      role: u.role,
      tier: u.tier,
      isVerified: u.isVerified,
      createdAt: u.createdAt,
    },
  });
});

auth.put("/me", protect, async (c) => {
  const u = c.get("user")!;
  const { firstName, lastName, phone } = await c.req.json();
  const data: Record<string, unknown> = {};
  if (firstName !== undefined) data.firstName = firstName;
  if (lastName !== undefined) data.lastName = lastName;
  if (phone !== undefined) data.phone = phone;
  const prisma = getPrisma(c.env.DATABASE_URL);
  const fresh = await prisma.user.update({ where: { id: u.id }, data });
  return c.json({
    success: true,
    data: {
      _id: fresh.id,
      id: fresh.id,
      firstName: fresh.firstName,
      lastName: fresh.lastName,
      email: fresh.email,
      phone: fresh.phone,
      role: fresh.role,
      tier: fresh.tier,
    },
  });
});

auth.route("/addresses", addressRoutes);

auth.get("/users", protect, authorize("admin"), async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, firstName: true, lastName: true, email: true,
      role: true, tier: true, isVerified: true, createdAt: true,
    },
  });
  return c.json({ success: true, count: users.length, data: sid(users) });
});

auth.put("/users/:id/role", protect, authorize("admin"), async (c) => {
  const { role } = await c.req.json();
  const allowed = ["user", "admin", "manager", "support"];
  if (!role || !allowed.includes(role)) {
    return c.json({ success: false, message: "Invalid role" }, 400);
  }
  const id = c.req.param("id");
  const u = c.get("user")!;
  if (u.id === id && role !== "admin") {
    return c.json({ success: false, message: "You cannot change your own admin role" }, 400);
  }
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true, firstName: true, lastName: true, email: true,
        role: true, tier: true, isVerified: true, createdAt: true,
      },
    });
    return c.json({ success: true, data: sid(updated) });
  } catch {
    return c.json({ success: false, message: "User not found" }, 404);
  }
});
