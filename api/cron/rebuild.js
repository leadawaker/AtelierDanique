import { redis } from "../_lib/redis.js";
import { isAuthed } from "../_lib/session.js";

// Re-runs the build so the static HTML crawlers read picks up Danique's
// latest studio edits. Called daily by Vercel Cron (Bearer CRON_SECRET) and
// by the "Update what Google sees" button in the studio (session cookie),
// at most once every 10 minutes.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const cron = req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`;
  if (!cron && !isAuthed(req)) return res.status(401).json({ error: "Unauthorized" });
  if (!process.env.DEPLOY_HOOK_URL) return res.status(500).json({ error: "DEPLOY_HOOK_URL is not set" });
  if (!cron) {
    const fresh = await redis.set("rebuild:last", Date.now(), { nx: true, ex: 600 });
    if (!fresh) return res.status(429).json({ error: "Already updating, try again in a few minutes" });
  }
  const r = await fetch(process.env.DEPLOY_HOOK_URL, { method: "POST" });
  return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
}
