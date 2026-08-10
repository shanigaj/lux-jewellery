import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import Product from "./models/Product";

// Load env (.env.local preferred, fallback .env)
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Root folder that holds one sub-folder per product
const SOURCE_ROOT = "D:/Work/0";

interface ProductDef {
  folder: string; // sub-folder name inside SOURCE_ROOT
  sku: string;
  name: string;
  description: string;
  category: "rings" | "necklaces" | "earrings" | "bracelets" | "watches";
  metalType: "gold" | "platinum" | "rose_gold" | "white_gold" | "silver";
  gemstone: string;
  isFeatured: boolean;
}

const PRODUCTS: ProductDef[] = [
  {
    folder: "01 braslate",
    sku: "SPZ-BR-001",
    name: "Marguerite Noir Fabric Cuff",
    description:
      "A striking black mesh-fabric cuff crowned with a daisy motif — hand-set white cubic-zirconia petals radiating around a warm yellow-sapphire heart, finished with rose-gold accents. Hinged adjustable fit for effortless elegance.",
    category: "bracelets",
    metalType: "rose_gold",
    gemstone: "Yellow Sapphire & Cubic Zirconia",
    isFeatured: true,
  },
  {
    folder: "02 braslate",
    sku: "SPZ-BR-002",
    name: "Rosé Géométrique Fabric Cuff",
    description:
      "A mauve mesh-fabric cuff centred by a rose-gold geometric medallion, its concentric diamond-set frames cradling a vivid ruby-red centre stone. Modern architecture meets soft romance.",
    category: "bracelets",
    metalType: "rose_gold",
    gemstone: "Ruby & Cubic Zirconia",
    isFeatured: false,
  },
  {
    folder: "03 braslate",
    sku: "SPZ-BR-003",
    name: "Emerald Quatrefoil Fabric Cuff",
    description:
      "A deep-green mesh-fabric cuff adorned with a rose-gold quatrefoil motif — a blush pink-sapphire heart embraced by blue-sapphire accents and a sparkling halo of cubic zirconia.",
    category: "bracelets",
    metalType: "rose_gold",
    gemstone: "Pink & Blue Sapphire",
    isFeatured: false,
  },
  {
    folder: "04 Ring",
    sku: "SPZ-RG-001",
    name: "Fleur Statement Cocktail Ring",
    description:
      "A show-stopping cocktail ring in rhodium-finished white gold — an intricate floral silhouette of pavé diamonds, available as an all-diamond starburst or with a rich green emerald centre. Open, adjustable fit.",
    category: "rings",
    metalType: "white_gold",
    gemstone: "Emerald & Diamond",
    isFeatured: true,
  },
  {
    folder: "05",
    sku: "SPZ-RG-002",
    name: "Éternité Couple Rings (His & Hers)",
    description:
      "A matched his-and-hers set in Pt950 platinum, each ring framing an emerald-cut solitaire within a double halo of pavé diamonds. A timeless symbol of union, hallmarked and ready to treasure.",
    category: "rings",
    metalType: "platinum",
    gemstone: "Diamond",
    isFeatured: true,
  },
  {
    folder: "06 Braslate",
    sku: "SPZ-BR-004",
    name: "Iridescent Emerald Medallion Cuff",
    description:
      "An iridescent mesh-fabric cuff finished with an ornate rose-gold medallion — a cluster of green emeralds encircled by a filigree diamond-set frame. Light-catching colour from every angle.",
    category: "bracelets",
    metalType: "rose_gold",
    gemstone: "Emerald & Diamond",
    isFeatured: false,
  },
  {
    folder: "07 Braslate",
    sku: "SPZ-BR-005",
    name: "Sapphire Bloom Midnight Cuff",
    description:
      "A midnight-blue mesh-fabric cuff centred by a rose-gold filigree medallion, where a marquise blue-sapphire flower blossoms amid scrollwork and diamond accents. Regal and richly detailed.",
    category: "bracelets",
    metalType: "rose_gold",
    gemstone: "Blue Sapphire & Diamond",
    isFeatured: false,
  },
  {
    folder: "08 ring braslate",
    sku: "SPZ-BR-006",
    name: "Pavé Platinum Bangle & Ring Set",
    description:
      "A luxurious Pt950 platinum set — a sculpted pavé-diamond bangle with a matching pavé ring, thousands of hand-set stones melting into a seamless ribbon of light. Hallmarked 950 platinum.",
    category: "bracelets",
    metalType: "platinum",
    gemstone: "Diamond",
    isFeatured: true,
  },
  {
    folder: "09 braslate",
    sku: "SPZ-BR-007",
    name: "Aurora Bloom Rose-Gold Cuff",
    description:
      "A warm taupe mesh-fabric cuff crowned by a rose-gold sunburst medallion — a vivid ruby heart encircled by a radiating filigree frame set with cubic zirconia. Adjustable hinged fit.",
    category: "bracelets",
    metalType: "rose_gold",
    gemstone: "Ruby & Cubic Zirconia",
    isFeatured: true,
  },
  {
    folder: "10 kadali",
    sku: "SPZ-BR-008",
    name: "Celestial Bead Adjustable Bangle",
    description:
      "A sterling-silver kada strung with alternating polished and stardust-textured beads on a sliding adjustable frame. Effortless everyday shine that fits any wrist.",
    category: "bracelets",
    metalType: "silver",
    gemstone: "Sterling Silver",
    isFeatured: false,
  },
  {
    folder: "11 braslate",
    sku: "SPZ-BR-009",
    name: "Rose Leaf Drop Bracelet",
    description:
      "A delicate rose-gold chain bracelet lined with rhombus links and dangling leaf drops set with cubic zirconia. Feminine movement and light with every gesture.",
    category: "bracelets",
    metalType: "rose_gold",
    gemstone: "Cubic Zirconia",
    isFeatured: false,
  },
  {
    folder: "12 Gents breslate",
    sku: "SPZ-BR-010",
    name: "Hellenic Crest Men's Bracelet",
    description:
      "A bold men's bracelet on a black stainless band, centred by a gold crest plaque framed in a border of cubic zirconia. Confident, architectural, everyday luxury.",
    category: "bracelets",
    metalType: "gold",
    gemstone: "Cubic Zirconia",
    isFeatured: false,
  },
  {
    folder: "13 Gents braslate",
    sku: "SPZ-BR-011",
    name: "Azure Checker Men's Bracelet",
    description:
      "A men's black Milanese-mesh bracelet with a gold checkerboard clasp cradling an emerald-cut blue topaz, flanked by cubic-zirconia accents. Modern and understated.",
    category: "bracelets",
    metalType: "gold",
    gemstone: "Blue Topaz & Cubic Zirconia",
    isFeatured: false,
  },
  {
    folder: "14 Gents braslate",
    sku: "SPZ-BR-012",
    name: "Noir Pavé Men's Bracelet",
    description:
      "A striking men's bracelet pairing a black band with a rose-gold plaque fully paved in cubic zirconia. Sleek contrast for a powerful statement.",
    category: "bracelets",
    metalType: "rose_gold",
    gemstone: "Cubic Zirconia",
    isFeatured: false,
  },
  {
    folder: "15 Gents braslate",
    sku: "SPZ-BR-013",
    name: "Monogram Plaque Men's Bracelet",
    description:
      "A men's black band bracelet finished with a gold monogram plaque and pavé cubic-zirconia detailing. Contemporary and distinctive.",
    category: "bracelets",
    metalType: "gold",
    gemstone: "Cubic Zirconia",
    isFeatured: false,
  },
  {
    folder: "16 Gents braslate",
    sku: "SPZ-BR-014",
    name: "Cabinet Link Men's Bracelet",
    description:
      "A men's black band bracelet with a gold chain-link motif plaque bordered in cubic zirconia. Timeless masculine detailing.",
    category: "bracelets",
    metalType: "gold",
    gemstone: "Cubic Zirconia",
    isFeatured: false,
  },
  {
    folder: "17 Gwnts braslate",
    sku: "SPZ-BR-015",
    name: "Panther Emblem Men's Bracelet",
    description:
      "A men's black band bracelet crowned with a gold panther emblem plaque set within a pavé cubic-zirconia frame. Fierce, refined, unmistakable.",
    category: "bracelets",
    metalType: "gold",
    gemstone: "Cubic Zirconia",
    isFeatured: true,
  },
  {
    folder: "18 Ladies Ring",
    sku: "SPZ-RG-003",
    name: "Éclat Solitaire Ring",
    description:
      "A rhodium-finished white-gold solitaire — a brilliant-cut centre stone lifted above a graceful split shank lined with pavé cubic zirconia. Timeless brilliance.",
    category: "rings",
    metalType: "white_gold",
    gemstone: "Cubic Zirconia",
    isFeatured: true,
  },
  {
    folder: "19 Pin",
    sku: "SPZ-BC-001",
    name: "Plume Sapphire Brooch",
    description:
      "A peacock-feather brooch in white gold — cascading diamond-set plumes curling around a deep blue-sapphire centre. A sculptural heirloom for lapel or scarf.",
    category: "necklaces",
    metalType: "white_gold",
    gemstone: "Blue Sapphire & Diamond",
    isFeatured: false,
  },
  {
    folder: "20 Ladies Ring",
    sku: "SPZ-RG-004",
    name: "Harmony Chevron Pavé Ring",
    description:
      "A white-gold chevron ring paved edge to edge with cubic zirconia — a modern zigzag silhouette that stacks beautifully or stands alone.",
    category: "rings",
    metalType: "white_gold",
    gemstone: "Cubic Zirconia",
    isFeatured: false,
  },
  {
    folder: "21 Ladies Ring",
    sku: "SPZ-RG-005",
    name: "Étoile Pavé Ring",
    description:
      "A slender white-gold ring shimmering with pavé cubic zirconia — understated everyday sparkle designed to layer with any look.",
    category: "rings",
    metalType: "white_gold",
    gemstone: "Cubic Zirconia",
    isFeatured: false,
  },
];

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VIDEO_EXT = new Set([".mp4", ".mov", ".webm"]);

// Real photos (jpeg) first as the hero, then AI/studio renders (png)
function orderFiles(files: string[]): string[] {
  const rank = (f: string) => {
    const ext = path.extname(f).toLowerCase();
    if (ext === ".jpeg" || ext === ".jpg") return 0;
    return 1;
  };
  return [...files].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

function sanitizePublicId(name: string): string {
  return name
    .replace(/\.[^.]+$/, "") // drop extension
    .replace(/[^a-zA-Z0-9-_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase();
}

async function uploadFolder(
  def: ProductDef
): Promise<{ images: string[]; videos: string[] }> {
  const dir = path.join(SOURCE_ROOT, def.folder);
  if (!fs.existsSync(dir)) {
    throw new Error(`Folder not found: ${dir}`);
  }

  const entries = fs
    .readdirSync(dir)
    .filter((f) => fs.statSync(path.join(dir, f)).isFile());

  const imageFiles = orderFiles(
    entries.filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
  );
  const videoFiles = entries.filter((f) =>
    VIDEO_EXT.has(path.extname(f).toLowerCase())
  );

  const cloudFolder = `sparenza/${def.sku}`;
  const images: string[] = [];
  const videos: string[] = [];

  for (const file of imageFiles) {
    const res = await cloudinary.uploader.upload(path.join(dir, file), {
      folder: cloudFolder,
      public_id: sanitizePublicId(file),
      overwrite: true,
      resource_type: "image",
    });
    images.push(res.secure_url);
    console.log(`   [img] ${file} -> ${res.secure_url}`);
  }

  for (const file of videoFiles) {
    const res = await cloudinary.uploader.upload(path.join(dir, file), {
      folder: cloudFolder,
      public_id: sanitizePublicId(file),
      overwrite: true,
      resource_type: "video",
    });
    videos.push(res.secure_url);
    console.log(`   [vid] ${file} -> ${res.secure_url}`);
  }

  return { images, videos };
}

async function run() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error("Missing Cloudinary env vars. Aborting.");
    process.exit(1);
  }

  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/sparenza-jewels"
  );
  console.log(`MongoDB Connected: ${mongoose.connection.name}\n`);

  let ok = 0;
  for (const def of PRODUCTS) {
    console.log(`Processing ${def.sku} — ${def.name} (${def.folder})`);
    const { images, videos } = await uploadFolder(def);

    if (images.length === 0) {
      console.warn(`   ! No images found, skipping DB write for ${def.sku}`);
      continue;
    }

    const doc = await Product.findOneAndUpdate(
      { sku: def.sku },
      {
        $set: {
          name: def.name,
          description: def.description,
          price: 0, // price hidden on storefront — WhatsApp inquiry model
          category: def.category,
          metalType: def.metalType,
          gemstone: def.gemstone,
          images,
          videos,
          isFeatured: def.isFeatured,
        },
        $setOnInsert: {
          sku: def.sku,
          stock: 10,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );

    console.log(
      `   ✓ Saved ${def.sku}  (${images.length} images, ${videos.length} videos)  _id=${doc?._id}\n`
    );
    ok++;
  }

  console.log(`\nDone. ${ok}/${PRODUCTS.length} products upserted.`);
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
