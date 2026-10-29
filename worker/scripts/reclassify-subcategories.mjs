// ═══════════════════════════════════════════════════════════
// One-off: re-classify product `subcategory` from each product's
// name + description, so the storefront's sub-category menu/filter
// pages resolve to real products.
//
// WHY: most rings/necklaces/earrings/bracelets were imported with no
// subcategory (or an older slug scheme), so menu links like Tennis /
// Halo / Hoops returned 0 products. This stamps a subcategory using the
// SAME keyword scheme the menu uses (client/src/config/subcategories.ts).
//
// SAFE BY DESIGN:
//  • Only rings / necklaces / earrings / bracelets are touched. Coins,
//    accessories, watches, diamonds are left exactly as-is.
//  • A product is only ever CHANGED on a confident keyword match — an
//    existing tag is never wiped to null.
//  • First match wins, most-specific first (order below mirrors the menu).
//
// USAGE (from worker/, with the Accelerate URL in the environment):
//   DATABASE_URL="prisma://..."  node scripts/reclassify-subcategories.mjs --dry
//   DATABASE_URL="prisma://..."  node scripts/reclassify-subcategories.mjs --write
// --dry (default) prints what WOULD change and writes nothing.
// ═══════════════════════════════════════════════════════════

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrismaClient } = require("../src/generated/prisma/index.js");
const { withAccelerate } = require("@prisma/extension-accelerate");

const WRITE = process.argv.includes("--write");
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL (the prisma:// Accelerate URL). Set it and retry.");
  process.exit(1);
}

// Keyword scheme — keep in sync with client/src/config/subcategories.ts.
// Order matters: most-specific first; first keyword hit wins.
const SCHEME = {
  rings: [
    ["engagement-rings", ["engagement", "solitaire"]],
    ["eternity-rings", ["eternity"]],
    ["halo-rings", ["halo"]],
    ["cocktail-rings", ["cocktail", "statement", "cluster", "three stone", "trilogy", "signet"]],
    ["wedding-bands", ["wedding", "band"]],
  ],
  necklaces: [
    ["chokers", ["choker", "collar"]],
    ["mangalsutra", ["mangalsutra", "mangal sutra", "mangalsutram"]],
    ["tennis-necklaces", ["tennis", "station", "riviere", "rivière", "lariat"]],
    ["pendants", ["pendant", "locket", "charm", "drop"]],
    ["pearl-necklaces", ["pearl"]],
    ["chains", ["chain"]],
  ],
  earrings: [
    ["nose-pins", ["nose pin", "nose-pin", "nosepin", "nose ring", "nath"]],
    ["ear-cuffs", ["ear cuff", "climber", "threader", "sui dhaga"]],
    ["hoops", ["hoop", "huggie"]],
    ["studs", ["stud"]],
    ["drop-earrings", ["drop", "dangle", "dangler", "chandelier", "jhumk", "jhumar"]],
  ],
  bracelets: [
    ["tennis-bracelets", ["tennis"]],
    ["anklets", ["anklet", "payal"]],
    ["cuffs", ["cuff"]],
    ["bangles", ["bangle", "kada"]],
    ["charm-bracelets", ["charm", "beaded"]],
    ["chain-bracelets", ["chain", "link", "cuban", "paperclip"]],
  ],
};

function classify(category, name, description) {
  const hay = `${name || ""} ${description || ""}`.toLowerCase();
  for (const [slug, kws] of SCHEME[category]) {
    if (kws.some((k) => hay.includes(k))) return slug;
  }
  return null;
}

const chunk = (arr, n) => {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
};

const prisma = new PrismaClient({ datasourceUrl: DATABASE_URL }).$extends(withAccelerate());

async function run() {
  console.log(WRITE ? "WRITE mode — the database WILL be updated.\n" : "DRY run — no writes.\n");
  let grandChanges = 0;

  for (const category of Object.keys(SCHEME)) {
    const products = await prisma.product.findMany({
      where: { category },
      select: { id: true, name: true, description: true, subcategory: true },
    });

    // Group product ids by the slug they should become — only where it differs
    // from the current value. A no-match never clears an existing tag.
    const bySlug = {};
    for (const p of products) {
      const slug = classify(category, p.name, p.description);
      if (!slug || slug === p.subcategory) continue;
      (bySlug[slug] ||= []).push(p.id);
    }

    const changes = Object.values(bySlug).reduce((s, ids) => s + ids.length, 0);
    grandChanges += changes;
    console.log(`### ${category}  (${products.length} products, ${changes} to change)`);
    for (const [slug, ids] of Object.entries(bySlug).sort((a, b) => b[1].length - a[1].length)) {
      console.log(`  ${slug.padEnd(20)} ${ids.length}`);
      if (WRITE) {
        for (const ids500 of chunk(ids, 500)) {
          await prisma.product.updateMany({ where: { id: { in: ids500 } }, data: { subcategory: slug } });
        }
      }
    }
    console.log("");
  }

  console.log(`${WRITE ? "Updated" : "Would update"} ${grandChanges} products total.`);
  await prisma.$disconnect();
}

run().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
