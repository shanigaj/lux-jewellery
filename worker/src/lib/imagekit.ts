// ImageKit uploads from a Worker via the REST upload API (the imagekit Node SDK
// can't run on Workers). Replaces the old Cloudinary upload path.
//
// Images are stored as ORIGINALS (no baked-in transform); the storefront adds
// width/format/quality on delivery via the next/image loader, matching how the
// migrated bluestone catalogue is stored.
import type { Bindings } from "./env";

interface UploadOpts {
  folder: string;
  fileName?: string;
  /** Optional ?tr= appended to the returned delivery URL. */
  tr?: string;
}

// `file` may be an uploaded File/Blob, a remote URL, or a base64/data: string —
// ImageKit accepts all three as the `file` field.
export async function imagekitUpload(
  env: Bindings,
  file: File | Blob | string,
  opts: UploadOpts
): Promise<{ url: string; filePath: string; fileId: string }> {
  const fallbackName = opts.fileName || `img_${Date.now()}`;
  const fileName =
    opts.fileName ||
    (typeof file !== "string" ? (file as File).name : undefined) ||
    fallbackName;

  const form = new FormData();
  if (typeof file === "string") {
    form.append("file", file); // remote URL or base64 / data: URI
  } else {
    form.append("file", file as Blob, fileName);
  }
  form.append("fileName", fileName);
  form.append("folder", opts.folder);
  form.append("useUniqueFileName", "true");

  const auth = btoa(`${env.IMAGEKIT_PRIVATE_KEY}:`);
  const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}` },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`ImageKit upload failed ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { url: string; filePath: string; fileId: string };
  const url = opts.tr ? `${data.url.split("?")[0]}?tr=${opts.tr}` : data.url;
  return { url, filePath: data.filePath, fileId: data.fileId };
}

// Non-generative cleanup: store the source on ImageKit and return a delivery URL
// with a light sharpen + contrast + auto format/quality. (ImageKit has no
// Cloudinary-style generative "improve"; this is the closest honest equivalent.)
export async function imagekitEnhance(env: Bindings, imageUrl: string): Promise<string> {
  const { url } = await imagekitUpload(env, imageUrl, {
    folder: "sparenza-jewels/enhanced",
    tr: "e-sharpen,e-contrast,w-2000,c-at_max,f-auto,q-auto",
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
// no openai SDK), then store the result on ImageKit.
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

  const { url } = await imagekitUpload(env, `data:image/png;base64,${b64}`, {
    folder: "sparenza-jewels/ai",
    fileName: `studio_${Date.now()}.png`,
    tr: "f-auto,q-auto",
  });
  return url;
}
