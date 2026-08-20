import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "sparenza-jewels",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // Optimise on the way in: never store more than 2400px on the long edge
    // (jewellery photos are often 6–9 MB straight off a phone) and let
    // Cloudinary keep the best quality for that size.
    transformation: [{ width: 2400, height: 2400, crop: "limit", quality: "auto:good" }],
  } as any,
});

// Cap uploads at 10 MB each so a single request can't balloon storage/bandwidth.
export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
export default cloudinary;
