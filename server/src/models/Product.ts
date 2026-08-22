import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  sku: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: "rings" | "necklaces" | "earrings" | "bracelets" | "watches";
  subcategory?: string;
  metalType: "gold" | "platinum" | "rose_gold" | "white_gold" | "silver";
  metalPurity?: string;
  gemstone?: string;
  weight?: number;
  caratWeight?: number;
  dimensions?: string;
  images: string[];
  videos?: string[];
  stock: number;
  isFeatured: boolean;
  ratingsAverage: number;
  ratingsQuantity: number;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["rings", "necklaces", "earrings", "bracelets", "watches"],
    },
    // Sub-category slug (e.g. "engagement-rings", "tennis-bracelets"). Free-form
    // string so the taxonomy can evolve without a migration.
    subcategory: { type: String, index: true },
    metalType: {
      type: String,
      required: true,
      enum: ["gold", "platinum", "rose_gold", "white_gold", "silver"],
    },
    // Karat / fineness, e.g. "18K", "22K", "PT950", "925". Free-form so the
    // vocabulary can grow without a migration.
    metalPurity: { type: String, trim: true },
    gemstone: { type: String },
    // Gross metal weight in grams.
    weight: { type: Number, min: 0 },
    // Total diamond / gemstone weight in carats.
    caratWeight: { type: Number, min: 0 },
    // Free-form physical dimensions, e.g. "Ring size 14 · 2.3 mm band".
    dimensions: { type: String, trim: true },
    images: {
      type: [String],
      required: true,
      validate: [
        (v: string[]) => v.length > 0,
        "A product must have at least one image.",
      ],
    },
    videos: {
      type: [String],
      default: [],
    },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isFeatured: { type: Boolean, default: false },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating must be above 0"],
      max: [5, "Rating must be below 5.0"],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for faster search
// Note: `sku` is already indexed via `unique: true` on the field above.
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ category: 1, metalType: 1 });
ProductSchema.index({ price: 1 });

export default mongoose.model<IProduct>("Product", ProductSchema);
