# 💎 Sparenza SEO & Google Indexing — Checklist (Hinglish)

> **Situation:** Site ka SEO code perfect hai. Homepage Google pe aa gaya hai.
> Problem: 1,036 pages "Discovered – currently not indexed" — kyunki site nayi hai
> aur abhi authority/backlinks nahi hain. Fix = **authority + backlinks + time**.
> Last updated: 2026-09-02

---

## ✅ Ho chuka hai (done)

- [x] Google Search Console mein `sparenza.com` domain **verify** (Cloudflare DNS)
- [x] **Sitemap submit** — `sitemap.xml`, Status: Success, 1,039 pages discovered
- [x] **Homepage indexed** — Google pe aa gaya
- [x] **`/products` page** — indexing request ki (priority crawl queue mein)
- [x] Code: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` support add (backup verification)

---

## 🔴 Priority 1 — Abhi karo (sabse zaroori, authority signals)

- [ ] **Google Business Profile** mein Website field = `https://sparenza.com` daalo
- [ ] **Instagram bio** mein website ka link lagao (@sparenzajewels)
- [ ] **Facebook page** mein website link add karo
- [ ] **WhatsApp Business** profile mein website link daalo
- [ ] Google Business Profile pe **5-10 photos** + products upload karo (activity = trust)

## 🟠 Priority 2 — Is hafte (backlinks banao)

- [ ] **JustDial** pe business list karo + website link
- [ ] **IndiaMART** pe seller account + website link
- [ ] **Sulekha** / local Surat directories mein list karo
- [ ] Google Maps pe business ka **address + website** verify karo
- [ ] Kisi jewellery blog / local news / friend ki site se ek link lelo

## 🟡 Priority 3 — Har hafte repeat karo (manual indexing push)

> GSC → **URL Inspection** (upar search box) → URL paste → **Request Indexing**
> Roz max ~10 URL ki limit hai. Har hafte apne **top/best-selling products** karo.

- [ ] `https://sparenza.com/categories/engagement-rings`
- [ ] `https://sparenza.com/categories/rings`
- [ ] `https://sparenza.com/categories/necklaces`
- [ ] `https://sparenza.com/categories/earrings`
- [ ] Top 5 best-selling **product** URLs (har hafte 5-10 naye)

## 🟢 Priority 4 — Traffic lao (real visitors = strong signal)

- [ ] Instagram/WhatsApp stories mein product links share karo
- [ ] Customers ko order ke baad website link bhejo (reviews ke liye bhi)
- [ ] Har naye product ka link social media pe post karo

---

## 📊 Progress kaise check karo

**Har hafte GSC mein dekho:** Search Console → **Indexing → Pages**
- "Indexed" count **badhna** chahiye (abhi 3 hai)
- "Discovered – currently not indexed" **ghatna** chahiye (abhi 1,036)

**Google pe search karke:** `site:sparenza.com` — jitne pages dikhein, utne indexed.

---

## ⏳ Realistic timeline

| Kab | Kya expect karo |
|-----|-----------------|
| 1 hafta | Homepage + /products + categories index ho jayenge |
| 2-4 hafte | 50-200 pages index (authority build hone lage) |
| 1-2 mahine | Zyada products index + search mein dikhne lage |
| 3+ mahine | Poora catalog index (agar backlinks/traffic aaye) |

> **Yaad rakho:** Site ki galti nahi hai. Ye har naye e-commerce site ka normal
> phase hai. Jitne backlinks + traffic laoge, utni jaldi Google index karega.

---

## 🔧 Technical (developer ke liye — ek baar check)

- [ ] Cloudflare env: `NEXT_PUBLIC_API_URL` = live worker API (localhost/onrender NAHI) — sitemap mein products aane ke liye ✅ (confirmed working)
- [ ] Cloudflare env: `NEXT_PUBLIC_SITE_URL` = `https://sparenza.com` (no trailing slash) ✅
- [x] GA4 property banaya — **Measurement ID: `G-N24WJXFYND`** (property "Sparenza & Co.", India/INR)
- [ ] **GA activate karo:** Cloudflare dashboard → worker `sparenza-web` → Settings → Variables & Secrets → add build/production variable `NEXT_PUBLIC_GA_ID` = `G-N24WJXFYND` → phir redeploy. (Yahin `NEXT_PUBLIC_SITE_URL` aur live API bhi set hai.)
- [ ] Redeploy ke baad GA → Realtime report mein apni site khol ke check karo ki data aa raha hai
