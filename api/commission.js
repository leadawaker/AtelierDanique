import { redis } from "./_lib/redis.js";
import { jsonBody } from "./_lib/body.js";

// Commission form, "Send by email": emails Danique the answers (and the photo
// as an attachment) through Resend. Nothing is stored.
const MAX_PER_HOUR = 5;
const MAX_TEXT = 4000;
const MAX_PHOTO_B64 = 4_000_000;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const FIELDS = [
  ["name", "Name"],
  ["contact", "Email or phone"],
  ["what", "Where is this, and what is it?"],
  ["why", "Why is this moment meaningful?"],
  ["feel", "How does it make them feel?"],
  ["extra", "Anything else"],
];
const SIZES = { A5: "A5 (€50)", A4: "A4 (€75)" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const text = (v) => (typeof v === "string" ? v.trim().slice(0, MAX_TEXT) : "");

function clientIp(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return fwd || String(req.headers["x-real-ip"] || "") || "unknown";
}

function buildEmail(form, size, lang) {
  const rows = FIELDS.map(([k, label]) => [label, form[k]]).filter(([, v]) => v);
  rows.push(["Size", SIZES[size]], ["Language", lang]);
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#26454F">
<p>New commission request from the website.</p>
${rows.map(([k, v]) => `<p style="margin:0 0 14px"><strong>${esc(k)}</strong><br>${esc(v).replace(/\n/g, "<br>")}</p>`).join("\n")}
</div>`;
  const plain = "New commission request from the website.\n\n" + rows.map(([k, v]) => `${k}:\n${v}`).join("\n\n");
  return { html, plain };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = jsonBody(req);
  if (!body) return res.status(400).json({ error: "Bad request" });
  // Honeypot: a hidden field people never fill in. Pretend it worked.
  if (text(body.website)) return res.status(200).json({ ok: true });

  const form = Object.fromEntries(FIELDS.map(([k]) => [k, text(body[k])]));
  const size = SIZES[body.size] ? body.size : "A4";
  const lang = ["en", "pt", "nl"].includes(body.lang) ? body.lang : "en";
  if (!form.name || !form.contact) return res.status(400).json({ error: "Name and contact are required" });

  const photo = body.photo;
  if (photo) {
    const ok = typeof photo.data === "string" && photo.data.length <= MAX_PHOTO_B64
      && /^[A-Za-z0-9+/=]+$/.test(photo.data) && PHOTO_TYPES.includes(photo.type);
    if (!ok) return res.status(413).json({ error: "Photo too large or not an image" });
  }

  try {
    const key = `commission:ip:${clientIp(req)}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 3600);
    if (count > MAX_PER_HOUR) return res.status(429).json({ error: "Too many requests" });

    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY env var is not set");
    const { html, plain } = buildEmail(form, size, lang);
    const ext = photo ? (photo.type.split("/")[1] || "jpg").replace("jpeg", "jpg") : "";
    const safeName = form.name.replace(/[^\p{L}\p{N} -]/gu, "").trim().slice(0, 40) || "client";

    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.COMMISSION_FROM || "Atelier Danique website <website@atelierdanique.com>",
        to: [process.env.COMMISSION_TO || "hello@atelierdanique.com"],
        ...(EMAIL_RE.test(form.contact) ? { reply_to: form.contact } : {}),
        subject: `New commission request: ${form.name.slice(0, 60)} (${size})`,
        html,
        text: plain,
        ...(photo ? { attachments: [{ filename: `${safeName} photo.${ext}`, content: photo.data }] } : {}),
      }),
    });
    if (!sent.ok) throw new Error(`Resend ${sent.status}: ${await sent.text()}`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("commission email failed", err);
    return res.status(500).json({ error: "Could not send" });
  }
}
