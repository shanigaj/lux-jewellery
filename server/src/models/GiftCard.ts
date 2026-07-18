import mongoose, { Document, Schema } from "mongoose";

export interface IGiftCard extends Document {
  code: string;
  balance: number;
  originalBalance: number;
  expiresAt: Date;
  isActive: boolean;
  purchasedBy?: mongoose.Types.ObjectId;
}

const GiftCardSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    balance: { type: Number, required: true },
    originalBalance: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    purchasedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<IGiftCard>("GiftCard", GiftCardSchema);
