// Taxonomy normalisation. DRY-RUN by default (no writes); pass --apply to write.
// Computes canonical { category, subcategory, style } for every product.
const { MongoClient } = require('mongodb');
const fs = require('fs');

const APPLY = process.argv.includes('--apply');
const env = fs.readFileSync(process.argv[2], 'utf8');
const uri = env.match(/^MONGO_URI=(.+)$/m)[1].trim();
const dbName = (uri.match(/\.net\/([^?]+)/) || [, 'sparenza-jewels'])[1];

// raw category -> canonical top-level category
const CATEGORY_MAP = {
  'earrings': 'earrings', 'rings': 'rings', 'necklaces': 'necklaces', 'bracelets': 'bracelets', 'watches': 'watches',
  'pendants': 'necklaces', 'chains': 'necklaces', 'mangalsutra': 'necklaces', 'mangalsutra chains': 'necklaces',
  'preset solitaire pendants': 'necklaces', 'preset solitaire mangalsutra': 'necklaces',
  'bangles': 'bracelets', 'adjustable bracelets': 'bracelets', 'kids bracelets': 'bracelets', 'kids bangles': 'bracelets',
  'anklets': 'bracelets', 'charms': 'bracelets', 'preset solitaire bangles': 'bracelets',
  'preset solitaire rings': 'rings', 'adjustable rings': 'rings', 'thumb rings': 'rings', 'midi rings': 'rings', 'kids rings': 'rings',
  'preset solitaire earrings': 'earrings', 'nose pins': 'earrings', 'nose screws': 'earrings', 'nose rings': 'earrings',
  'watch accessory': 'watches',
  'gold coins': 'coins', 'silver coins': 'coins',
  'cufflinks': 'accessories', 'preset solitaire cufflinks': 'accessories', 'brooch': 'accessories',
  'hair pins': 'accessories', 'tie pin': 'accessories', 'maang tikka': 'accessories',
};

// raw category -> subcategory slug (when the category itself denotes a sub-type)
const CATEGORY_DERIVED_SUBCAT = {
  'pendants': 'pendants', 'preset solitaire pendants': 'pendants',
  'chains': 'chains',
  'mangalsutra': 'mangalsutra', 'mangalsutra chains': 'mangalsutra', 'preset solitaire mangalsutra': 'mangalsutra',
  'bangles': 'bangles', 'kids bangles': 'bangles', 'preset solitaire bangles': 'bangles',
  'anklets': 'anklets', 'charms': 'charm-bracelets',
  'preset solitaire rings': 'solitaire-rings',
  'preset solitaire earrings': 'studs',
  'nose pins': 'nose-pins', 'nose screws': 'nose-pins', 'nose rings': 'nose-pins',
  'cufflinks': 'cufflinks', 'preset solitaire cufflinks': 'cufflinks',
  'brooch': 'brooch', 'hair pins': 'hair-pins', 'tie pin': 'tie-pin', 'maang tikka': 'maang-tikka',
  'gold coins': 'gold-coins', 'silver coins': 'silver-coins',
};

// existing proper subcategory slug -> canonical slug
const SUBCAT_MAP = {
  'stud-earrings': 'studs', 'hoop-earrings': 'hoops', 'drop-earrings': 'drop-earrings', 'ear-cuffs': 'ear-cuffs',
  'chain-bracelets': 'chain-bracelets', 'tennis-bracelets': 'tennis-bracelets', 'charm-bracelets': 'charm-bracelets', 'cuffs': 'cuffs', 'bangles': 'bangles',
  'tennis-necklaces': 'tennis-necklaces', 'pearl-necklaces': 'pearl-necklaces', 'chokers': 'chokers', 'pendants': 'pendants', 'chains': 'chains',
  'wedding-bands': 'wedding-bands', 'engagement-rings': 'engagement-rings', 'eternity-rings': 'eternity-rings', 'cocktail-rings': 'cocktail-rings', 'halo-rings': 'halo-rings',
};

// material tag (in subcategory) -> style slug
const STYLE_MAP = {
  'Polki Studded': 'polki', 'Plain Gold': 'plain', 'Gemstone Studded': 'gemstone',
  'Platinum Diamond Jewellery': 'diamond', 'Platinum Plain Jewellery': 'plain', 'Platinum Gemstone Studded': 'gemstone',
};

function compute(p) {
  const rawCat = p.category;
  const rawSub = p.subcategory;
  const newCat = CATEGORY_MAP[rawCat] || rawCat;
  let newSub = CATEGORY_DERIVED_SUBCAT[rawCat] || null;
  if (!newSub && rawSub && SUBCAT_MAP[rawSub]) newSub = SUBCAT_MAP[rawSub];
  const newStyle = (rawSub && STYLE_MAP[rawSub]) || p.style || null;
  return { newCat, newSub, newStyle };
}

function tally(map, key) { map.set(key, (map.get(key) || 0) + 1); }

(async () => {
  const c = new MongoClient(uri, { serverSelectionTimeoutMS: 20000 });
  await c.connect();
  const col = c.db(dbName).collection('products');
  const cursor = col.find({}, { projection: { category: 1, subcategory: 1, style: 1, name: 1 } });

  const catDist = new Map(), subDist = new Map(), styleDist = new Map();
  let total = 0, catChanged = 0, subChanged = 0, styleSet = 0, subNulled = 0;
  const samples = [];
  const ops = [];

  for await (const p of cursor) {
    total++;
    const { newCat, newSub, newStyle } = compute(p);
    tally(catDist, newCat);
    tally(subDist, newSub || '(none)');
    tally(styleDist, newStyle || '(none)');
    if (newCat !== p.category) catChanged++;
    if ((newSub || null) !== (p.subcategory || null)) subChanged++;
    if (newStyle && newStyle !== (p.style || null)) styleSet++;
    if (!newSub && p.subcategory) subNulled++;
    if (samples.length < 12 && (newCat !== p.category || (newSub || null) !== (p.subcategory || null))) {
      samples.push(`  "${p.name}"\n     cat: ${JSON.stringify(p.category)} -> ${JSON.stringify(newCat)} | sub: ${JSON.stringify(p.subcategory)} -> ${JSON.stringify(newSub)} | style: ${JSON.stringify(newStyle)}`);
    }
    if (APPLY) {
      ops.push({ updateOne: { filter: { _id: p._id }, update: { $set: { category: newCat, subcategory: newSub, style: newStyle } } } });
    }
  }

  const sortDesc = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]);
  console.log(`MODE: ${APPLY ? 'APPLY (writing)' : 'DRY-RUN (no writes)'} | total products: ${total}`);
  console.log(`\nChanges: category ${catChanged}, subcategory ${subChanged} (of which cleared: ${subNulled}), style set ${styleSet}`);
  console.log('\n== NEW CATEGORY distribution ==');
  sortDesc(catDist).forEach(([k, n]) => console.log(`  ${String(n).padStart(5)}  ${k}`));
  console.log('\n== NEW SUBCATEGORY distribution ==');
  sortDesc(subDist).forEach(([k, n]) => console.log(`  ${String(n).padStart(5)}  ${k}`));
  console.log('\n== NEW STYLE distribution ==');
  sortDesc(styleDist).forEach(([k, n]) => console.log(`  ${String(n).padStart(5)}  ${k}`));
  console.log('\n== SAMPLE changes ==');
  samples.forEach(s => console.log(s));

  if (APPLY && ops.length) {
    console.log(`\nApplying ${ops.length} updates in batches...`);
    for (let i = 0; i < ops.length; i += 1000) {
      await col.bulkWrite(ops.slice(i, i + 1000), { ordered: false });
      process.stdout.write(`  ${Math.min(i + 1000, ops.length)}/${ops.length}\r`);
    }
    console.log('\nDone.');
  }

  await c.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
