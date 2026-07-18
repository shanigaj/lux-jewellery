import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { getProductReviews, createReview } from "../controllers/review.controller";

const router = Router();

// Product routes
router.route("/").get(getProducts).post(createProduct);
router.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct);

// Nested review routes
router.route("/:productId/reviews").get(getProductReviews).post(createReview);

export default router;
