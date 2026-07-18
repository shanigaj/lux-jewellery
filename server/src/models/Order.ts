import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    thumbnail: string;
    sku: string;
    metalType: string;
    metalPurity: string;
    size?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  payment: {
    method: "stripe" | "razorpay" | "paypal";
    transactionId: string;
    status: "pending" | "processing" | "completed" | "failed" | "refunded";
    amount: number;
    currency: string;
    paidAt?: Date;
  };
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  taxRate: number;
  couponDiscount: number;
  giftCardAmount: number;
  totalAmount: number;
  couponCode?: string;
  giftCardCode?: string;
  status: string;
  timeline: {
    status: string;
    title: string;
    description: string;
    timestamp: Date;
    isCompleted: boolean;
  }[];
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: Date;
  emailSent: boolean;
  smsSent: boolean;
  customerNote?: string;
  adminNote?: string;
}

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        thumbnail: String,
        sku: String,
        metalType: String,
        metalPurity: String,
        size: String,
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    payment: {
      method: { type: String, enum: ["stripe", "razorpay", "paypal"], required: true },
      transactionId: String,
      status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed", "refunded"],
        default: "pending",
      },
      amount: Number,
      currency: { type: String, default: "INR" },
      paidAt: Date,
    },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    taxAmount: { type: Number, required: true },
    taxRate: { type: Number, default: 0.18 },
    couponDiscount: { type: Number, default: 0 },
    giftCardAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    couponCode: String,
    giftCardCode: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled", "returned", "refunded"],
      default: "pending",
    },
    timeline: [
      {
        status: String,
        title: String,
        description: String,
        timestamp: Date,
        isCompleted: { type: Boolean, default: false },
      },
    ],
    trackingNumber: String,
    estimatedDelivery: String,
    deliveredAt: Date,
    emailSent: { type: Boolean, default: false },
    smsSent: { type: Boolean, default: false },
    customerNote: String,
    adminNote: String,
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
