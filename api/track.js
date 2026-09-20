import { redis } from "./_lib/redis.js";
import { isAuthed } from "./_lib/session.js";
import { jsonBody } from "./_lib/body.js";
import { LANGS, PAGES } from "../src/lib/routes.js";

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp|curl|python|node-fetch|chatgpt|openai|gpt|claude|anthropic|perplexity|vercel|monitor|uptime/i;
const SOURCES = [
  [/^(ig|instagram)$|instagram\./, "instagram"], [/google/, "google"], [/bing\./, "bing"],
  [/chatgpt|openai/, "chatgpt"], [/perplexity/, "perplexity"], [/claude\.ai/, "claude"], [/gemini/, "gemini"],
  [/facebook|fb\./, "facebook"], [/pinterest|pin\.it/, "pinterest"], [/whatsapp|wa\.me/, "whatsapp"],
];

// The only paths a real visit can land on: the 3 languages times the 4 pages
// (home, commission, privacy, terms), e.g. /nl, /en/commission. Anything else
// is not counted, so the endpoint can't be used to write arbitrary Redis
// fields.
const PATHS = new Set(LANGS.flatMap((lang) => PAGES.map((page) => "/" + lang + (page ? "/" + page : ""))));

export function sourceOf(referrer, tag) {
  const t = tag.toLowerCase().slice(0, 40);
  if (t) return (SOURCES.find(([re]) => re.test(t)) || [, "other"])[1];
  if (!referrer) return "direct";
  let host = "";
  try { host = new URL(referrer).hostname; } catch { return "other"; }
  if (host.endsWith("atelierdanique.com")) return "internal";
  return (SOURCES.find(([re]) => re.test(host)) || [, "other"])[1];
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).end(); }
  res.setHeader("Cache-Control", "no-store");
  // A counter must never break the page: any failure here still answers 204.
  try {
    // Bots and Danique's own visits (studio cookie) are not counted.
    if (BOT.test(req.headers["user-agent"] || "") || isAuthed(req)) return res.status(204).end();
    await count(req);
  } catch (e) {
    console.error("track failed:", e);
  }
  return res.status(204).end();
}

async function count(req) {
  const b = jsonBody(req) || {};
  const path = typeof b.p === "string" && PATHS.has(b.p) ? b.p : null;
  if (!path) return;
  const lang = ["nl", "en", "pt"].includes(b.l) ? b.l : "other";
  const raw = req.headers["x-vercel-ip-country"];
  const country = typeof raw === "string" && /^[A-Z]{2}$/i.test(raw) ? raw.toUpperCase() : "??";
  const source = sourceOf(String(b.r || ""), String(b.s || ""));
  const key = "stats:" + new Date().toISOString().slice(0, 10);
  const p = redis.pipeline();
  p.hincrby(key, "views", 1);
  if (source !== "internal") {
    p.hincrby(key, "visits", 1);
    p.hincrby(key, "s:" + source, 1);
    p.hincrby(key, "c:" + country, 1);
  }
  p.hincrby(key, "p:" + path, 1);
  p.hincrby(key, "l:" + lang, 1);
  p.expire(key, 60 * 60 * 24 * 400);
  await p.exec();
}
