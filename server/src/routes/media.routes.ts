import { Router } from "express";
import { uploadImage, uploadMultipleImages } from "../controllers/media.controller";
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

export default router;
