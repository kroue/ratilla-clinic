import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "rmc_admin";
const SESSION_HOURS = 8;

function sha256(value: string) {
  return createHash("sha256").update(value).digest();
}

// Sessions are signed with a key derived from ADMIN_PASSWORD, so changing
// the password signs everyone out.
function sign(payload: string) {
  const password = process.env.ADMIN_PASSWORD ?? "";
  return createHmac("sha256", sha256(`rmc-admin-session:${password}`)).update(payload).digest("hex");
}

function safeEqual(a: Buffer, b: Buffer) {
  return a.length === b.length && timingSafeEqual(a, b);
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(sha256(input), sha256(expected));
}

export async function startSession() {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = String(expires);
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    expires: new Date(expires),
  });
}

export async function endSession() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

export async function isSignedIn() {
  // Read the cookie first: it marks admin pages as per-request, never prerendered.
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value || !adminConfigured()) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(Buffer.from(signature), Buffer.from(sign(payload)))) return false;
  return Number(payload) > Date.now();
}

/** Call at the top of every admin page and admin Server Action. */
export async function requireAdmin() {
  if (!(await isSignedIn())) redirect("/admin/login");
}
