import { Router } from "express";
import { getAllReviews, updateReviewStatus } from "../controllers/review.controller";
import { protect, authorize } from "../middleware/auth";

const router = Router();

// Admin-only review moderation.
router.use(protect, authorize("admin"));
router.route("/").get(getAllReviews);
router.route("/:id").put(updateReviewStatus);

export default router;
