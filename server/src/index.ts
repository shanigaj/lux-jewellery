import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import couponRoutes from "./routes/coupon.routes";
import productRoutes from "./routes/product.routes";
import mediaRoutes from "./routes/media.routes";
import reviewRoutes from "./routes/review.routes";
import blogRoutes from "./routes/blog.routes";
import auditRoutes from "./routes/audit.routes";
import metalsRoutes from "./routes/metals.routes";
import settingsRoutes from "./routes/settings.routes";
import appointmentRoutes from "./routes/appointment.routes";
import contactRoutes from "./routes/contact.routes";
import morganMiddleware from "./middleware/morgan.middleware";
import { errorHandler } from "./middleware/error.middleware";
import logger from "./utils/logger";

dotenv.config({ path: [".env.local", ".env"] });

const app = express();
const PORT = process.env.PORT || 5000;

// Render (and most hosts) put a reverse proxy in front of us, so the real client
// IP arrives in X-Forwarded-For. Trust exactly one proxy hop so express-rate-limit
// keys off the actual visitor's IP — otherwise every request looks like it comes
// from the proxy's single IP and the whole site shares one rate-limit bucket
// (one burst then 429s for everyone). "1" (not `true`) also avoids the spoofable
// trust-all mode express-rate-limit warns about.
app.set("trust proxy", 1);

// CORS first — so even rate-limited (429) and other error responses carry the
// Access-Control-Allow-Origin header. Otherwise the browser reports a
// misleading CORS error stacked on top of the real status.
// CLIENT_URL may be a comma-separated list (prod domain, www, Vercel, localhost).
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin/non-browser requests (no Origin header) and any listed origin.
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

// Security Middlewares
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Stripe Webhook MUST be before express.json()
import { stripeWebhook } from "./controllers/payment.controller";
app.post("/api/payments/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// Standard Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morganMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/metals", metalsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/contact", contactRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

startServer();
