// Media uploads (admin) — ports server/src/controllers/media.controller.ts.
// Parses multipart/form-data natively and pushes to Cloudinary via signed REST.
import { Hono } from "hono";
import { protect, authorize } from "../middleware/auth";
import { cloudinaryUpload, cloudinaryEnhance, openaiStudioShot } from "../lib/cloudinary";
import type { AppEnv } from "../lib/env";

export const media = new Hono<AppEnv>();

const PRODUCT_TRANSFORM = "c_limit,h_2400,q_auto:good,w_2400";
const MAX_BYTES = 10 * 1024 * 1024;

// Workers-types type FormData entries as string, so detect an uploaded file by
// its Blob shape rather than `instanceof File`.
function isUploadFile(v: unknown): v is File {
  return (
    typeof v === "object" &&
    v !== null &&
    typeof (v as File).arrayBuffer === "function" &&
    typeof (v as File).size === "number"
  );
}

// POST /api/media/upload
media.post("/upload", protect, authorize("admin"), async (c) => {
  const form = await c.req.formData();
  const file = form.get("image");
  if (!isUploadFile(file)) {
    return c.json({ status: "error", message: "No image file provided" }, 400);
  }
  if (file.size > MAX_BYTES) {
    return c.json({ status: "error", message: "Image exceeds the 10 MB limit" }, 400);
  }
  const { url, publicId } = await cloudinaryUpload(c.env, file, {
    folder: "sparenza-jewels",
    transformation: PRODUCT_TRANSFORM,
  });
  return c.json({ status: "success", data: { url, filename: publicId } });
});

// POST /api/media/upload-multiple
media.post("/upload-multiple", protect, authorize("admin"), async (c) => {
  const form = await c.req.formData();
  const files = (form.getAll("images") as unknown[]).filter(isUploadFile);
  if (!files.length) {
    return c.json({ status: "error", message: "No image files provided" }, 400);
  }
  const urls: { url: string; filename: string }[] = [];
  for (const file of files.slice(0, 10)) {
    if (file.size > MAX_BYTES) continue;
    const { url, publicId } = await cloudinaryUpload(c.env, file, {
      folder: "sparenza-jewels",
      transformation: PRODUCT_TRANSFORM,
    });
    urls.push({ url, filename: publicId });
  }
  return c.json({ status: "success", data: urls });
});

// POST /api/media/enhance — "enhance" (Cloudinary) or "studio" (gpt-image-1).
media.post("/enhance", protect, authorize("admin"), async (c) => {
  const { imageUrl, mode } = await c.req.json();
  if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) {
    return c.json({ status: "error", message: "A valid imageUrl is required" }, 400);
  }
  try {
    const url =
      mode === "studio"
        ? await openaiStudioShot(c.env, imageUrl)
        : await cloudinaryEnhance(c.env, imageUrl);
    return c.json({ status: "success", data: { url } });
  } catch (e) {
    return c.json({ status: "error", message: (e as Error)?.message || "Image enhancement failed" }, 502);
  }
});
