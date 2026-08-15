import mongoose, { Document, Schema } from "mongoose";

export interface ISettings extends Document {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  currency: string;
  timezone: string;
  freeShippingThreshold: number;
  announcements: string[];
}

const SettingsSchema: Schema = new Schema(
  {
    // A single settings document is kept; `key` guarantees the singleton.
    key: { type: String, default: "site", unique: true },
    storeName: { type: String, default: "Sparenza & Co." },
    supportEmail: { type: String, default: "contact@sparenza.com" },
    supportPhone: { type: String, default: "+91 63527 51091" },
    address: {
      type: String,
      default:
        "52, Shubham Park Society, Aakar Club Rd, Swagat Society, BRTS, Simada Gam, Nana Varachha, Surat, Gujarat 395011",
    },
    currency: { type: String, default: "INR" },
    timezone: { type: String, default: "Asia/Kolkata" },
    freeShippingThreshold: { type: Number, default: 50000 },
    announcements: {
      type: [String],
      default: [
        "Complimentary worldwide shipping on orders above ₹50,000",
        "Every diamond is GIA certified — Authenticity guaranteed",
        "Lifetime exchange & buyback on all collections",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISettings>("Settings", SettingsSchema);
