// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Product Type Definitions
// ═══════════════════════════════════════════════════════════

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;

  // Pricing
  basePrice: number;
  salePrice?: number;
  currency: string;

  // Classification
  category: ICategory;
  collections: ICollection[];

  // Diamond
  diamondSpecs: IDiamondSpecs;

  // Metal & Physical
  metalType: TMetalType;
  metalPurity: TMetalPurity;
  weight: number;
  dimensions?: IDimensions;

  // Variants
  variants: IProductVariant[];

  // Media
  images: IProductImage[];
  thumbnail: string;
  video?: string;
  videos?: string[];

  // Inventory
  stockQuantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;

  // Status
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;

  // Reviews
  avgRating: number;
  reviewCount: number;

  // SEO
  seo: ISEO;

  // Meta
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IDiamondSpecs {
  shape: TDiamondShape;
  caratWeight: number;
  cut: TDiamondCut;
  clarity: TDiamondClarity;
  color: TDiamondColor;
  certification: TCertification;
  certificationNumber?: string;
  fluorescence?: "none" | "faint" | "medium" | "strong";
  depthPercentage?: number;
  tablePercentage?: number;
  symmetry?: "excellent" | "very_good" | "good";
  polish?: "excellent" | "very_good" | "good";
}

export interface IProductVariant {
  _id: string;
  name: string;
  sku: string;
  metalType: string;
  metalPurity: string;
  size?: string;
  priceModifier: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface IProductImage {
  _id: string;
  url: string;
  publicId: string;
  altText: string;
  sortOrder: number;
  isDefault: boolean;
}

export interface IDimensions {
  length?: number;
  width?: number;
  height?: number;
  ringSize?: string;
  chainLength?: number;
  braceletSize?: string;
}

export interface ISEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
}

// ── Enums as Types ──
export type TDiamondShape =
  | "round" | "princess" | "oval" | "cushion" | "emerald"
  | "pear" | "marquise" | "radiant" | "asscher" | "heart";

export type TDiamondCut = "ideal" | "excellent" | "very_good" | "good" | "fair";
export type TDiamondClarity = "FL" | "IF" | "VVS1" | "VVS2" | "VS1" | "VS2" | "SI1" | "SI2";
export type TDiamondColor = "D" | "E" | "F" | "G" | "H" | "I" | "J";
export type TCertification = "GIA" | "IGI" | "AGS" | "HRD";
export type TMetalType = "gold" | "white_gold" | "rose_gold" | "platinum" | "silver";
export type TMetalPurity = "24K" | "22K" | "18K" | "14K" | "950Pt";

// ── Category ──
export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parent?: ICategory;
  sortOrder: number;
  isActive: boolean;
  seo: ISEO;
  productCount?: number;
}

// ── Collection ──
export interface ICollection {
  _id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  thumbnailImage: string;
  products: IProduct[];
  isActive: boolean;
  isFeatured: boolean;
  startDate?: string;
  endDate?: string;
  seo: ISEO;
}

// ── Review ──
export interface IReview {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  product: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: string;
}

// ── Filters ──
export interface IProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  metalType?: TMetalType[];
  metalPurity?: TMetalPurity[];
  diamondShape?: TDiamondShape[];
  diamondCarat?: [number, number];
  diamondClarity?: TDiamondClarity[];
  diamondColor?: TDiamondColor[];
  certification?: TCertification[];
  inStock?: boolean;
  isFeatured?: boolean;
  sort?: string;
  search?: string;
  page?: number;
  limit?: number;
}
