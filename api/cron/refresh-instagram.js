import { refreshInstagram } from "../_lib/instagram.js";
import { isAuthed } from "../_lib/session.js";

const AMSTERDAM_TZ = "Europe/Amsterdam";
const TARGET_HOUR = 19;

function currentAmsterdamHour() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: AMSTERDAM_TZ,
    hour: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  return Number(parts.find((p) => p.type === "hour").value);
}

// Two callers:
// - Vercel Cron (Bearer CRON_SECRET). Cron can only schedule in UTC, so it
//   runs twice a day (CET and CEST) and only works on the run that lands at
//   19:00 Amsterdam time. Add ?force=1 to run it at any hour.
// - The "Refresh Instagram" button on /edit (studio session cookie), any hour.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const cron = !!process.env.CRON_SECRET && req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`;
  const studio = !cron && isAuthed(req);
  if (!cron && !studio) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const force = studio || req.query?.force === "1";
  if (!force && currentAmsterdamHour() !== TARGET_HOUR) {
    return res.status(200).json({ skipped: true, reason: "Not 19:00 Europe/Amsterdam yet" });
  }

  try {
    const result = await refreshInstagram();
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error("instagram refresh failed", err);
    return res.status(500).json({ error: err.message });
  }
}
