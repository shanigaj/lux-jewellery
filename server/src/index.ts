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
import morganMiddleware from "./middleware/morgan.middleware";
import { errorHandler } from "./middleware/error.middleware";
import logger from "./utils/logger";

dotenv.config({ path: [".env.local", ".env"] });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS first — so even rate-limited (429) and other error responses carry the
// Access-Control-Allow-Origin header. Otherwise the browser reports a
// misleading CORS error stacked on top of the real status.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3002",
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
