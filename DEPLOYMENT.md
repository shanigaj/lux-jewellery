# 🚀 Deployment — Sparenza & Co.

**Frontend → Vercel** · **Backend → Render** · **Database → MongoDB Atlas (already set up)**

Repo is deploy-ready: server builds cleanly (`tsc` → `dist`), reads `PORT` from env,
CORS accepts a comma-separated origin list, and the client reads the API URL from
`NEXT_PUBLIC_API_URL`.

---

## 1. MongoDB Atlas (one-time)

Render's outbound IPs are dynamic, so allow all:

- Atlas → **Network Access** → **Add IP Address** → `0.0.0.0/0` (Allow from anywhere) → Confirm.

(The `MONGO_URI` you already use — `...clustersparenza.../sparenza-jewels` — stays the same.)

---

## 2. Backend on Render

### Option A — Blueprint (uses `render.yaml`)
1. [Render](https://render.com) → **New** → **Blueprint** → connect the GitHub repo.
2. It reads `render.yaml` and creates the **sparenza-api** web service (rootDir `server`).
3. Fill the secret env vars (see list below) → **Apply**.

### Option B — Manual Web Service
1. **New** → **Web Service** → connect repo.
2. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
3. Add env vars (below) → **Create Web Service**.

### Backend env vars (Render → Environment)
| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | your Atlas URI (`mongodb+srv://…/sparenza-jewels?...`) |
| `JWT_SECRET` | a long random string |
| `JWT_REFRESH_SECRET` | a different long random string |
| `CLIENT_URL` | `https://yourdomain.com,https://www.yourdomain.com,https://<project>.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | dtjxooom |
| `CLOUDINARY_API_KEY` | … |
| `CLOUDINARY_API_SECRET` | … |
| `CLOUDINARY_URL` | cloudinary://…@dtjxooom |
| `SMTP_HOST` | smtp.gmail.com |
| `SMTP_PORT` | 587 |
| `SMTP_USER` | your gmail |
| `SMTP_PASS` | gmail app password |

> Don't set `PORT` — Render injects it automatically.

After deploy you get a URL like **`https://sparenza-api.onrender.com`**.
Test: open `https://sparenza-api.onrender.com/api/health` → `{ "status": "ok" }`.

> ⚠️ Render **free** tier sleeps after ~15 min idle; the first request then takes
> ~30–50s (cold start). Upgrade to a paid instance for always-on.

### Seed the database (once, optional)
From the Render shell (or locally with the prod `MONGO_URI`):
```
npm run seed:users        # creates admin@lux.com / password123
npm run seed:categories   # tops up categories to 5 products each
```

---

## 3. Frontend on Vercel

1. [Vercel](https://vercel.com) → **Add New** → **Project** → import the repo.
2. **Root Directory:** `client` (click *Edit* → select `client`).
3. Framework preset auto-detects **Next.js**. Leave build/output defaults.
4. Add env vars (below) → **Deploy**.

### Frontend env vars (Vercel → Settings → Environment Variables)
| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://sparenza-api.onrender.com/api` |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `+91XXXXXXXXXX` (international format) |

> `NEXT_PUBLIC_*` vars are inlined at build time — after changing them, **redeploy**.

You get a URL like **`https://<project>.vercel.app`**.

---

## 4. Connect your domain (Vercel)

1. Vercel → Project → **Settings** → **Domains** → add `yourdomain.com` and `www.yourdomain.com`.
2. At your domain registrar, set the DNS records Vercel shows:
   - `yourdomain.com` → **A** record → `76.76.21.21`
   - `www` → **CNAME** → `cname.vercel-dns.com`
3. Wait for DNS + SSL (a few minutes).

Then update the backend so it trusts the live domain:
- Render → `CLIENT_URL` = `https://yourdomain.com,https://www.yourdomain.com,https://<project>.vercel.app`
- Save → Render redeploys.

---

## 5. Final checks
- `https://yourdomain.com` loads the storefront.
- Live gold/silver ticker shows in the header (backend reachable).
- Admin login at `https://yourdomain.com/admin` (`admin@lux.com` / `password123`).
- Book an appointment → saved (visible in `/admin/appointments`).

---

### Recap of what points where
```
Browser ──▶ yourdomain.com (Vercel · Next.js frontend)
                     │  NEXT_PUBLIC_API_URL
                     ▼
        sparenza-api.onrender.com/api (Render · Express)
                     │  MONGO_URI
                     ▼
        MongoDB Atlas · ClusterSparenza
```
