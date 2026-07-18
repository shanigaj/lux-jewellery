import express from "express";
import {
  createOrder,
  getOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller";
import { protect, authorize } from "../middleware/auth";

const router = express.Router();

// Protected routes
router.use(protect);

router.post("/", createOrder);
router.get("/myorders", getUserOrders);
router.get("/:id", getOrder);

// Admin only routes
router.use(authorize("admin"));
router.get("/", getAllOrders);
router.put("/:id/status", updateOrderStatus);

export default router;
