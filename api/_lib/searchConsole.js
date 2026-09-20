import { createSign } from "node:crypto";

const API = "https://www.googleapis.com/webmasters/v3/sites/";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");

export const searchConsoleConfigured = () =>
  !!(process.env.GSC_CLIENT_EMAIL && process.env.GSC_PRIVATE_KEY && process.env.GSC_SITE);

// The private key as pasted into Vercel can arrive with its line breaks turned
// into spaces or a literal \n, with the quotes around it, or even as the whole
// JSON file. Rebuild a clean PEM from whichever of those it is.
export function normalizeKey(raw) {
  let s = String(raw).trim();
  if (s.startsWith("{")) { try { s = JSON.parse(s).private_key || s; } catch { /* not JSON */ } }
  const m = s.match(/-----BEGIN ([A-Z ]+)-----([\s\S]*?)-----END \1-----/);
  if (!m) {
    // Pasted without the BEGIN/END lines: a bare base64 body is a PKCS#8 key.
    const bare = s.replace(/\\n|\s|"/g, "");
    if (/^[A-Za-z0-9+/]{200,}={0,2}$/.test(bare)) return `-----BEGIN PRIVATE KEY-----\n${bare.match(/.{1,64}/g).join("\n")}\n-----END PRIVATE KEY-----\n`;
    return s.replace(/\\n/g, "\n");
  }
  const body = m[2].replace(/\\n|\s|"/g, "");
  return `-----BEGIN ${m[1]}-----\n${body.match(/.{1,64}/g).join("\n")}\n-----END ${m[1]}-----\n`;
}

// Counts only (never the key itself) so the studio can say what Vercel holds.
export function keyInfo() {
  const raw = String(process.env.GSC_PRIVATE_KEY || "");
  const m = raw.match(/-----BEGIN ([A-Z ]+)-----([\s\S]*?)-----END \1-----/);
  return {
    length: raw.length,
    begin: /-----BEGIN [A-Z ]+-----/.test(raw),
    end: /-----END [A-Z ]+-----/.test(raw),
    type: m ? m[1] : null,
    body: m ? m[2].replace(/\\n|\s|"/g, "").length : 0,
  };
}

// Service-account login (JWT bearer grant), signed with node:crypto so no
// Google SDK is needed.
async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  const unsigned = b64({ alg: "RS256", typ: "JWT" }) + "." + b64({
    iss: process.env.GSC_CLIENT_EMAIL, scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600,
  });
  const key = normalizeKey(process.env.GSC_PRIVATE_KEY);
  const sig = createSign("RSA-SHA256").update(unsigned).sign(key).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: unsigned + "." + sig }),
  });
  if (!res.ok) throw new Error("gsc token " + res.status + " " + (await res.text()).slice(0, 200));
  return (await res.json()).access_token;
}

async function query(token, body) {
  const res = await fetch(API + encodeURIComponent(process.env.GSC_SITE) + "/searchAnalytics/query", {
    method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("gsc query " + res.status + " " + (await res.text()).slice(0, 200));
  return (await res.json()).rows || [];
}

// Search Console data lags about two days, so the window ends two days ago.
export async function searchStats(days = 28) {
  const day = (offset) => new Date(Date.now() - offset * 864e5).toISOString().slice(0, 10);
  const range = { startDate: day(days + 2), endDate: day(2) };
  const token = await accessToken();
  const [daily, queries, pages] = await Promise.all([
    query(token, { ...range, dimensions: ["date"] }),
    query(token, { ...range, dimensions: ["query"], rowLimit: 10 }),
    query(token, { ...range, dimensions: ["page"], rowLimit: 10 }),
  ]);
  const clicks = daily.reduce((a, r) => a + r.clicks, 0);
  const impressions = daily.reduce((a, r) => a + r.impressions, 0);
  const position = impressions ? daily.reduce((a, r) => a + r.position * r.impressions, 0) / impressions : null;
  return {
    configured: true,
    totals: { clicks, impressions, position },
    daily: daily.map((r) => ({ date: r.keys[0], clicks: r.clicks, impressions: r.impressions })),
    queries: queries.map((r) => ({ query: r.keys[0], clicks: r.clicks, impressions: r.impressions, position: r.position })),
    pages: pages.map((r) => ({ page: r.keys[0], clicks: r.clicks, impressions: r.impressions })),
  };
}
