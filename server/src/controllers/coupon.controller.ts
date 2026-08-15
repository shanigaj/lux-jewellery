import { Request, Response } from "express";
import Coupon from "../models/Coupon";
import GiftCard from "../models/GiftCard";
import { logAudit } from "./audit.controller";

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, orderAmount } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!coupon) {
      return res.status(400).json({ success: false, message: "Invalid or expired coupon" });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ₹${coupon.minOrderAmount}`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    res.status(200).json({ success: true, coupon, discount });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Validate gift card code
// @route   POST /api/giftcards/validate
export const validateGiftCard = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    const giftCard = await GiftCard.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!giftCard) {
      return res.status(400).json({ success: false, message: "Invalid or expired gift card" });
    }

    if (giftCard.balance <= 0) {
      return res.status(400).json({ success: false, message: "Gift card has no remaining balance" });
    }

    res.status(200).json({ success: true, giftCard });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// ── Admin CRUD ──────────────────────────────────────────────

// @desc    List all coupons
// @route   GET /api/coupons
// @access  Admin
export const getCoupons = async (_req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Admin
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.create(req.body);
    logAudit(req, "Created Coupon", coupon.code);
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Admin
export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) {
      res.status(404).json({ success: false, message: "Coupon not found" });
      return;
    }
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      res.status(404).json({ success: false, message: "Coupon not found" });
      return;
    }
    logAudit(req, "Deleted Coupon", coupon.code);
    res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
