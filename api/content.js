import { redis } from "./_lib/redis.js";
import { isAuthed } from "./_lib/session.js";
import { jsonBody } from "./_lib/body.js";
import { CONTENT_KEYS, CONTENT_TYPES } from "./_lib/contentKeys.js";

// Everything Danique edits in the studio lives in one Redis hash, one field
// per key, each field holding JSON text. GET is public (the site reads it),
// PUT needs the studio session cookie.
const HASH = "site:content";
const MAX_BYTES = 200 * 1024;

function typeOf(v) {
  if (Array.isArray(v)) return "array";
  if (v && typeof v === "object") return "object";
  return typeof v;
}

// Upstash auto-deserializes JSON field values, so a stored '"banner"' usually
// arrives as 'banner'. If it arrives raw (still JSON text), parse it here.
function decode(key, v) {
  if (typeof v !== "string") return v;
  const wantsString = CONTENT_TYPES[key] === "string";
  if (wantsString && !v.startsWith('"')) return v;
  try { return JSON.parse(v); } catch { return wantsString ? v : undefined; }
}

function validate(key, value) {
  if (!CONTENT_KEYS.includes(key)) return "Unknown key";
  if (typeOf(value) !== CONTENT_TYPES[key]) return `Value for ${key} must be ${CONTENT_TYPES[key]}`;
  if (key === "ad-hero-layout" && value !== "banner" && value !== "split") return "Layout must be banner or split";
  if (key === "ad-video-url" && value.length > 500) return "Video link is too long";
  return null;
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const fresh = req.query?.fresh === "1" || /[?&]fresh=1\b/.test(req.url || "");
      const raw = (await redis.hgetall(HASH)) || {};
      const out = {};
      for (const key of CONTENT_KEYS) {
        if (!(key in raw)) continue;
        const v = decode(key, raw[key]);
        if (typeOf(v) === CONTENT_TYPES[key]) out[key] = v;
      }
      res.setHeader("Cache-Control", fresh ? "no-store" : "public, s-maxage=15, stale-while-revalidate=60");
      return res.status(200).json(out);
    }

    if (req.method === "PUT") {
      res.setHeader("Cache-Control", "no-store");
      if (!isAuthed(req)) return res.status(401).json({ error: "Not logged in" });

      const body = jsonBody(req);
      if (!body || typeof body.key !== "string" || !("value" in body)) {
        return res.status(400).json({ error: "Expected {key, value}" });
      }
      const { key, value } = body;
      const problem = validate(key, value);
      if (problem) return res.status(400).json({ error: problem });

      const json = JSON.stringify(value);
      if (Buffer.byteLength(json, "utf8") > MAX_BYTES) {
        return res.status(413).json({ error: "Content too large" });
      }
      await redis.hset(HASH, { [key]: json });
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("content error", err);
    return res.status(500).json({ error: "Server error" });
  }
}
