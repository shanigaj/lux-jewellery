// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — API, User, Cart & Order Types
// ═══════════════════════════════════════════════════════════

// ── API Response ──
export interface IApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: IPaginationMeta;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

// ── User ──
export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "customer" | "admin";
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Address ──
export interface IAddress {
  _id: string;
  user: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  type: "shipping" | "billing";
  isDefault: boolean;
}

// ── Cart ──
export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  totalAmount: number;
  coupon?: string;
  discountAmount?: number;
}

export interface ICartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    thumbnail: string;
    basePrice: number;
    salePrice?: number;
    stockQuantity: number;
  };
  quantity: number;
  selectedVariant?: {
    _id: string;
    name: string;
    sku: string;
    priceModifier: number;
  };
  unitPrice: number;
  totalPrice: number;
}

// ── Order ──
export interface IOrder {
  _id: string;
  orderNumber: string;
  user: IUser;
  items: IOrderItem[];
  shippingAddress: IAddress;
  billingAddress: IAddress;
  status: TOrderStatus;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  coupon?: string;
  paymentInfo: IPaymentInfo;
  shippingInfo?: IShippingInfo;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItem {
  product: string;
  productName: string;
  productImage: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedVariant?: {
    name: string;
    sku: string;
  };
}

export interface IPaymentInfo {
  gateway: "stripe" | "razorpay" | "cod";
  gatewayPaymentId?: string;
  gatewayOrderId?: string;
  status: TPaymentStatus;
  paidAt?: string;
}

export interface IShippingInfo {
  carrier: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

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

export type TPaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

// ── Coupon ──
export interface ICoupon {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}

// ── Wishlist ──
export interface IWishlist {
  _id: string;
  user: string;
  products: string[];
}
