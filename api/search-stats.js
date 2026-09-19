import { redis } from "./_lib/redis.js";
import { isAuthed } from "./_lib/session.js";
import { searchConsoleConfigured, searchStats } from "./_lib/searchConsole.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!isAuthed(req)) return res.status(401).json({ error: "Not logged in" });
  if (!searchConsoleConfigured()) return res.status(200).json({ configured: false });
  try {
    const cached = await redis.get("gsc:cache");
    if (cached) return res.status(200).json(cached);
    const data = await searchStats(28);
    await redis.set("gsc:cache", data, { ex: 6 * 3600 });
    return res.status(200).json(data);
  } catch (err) {
    console.error("search-stats error", err);
    return res.status(502).json({ error: "Could not reach Google Search Console" });
  }
}
