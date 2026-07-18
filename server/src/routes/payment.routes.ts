import express from "express";
import {
  createStripeIntent,
  verifyRazorpayPayment,
  capturePayPalPayment,
  stripeWebhook,
} from "../controllers/payment.controller";
import { protect } from "../middleware/auth";

const router = express.Router();

router.use(protect);

router.post("/stripe/create-intent", createStripeIntent);
router.post("/razorpay/verify", verifyRazorpayPayment);
router.post("/paypal/capture", capturePayPalPayment);

export default router;
