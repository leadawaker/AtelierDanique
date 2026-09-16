import { redis } from "./redis.js";

const FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";

async function getJson(url) {
  const res = await fetch(url);
  return res.json();
}

// Fetches her latest posts into Redis. Tries the stored token first, then
// IG_INITIAL_TOKEN (so pasting a new token into Vercel fixes a dead one).
// Renewing a token fails while it is under 24h old; that is fine, the token
// still works, so the posts are fetched anyway.
export async function refreshInstagram() {
  const stored = await redis.get("ig_access_token");
  const candidates = [...new Set([stored, process.env.IG_INITIAL_TOKEN].filter(Boolean))];
  if (!candidates.length) {
    throw new Error("No Instagram token available (Redis empty and IG_INITIAL_TOKEN unset)");
  }

  let lastError = null;
  for (const token of candidates) {
    const media = await getJson(
      `https://graph.instagram.com/v21.0/me/media?fields=${FIELDS}&access_token=${encodeURIComponent(token)}`
    );
    if (!media.data) {
      lastError = media.error || media;
      continue;
    }

    const refreshed = await getJson(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`
    );
    await redis.set("ig_access_token", refreshed.access_token || token);
    await redis.set("ig_posts", media.data);
    const updatedAt = new Date().toISOString();
    await redis.set("ig_posts_updated_at", updatedAt);
    return { count: media.data.length, updatedAt, renewed: !!refreshed.access_token };
  }

  throw new Error(`Instagram rejected the token: ${JSON.stringify(lastError)}`);
}
