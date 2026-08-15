import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  author: string;
  status: "draft" | "published";
  tags: string[];
  views: number;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    coverImage: { type: String },
    author: { type: String, default: "Sparenza & Co." },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    tags: { type: [String], default: [] },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BlogSchema.index({ title: "text", excerpt: "text" });

export default mongoose.model<IBlog>("Blog", BlogSchema);
