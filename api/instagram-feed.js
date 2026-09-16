import { redis } from "./_lib/redis.js";

// Public, read-only endpoint the site's frontend calls. Never touches Meta
// or the access token directly, just serves whatever the cron job cached.
export default async function handler(req, res) {
  const posts = (await redis.get("ig_posts")) || [];
  const updatedAt = await redis.get("ig_posts_updated_at");

  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  return res.status(200).json({ posts, updatedAt });
}
