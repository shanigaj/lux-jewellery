import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product";

dotenv.config();

// Images are served by the Next.js client from its /public folder.
const IMG = {
  ring: "/images/hero-ring.png",
  necklace: "/images/products/necklace.png",
  earrings: "/images/products/earrings.png",
  bracelet: "/images/products/bracelet.png",
  watch: "/images/products/watch.png",
};

const products = [
  {
    name: "Celestial Solitaire Ring",
    sku: "LUX-RING-001",
    description:
      "A breathtaking 1.5ct round brilliant diamond set in a delicate white gold band. GIA certified, D colour, VVS1 clarity — the pinnacle of solitaire elegance.",
    price: 185000,
    category: "rings",
    metalType: "white_gold",
    gemstone: "Diamond",
    images: [IMG.ring],
    stock: 8,
    isFeatured: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 127,
  },
  {
    name: "Aurora Diamond Pendant",
    sku: "LUX-NECK-001",
    description:
      "An oval-cut diamond pendant suspended on an 18K rose gold chain. Understated brilliance for everyday luxury.",
    price: 95000,
    discountPrice: 82000,
    category: "necklaces",
    metalType: "rose_gold",
    gemstone: "Diamond",
    images: [IMG.necklace],
    stock: 12,
    isFeatured: true,
    ratingsAverage: 4.8,
    ratingsQuantity: 89,
  },
  {
    name: "Eternal Tennis Bracelet",
    sku: "LUX-BRAC-001",
    description:
      "3.0ct of perfectly matched round diamonds in a classic platinum tennis setting. A timeless statement of devotion.",
    price: 275000,
    category: "bracelets",
    metalType: "platinum",
    gemstone: "Diamond",
    images: [IMG.bracelet],
    stock: 5,
    isFeatured: true,
    ratingsAverage: 5.0,
    ratingsQuantity: 203,
  },
  {
    name: "Radiance Drop Earrings",
    sku: "LUX-EARR-001",
    description:
      "Pear-shaped diamond drop earrings in white gold. 1.0ct total, F colour, VVS1 clarity — captivating movement and sparkle.",
    price: 125000,
    category: "earrings",
    metalType: "white_gold",
    gemstone: "Diamond",
    images: [IMG.earrings],
    stock: 10,
    isFeatured: true,
    ratingsAverage: 4.7,
    ratingsQuantity: 64,
  },
  {
    name: "Royal Heritage Solitaire",
    sku: "LUX-RING-002",
    description:
      "A regal 2.0ct round brilliant solitaire in platinum, D colour, internally flawless. The ultimate heirloom.",
    price: 325000,
    category: "rings",
    metalType: "platinum",
    gemstone: "Diamond",
    images: [IMG.ring],
    stock: 4,
    isFeatured: false,
    ratingsAverage: 4.9,
    ratingsQuantity: 240,
  },
  {
    name: "Empress Tennis Necklace",
    sku: "LUX-NECK-002",
    description:
      "5.0ct total of round brilliant diamonds in a graduated white gold tennis necklace. Red-carpet worthy radiance.",
    price: 485000,
    category: "necklaces",
    metalType: "white_gold",
    gemstone: "Diamond",
    images: [IMG.necklace],
    stock: 3,
    isFeatured: false,
    ratingsAverage: 4.9,
    ratingsQuantity: 180,
  },
  {
    name: "Diamond Cascade Earrings",
    sku: "LUX-EARR-002",
    description:
      "Cascading pear diamonds in rose gold, 1.5ct total, E colour, VVS2 clarity. Effortless drama.",
    price: 195000,
    category: "earrings",
    metalType: "rose_gold",
    gemstone: "Diamond",
    images: [IMG.earrings],
    stock: 7,
    isFeatured: false,
    ratingsAverage: 4.8,
    ratingsQuantity: 156,
  },
  {
    name: "Infinity Diamond Bracelet",
    sku: "LUX-BRAC-002",
    description:
      "3.0ct of round diamonds arranged in an infinity motif, crafted in 18K yellow gold. A symbol of endless love.",
    price: 275000,
    category: "bracelets",
    metalType: "gold",
    gemstone: "Diamond",
    images: [IMG.bracelet],
    stock: 6,
    isFeatured: false,
    ratingsAverage: 4.7,
    ratingsQuantity: 72,
  },
  {
    name: "Royal Chronograph",
    sku: "LUX-WATCH-001",
    description:
      "A Swiss automatic chronograph in 18K gold with a diamond-set bezel. Horological artistry meets fine jewellery.",
    price: 1250000,
    category: "watches",
    metalType: "gold",
    gemstone: "Diamond",
    images: [IMG.watch],
    stock: 3,
    isFeatured: false,
    ratingsAverage: 4.9,
    ratingsQuantity: 60,
  },
  {
    name: "Heritage Tourbillon",
    sku: "LUX-WATCH-002",
    description:
      "A limited-edition platinum tourbillon, hand-finished Swiss movement. The definition of timeless luxury.",
    price: 2400000,
    category: "watches",
    metalType: "platinum",
    gemstone: "Diamond",
    images: [IMG.watch],
    stock: 2,
    isFeatured: false,
    ratingsAverage: 4.8,
    ratingsQuantity: 45,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/lux-diamonds");
    console.log("MongoDB Connected");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    const created = await Product.insertMany(products);
    console.log(`Seeded ${created.length} products successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
