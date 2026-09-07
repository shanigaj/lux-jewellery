// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Journal Articles (static, SEO-indexable)
// ═══════════════════════════════════════════════════════════
//
// These articles are server-rendered so search engines can index the full
// content (unlike the CMS/API blogs which load on the client). Add or edit an
// entry here and it appears in the Journal list and at /journal/<slug>.
//
// `blocks` render as real headings, paragraphs, lists and pull-quotes — see
// the renderer in app/(main)/journal/ArticleBlocks.tsx.

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export interface JournalArticle {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string; // ISO date the piece was published
  readMinutes: number;
  category: string;
  tags: string[];
  blocks: ArticleBlock[];
}

export const journalArticles: JournalArticle[] = [
  {
    slug: "the-4cs-of-diamonds-explained",
    title: "The 4Cs of Diamonds, Explained Simply",
    excerpt:
      "Cut, Colour, Clarity and Carat decide how a diamond looks and what it costs. Here is what each one actually means — and where it is worth spending.",
    author: "Sparenza Atelier",
    date: "2026-01-12",
    readMinutes: 7,
    category: "Diamond Guide",
    tags: ["4Cs", "diamond buying", "GIA"],
    blocks: [
      { type: "p", text: "Every diamond is graded on four qualities — the 4Cs. Understanding them is the single most useful thing you can do before buying, because it lets you compare stones honestly and put your budget where your eye will actually notice it." },
      { type: "h2", text: "Cut — the one that makes a diamond sparkle" },
      { type: "p", text: "Cut is not the shape of the diamond; it is how well its facets are proportioned and polished. A well-cut stone bounces light back to your eye as brilliance and fire. A poorly cut one looks dull even if it is large and flawless. If you remember only one thing from this guide: never compromise on cut. Aim for Excellent or Very Good." },
      { type: "h2", text: "Colour — how white the diamond is" },
      { type: "p", text: "Colourless diamonds are graded D (icy white) down to Z (noticeably tinted). The difference between neighbouring grades is subtle. For white-gold and platinum settings, G–H offers a diamond that looks white to the eye at a fraction of the price of D–F. In yellow or rose gold, you can go a grade or two lower still, because the warm metal masks faint tint." },
      { type: "h2", text: "Clarity — the tiny natural marks inside" },
      { type: "p", text: "Almost every diamond has microscopic inclusions formed as it grew. Clarity runs from Flawless (FL) to Included (I). The sweet spot for most buyers is VS1–VS2 or a well-chosen SI1 — 'eye-clean', meaning no inclusion is visible without magnification, while costing far less than a flawless stone." },
      { type: "h2", text: "Carat — the weight, not the size" },
      { type: "list", items: [
        "Carat measures weight, so two one-carat diamonds can look different sizes depending on cut.",
        "Prices jump at round numbers (1.00ct, 2.00ct). A 0.90ct stone can look almost identical to a 1.00ct for noticeably less.",
        "Face-up diameter matters more to the eye than weight — ask for millimetre measurements.",
      ] },
      { type: "quote", text: "Spend on cut, choose colour and clarity by what the eye can see, and buy carat last. That order gives you the most beautiful diamond for your budget." },
      { type: "p", text: "Every Sparenza diamond is chosen against these standards and supplied with a GIA or IGI certificate so you can verify the grading independently. Speak with our team and we will help you balance the 4Cs for the look you want." },
    ],
  },
  {
    slug: "lab-grown-vs-natural-diamonds",
    title: "Lab-Grown vs Natural Diamonds: An Honest Comparison",
    excerpt:
      "They are chemically the same stone — so what really separates a lab-grown diamond from a mined one? Price, resale, sustainability and how to choose.",
    author: "Sparenza Atelier",
    date: "2026-01-20",
    readMinutes: 6,
    category: "Diamond Guide",
    tags: ["lab-grown", "natural diamonds", "buying guide"],
    blocks: [
      { type: "p", text: "A lab-grown diamond is a real diamond. It has the same carbon crystal structure, the same hardness, the same sparkle as a mined one — the only difference is that it grew in a laboratory over weeks rather than underground over billions of years. A jeweller's loupe cannot tell them apart; only specialised equipment can." },
      { type: "h2", text: "The case for lab-grown" },
      { type: "list", items: [
        "Price: typically 30–50% less than a mined diamond of the same 4Cs, so you can buy larger or cleaner for the same budget.",
        "Traceability: guaranteed conflict-free and made without mining.",
        "Consistency: available in very high clarity and colour grades reliably.",
      ] },
      { type: "h2", text: "The case for natural" },
      { type: "list", items: [
        "Rarity: a mined diamond is finite and billions of years old — for many buyers that story is the point.",
        "Resale and heirloom value: natural diamonds hold value better on the second-hand market.",
        "Tradition: for engagement and bridal pieces meant to be passed down, many still prefer mined stones.",
      ] },
      { type: "h2", text: "So which should you choose?" },
      { type: "p", text: "There is no wrong answer — only what matters to you. If maximising size and clarity for your budget is the priority, lab-grown is compelling. If rarity, tradition and long-term value matter more, choose natural. Both are certified, both are graded on the same 4Cs, and both are set with the same care at Sparenza." },
      { type: "quote", text: "Buy the stone that means the most to you — not the one an internet argument tells you to prefer." },
      { type: "p", text: "Whichever you choose, insist on independent certification (GIA or IGI) that states clearly whether the diamond is natural or laboratory-grown. Every Sparenza diamond is labelled honestly on its certificate and invoice." },
    ],
  },
  {
    slug: "how-to-choose-an-engagement-ring",
    title: "How to Choose an Engagement Ring: A Step-by-Step Guide",
    excerpt:
      "From setting the budget to picking the setting and keeping it a surprise — a calm, practical walkthrough to the most meaningful purchase you'll make.",
    author: "Sparenza Atelier",
    date: "2026-02-02",
    readMinutes: 8,
    category: "Bridal",
    tags: ["engagement rings", "bridal", "buying guide"],
    blocks: [
      { type: "p", text: "Choosing an engagement ring feels enormous because it matters. Break it into steps and it becomes not just manageable but genuinely enjoyable. Here is the order we walk our clients through." },
      { type: "h2", text: "1. Set a budget you're comfortable with" },
      { type: "p", text: "Forget the old 'three months' salary' rule — it was a marketing slogan. Decide what you can spend happily, and we will design the most beautiful ring within it. A well-chosen ₹80,000 ring can outshine a carelessly chosen ₹2,00,000 one." },
      { type: "h2", text: "2. Learn their style" },
      { type: "list", items: [
        "Notice the jewellery they already wear — yellow, white or rose metal? Delicate or bold?",
        "Classic or modern? A timeless solitaire, or something with vintage detail?",
        "Quietly ask a close friend or sibling — they are your best source of intelligence.",
      ] },
      { type: "h2", text: "3. Choose the diamond shape" },
      { type: "p", text: "The shape sets the whole character of the ring. Round brilliant is the most popular and the most sparkling; oval looks larger for its weight; emerald cut is elegant and understated; princess is modern and geometric. If in doubt, round is never wrong." },
      { type: "h2", text: "4. Pick the setting" },
      { type: "p", text: "A solitaire celebrates the stone alone. A halo surrounds it with smaller diamonds to add sparkle and size. A three-stone setting symbolises past, present and future. The setting also affects how secure and how everyday-wearable the ring is." },
      { type: "h2", text: "5. Get the ring size right" },
      { type: "p", text: "If it is a surprise, borrow a ring they already wear on that finger and bring it to us, or ask about our free resizing. See our size guide for measuring at home." },
      { type: "quote", text: "The best engagement ring is not the biggest or the most expensive — it's the one that looks like it was made for the person wearing it." },
      { type: "p", text: "Every Sparenza engagement ring is made to order, so it fits your budget, their style and their finger exactly. Book a private consultation and we will design it with you." },
    ],
  },
  {
    slug: "understanding-bis-hallmarking",
    title: "BIS Hallmarking: How to Know Your Gold is Really Gold",
    excerpt:
      "The BIS hallmark and its six-digit HUID are your legal guarantee of gold purity in India. Here's how to read them — and why they matter.",
    author: "Sparenza Atelier",
    date: "2026-02-10",
    readMinutes: 5,
    category: "Buying Guide",
    tags: ["BIS hallmark", "gold purity", "HUID"],
    blocks: [
      { type: "p", text: "When you buy gold jewellery in India, the BIS hallmark is your protection. It is a certification from the Bureau of Indian Standards confirming that the gold's purity is exactly what the seller claims. Since it became mandatory, every piece of hallmarked gold carries marks you can — and should — check." },
      { type: "h2", text: "What the hallmark actually shows" },
      { type: "list", items: [
        "The BIS logo — the triangular standards mark itself.",
        "The purity in karats and fineness — for example '22K916' means 22-karat gold that is 91.6% pure.",
        "A six-character alphanumeric HUID (Hallmark Unique Identification) — unique to that individual piece.",
      ] },
      { type: "h2", text: "Why the HUID matters" },
      { type: "p", text: "The HUID makes each piece traceable. You can enter it in the official BIS CARE app to confirm the jeweller, the purity and that the mark is genuine. It means a hallmark can no longer be faked with a simple stamp — the number has to match the national register." },
      { type: "h2", text: "Purity, simply" },
      { type: "list", items: [
        "24K = 99.9% pure (too soft for most jewellery).",
        "22K = 91.6% pure — traditional for Indian gold jewellery.",
        "18K = 75.0% pure — stronger, ideal for diamond settings.",
        "14K = 58.5% pure — the most durable, good for everyday wear.",
      ] },
      { type: "quote", text: "If gold jewellery has no BIS hallmark and no HUID, treat the purity claim as unverified — full stop." },
      { type: "p", text: "Every gold piece from Sparenza is BIS hallmarked with a HUID you can verify yourself, and every diamond carries its own GIA or IGI certificate. Buying certified is not a luxury — it is the baseline you should expect." },
    ],
  },
  {
    slug: "gia-vs-igi-certification",
    title: "GIA vs IGI: What a Diamond Certificate Really Tells You",
    excerpt:
      "A diamond certificate is an independent grading report, not a valuation. Here's the difference between GIA and IGI — and what to check on any report.",
    author: "Sparenza Atelier",
    date: "2026-02-18",
    readMinutes: 6,
    category: "Diamond Guide",
    tags: ["GIA", "IGI", "certification"],
    blocks: [
      { type: "p", text: "A diamond certificate — properly, a grading report — is issued by an independent laboratory that has examined the loose stone and recorded its exact characteristics. It is not a price tag or a valuation; it is an objective description you can trust because the lab has no stake in the sale." },
      { type: "h2", text: "GIA — the global benchmark" },
      { type: "p", text: "The Gemological Institute of America created the 4Cs and is regarded worldwide as the strictest, most consistent grader. A GIA report carries the most weight for natural diamonds, especially larger and higher-value stones, and supports the best resale confidence." },
      { type: "h2", text: "IGI — widely used, strong for lab-grown" },
      { type: "p", text: "The International Gemological Institute grades quickly, at scale, and is the dominant certifier for lab-grown diamonds and for set jewellery in India. Its reports are reliable and detailed; on average GIA is regarded as marginally stricter on colour and clarity, so compare like-for-like rather than across labs." },
      { type: "h2", text: "What to check on any report" },
      { type: "list", items: [
        "The report number — verify it on the lab's official online database.",
        "Cut, colour, clarity and carat, plus the diamond's measurements.",
        "Whether the stone is stated as natural or laboratory-grown.",
        "Any treatments disclosed (e.g. fracture-filling or HPHT).",
      ] },
      { type: "quote", text: "Buy the diamond, then read the certificate to confirm what your eye already told you — never the other way around." },
      { type: "p", text: "Sparenza supplies a GIA or IGI report with every certified diamond, and we will happily walk you through the report line by line before you decide." },
    ],
  },
  {
    slug: "gold-purity-22k-18k-14k",
    title: "22K, 18K or 14K? Choosing the Right Gold for Your Piece",
    excerpt:
      "Higher karat isn't always better. Here's how gold purity affects colour, strength and price — and which to pick for rings, chains and diamond settings.",
    author: "Sparenza Atelier",
    date: "2026-02-26",
    readMinutes: 5,
    category: "Buying Guide",
    tags: ["gold purity", "karats", "metals"],
    blocks: [
      { type: "p", text: "Pure gold is 24 karat — but it is also very soft, which is why jewellery is made from gold alloyed with other metals for strength. The karat number tells you how much of the alloy is pure gold. Choosing the right karat is about matching purity to how the piece will be worn." },
      { type: "h2", text: "22K — rich, traditional, for pieces you'll treasure" },
      { type: "p", text: "At 91.6% pure, 22K has the deep, warm yellow associated with Indian gold jewellery. It is ideal for pieces worn occasionally — bridal sets, bangles, chains — where colour and gold content matter more than everyday toughness." },
      { type: "h2", text: "18K — the sweet spot for diamond jewellery" },
      { type: "p", text: "At 75% pure, 18K is noticeably stronger while still clearly rich in colour. It holds diamonds and gemstones securely, which is why it is the standard for fine diamond rings and pendants. It is also the base for most white and rose gold." },
      { type: "h2", text: "14K — the most durable, for everyday wear" },
      { type: "p", text: "At 58.5% pure, 14K resists scratches and bending best, making it a smart choice for rings and bracelets worn every single day. The colour is slightly lighter, and the price per gram is lower." },
      { type: "quote", text: "Wearing it daily? Lean to 18K or 14K. Saving it for occasions? 22K rewards you with colour and gold content." },
      { type: "p", text: "Every Sparenza piece can be made in the karat and colour you prefer, all BIS hallmarked. Tell us how you'll wear it and we'll recommend the ideal purity." },
    ],
  },
  {
    slug: "how-to-measure-ring-size-at-home",
    title: "How to Measure Your Ring Size at Home (Accurately)",
    excerpt:
      "No jeweller nearby? Three reliable ways to find your ring size using things you already own — plus the mistakes that throw the measurement off.",
    author: "Sparenza Atelier",
    date: "2026-03-05",
    readMinutes: 5,
    category: "Guides",
    tags: ["ring size", "how-to", "fit"],
    blocks: [
      { type: "p", text: "A ring that fits should slide over the knuckle with a little resistance and sit snugly without pinching. Here are three ways to measure at home, in order of reliability." },
      { type: "h2", text: "Method 1 — measure a ring you already own (most accurate)" },
      { type: "list", items: [
        "Take a ring that fits the correct finger well.",
        "Measure the inside diameter across the middle, in millimetres.",
        "Match that diameter to a ring-size chart — or send it to us and we'll convert it.",
      ] },
      { type: "h2", text: "Method 2 — the string or paper strip method" },
      { type: "list", items: [
        "Wrap a thin strip of paper or string snugly around the base of the finger.",
        "Mark where it overlaps, then measure the length in millimetres — that's the circumference.",
        "Divide by 3.14 to get the diameter, or match the circumference to a chart.",
      ] },
      { type: "h2", text: "Get it right: the details that matter" },
      { type: "list", items: [
        "Measure at the end of the day, when fingers are at their largest.",
        "Avoid measuring when cold — fingers shrink and you'll size too small.",
        "For wide bands, size up slightly; they fit tighter than thin ones.",
        "Measure the exact finger you'll wear it on — hands differ left to right.",
      ] },
      { type: "quote", text: "When in doubt, size up. A ring that's a touch loose can be resized down far more easily than a tight one can be stretched." },
      { type: "p", text: "Sparenza offers a complimentary first resize on eligible rings within 30 days, so you can order with confidence. See our full size guide for detailed charts." },
    ],
  },
  {
    slug: "caring-for-your-diamond-jewellery",
    title: "How to Care for Diamond Jewellery So It Lasts Generations",
    excerpt:
      "Diamonds are tough, but their settings aren't invincible. A simple at-home routine — and a few things to never do — keep your pieces brilliant for life.",
    author: "Sparenza Atelier",
    date: "2026-03-14",
    readMinutes: 5,
    category: "Care",
    tags: ["jewellery care", "cleaning", "maintenance"],
    blocks: [
      { type: "p", text: "A diamond is the hardest natural material on earth, but 'hard' and 'indestructible' are not the same. Dirt dulls its sparkle, and the metal holding it can wear over years. A little care keeps a piece looking as good as the day it was made." },
      { type: "h2", text: "The simple at-home clean" },
      { type: "list", items: [
        "Soak the piece for 20 minutes in warm water with a drop of mild dish soap.",
        "Brush gently behind the diamond with a soft toothbrush — that's where oils collect and kill sparkle.",
        "Rinse well (with the plug in the basin!) and dry with a lint-free cloth.",
        "Do this every couple of weeks for pieces you wear often.",
      ] },
      { type: "h2", text: "What to avoid" },
      { type: "list", items: [
        "Chlorine and harsh chemicals — remove rings before swimming or cleaning.",
        "Wearing jewellery in the gym or during rough work; knocks loosen prongs.",
        "Storing pieces loose together — diamonds scratch other metals and stones.",
        "Ultrasonic cleaners on fragile or treated stones without checking first.",
      ] },
      { type: "h2", text: "The habit that saves heartbreak" },
      { type: "p", text: "Once a year, have a jeweller inspect the settings and re-tighten the prongs. Most lost diamonds are lost not to theft but to a worn claw that finally gives way — and a two-minute check prevents it." },
      { type: "quote", text: "Store each piece separately, clean it gently, and have the settings checked yearly. That's ninety percent of jewellery care." },
      { type: "p", text: "Sparenza offers complimentary cleaning and inspection at our boutique for every piece we make. Bring your jewellery in and we'll keep it brilliant." },
    ],
  },
  {
    slug: "diamond-shapes-guide",
    title: "A Guide to Diamond Shapes: Finding the One That's You",
    excerpt:
      "Round, oval, princess, emerald and more — each diamond shape has its own personality, sparkle and value. Here's how to choose the right one.",
    author: "Sparenza Atelier",
    date: "2026-03-22",
    readMinutes: 6,
    category: "Diamond Guide",
    tags: ["diamond shapes", "cuts", "buying guide"],
    blocks: [
      { type: "p", text: "Shape is the first thing you notice about a diamond and the choice that most shapes a ring's character. It also affects price and how large the stone looks. Here are the shapes worth knowing." },
      { type: "h2", text: "Round Brilliant" },
      { type: "p", text: "The most popular shape and the most brilliant, engineered with 57 facets to maximise sparkle. It is the safest, most timeless choice — and, being in highest demand, the most expensive per carat." },
      { type: "h2", text: "Oval" },
      { type: "p", text: "Nearly as sparkling as round, but its elongated outline looks larger for the same weight and flatters the finger by making it appear longer. A favourite for those who want presence and value." },
      { type: "h2", text: "Princess" },
      { type: "p", text: "A square shape with sharp corners and lots of fire — modern, geometric and slightly less costly than round for the same carat. Its corners need a protective setting." },
      { type: "h2", text: "Emerald & Cushion" },
      { type: "list", items: [
        "Emerald: a rectangular step-cut with long, elegant flashes rather than sparkle — sophisticated and understated. It shows clarity, so choose a cleaner stone.",
        "Cushion: a soft, rounded square with a romantic, vintage feel and a warm, glowing brilliance.",
      ] },
      { type: "quote", text: "Round for maximum sparkle, oval for size-per-carat, emerald for quiet elegance, princess for modern edge. Start with the feeling you want." },
      { type: "p", text: "Whatever shape speaks to you, Sparenza will source a certified stone to match and build the setting around it. Come and see the shapes side by side — the difference is easier to feel than to read." },
    ],
  },
  {
    slug: "solitaire-halo-three-stone-settings",
    title: "Solitaire, Halo or Three-Stone? Choosing a Ring Setting",
    excerpt:
      "The setting decides how big the diamond looks, how much it sparkles and what it means. A clear comparison of the three most-loved styles.",
    author: "Sparenza Atelier",
    date: "2026-03-30",
    readMinutes: 5,
    category: "Bridal",
    tags: ["ring settings", "solitaire", "halo"],
    blocks: [
      { type: "p", text: "Two rings with the same diamond can look completely different depending on the setting. The setting is what turns a stone into a piece of jewellery — and it changes the ring's presence, sparkle, security and cost." },
      { type: "h2", text: "The Solitaire" },
      { type: "p", text: "A single diamond, nothing to distract from it. Timeless, elegant and endlessly re-wearable, the solitaire puts every rupee into the stone itself. If you want a ring that will never look dated, this is it." },
      { type: "h2", text: "The Halo" },
      { type: "p", text: "A ring of small diamonds encircles the centre stone, adding sparkle and making the centre look noticeably larger. A halo lets a modest centre diamond carry real presence — excellent value if size and shine matter to you." },
      { type: "h2", text: "The Three-Stone" },
      { type: "p", text: "A centre diamond flanked by two smaller ones, traditionally symbolising a couple's past, present and future. It carries meaning and a fuller look across the finger, and works beautifully with pear or oval side stones." },
      { type: "quote", text: "Want the diamond to be the whole story? Solitaire. Want maximum sparkle for the size? Halo. Want the ring to mean something? Three-stone." },
      { type: "p", text: "Every setting at Sparenza is made to order, so we can adapt any of these to your stone, your budget and your hand. Book a design consultation to see them on your finger." },
    ],
  },
  {
    slug: "platinum-vs-white-gold",
    title: "Platinum vs White Gold: Which Should You Choose?",
    excerpt:
      "They look almost identical — but they age differently, cost differently and suit different lifestyles. Here's how to decide between platinum and white gold.",
    author: "Sparenza Atelier",
    date: "2026-04-08",
    readMinutes: 5,
    category: "Buying Guide",
    tags: ["platinum", "white gold", "metals"],
    blocks: [
      { type: "p", text: "Stand a platinum ring next to a white-gold one and most people can't tell them apart. The difference is in how they behave over years of wear, and in price. Here's what actually separates them." },
      { type: "h2", text: "White gold" },
      { type: "p", text: "White gold is yellow gold alloyed with white metals and finished with a thin rhodium plating for a bright, cool white. It is lighter, more affordable, and beautifully white — but the rhodium plating wears over time and needs re-coating every year or two to stay bright." },
      { type: "h2", text: "Platinum" },
      { type: "p", text: "Platinum is naturally white all the way through, so it never needs plating. It is denser and heavier, giving a reassuring weight, and more durable for holding diamonds securely. It costs more, both for the metal and because more of it is needed for the same piece." },
      { type: "h2", text: "How they age" },
      { type: "list", items: [
        "White gold keeps a mirror-bright finish — with periodic re-plating.",
        "Platinum develops a soft matte 'patina' with wear, which many people love and which can be polished back to bright any time.",
        "Platinum's whiteness is permanent; white gold's is maintained.",
      ] },
      { type: "quote", text: "Choose platinum for permanence and weight; choose white gold for the same look at a friendlier price, if you don't mind occasional re-plating." },
      { type: "p", text: "Sparenza crafts in both, hallmarked and certified. Tell us your budget and how often you'll wear the piece, and we'll point you to the right metal." },
    ],
  },
  {
    slug: "jewellery-for-indian-weddings",
    title: "Choosing Bridal Jewellery for an Indian Wedding",
    excerpt:
      "From the statement necklace to everyday pieces you'll actually re-wear, a thoughtful guide to building a bridal jewellery wardrobe that lasts beyond the wedding.",
    author: "Sparenza Atelier",
    date: "2026-04-16",
    readMinutes: 7,
    category: "Bridal",
    tags: ["bridal", "wedding", "Indian jewellery"],
    blocks: [
      { type: "p", text: "Bridal jewellery for an Indian wedding is both an emotional and a significant financial decision. The pieces carry family meaning, appear in every photograph, and — chosen well — become heirlooms. Here's how to plan a set you'll treasure long after the mandap." },
      { type: "h2", text: "Start with the outfit and the occasion" },
      { type: "p", text: "Heavy traditional bridalwear can carry a bold polki or diamond necklace; a lighter reception outfit calls for something more delicate. Plan jewellery per event rather than buying one set to force across all of them." },
      { type: "h2", text: "The pieces to prioritise" },
      { type: "list", items: [
        "The statement necklace — the anchor of the bridal look, worth the largest share of the budget.",
        "Matching earrings — often the most re-worn piece afterwards, so choose a versatile design.",
        "The maang tikka or a subtle bracelet to complete the look.",
        "A ring you'll wear for years, not just the ceremony.",
      ] },
      { type: "h2", text: "Buy for after the wedding, too" },
      { type: "p", text: "The most-loved bridal jewellery is the kind that steps into everyday life. Balance one or two grand statement pieces with earrings, a pendant and a ring you'll genuinely re-wear. Made-to-order design lets you tune each piece to be as versatile as you want." },
      { type: "h2", text: "Insist on certification and buyback" },
      { type: "p", text: "Bridal sets are a major purchase — every diamond should be certified, every gold piece BIS hallmarked, and the jeweller should offer a clear lifetime exchange and buyback so the value stays with your family." },
      { type: "quote", text: "Buy fewer, better pieces you'll re-wear — not a drawer of jewellery that only ever saw one evening." },
      { type: "p", text: "Sparenza designs complete bridal sets to order, certified and hallmarked, with lifetime exchange and buyback. Book a private appointment and we'll plan your wedding jewellery together." },
    ],
  },
  {
    slug: "jewellery-buyback-and-value",
    title: "Buyback, Exchange & Resale: Understanding Jewellery Value",
    excerpt:
      "What is your jewellery actually worth later, and how do buyback and exchange really work? A clear-eyed look at value, so there are no surprises.",
    author: "Sparenza Atelier",
    date: "2026-04-24",
    readMinutes: 6,
    category: "Buying Guide",
    tags: ["buyback", "resale", "value"],
    blocks: [
      { type: "p", text: "Fine jewellery is one of the few luxuries that retains real, tangible value — but how much, and how you realise it, depends on understanding buyback and exchange before you buy, not after." },
      { type: "h2", text: "What your piece is worth is made of two parts" },
      { type: "list", items: [
        "The intrinsic value — the gold and the certified diamonds, which track prevailing market rates.",
        "The making — the craft and design, which is a cost when you buy and usually not returned on buyback.",
      ] },
      { type: "h2", text: "Exchange vs buyback" },
      { type: "p", text: "Exchange lets you trade a piece towards a new one, usually on favourable terms because you remain a customer. Buyback returns cash, valued on the day's gold rate and a fresh diamond valuation, less defined deductions. Exchange almost always returns more value than buyback." },
      { type: "h2", text: "What to check before you buy" },
      { type: "list", items: [
        "Is the buyback policy written down, with the deductions stated clearly?",
        "Is it valued at the current market rate, or a fixed lower figure?",
        "Do you need to keep the original certificate and invoice? (Almost always yes — so store them safely.)",
      ] },
      { type: "quote", text: "A generous, transparent buyback policy is one of the clearest signs of a jeweller who stands behind what they sell." },
      { type: "p", text: "Sparenza offers lifetime exchange and buyback on our collections, valued on the prevailing metal rate and diamond valuation, with terms stated plainly. Keep your certificate and invoice, and your value stays protected." },
    ],
  },
  {
    slug: "how-made-to-order-jewellery-is-crafted",
    title: "Inside the Atelier: How Made-to-Order Jewellery is Crafted",
    excerpt:
      "From a sketch to the finished piece in your hand — the journey of a made-to-order Sparenza creation, and why bespoke is worth the wait.",
    author: "Sparenza Atelier",
    date: "2026-05-02",
    readMinutes: 6,
    category: "Craftsmanship",
    tags: ["craftsmanship", "made to order", "bespoke"],
    blocks: [
      { type: "p", text: "When a piece is made to order, nothing about it is left to chance — the design, the metal, the purity, the exact gram weight and every stone are chosen for you. Here is how a single piece comes to life in the atelier." },
      { type: "h2", text: "1. Design & consultation" },
      { type: "p", text: "It begins with a conversation and a sketch — your idea, refined with our designers into a drawing and often a 3D render, so you see exactly what you're commissioning before a gram of gold is used." },
      { type: "h2", text: "2. Sourcing the stones" },
      { type: "p", text: "We select certified diamonds and gemstones to the 4Cs you've chosen, sharing the certificates so you know precisely what is going into your piece." },
      { type: "h2", text: "3. Casting & the goldsmith's hand" },
      { type: "p", text: "The design is cast in your chosen metal and purity, then filed, soldered and shaped by hand. This is where craft matters most — the parts a machine can't judge, done by a goldsmith's eye." },
      { type: "h2", text: "4. Setting & finishing" },
      { type: "list", items: [
        "Each stone is set by hand so it sits secure and catches the light correctly.",
        "The piece is polished, and white gold is rhodium-plated for brightness.",
        "It is BIS hallmarked and paired with its diamond certificate.",
      ] },
      { type: "quote", text: "Bespoke takes a little longer because it's made once, for one person — and that is exactly what makes it worth the wait." },
      { type: "p", text: "Every Sparenza piece is crafted to order this way, certified and hallmarked, and backed by lifetime exchange and buyback. Start your own piece with a design consultation." },
    ],
  },
];

export const journalArticleSlugs = journalArticles.map((a) => a.slug);

export function getJournalArticle(slug: string): JournalArticle | undefined {
  return journalArticles.find((a) => a.slug === slug);
}
