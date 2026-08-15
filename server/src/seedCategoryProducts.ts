// ═══════════════════════════════════════════════════════════
// 💎 Additive category seeding
// ───────────────────────────────────────────────────────────
// Ensures every storefront category has at least 5 products so
// the /categories/[slug] landing pages are never sparse.
//
// This script is ADDITIVE and IDEMPOTENT: it upserts by `sku`
// and never calls deleteMany, so re-running it (or running it
// after the main `seed`) leaves existing data — including the
// hand-seeded rings — untouched.
//
//   npm run seed:categories
// ═══════════════════════════════════════════════════════════

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product";

dotenv.config({ path: [".env.local", ".env"] });

// Images ship with the Next.js client (`client/public`).
const IMG = {
  necklace: "/images/products/necklace.png",
  earrings: "/images/products/earrings.png",
  bracelet: "/images/products/bracelet.png",
  watch: "/images/products/watch.png",
};

// Curated pieces to top up the thinner categories to 5 each.
const products = [
  // ── Necklaces (+3) ──
  {
    name: "Solstice Diamond Rivière",
    sku: "LUX-NECK-002",
    description:
      "A graduated line of 42 round brilliant diamonds — 5.0ct total — strung on 18K white gold. The definitive red-carpet necklace.",
    price: 480000,
    category: "necklaces",
    metalType: "white_gold",
    gemstone: "Diamond",
    images: [IMG.necklace],
    stock: 4,
    isFeatured: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 58,
  },
  {
    name: "Lumière Station Chain",
    sku: "LUX-NECK-003",
    description:
      "Seven bezel-set diamonds float along a fine platinum cable chain. Effortless brilliance for day into night.",
    price: 138000,
    discountPrice: 119000,
    category: "necklaces",
    metalType: "platinum",
    gemstone: "Diamond",
    images: [IMG.necklace],
    stock: 9,
    isFeatured: false,
    ratingsAverage: 4.7,
    ratingsQuantity: 41,
  },
  {
    name: "Verona Emerald Halo Pendant",
    sku: "LUX-NECK-004",
    description:
      "A 1.2ct Colombian emerald framed by a halo of pavé diamonds in rose gold. A pop of colour with timeless poise.",
    price: 164000,
    category: "necklaces",
    metalType: "rose_gold",
    gemstone: "Emerald",
    images: [IMG.necklace],
    stock: 6,
    isFeatured: true,
    ratingsAverage: 4.8,
    ratingsQuantity: 33,
  },

  // ── Earrings (+3) ──
  {
    name: "Aria Diamond Studs",
    sku: "LUX-EARR-002",
    description:
      "A matched pair of 1.0ct round brilliant solitaires, four-prong set in platinum. GIA certified, the everyday icon.",
    price: 210000,
    category: "earrings",
    metalType: "platinum",
    gemstone: "Diamond",
    images: [IMG.earrings],
    stock: 11,
    isFeatured: true,
    ratingsAverage: 5.0,
    ratingsQuantity: 96,
  },
  {
    name: "Celeste Inside-Out Hoops",
    sku: "LUX-EARR-003",
    description:
      "Diamonds set on both faces of a slim 18K yellow gold hoop — brilliance from every angle. 1.5ct total.",
    price: 158000,
    discountPrice: 139000,
    category: "earrings",
    metalType: "gold",
    gemstone: "Diamond",
    images: [IMG.earrings],
    stock: 7,
    isFeatured: false,
    ratingsAverage: 4.7,
    ratingsQuantity: 52,
  },
  {
    name: "Cascade Chandelier Earrings",
    sku: "LUX-EARR-004",
    description:
      "Tiered marquise and pear diamonds cascade in white gold — 3.2ct of red-carpet drama with fluid movement.",
    price: 395000,
    category: "earrings",
    metalType: "white_gold",
    gemstone: "Diamond",
    images: [IMG.earrings],
    stock: 3,
    isFeatured: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 27,
  },

  // ── Bracelets (+3) ──
  {
    name: "Aurelia Bangle",
    sku: "LUX-BRAC-002",
    description:
      "A hinged 18K yellow gold bangle set with a channel of 1.8ct round diamonds. Sculptural and endlessly stackable.",
    price: 232000,
    category: "bracelets",
    metalType: "gold",
    gemstone: "Diamond",
    images: [IMG.bracelet],
    stock: 6,
    isFeatured: false,
    ratingsAverage: 4.8,
    ratingsQuantity: 44,
  },
  {
    name: "Meridian Diamond Cuff",
    sku: "LUX-BRAC-003",
    description:
      "An architectural open cuff in platinum, pavé-set with 2.4ct of diamonds along a bold, modern silhouette.",
    price: 318000,
    category: "bracelets",
    metalType: "platinum",
    gemstone: "Diamond",
    images: [IMG.bracelet],
    stock: 4,
    isFeatured: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 38,
  },
  {
    name: "Rosé Line Bracelet",
    sku: "LUX-BRAC-004",
    description:
      "A delicate rose gold line of 1.5ct alternating diamonds — the everyday tennis bracelet, reimagined.",
    price: 176000,
    discountPrice: 154000,
    category: "bracelets",
    metalType: "rose_gold",
    gemstone: "Diamond",
    images: [IMG.bracelet],
    stock: 10,
    isFeatured: false,
    ratingsAverage: 4.6,
    ratingsQuantity: 61,
  },

  {
    name: "Belle Époque Diamond Collar",
    sku: "LUX-NECK-005",
    description:
      "A vintage-inspired collar of milgrain-edged diamonds in platinum — 3.6ct of old-world romance for the modern bride.",
    price: 356000,
    category: "necklaces",
    metalType: "platinum",
    gemstone: "Diamond",
    images: [IMG.necklace],
    stock: 5,
    isFeatured: false,
    ratingsAverage: 4.8,
    ratingsQuantity: 29,
  },
  {
    name: "Fleur Cluster Earrings",
    sku: "LUX-EARR-005",
    description:
      "Blossoming clusters of round and pear diamonds in rose gold — 2.0ct of feminine sparkle that sits close to the ear.",
    price: 187000,
    category: "earrings",
    metalType: "rose_gold",
    gemstone: "Diamond",
    images: [IMG.earrings],
    stock: 8,
    isFeatured: false,
    ratingsAverage: 4.7,
    ratingsQuantity: 36,
  },
  {
    name: "Empire Tennis Bracelet",
    sku: "LUX-BRAC-005",
    description:
      "The full-carat statement: 5.0ct of matched round brilliants in a classic four-prong white gold tennis setting.",
    price: 425000,
    category: "bracelets",
    metalType: "white_gold",
    gemstone: "Diamond",
    images: [IMG.bracelet],
    stock: 3,
    isFeatured: true,
    ratingsAverage: 5.0,
    ratingsQuantity: 47,
  },

  // ── Watches (+3) ──
  {
    name: "Aventine Diamond Bezel",
    sku: "LUX-WATCH-003",
    description:
      "A 34mm white gold dress watch with a diamond-set bezel and mother-of-pearl dial. Swiss automatic movement.",
    price: 1250000,
    category: "watches",
    metalType: "white_gold",
    gemstone: "Diamond",
    images: [IMG.watch],
    stock: 3,
    isFeatured: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 22,
  },
  {
    name: "Régence Rose Chronograph",
    sku: "LUX-WATCH-004",
    description:
      "An 18K rose gold chronograph with sapphire crystal and an exhibition caseback. Refined precision for every occasion.",
    price: 980000,
    discountPrice: 899000,
    category: "watches",
    metalType: "rose_gold",
    gemstone: "Sapphire",
    images: [IMG.watch],
    stock: 5,
    isFeatured: false,
    ratingsAverage: 4.7,
    ratingsQuantity: 31,
  },
  {
    name: "Platine Pavé Cocktail Watch",
    sku: "LUX-WATCH-005",
    description:
      "A fully pavé platinum cocktail watch — 4.0ct of diamonds concealing a delicate quartz movement. Jewellery first, timepiece second.",
    price: 1850000,
    category: "watches",
    metalType: "platinum",
    gemstone: "Diamond",
    images: [IMG.watch],
    stock: 2,
    isFeatured: true,
    ratingsAverage: 5.0,
    ratingsQuantity: 14,
  },

  // ── Top-ups so earrings & watches also reach 5 ──
  {
    name: "Estelle Diamond Huggie Hoops",
    sku: "LUX-EARR-006",
    description:
      "Snug pavé huggie hoops in 18K white gold — 0.75ct of diamonds that hug the lobe for all-day sparkle.",
    price: 96000,
    discountPrice: 84000,
    category: "earrings",
    metalType: "white_gold",
    gemstone: "Diamond",
    images: [IMG.earrings],
    stock: 14,
    isFeatured: false,
    ratingsAverage: 4.6,
    ratingsQuantity: 73,
  },
  {
    name: "Seraphine Mother-of-Pearl Watch",
    sku: "LUX-WATCH-006",
    description:
      "A 30mm rose gold dress watch with a mother-of-pearl dial and a full diamond-set bezel. Swiss quartz precision.",
    price: 760000,
    category: "watches",
    metalType: "rose_gold",
    gemstone: "Diamond",
    images: [IMG.watch],
    stock: 6,
    isFeatured: false,
    ratingsAverage: 4.7,
    ratingsQuantity: 19,
  },
  {
    name: "Monarch Openwork Tourbillon",
    sku: "LUX-WATCH-007",
    description:
      "An 18K yellow gold skeleton tourbillon with a diamond-set crown — hand-finished haute horlogerie for the collector.",
    price: 2650000,
    category: "watches",
    metalType: "gold",
    gemstone: "Diamond",
    images: [IMG.watch],
    stock: 2,
    isFeatured: true,
    ratingsAverage: 5.0,
    ratingsQuantity: 9,
  },
];

const seedCategoryProducts = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/sparenza-jewels"
    );
    console.log("MongoDB Connected");

    const ops = products.map((p) => ({
      updateOne: {
        filter: { sku: p.sku },
        update: { $set: p },
        upsert: true,
      },
    }));

    const result = await Product.bulkWrite(ops);
    const upserted = result.upsertedCount ?? 0;
    const modified = result.modifiedCount ?? 0;
    console.log(
      `Category top-up complete — ${upserted} inserted, ${modified} updated.`
    );

    // Report the resulting per-category counts.
    for (const category of ["rings", "necklaces", "earrings", "bracelets", "watches"]) {
      const count = await Product.countDocuments({ category });
      console.log(`  ${category}: ${count}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding category products:", error);
    process.exit(1);
  }
};

seedCategoryProducts();
