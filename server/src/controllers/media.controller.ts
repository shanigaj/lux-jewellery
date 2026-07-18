import { Request, Response, NextFunction } from "express";

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
