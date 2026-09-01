# Sparenza API — Cloudflare Workers (Hono + Prisma Accelerate)

Free, edge-hosted replacement for the Express backend in `../server`. Same
MongoDB Atlas database — no data migration.

```
Browser ─▶ Cloudflare Worker (Hono)  ─Accelerate(HTTPS)─▶  MongoDB Atlas
                    │
                    ├─ KV (cache / rate-limit)
                    └─ Cloudinary · OpenAI · Stripe · Resend (all HTTPS)
```

## One-time setup

1. **Install deps**
   ```
   cd worker && npm install
   ```

2. **Prisma Accelerate** (free) — https://console.prisma.io
   - New project → **Accelerate** → paste your Atlas `mongodb+srv://…` URL → enable.
   - Copy the generated `prisma://accelerate…?api_key=…` string → that's `DATABASE_URL`.

3. **Cloudflare** (free) — `npx wrangler login`, then:
   ```
   npx wrangler kv namespace create CACHE      # paste the id into wrangler.jsonc
   ```

4. **Secrets** — local dev uses `.dev.vars` (copy from `.dev.vars.example`).
   For production push each one:
   ```
   npx wrangler secret put DATABASE_URL
   npx wrangler secret put DIRECT_DATABASE_URL
   npx wrangler secret put JWT_SECRET
   npx wrangler secret put JWT_REFRESH_SECRET
   npx wrangler secret put CLIENT_URL
   npx wrangler secret put CLOUDINARY_CLOUD_NAME
   npx wrangler secret put CLOUDINARY_API_KEY
   npx wrangler secret put CLOUDINARY_API_SECRET
   npx wrangler secret put OPENAI_API_KEY
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put MAIL_FROM
   npx wrangler secret put CONTACT_EMAIL
   npx wrangler secret put STRIPE_SECRET_KEY
   npx wrangler secret put STRIPE_WEBHOOK_SECRET
   ```

5. **Generate client & sync schema**
   ```
   npm run db:generate     # prisma generate --no-engine
   npm run db:push         # writes Prisma indexes to Atlas (safe, additive)
   ```

## Run / deploy
```
npm run dev        # http://localhost:8787/api/health
npm run deploy     # → https://sparenza-api.<subdomain>.workers.dev
```

## Migration progress (Express ➜ Hono)

| Route | Status |
|-------|--------|
| `/api/health` | ✅ done |
| `/api/metals` | ✅ done (KV cache) |
| `/api/auth` | ⏳ next (JWT via `jose`, bcrypt → see note) |
| `/api/products` | ⏳ |
| `/api/orders` | ⏳ |
| `/api/payments` (Stripe webhook) | ⏳ |
| `/api/coupons` | ⏳ |
| `/api/media` (upload) | ⏳ (Cloudinary signed REST) |
| `/api/reviews` | ⏳ |
| `/api/blogs` | ⏳ |
| `/api/audit-logs` | ⏳ |
| `/api/settings` | ⏳ |
| `/api/appointments` | ⏳ |
| `/api/contact` | ⏳ |

### Known Workers gotchas (handled as we port)
- **Password hashing** — `bcryptjs` is CPU-heavy; on Workers we hash with WebCrypto
  **PBKDF2** (or Argon via a WASM lib). Existing bcrypt hashes are re-hashed on
  next successful login so old users keep working.
- **JWT** — `jsonwebtoken` uses Node crypto; replaced by **`jose`** (WebCrypto).
- **Uploads** — `multer` doesn't run on Workers; we parse `multipart/form-data`
  and upload to Cloudinary via its **signed REST API** with `fetch`.
- **Email** — `nodemailer` won't run; send via **Resend HTTPS API**.
- **Logs** — no filesystem; `winston` file transport → `console` + Workers Logs.
- **Rate limit** — `express-rate-limit` → KV-backed limiter.
