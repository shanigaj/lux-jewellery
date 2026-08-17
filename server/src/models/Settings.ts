import mongoose, { Document, Schema } from "mongoose";

export interface IBoutique {
  id: string;
  name: string;
  city: string;
  address: string;
}

export interface ISettings extends Document {
  key: string;
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  currency: string;
  timezone: string;
  freeShippingThreshold: number;
  announcements: string[];
  boutiques: IBoutique[];
  timeSlots: string[];
}

const BoutiqueSchema = new Schema<IBoutique>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { _id: false }
);

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
    boutiques: {
      type: [BoutiqueSchema],
      default: [
        { id: "surat", name: "Surat Flagship", city: "Surat", address: "123 Diamond Avenue, Surat" },
        { id: "mumbai", name: "Mumbai Boutique", city: "Mumbai", address: "Kala Ghoda, Fort, Mumbai" },
        { id: "delhi", name: "Delhi Boutique", city: "New Delhi", address: "DLF Emporio, Vasant Kunj" },
        { id: "bengaluru", name: "Bengaluru Boutique", city: "Bengaluru", address: "UB City, Vittal Mallya Road" },
      ],
    },
    timeSlots: {
      type: [String],
      default: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISettings>("Settings", SettingsSchema);
