// JWT sign/verify with jose (WebCrypto HS256) — replaces jsonwebtoken, which
// depends on Node's crypto and doesn't run on Workers.
import { SignJWT, jwtVerify } from "jose";

const enc = new TextEncoder();

export async function signToken(
  id: string,
  secret: string,
  expiresIn: string
): Promise<string> {
  return new SignJWT({ id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(enc.encode(secret));
}

export async function verifyToken(
  token: string,
  secret: string
): Promise<{ id: string }> {
  const { payload } = await jwtVerify(token, enc.encode(secret));
  return { id: payload.id as string };
}
