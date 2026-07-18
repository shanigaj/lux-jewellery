import express from "express";
import { validateCoupon, validateGiftCard } from "../controllers/coupon.controller";
import { protect } from "../middleware/auth";

const router = express.Router();

router.use(protect);

router.post("/validate", validateCoupon);
router.post("/giftcards/validate", validateGiftCard);

export default router;
