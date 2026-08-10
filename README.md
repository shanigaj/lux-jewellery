# Sparenza & Co. 💎
**Where Brilliance Meets Artistry**

An ultra-premium, full-stack E-Commerce platform built for a luxury diamond jewelry brand. It features a stunning storefront and a highly sophisticated Enterprise Admin Dashboard for complete operational control.

## 🌟 Key Features

### Storefront (Next.js 15, React 19)
- **Immersive Design**: Aesthetically crafted UI tailored for luxury, utilizing custom fonts (Playfair Display & Inter) and Framer Motion micro-animations.
- **Dynamic Product Browsing**: 360° Viewers, high-resolution Image Zoom, and interactive filtering.
- **Performance Optimized**: 95+ Lighthouse score out-of-the-box, leveraging Next.js App Router, Server Components, lazy-loading, and CSS optimization (`critters`).
- **SEO & Accessibility**: Fully implemented OpenGraph metadata, JSON-LD structured data for Google Rich Results, and ARIA attributes for a11y.
- **Seamless Checkout**: Complete Stripe integration for secure payments.

### Enterprise Admin Dashboard
- **Robust Analytics**: Real-time sales and revenue tracking via `recharts`.
- **Complete CRUD Operations**: Manage Products, Inventory (with low-stock alerts), Orders, and Customers.
- **Content Management**: Built-in CMS for Homepage banners, Blog management, and Customer Review moderation.
- **System Admin Tools**: Role-Based Access Control (RBAC), detailed Audit Logs, and downloadable financial reports.

### Robust Backend (Node.js, Express, MongoDB)
- **High Performance**: Endpoints cached using `node-cache` for instant catalog retrieval.
- **Security-First**: Fortified with `helmet`, `express-rate-limit`, and a centralized Error Handler.
- **Cloud Media**: Direct streaming of product images to Cloudinary via `multer`.
- **Reliable Logging**: Comprehensive Winston + Morgan logging configuration.
- **Asynchronous Webhooks**: Secure background processing of Stripe webhooks.

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Node.js, Express, MongoDB, Mongoose, Zod (Validation), JWT
- **Integrations**: Stripe (Payments), Cloudinary (Media Hosting)
- **DevOps**: Docker, Docker Compose, GitHub Actions (CI/CD), Vercel (Frontend Deployment)

## 🚀 Local Development Setup

### Option 1: Docker Compose (Recommended)
You can spin up the entire stack (Database, Backend, Frontend) with a single command:
```bash
docker-compose up --build
```
- Storefront: `http://localhost:3000`
- API Backend: `http://localhost:5000`
- Admin Dashboard: `http://localhost:3000/admin`

### Option 2: Manual Setup

#### 1. Database & Backend
```bash
cd server
npm install
npm run dev
```

#### 2. Frontend
```bash
cd client
npm install
npm run dev
```

## 🔐 Environment Variables

You must create `.env` files in both the `client` and `server` directories.

**`server/.env`**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/sparenza-jewels
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:3002
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**`client/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3002
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# Destination for the "Enquire on WhatsApp" buttons (international format).
# Inlined at build time — for Docker it is passed via docker-compose build args.
NEXT_PUBLIC_WHATSAPP_NUMBER=+910000000000
```

## 🌱 Seeding the Database

Sample data lives in `server/src/`. Products must be seeded before the
storefront shows anything (an empty catalog otherwise renders no products).

**Local (tsx):**
```bash
cd server
npm run seed        # inserts 10 sample products
npm run seed:users  # creates admin@lux.com / user@lux.com (password: password123)
```

**Docker (against the running stack):**
```bash
docker exec sparenza_server node dist/seedProducts.js
docker exec sparenza_server node dist/seedUsers.js
```

> Seed data is stored in the MongoDB volume, not in git — re-run the seed on a
> fresh database/volume to repopulate it.

## 🚢 Deployment Guide

### Deploying the Frontend (Vercel)
The Next.js frontend is perfectly optimized for Vercel.
1. Push your code to GitHub.
2. Import the repository into Vercel.
3. Set the Root Directory to `client`.
4. Add the environment variables (`NEXT_PUBLIC_API_URL`, etc.).
5. Deploy!

### Deploying the Backend (Docker)
The backend comes with a production-ready `Dockerfile`.
1. Pull your code onto a VPS (e.g., DigitalOcean, AWS EC2).
2. Ensure Docker and Docker Compose are installed.
3. Run `docker-compose up -d server mongodb`.
4. (Optional) Setup Nginx as a reverse proxy with SSL to point to port 5000.

## 🤝 CI/CD Pipeline
This project includes a `.github/workflows/main.yml` file that automatically:
- Installs dependencies
- Type-checks and builds both the Frontend and Backend
- Ensures the project compiles perfectly before any PR can be merged to `main`.
