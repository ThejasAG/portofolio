import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "portfolio_admin";

export function verifyPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function createSession(password: string) {
  if (!verifyPassword(password)) return null;
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `${expires}.${createHmac("sha256", secret).update(String(expires)).digest("hex")}`;
  return { value: payload, expires };
}

export function isAdmin(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]*)`));
  if (!match) return false;
  let value = "";
  try {
    value = decodeURIComponent(match[1]);
  } catch {
    return false;
  }
  const dot = value.lastIndexOf(".");
  if (dot < 0) return false;
  const expiresText = value.slice(0, dot);
  const expires = Number(expiresText);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  const signature = createHmac("sha256", secret).update(expiresText).digest("hex");
  const supplied = value.slice(dot + 1);
  if (supplied.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(supplied), Buffer.from(signature));
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}
