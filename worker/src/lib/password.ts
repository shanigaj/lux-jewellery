// Password hashing for Workers.
//
// bcrypt (the old server's scheme) is too CPU-heavy for the Workers free plan,
// so new passwords use WebCrypto PBKDF2 (native, fast). Existing bcrypt hashes
// still verify via bcryptjs, and are transparently upgraded to PBKDF2 on the
// user's next successful login (see needsRehash + the login handler).
import bcrypt from "bcryptjs";

const PBKDF2_ITERATIONS = 100_000;
const enc = new TextEncoder();

function b64(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function unb64(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    key,
    256
  );
  return new Uint8Array(bits);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$sha256$${PBKDF2_ITERATIONS}$${b64(salt)}$${b64(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (stored.startsWith("pbkdf2$")) {
    const [, , iterStr, saltB64, hashB64] = stored.split("$");
    const hash = await pbkdf2(password, unb64(saltB64), parseInt(iterStr, 10));
    return timingSafeEqual(hash, unb64(hashB64));
  }
  // Legacy bcrypt hash ($2a$/$2b$/$2y$).
  if (stored.startsWith("$2")) {
    try {
      return bcrypt.compareSync(password, stored);
    } catch {
      return false;
    }
  }
  return false;
}

// True for any hash that isn't already our PBKDF2 format — upgrade on next login.
export function needsRehash(stored: string): boolean {
  return !stored.startsWith("pbkdf2$");
}
