// Tells the browser which country the visitor is in, so the site can open in
// Dutch for the Netherlands and Portuguese for Brazil. Vercel puts the
// country on every request as x-vercel-ip-country (two letters, e.g. "NL").
// Never cached: the answer is different for every visitor.
export default function handler(req, res) {
  const raw = req.headers["x-vercel-ip-country"];
  const country = typeof raw === "string" && /^[A-Za-z]{2}$/.test(raw) ? raw.toUpperCase() : "";
  res.setHeader("Cache-Control", "private, no-store");
  return res.status(200).json({ country });
}
