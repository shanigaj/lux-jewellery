// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Order & Shopping Type Definitions
// ═══════════════════════════════════════════════════════════

import { IProduct, TMetalType, TMetalPurity } from "./product.types";

// ── Cart ──
export interface ICartItem {
  product: IProduct;
  variantId?: string;
  quantity: number;
  selectedMetal: TMetalType;
  selectedPurity: TMetalPurity;
  selectedSize?: string;
  unitPrice: number;
  totalPrice: number;
}

// ── Shipping ──
export interface IShippingAddress {
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
}

// ── Coupon ──
export interface ICoupon {
  _id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiresAt: string;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
}

// ── Gift Card ──
export interface IGiftCard {
  _id: string;
  code: string;
  balance: number;
  originalBalance: number;
  expiresAt: string;
  isActive: boolean;
}

// ── Payment ──
export type TPaymentMethod = "stripe" | "razorpay" | "paypal";
export type TPaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded";

export interface IPaymentInfo {
  method: TPaymentMethod;
  transactionId: string;
  status: TPaymentStatus;
  amount: number;
  currency: string;
  paidAt?: string;
}

// ── Order Status ──
export type TOrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

// ── Order Timeline ──
export interface IOrderTimeline {
  status: TOrderStatus;
  title: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
}

// ── Order Item ──
export interface IOrderItem {
  product: IProduct;
  name: string;
  thumbnail: string;
  sku: string;
  variantId?: string;
  metalType: TMetalType;
  metalPurity: TMetalPurity;
  size?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ── Order ──
export interface IOrder {
  _id: string;
  orderNumber: string;
  user: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  payment: IPaymentInfo;

  // Pricing
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  taxRate: number;
  couponDiscount: number;
  giftCardAmount: number;
  totalAmount: number;

  // Codes
  couponCode?: string;
  giftCardCode?: string;

  // Status
  status: TOrderStatus;
  timeline: IOrderTimeline[];

  // Shipping
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;

  // Notifications
  emailSent: boolean;
  smsSent: boolean;

  // Notes
  customerNote?: string;
  adminNote?: string;

  createdAt: string;
  updatedAt: string;
}

// ── Invoice ──
export interface IInvoice {
  invoiceNumber: string;
  order: IOrder;
  issuedAt: string;
  dueDate?: string;
  companyInfo: {
    name: string;
    address: string;
    email: string;
    phone: string;
    gst?: string;
  };
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  shippingCost: number;
  discount: number;
  grandTotal: number;
}
