// Sparenza & Co. API — Cloudflare Workers entrypoint (Hono + Prisma Accelerate).
// Replaces the Express server in ../server.
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import type { AppEnv } from "./lib/env";

import { metals } from "./routes/metals";
import { auth } from "./routes/auth";
import { products } from "./routes/products";
import { reviews } from "./routes/reviews";
import { audit } from "./routes/audit";
import { settings } from "./routes/settings";
import { appointments } from "./routes/appointments";
import { contact } from "./routes/contact";
import { blogs } from "./routes/blogs";
import { coupons } from "./routes/coupons";
import { orders } from "./routes/orders";
import { payments } from "./routes/payments";
import { media } from "./routes/media";

const app = new Hono<AppEnv>();

// Security headers on every response (helmet equivalent).
app.use("*", secureHeaders());

// CORS — CLIENT_URL may be a comma-separated list (prod, www, localhost).
app.use("/api/*", (c, next) => {
  const allowed = (c.env.CLIENT_URL || "http://localhost:3000")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return cors({
    origin: (origin) => {
      if (!origin) return origin;
      return allowed.includes(origin) ? origin : allowed[0];
    },
    credentials: true,
  })(c, next);
});

app.get("/api/health", (c) => c.json({ status: "ok", message: "Server is running" }));

// Routes
app.route("/api/metals", metals);
app.route("/api/auth", auth);
app.route("/api/products", products);
app.route("/api/reviews", reviews);
app.route("/api/audit-logs", audit);
app.route("/api/settings", settings);
app.route("/api/appointments", appointments);
app.route("/api/contact", contact);
app.route("/api/blogs", blogs);
app.route("/api/coupons", coupons);
app.route("/api/orders", orders);
app.route("/api/payments", payments);
app.route("/api/media", media);

app.onError((err, c) => {
  console.error(err);
  return c.json({ success: false, message: err.message || "Server error" }, 500);
});

app.notFound((c) => c.json({ success: false, message: "Not found" }, 404));

export default app;
