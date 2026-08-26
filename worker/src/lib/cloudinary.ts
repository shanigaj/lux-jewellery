// Cloudinary uploads from a Worker via the signed REST API (multer +
// multer-storage-cloudinary can't run on Workers). Ports the behaviour of
// server/src/utils/cloudinary.ts and imageEnhance.ts.
import type { Bindings } from "./env";

async function sha1Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(input));
  let out = "";
  for (const b of new Uint8Array(digest)) out += b.toString(16).padStart(2, "0");
  return out;
}

interface UploadOpts {
  folder: string;
  transformation?: string;
}

// `file` may be an uploaded File/Blob, a remote URL, or a data: URI — Cloudinary
// accepts all three as the `file` field.
export async function cloudinaryUpload(
  env: Bindings,
  file: File | Blob | string,
  opts: UploadOpts
): Promise<{ url: string; publicId: string }> {
  const timestamp = Math.floor(Date.now() / 1000);

  // Sign every param except file/api_key/resource_type (Cloudinary rule).
  const toSign: Record<string, string | number> = { folder: opts.folder, timestamp };
  if (opts.transformation) toSign.transformation = opts.transformation;
  const signStr =
    Object.keys(toSign)
      .sort()
      .map((k) => `${k}=${toSign[k]}`)
      .join("&") + env.CLOUDINARY_API_SECRET;
  const signature = await sha1Hex(signStr);

  const form = new FormData();
  form.append("file", file as any);
  form.append("api_key", env.CLOUDINARY_API_KEY);
  form.append("timestamp", String(timestamp));
  form.append("folder", opts.folder);
  if (opts.transformation) form.append("transformation", opts.transformation);
  form.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) {
    throw new Error(`Cloudinary upload failed ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { secure_url: string; public_id: string };
  return { url: data.secure_url, publicId: data.public_id };
}

// Fast, non-generative cleanup (Cloudinary pulls the source URL itself). No AI.
export async function cloudinaryEnhance(env: Bindings, imageUrl: string): Promise<string> {
  const { url } = await cloudinaryUpload(env, imageUrl, {
    folder: "sparenza-jewels/enhanced",
    transformation: "e_improve/e_sharpen:60/c_limit,h_2000,w_2000,q_auto:good,f_auto",
  });
  return url;
}

const STUDIO_PROMPT =
  "Transform this into a professional e-commerce jewellery product photograph. " +
  "Keep the exact same piece, shape, gemstones and metal colour — do not redesign it. " +
  "Place it on a clean seamless soft light-grey studio background with a subtle gradient, " +
  "soft diffused studio lighting, crisp realistic reflections and a gentle shadow, razor-sharp " +
  "focus, true-to-life colours, elegant centred composition. No text, no watermark, no hands, no props.";

// Turn an ordinary snap into a studio product shot via gpt-image-1 (direct REST,
// no openai SDK), then store the result on Cloudinary.
export async function openaiStudioShot(env: Bindings, imageUrl: string): Promise<string> {
  if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured on the server");

  const srcRes = await fetch(imageUrl);
  if (!srcRes.ok) throw new Error(`Could not fetch source image (${srcRes.status})`);
  const srcType = srcRes.headers.get("content-type") || "image/png";
  const blob = await srcRes.blob();

  const form = new FormData();
  form.append("model", "gpt-image-1");
  form.append("prompt", STUDIO_PROMPT);
  form.append("size", "1024x1024");
  form.append("image", new File([blob], "source.png", { type: srcType }));

  const res = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Image model error ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error("Image model returned no image");

  const { url } = await cloudinaryUpload(env, `data:image/png;base64,${b64}`, {
    folder: "sparenza-jewels/ai",
    transformation: "q_auto:good,f_auto",
  });
  return url;
}
