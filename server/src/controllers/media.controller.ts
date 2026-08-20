import { Request, Response, NextFunction } from "express";
import { cloudinaryEnhance, openaiStudioShot } from "../utils/imageEnhance";

/**
 * @desc    Upload image to Cloudinary
 * @route   POST /api/media/upload
 * @access  Private/Admin
 */
export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ status: "error", message: "No image file provided" });
      return;
    }

    // req.file is populated by multer-storage-cloudinary
    res.status(200).json({
      status: "success",
      data: {
        url: req.file.path,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload multiple images to Cloudinary
 * @route   POST /api/media/upload-multiple
 * @access  Private/Admin
 */
export const uploadMultipleImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      res.status(400).json({ status: "error", message: "No image files provided" });
      return;
    }

    const files = req.files as Express.Multer.File[];
    const urls = files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    res.status(200).json({
      status: "success",
      data: urls,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Enhance an existing (Cloudinary) image
 * @route   POST /api/media/enhance
 * @access  Private/Admin
 * body: { imageUrl: string, mode: "enhance" | "studio" }
 *   - "enhance": fast Cloudinary auto-improve + sharpen (no AI credits)
 *   - "studio":  gpt-image-1 turns the snap into a studio product shot
 */
export const enhanceImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { imageUrl, mode } = req.body as { imageUrl?: string; mode?: string };

    if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) {
      res.status(400).json({ status: "error", message: "A valid imageUrl is required" });
      return;
    }

    const url =
      mode === "studio"
        ? await openaiStudioShot(imageUrl)
        : await cloudinaryEnhance(imageUrl);

    res.status(200).json({ status: "success", data: { url } });
  } catch (error: any) {
    // Surface a clean, actionable message (e.g. missing OpenAI key / AI failure)
    // instead of a 500 stack the admin can't act on.
    res.status(502).json({
      status: "error",
      message: error?.message || "Image enhancement failed",
    });
  }
};
