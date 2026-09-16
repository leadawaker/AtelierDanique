// Vercel Node functions parse application/json into req.body, but a missing
// or odd Content-Type leaves a string or Buffer. Normalise to an object.
export function jsonBody(req) {
  let b = req.body;
  if (Buffer.isBuffer(b)) b = b.toString("utf8");
  if (typeof b === "string") {
    try { b = JSON.parse(b); } catch { return null; }
  }
  return b && typeof b === "object" && !Array.isArray(b) ? b : null;
}
