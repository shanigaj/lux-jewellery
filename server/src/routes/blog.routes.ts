import { Router } from "express";
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller";
import { protect, authorize } from "../middleware/auth";

const router = Router();

// Public storefront reads
router.get("/", getBlogs);
router.get("/:slug", getBlog);

// Admin management
router.post("/", protect, authorize("admin"), createBlog);
router.put("/:id", protect, authorize("admin"), updateBlog);
router.delete("/:id", protect, authorize("admin"), deleteBlog);

export default router;
