import { Request, Response } from "express";
import Order from "../models/Order";
import { sendOrderConfirmationEmail, sendShippingEmail } from "../utils/email";
import { sendOrderSMS } from "../utils/sms";

// @desc    Create new order
// @route   POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      transactionId,
      subtotal,
      shippingCost,
      taxAmount,
      taxRate,
      couponDiscount,
      giftCardAmount,
      totalAmount,
      couponCode,
      giftCardCode,
      customerNote,
    } = req.body;

    const orderNumber = `LUX-${Date.now().toString(36).toUpperCase()}`;

    const order = await Order.create({
      orderNumber,
      user: (req as any).user.id,
      items,
      shippingAddress,
      payment: {
        method: paymentMethod,
        transactionId,
        status: "completed",
        amount: totalAmount,
        currency: "INR",
        paidAt: new Date(),
      },
      subtotal,
      shippingCost,
      taxAmount,
      taxRate,
      couponDiscount,
      giftCardAmount,
      totalAmount,
      couponCode,
      giftCardCode,
      status: "confirmed",
      timeline: [
        {
          status: "confirmed",
          title: "Order Confirmed",
          description: "Your order has been placed successfully",
          timestamp: new Date(),
          isCompleted: true,
        },
      ],
      customerNote,
    });

    // Send notifications
    try {
      await sendOrderConfirmationEmail(shippingAddress.email, order);
      order.emailSent = true;
    } catch (e) {
      console.error("Email failed:", e);
    }

    try {
      await sendOrderSMS(shippingAddress.phone, orderNumber);
      order.smsSent = true;
    } catch (e) {
      console.error("SMS failed:", e);
    }

    await order.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({
      $or: [
        { _id: req.params.id },
        { orderNumber: req.params.id },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/myorders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: (req as any).user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    // Add to timeline
    const statusTitles: Record<string, string> = {
      processing: "Processing",
      shipped: "Shipped",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };

    order.timeline.push({
      status,
      title: statusTitles[status] || status,
      description: `Order status updated to ${status}`,
      timestamp: new Date(),
      isCompleted: true,
    });

    // Mark previous timeline steps as completed
    order.timeline.forEach((step: any) => {
      step.isCompleted = true;
    });

    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    // Send shipping notification
    if (status === "shipped") {
      try {
        await sendShippingEmail(order.shippingAddress.email, order);
      } catch (e) {
        console.error("Shipping email failed:", e);
      }
    }

    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
