import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import Order from "../models/Order";
import logger from "../utils/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  apiVersion: "2026-06-24.dahlia" as any,
});

// @desc    Create Stripe Payment Intent
// @route   POST /api/payments/stripe/create-intent
export const createStripeIntent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, currency = "inr", orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents/paise
      currency,
      metadata: { orderId },
    });

    res.status(200).json({ success: true, paymentIntent: { client_secret: paymentIntent.client_secret, id: paymentIntent.id } });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe Webhook Handler
// @route   POST /api/payments/stripe/webhook
export const stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;
  try {
    // Stripe requires the raw body for signature verification
    // Express must be configured to pass raw body for this route
    event = stripe.webhooks.constructEvent(
      req.body, // This needs to be raw buffer, we'll assume it's handled in index.ts
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || "whsec_mock"
    );
  } catch (err: any) {
    logger.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      if (paymentIntent.metadata.orderId) {
        await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, {
          paymentStatus: "completed",
          "paymentDetails.transactionId": paymentIntent.id,
        });
        logger.info(`Payment succeeded for order ${paymentIntent.metadata.orderId}`);
      }
      break;
    case "payment_intent.payment_failed":
      const failedIntent = event.data.object as Stripe.PaymentIntent;
      if (failedIntent.metadata.orderId) {
        await Order.findByIdAndUpdate(failedIntent.metadata.orderId, {
          paymentStatus: "failed",
        });
        logger.warn(`Payment failed for order ${failedIntent.metadata.orderId}`);
      }
      break;
    default:
      // Unhandled event type
      break;
  }

  res.status(200).json({ received: true });
};

// @desc    Verify Razorpay Payment (Mock)
// @route   POST /api/payments/razorpay/verify
export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // In production, you'd verify the signature:
    // const crypto = require('crypto');
    // const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    // hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    // const generated_signature = hmac.digest('hex');
    // if (generated_signature !== razorpay_signature) throw new Error('Invalid signature');

    res.status(200).json({
      success: true,
      verified: true,
      transactionId: razorpay_payment_id || `rzp_${Date.now()}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Capture PayPal Payment (Mock)
// @route   POST /api/payments/paypal/capture
export const capturePayPalPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    // In production, you'd use PayPal SDK:
    // const paypal = require('@paypal/checkout-server-sdk');
    // const request = new paypal.orders.OrdersCaptureRequest(orderId);
    // const capture = await client.execute(request);

    res.status(200).json({
      success: true,
      captured: true,
      transactionId: `paypal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
