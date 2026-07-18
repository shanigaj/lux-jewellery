import { Router } from "express";
import { uploadImage, uploadMultipleImages } from "../controllers/media.controller";
import { upload } from "../utils/cloudinary";

const router = Router();

// In a real app, protect these routes with auth and admin middleware
router.post("/upload", upload.single("image"), uploadImage);
router.post("/upload-multiple", upload.array("images", 10), uploadMultipleImages);

export default router;
