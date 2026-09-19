import { isAuthed } from "./_lib/session.js";
import { readStats } from "./_lib/stats.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!isAuthed(req)) return res.status(401).json({ error: "Not logged in" });
  const days = Math.min(365, Math.max(7, Number(req.query?.days) || 28));
  try { return res.status(200).json(await readStats(days)); }
  catch (err) { console.error("stats error", err); return res.status(500).json({ error: "Server error" }); }
}
