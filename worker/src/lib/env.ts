// Every binding/secret the Worker reads.
import type { User } from "../generated/prisma";

export type Bindings = {
  CACHE: KVNamespace;
  NODE_ENV: string;

  // Prisma Accelerate connection string (prisma://…) — used at runtime.
  DATABASE_URL: string;
  // Direct Atlas URL (mongodb+srv://…) — only for `prisma db push`.
  DIRECT_DATABASE_URL: string;

  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  CLIENT_URL: string;

  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;

  OPENAI_API_KEY: string;

  RESEND_API_KEY: string;
  MAIL_FROM: string;
  CONTACT_EMAIL: string;

  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;

  INDIA_METAL_PREMIUM: string;
};

// `user` is set by the `protect` middleware (Prisma User).
export type AppEnv = { Bindings: Bindings; Variables: { user?: User } };
