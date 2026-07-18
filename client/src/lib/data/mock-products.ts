import { IProduct } from "@/types/product.types";

const now = new Date().toISOString();

export const MOCK_PRODUCTS: IProduct[] = [
  {
    _id: "p1",
    name: "Celestial Solitaire Ring",
    slug: "celestial-solitaire-ring",
    sku: "R-CEL-001",
    description: "The Celestial Solitaire Ring features a stunning round brilliant diamond set in an elegant six-prong platinum setting. Engineered to maximize light return, this ring captures starlight in a way that is truly breathtaking. Every facet is polished to perfection by our master craftsmen.",
    shortDescription: "A breathtaking round brilliant diamond in a classic six-prong platinum setting.",
    basePrice: 185000,
    currency: "INR",
    category: {
      _id: "c1",
      name: "Rings",
      slug: "rings",
      description: "Engagement and fashion rings.",
      image: "/images/hero-ring.png",
      sortOrder: 1,
      isActive: true,
      seo: { metaTitle: "Luxury Diamond Rings" }
    },
    collections: [],
    diamondSpecs: {
      shape: "round",
      caratWeight: 1.5,
      cut: "excellent",
      clarity: "VVS1",
      color: "D",
      certification: "GIA",
      certificationNumber: "GIA-1234567890",
      symmetry: "excellent",
      polish: "excellent",
      fluorescence: "none"
    },
    metalType: "platinum",
    metalPurity: "950Pt",
    weight: 4.5,
    variants: [
      { _id: "v1-1", name: "Platinum, Size 6", sku: "R-CEL-001-PT-6", metalType: "platinum", metalPurity: "950Pt", size: "6", priceModifier: 0, stockQuantity: 5, isActive: true },
      { _id: "v1-2", name: "18K Gold, Size 6", sku: "R-CEL-001-YG-6", metalType: "gold", metalPurity: "18K", size: "6", priceModifier: -15000, stockQuantity: 3, isActive: true }
    ],
    images: [
      { _id: "img1", url: "/images/hero-ring.png", publicId: "hero-ring", altText: "Celestial Solitaire Ring", sortOrder: 1, isDefault: true },
      { _id: "img1-2", url: "/images/collections/hero-collection.png", publicId: "hero-ring-alt", altText: "Celestial Solitaire Ring Profile", sortOrder: 2, isDefault: false }
    ],
    thumbnail: "/images/hero-ring.png",
    stockQuantity: 8,
    lowStockThreshold: 2,
    trackInventory: true,
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    isBestseller: false,
    avgRating: 4.9,
    reviewCount: 127,
    seo: { metaTitle: "Celestial Solitaire Ring | LUX Diamonds", metaDescription: "Discover the breathtaking Celestial Solitaire Ring." },
    tags: ["engagement", "solitaire", "platinum"],
    createdAt: now,
    updatedAt: now
  },
  {
    _id: "p2",
    name: "Aurora Diamond Pendant",
    slug: "aurora-diamond-pendant",
    sku: "N-AUR-001",
    description: "Suspended elegantly on an 18K white gold chain, the Aurora pendant features a rare oval-cut diamond surrounded by a halo of brilliant micropavé stones.",
    shortDescription: "An elegant oval diamond pendant with a micropavé halo.",
    basePrice: 95000,
    salePrice: 82000,
    currency: "INR",
    category: {
      _id: "c2",
      name: "Necklaces",
      slug: "necklaces",
      description: "Pendants and necklaces.",
      image: "/images/products/necklace.png",
      sortOrder: 2,
      isActive: true,
      seo: { metaTitle: "Luxury Diamond Necklaces" }
    },
    collections: [],
    diamondSpecs: {
      shape: "oval",
      caratWeight: 0.75,
      cut: "ideal",
      clarity: "VS1",
      color: "E",
      certification: "IGI",
      symmetry: "excellent",
      polish: "excellent"
    },
    metalType: "white_gold",
    metalPurity: "18K",
    weight: 3.2,
    variants: [],
    images: [
      { _id: "img2", url: "/images/products/necklace.png", publicId: "aurora-pendant", altText: "Aurora Diamond Pendant", sortOrder: 1, isDefault: true }
    ],
    thumbnail: "/images/products/necklace.png",
    stockQuantity: 15,
    lowStockThreshold: 3,
    trackInventory: true,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    avgRating: 4.8,
    reviewCount: 89,
    seo: { metaTitle: "Aurora Diamond Pendant | LUX Diamonds" },
    tags: ["pendant", "halo", "gift"],
    createdAt: now,
    updatedAt: now
  },
  {
    _id: "p3",
    name: "Eternal Tennis Bracelet",
    slug: "eternal-tennis-bracelet",
    sku: "B-ETN-001",
    description: "A continuous line of flawlessly matched round brilliant diamonds set in 18K white gold. The Eternal Tennis Bracelet brings sophistication and radiant sparkle to every wrist movement.",
    shortDescription: "A classic line bracelet with perfectly matched round diamonds.",
    basePrice: 275000,
    currency: "INR",
    category: {
      _id: "c3",
      name: "Bracelets",
      slug: "bracelets",
      description: "Tennis bracelets and bangles.",
      image: "/images/products/bracelet.png",
      sortOrder: 3,
      isActive: true,
      seo: { metaTitle: "Diamond Bracelets" }
    },
    collections: [],
    diamondSpecs: {
      shape: "round",
      caratWeight: 3.0,
      cut: "excellent",
      clarity: "VVS2",
      color: "D",
      certification: "GIA",
    },
    metalType: "white_gold",
    metalPurity: "18K",
    weight: 12.5,
    variants: [],
    images: [
      { _id: "img3", url: "/images/products/bracelet.png", publicId: "eternal-bracelet", altText: "Eternal Tennis Bracelet", sortOrder: 1, isDefault: true }
    ],
    thumbnail: "/images/products/bracelet.png",
    stockQuantity: 4,
    lowStockThreshold: 1,
    trackInventory: true,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    avgRating: 5.0,
    reviewCount: 203,
    seo: { metaTitle: "Eternal Tennis Bracelet" },
    tags: ["tennis", "classic", "anniversary"],
    createdAt: now,
    updatedAt: now
  },
  {
    _id: "p4",
    name: "Radiance Drop Earrings",
    slug: "radiance-drop-earrings",
    sku: "E-RAD-001",
    description: "Capturing the essence of falling water, the Radiance Drop Earrings feature exquisite pear-shaped diamonds that dangle elegantly to catch and reflect light with every step.",
    shortDescription: "Elegant pear-shaped diamond drop earrings.",
    basePrice: 125000,
    currency: "INR",
    category: {
      _id: "c4",
      name: "Earrings",
      slug: "earrings",
      description: "Diamond earrings.",
      image: "/images/products/earrings.png",
      sortOrder: 4,
      isActive: true,
      seo: { metaTitle: "Diamond Earrings" }
    },
    collections: [],
    diamondSpecs: {
      shape: "pear",
      caratWeight: 1.0,
      cut: "excellent",
      clarity: "VVS1",
      color: "F",
      certification: "GIA",
    },
    metalType: "white_gold",
    metalPurity: "18K",
    weight: 4.0,
    variants: [],
    images: [
      { _id: "img4", url: "/images/products/earrings.png", publicId: "radiance-earrings", altText: "Radiance Drop Earrings", sortOrder: 1, isDefault: true }
    ],
    thumbnail: "/images/products/earrings.png",
    stockQuantity: 12,
    lowStockThreshold: 2,
    trackInventory: true,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: false,
    avgRating: 4.7,
    reviewCount: 64,
    seo: { metaTitle: "Radiance Drop Earrings" },
    tags: ["drop", "pear", "bridal"],
    createdAt: now,
    updatedAt: now
  },
  {
    _id: "p5",
    name: "Royal Chronograph",
    slug: "royal-chronograph",
    sku: "W-ROY-001",
    description: "A masterpiece of horological artistry. The Royal Chronograph features a Swiss automatic movement encased in 18K yellow gold, with a bezel meticulously set with brilliant-cut diamonds.",
    shortDescription: "A luxury 18K gold Swiss chronograph with a diamond bezel.",
    basePrice: 1250000,
    currency: "INR",
    category: {
      _id: "c5",
      name: "Watches",
      slug: "watches",
      description: "Luxury timepieces.",
      image: "/images/products/watch.png",
      sortOrder: 5,
      isActive: true,
      seo: { metaTitle: "Luxury Watches" }
    },
    collections: [],
    diamondSpecs: {
      shape: "round",
      caratWeight: 1.2,
      cut: "excellent",
      clarity: "VS1",
      color: "F",
      certification: "GIA",
    },
    metalType: "gold",
    metalPurity: "18K",
    weight: 145,
    variants: [],
    images: [
      { _id: "img5", url: "/images/products/watch.png", publicId: "royal-chronograph", altText: "Royal Chronograph Watch", sortOrder: 1, isDefault: true }
    ],
    thumbnail: "/images/products/watch.png",
    stockQuantity: 2,
    lowStockThreshold: 1,
    trackInventory: true,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestseller: true,
    avgRating: 5.0,
    reviewCount: 12,
    seo: { metaTitle: "Royal Chronograph Watch" },
    tags: ["watch", "swiss", "chronograph", "gold"],
    createdAt: now,
    updatedAt: now
  },
  {
    _id: "p6",
    name: "Imperial Emerald Ring",
    slug: "imperial-emerald-ring",
    sku: "R-IMP-002",
    description: "The Imperial Emerald Ring showcases a magnificent step-cut emerald diamond. Known for its hall-of-mirrors effect, this cut emphasizes extreme clarity and sophisticated elegance.",
    shortDescription: "A sophisticated step-cut emerald diamond ring in platinum.",
    basePrice: 245000,
    currency: "INR",
    category: { _id: "c1", name: "Rings", slug: "rings", description: "", image: "", sortOrder: 1, isActive: true, seo: {} },
    collections: [],
    diamondSpecs: {
      shape: "emerald",
      caratWeight: 2.0,
      cut: "excellent",
      clarity: "IF",
      color: "E",
      certification: "HRD",
    },
    metalType: "platinum",
    metalPurity: "950Pt",
    weight: 5.2,
    variants: [],
    images: [
      { _id: "img6", url: "/images/hero-ring.png", publicId: "imperial-ring", altText: "Imperial Emerald Ring", sortOrder: 1, isDefault: true }
    ],
    thumbnail: "/images/hero-ring.png",
    stockQuantity: 3,
    lowStockThreshold: 1,
    trackInventory: true,
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isBestseller: false,
    avgRating: 4.6,
    reviewCount: 34,
    seo: { metaTitle: "Imperial Emerald Ring" },
    tags: ["emerald-cut", "platinum"],
    createdAt: now,
    updatedAt: now
  },
  {
    _id: "p7",
    name: "Rose Gold Princess Band",
    slug: "rose-gold-princess-band",
    sku: "R-ROS-003",
    description: "A continuous channel of princess-cut diamonds set in warm 18K rose gold. Perfect as an eternity band or a dazzling stacking ring.",
    shortDescription: "A channel-set princess diamond eternity band in 18K rose gold.",
    basePrice: 110000,
    currency: "INR",
    category: { _id: "c1", name: "Rings", slug: "rings", description: "", image: "", sortOrder: 1, isActive: true, seo: {} },
    collections: [],
    diamondSpecs: {
      shape: "princess",
      caratWeight: 1.25,
      cut: "very_good",
      clarity: "VS2",
      color: "G",
      certification: "IGI",
    },
    metalType: "rose_gold",
    metalPurity: "18K",
    weight: 3.8,
    variants: [],
    images: [
      { _id: "img7", url: "/images/collections/hero-collection.png", publicId: "rose-princess-band", altText: "Rose Gold Princess Band", sortOrder: 1, isDefault: true }
    ],
    thumbnail: "/images/collections/hero-collection.png",
    stockQuantity: 10,
    lowStockThreshold: 2,
    trackInventory: true,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    avgRating: 4.8,
    reviewCount: 45,
    seo: { metaTitle: "Rose Gold Princess Band" },
    tags: ["eternity", "princess-cut", "rose-gold"],
    createdAt: now,
    updatedAt: now
  },
  {
    _id: "p8",
    name: "Diamond Constellation Watch",
    slug: "diamond-constellation-watch",
    sku: "W-CON-002",
    description: "A breathtaking timepiece with a dial that mirrors the night sky, featuring diamond hour markers and a bezel fully encrusted with pavé diamonds.",
    shortDescription: "Automatic Swiss movement watch with a full diamond bezel.",
    basePrice: 875000,
    currency: "INR",
    category: { _id: "c5", name: "Watches", slug: "watches", description: "", image: "", sortOrder: 5, isActive: true, seo: {} },
    collections: [],
    diamondSpecs: {
      shape: "round",
      caratWeight: 0.8,
      cut: "excellent",
      clarity: "VVS1",
      color: "E",
      certification: "GIA",
    },
    metalType: "white_gold",
    metalPurity: "18K",
    weight: 120,
    variants: [],
    images: [
      { _id: "img8", url: "/images/products/watch.png", publicId: "constellation-watch", altText: "Constellation Watch", sortOrder: 1, isDefault: true }
    ],
    thumbnail: "/images/products/watch.png",
    stockQuantity: 5,
    lowStockThreshold: 1,
    trackInventory: true,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: false,
    avgRating: 4.9,
    reviewCount: 18,
    seo: { metaTitle: "Diamond Constellation Watch" },
    tags: ["watch", "diamond-bezel", "automatic"],
    createdAt: now,
    updatedAt: now
  }
];

// Helper functions for mock data
export const getProductBySlug = (slug: string) => {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
};

export const getFilteredProducts = (filters: any) => {
  let products = [...MOCK_PRODUCTS];

  if (filters.category && filters.category !== "all") {
    products = products.filter(p => p.category.slug === filters.category);
  }

  if (filters.minPrice) {
    products = products.filter(p => (p.salePrice || p.basePrice) >= filters.minPrice);
  }

  if (filters.maxPrice) {
    products = products.filter(p => (p.salePrice || p.basePrice) <= filters.maxPrice);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (filters.sort) {
    switch (filters.sort) {
      case "price-asc":
        products.sort((a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice));
        break;
      case "price-desc":
        products.sort((a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice));
        break;
      case "newest":
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
  }

  return products;
};
