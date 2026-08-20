import OpenAI, { toFile } from "openai";
import cloudinary from "./cloudinary";

// ── Cloudinary "enhance": a fast, non-generative cleanup ──
// Re-uploads the source (Cloudinary can pull straight from a URL) and bakes in
// an auto-improve + gentle sharpen, delivering an optimised asset. No AI credits.
export async function cloudinaryEnhance(imageUrl: string): Promise<string> {
  const res = await cloudinary.uploader.upload(imageUrl, {
    folder: "sparenza-jewels/enhanced",
    transformation: [
      { effect: "improve" },
      { effect: "sharpen:60" },
      { width: 2000, height: 2000, crop: "limit" },
    ],
    quality: "auto:good",
    fetch_format: "auto",
  });
  return res.secure_url;
}

// ── OpenAI "studio": turn an ordinary snap into a polished product shot ──
const STUDIO_PROMPT =
  "Transform this into a professional e-commerce jewellery product photograph. " +
  "Keep the exact same piece, shape, gemstones and metal colour — do not redesign it. " +
  "Place it on a clean seamless soft light-grey studio background with a subtle gradient, " +
  "soft diffused studio lighting, crisp realistic reflections and a gentle shadow, razor-sharp " +
  "focus, true-to-life colours, elegant centred composition. No text, no watermark, no hands, no props.";

let client: OpenAI | null = null;
function openai(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured on the server");
  }
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

/**
 * Runs the source image through gpt-image-1 and uploads the studio result to
 * Cloudinary, returning its URL.
 */
export async function openaiStudioShot(imageUrl: string): Promise<string> {
  // Pull the source bytes (Cloudinary URL) and hand them to the image model.
  const srcRes = await fetch(imageUrl);
  if (!srcRes.ok) throw new Error(`Could not fetch source image (${srcRes.status})`);
  const srcBuf = Buffer.from(await srcRes.arrayBuffer());
  const srcType = srcRes.headers.get("content-type") || "image/png";
  const file = await toFile(srcBuf, "source.png", { type: srcType });

  const result = await openai().images.edit({
    model: "gpt-image-1",
    image: file,
    prompt: STUDIO_PROMPT,
    size: "1024x1024",
  });

  const b64 = result.data?.[0]?.b64_json;
  if (!b64) throw new Error("Image model returned no image");

  const uploaded = await cloudinary.uploader.upload(`data:image/png;base64,${b64}`, {
    folder: "sparenza-jewels/ai",
    quality: "auto:good",
    fetch_format: "auto",
  });
  return uploaded.secure_url;
}
