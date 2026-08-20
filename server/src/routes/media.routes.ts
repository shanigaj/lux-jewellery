import { Router } from "express";
import { uploadImage, uploadMultipleImages, enhanceImage } from "../controllers/media.controller";
import { upload } from "../utils/cloudinary";
import { protect, authorize } from "../middleware/auth";

const router = Router();

// Admin-only — an open upload endpoint lets anyone dump files into (and run up
// the bill on) our Cloudinary account.
router.post("/upload", protect, authorize("admin"), upload.single("image"), uploadImage);
router.post(
  "/upload-multiple",
  protect,
  authorize("admin"),
  upload.array("images", 10),
  uploadMultipleImages
);

// AI / Cloudinary enhancement of an already-uploaded image (admin only).
router.post("/enhance", protect, authorize("admin"), enhanceImage);

export default router;
