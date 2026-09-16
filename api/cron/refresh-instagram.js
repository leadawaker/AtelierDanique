import { redis } from "../_lib/redis.js";

const AMSTERDAM_TZ = "Europe/Amsterdam";
const TARGET_HOUR = 19;
const FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";

function currentAmsterdamHour() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: AMSTERDAM_TZ,
    hour: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  return Number(parts.find((p) => p.type === "hour").value);
}

// Vercel Cron can only schedule in UTC, so this runs twice a day (covering
// both CET and CEST) and only does real work on the invocation that actually
// lands at 19:00 Amsterdam time. See vercel.json for the two UTC schedules.
export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (currentAmsterdamHour() !== TARGET_HOUR) {
    return res.status(200).json({ skipped: true, reason: "Not 19:00 Europe/Amsterdam yet" });
  }

  try {
    const currentToken = (await redis.get("ig_access_token")) || process.env.IG_INITIAL_TOKEN;
    if (!currentToken) {
      return res.status(500).json({ error: "No Instagram token available (Redis empty and IG_INITIAL_TOKEN unset)" });
    }

    // Refresh the long-lived token for another 60 days. Requires the token to
    // already be at least 24h old, which the daily schedule guarantees after
    // the first run.
    const refreshRes = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`
    );
    const refreshData = await refreshRes.json();
    if (!refreshData.access_token) {
      throw new Error(`Token refresh failed: ${JSON.stringify(refreshData)}`);
    }
    const freshToken = refreshData.access_token;
    await redis.set("ig_access_token", freshToken);

    const mediaRes = await fetch(
      `https://graph.instagram.com/v21.0/me/media?fields=${FIELDS}&access_token=${freshToken}`
    );
    const mediaData = await mediaRes.json();
    if (!mediaData.data) {
      throw new Error(`Media fetch failed: ${JSON.stringify(mediaData)}`);
    }

    await redis.set("ig_posts", mediaData.data);
    await redis.set("ig_posts_updated_at", new Date().toISOString());

    return res.status(200).json({ ok: true, count: mediaData.data.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
