// Payments. Stripe runs on Workers via its fetch HTTP client; webhook signatures
// are verified with the async (WebCrypto) verifier. Razorpay/PayPal stay mocks.
import { Hono } from "hono";
import Stripe from "stripe";
import { getPrisma } from "../lib/db";
import { protect } from "../middleware/auth";
import type { AppEnv, Bindings } from "../lib/env";

export const payments = new Hono<AppEnv>();

function getStripe(env: Bindings): Stripe {
  return new Stripe(env.STRIPE_SECRET_KEY || "sk_test_mock", {
    httpClient: Stripe.createFetchHttpClient(),
  });
}

// POST /api/payments/stripe/webhook — PUBLIC (declared before `protect`).
payments.post("/stripe/webhook", async (c) => {
  const sig = c.req.header("stripe-signature") || "";
  const body = await c.req.text();
  const stripe = getStripe(c.env);

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      c.env.STRIPE_WEBHOOK_SECRET || "whsec_mock",
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch (err) {
    return c.text(`Webhook Error: ${(err as Error).message}`, 400);
  }

  if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const orderId = pi.metadata?.orderId;
    if (orderId && /^[a-f0-9]{24}$/i.test(orderId)) {
      const status = event.type === "payment_intent.succeeded" ? "completed" : "failed";
      const prisma = getPrisma(c.env.DATABASE_URL);
      await prisma.order
        .update({
          where: { id: orderId },
          data: {
            payment: { update: { status, ...(status === "completed" ? { transactionId: pi.id } : {}) } },
          },
        })
        .catch(() => {});
    }
  }
  return c.json({ received: true });
});

payments.use("*", protect);

payments.post("/stripe/create-intent", async (c) => {
  const { amount, currency = "inr", orderId } = await c.req.json();
  const stripe = getStripe(c.env);
  const pi = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata: { orderId },
  });
  return c.json({ success: true, paymentIntent: { client_secret: pi.client_secret, id: pi.id } });
});

payments.post("/razorpay/verify", async (c) => {
  const { razorpay_payment_id } = await c.req.json();
  return c.json({ success: true, verified: true, transactionId: razorpay_payment_id || `rzp_${Date.now()}` });
});

payments.post("/paypal/capture", async (c) => {
  return c.json({
    success: true,
    captured: true,
    transactionId: `paypal_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
  });
});
