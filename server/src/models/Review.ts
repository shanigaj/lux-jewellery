import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  isApproved: boolean;
}

const ReviewSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: [500, "Review cannot exceed 500 characters"],
    },
    isApproved: {
      type: Boolean,
      default: false, // Requires admin moderation
    },
  },
  { timestamps: true }
);

// Prevent a user from leaving multiple reviews for the same product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", ReviewSchema);
