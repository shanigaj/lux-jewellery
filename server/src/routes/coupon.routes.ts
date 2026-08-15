import express from "express";
import {
  validateCoupon,
  validateGiftCard,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupon.controller";
import { protect, authorize } from "../middleware/auth";

const router = express.Router();

router.use(protect);

// Storefront
router.post("/validate", validateCoupon);
router.post("/giftcards/validate", validateGiftCard);

// Admin CRUD
router.route("/").get(authorize("admin"), getCoupons).post(authorize("admin"), createCoupon);
router
  .route("/:id")
  .put(authorize("admin"), updateCoupon)
  .delete(authorize("admin"), deleteCoupon);

export default router;
