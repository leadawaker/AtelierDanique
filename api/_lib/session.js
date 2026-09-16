import { createHmac, timingSafeEqual } from "node:crypto";

// Stateless studio session: the cookie holds its own expiry plus an HMAC of
// that expiry, so nothing is stored server-side. Changing SESSION_SECRET logs
// every device out.
const COOKIE = "ad_studio";
const MAX_AGE_S = 30 * 24 * 60 * 60;

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("SESSION_SECRET env var is missing or shorter than 32 characters");
  }
  return s;
}

function sign(value) {
  return createHmac("sha256", secret()).update(String(value)).digest("hex");
}

function readCookie(req, name) {
  const header = req.headers?.cookie || "";
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    if (part.slice(0, i).trim() === name) {
      try { return decodeURIComponent(part.slice(i + 1).trim()); } catch { return null; }
    }
  }
  return null;
}

function isLocalhost(req) {
  const host = String(req.headers?.host || "").split(":")[0];
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

function cookieAttrs(req, maxAge) {
  const attrs = ["Path=/", "HttpOnly", "SameSite=Strict", `Max-Age=${maxAge}`];
  if (!isLocalhost(req)) attrs.push("Secure");
  return attrs.join("; ");
}

export function isAuthed(req) {
  const raw = readCookie(req, COOKIE);
  if (!raw) return false;
  const dot = raw.indexOf(".");
  if (dot === -1) return false;
  const expires = raw.slice(0, dot);
  const mac = raw.slice(dot + 1);
  if (!/^\d+$/.test(expires) || !/^[0-9a-f]{64}$/.test(mac)) return false;
  const expected = Buffer.from(sign(expires), "hex");
  const given = Buffer.from(mac, "hex");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;
  return Number(expires) > Date.now();
}

// `res.req` is set by Node's http server; pass req explicitly when available.
export function setSession(res, req = res.req) {
  const expires = String(Date.now() + MAX_AGE_S * 1000);
  const value = `${expires}.${sign(expires)}`;
  res.setHeader("Set-Cookie", `${COOKIE}=${value}; ${cookieAttrs(req || {}, MAX_AGE_S)}`);
}

export function clearSession(res, req = res.req) {
  res.setHeader("Set-Cookie", `${COOKIE}=; ${cookieAttrs(req || {}, 0)}`);
}
