import crypto from "crypto";
import { getOsEnv } from "../../lib/env";

const JWT_SECRET = getOsEnv("JWT_SECRET");
const SCRYPT_KEYLEN = 64;

export interface AuthUser {
  id: string;
  role: "admin" | "ambassador" | "public";
  ambassadorId?: string | null;
  email?: string;
  name?: string | null;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

export function signToken(payload: Omit<AuthUser, "role"> & { role: AuthUser["role"] }): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): AuthUser | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expected = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  // constant-time comparison
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return payload as AuthUser;
  } catch {
    return null;
  }
}

// ---- Password hashing (scrypt, no external deps) ----

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.startsWith("scrypt$")) return false;
  const [, salt, derived] = stored.split("$");
  const computed = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  const a = Buffer.from(computed);
  const b = Buffer.from(derived);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
