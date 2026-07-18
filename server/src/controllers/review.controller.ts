import { Request, Response, NextFunction } from "express";
import Review from "../models/Review";
import Product from "../models/Product";

/**
 * @desc    Get all reviews for a product
 * @route   GET /api/products/:productId/reviews
 * @access  Public
 */
export const getProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate("user", "firstName lastName")
      .sort("-createdAt");

    res.status(200).json({ status: "success", count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new review
 * @route   POST /api/products/:productId/reviews
 * @access  Private/User
 */
export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productId = req.params.productId;
    const userId = (req as any).user.id;

    // Check if user already submitted a review
    const alreadyReviewed = await Review.findOne({ product: productId, user: userId });
    if (alreadyReviewed) {
      res.status(400).json({ status: "error", message: "You have already reviewed this product" });
      return;
    }

    const review = await Review.create({
      product: productId as any,
      user: userId as any,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    // We don't update Product ratings immediately until review is approved by admin (optional)
    
    res.status(201).json({ status: "success", message: "Review submitted for moderation", data: review });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reviews (Admin moderation)
 * @route   GET /api/reviews
 * @access  Private/Admin
 */
export const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reviews = await Review.find()
      .populate("user", "firstName email")
      .populate("product", "name sku")
      .sort("-createdAt");
    res.status(200).json({ status: "success", count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update review status (Approve/Reject)
 * @route   PUT /api/reviews/:id
 * @access  Private/Admin
 */
export const updateReviewStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );

    if (!review) {
      res.status(404).json({ status: "error", message: "Review not found" });
      return;
    }

    // Recalculate average rating for the product if approved
    if (isApproved) {
      const stats = await Review.aggregate([
        { $match: { product: review.product, isApproved: true } },
        { $group: { _id: "$product", avgRating: { $avg: "$rating" }, numReviews: { $sum: 1 } } }
      ]);
      
      if (stats.length > 0) {
        await Product.findByIdAndUpdate(review.product, {
          ratingsAverage: stats[0].avgRating,
          ratingsQuantity: stats[0].numReviews
        });
      }
    }

    res.status(200).json({ status: "success", data: review });
  } catch (error) {
    next(error);
  }
};
