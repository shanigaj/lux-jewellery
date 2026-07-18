import { Router } from "express";
import { getAllReviews, updateReviewStatus } from "../controllers/review.controller";

const router = Router();

// Admin routes for moderation
router.route("/").get(getAllReviews);
router.route("/:id").put(updateReviewStatus);

export default router;
