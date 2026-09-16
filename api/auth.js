import { createHash, timingSafeEqual } from "node:crypto";
import { redis } from "./_lib/redis.js";
import { isAuthed, setSession, clearSession } from "./_lib/session.js";
import { jsonBody } from "./_lib/body.js";

// Studio login. GET: am I logged in? POST {password}: log in. DELETE: log out.
const MAX_FAILS = 10;
const WINDOW_S = 15 * 60;

function clientIp(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return fwd || String(req.headers["x-real-ip"] || "") || req.socket?.remoteAddress || "unknown";
}

function passwordMatches(given) {
  const expected = process.env.STUDIO_PASSWORD;
  if (!expected) throw new Error("STUDIO_PASSWORD env var is not set");
  // Hash both sides so the buffers always have equal length.
  const a = createHash("sha256").update(String(given)).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  try {
    if (req.method === "GET") {
      return res.status(200).json({ authed: isAuthed(req) });
    }

    if (req.method === "DELETE") {
      clearSession(res, req);
      return res.status(200).json({ ok: true });
    }

    if (req.method === "POST") {
      const failKey = `studio:fail:${clientIp(req)}`;
      const fails = Number(await redis.get(failKey)) || 0;
      if (fails >= MAX_FAILS) {
        const ttl = await redis.ttl(failKey);
        if (ttl > 0) res.setHeader("Retry-After", String(ttl));
        return res.status(429).json({ error: "Too many attempts, try again later" });
      }

      const body = jsonBody(req);
      const password = body && typeof body.password === "string" ? body.password : "";
      if (password && passwordMatches(password)) {
        await redis.del(failKey);
        setSession(res, req);
        return res.status(200).json({ ok: true });
      }

      const count = await redis.incr(failKey);
      if (count === 1) await redis.expire(failKey, WINDOW_S);
      return res.status(401).json({ error: "Wrong password" });
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("auth error", err);
    return res.status(500).json({ error: "Server error" });
  }
}
