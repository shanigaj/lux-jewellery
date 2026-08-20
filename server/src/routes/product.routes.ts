import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { getProductReviews, createReview } from "../controllers/review.controller";
import { protect, authorize } from "../middleware/auth";

const router = Router();

// Product routes — reads are public; writes are admin-only.
router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("admin"), createProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, authorize("admin"), updateProduct)
  .delete(protect, authorize("admin"), deleteProduct);

// Nested review routes — anyone can read; only signed-in users may post.
router
  .route("/:productId/reviews")
  .get(getProductReviews)
  .post(protect, createReview);

export default router;
