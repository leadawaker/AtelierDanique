import { redis } from "./_lib/redis.js";
import { isAuthed } from "./_lib/session.js";
import { searchConsoleConfigured, searchStats } from "./_lib/searchConsole.js";

// A plain-words reason for the studio's Stats tab. Only a logged-in session
// gets this, and it never contains the key itself.
function hintFor(err) {
  const msg = String((err && (err.code || err.message)) || "");
  if (/DECODER|ERR_OSSL|PEM|asn1/i.test(msg)) return "The private key saved in Vercel (GSC_PRIVATE_KEY) can't be read. Copy the whole private_key value from the JSON file again, from BEGIN to END.";
  if (/invalid_grant|invalid_client|unauthorized_client/i.test(msg)) return "Google didn't accept the service account. Check that GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY come from the same JSON file.";
  if (/has not been used|is disabled|accessNotConfigured|SERVICE_DISABLED/i.test(msg)) return "The Search Console API isn't enabled in the Google Cloud project that owns the service account.";
  if (/gsc query 40[34]/.test(msg)) return "Google says this service account has no access to the property. Add its email under Users and permissions in Search Console, and check that GSC_SITE is sc-domain:atelierdanique.com.";
  if (/gsc token/.test(msg)) return "Google refused the service account login (" + msg.slice(0, 40) + ").";
  return "Something else went wrong (" + msg.slice(0, 60) + ").";
}

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
    return res.status(502).json({ error: "Could not reach Google Search Console", hint: hintFor(err) });
  }
}
