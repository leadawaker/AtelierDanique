import { redis } from "./redis.js";

const addTo = (bag, k, n) => { bag[k] = (bag[k] || 0) + n; };

// Sums the daily counter hashes for the last `n` days (oldest first).
export async function readStats(n) {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) dates.push(new Date(Date.now() - i * 864e5).toISOString().slice(0, 10));
  const p = redis.pipeline();
  dates.forEach((d) => p.hgetall("stats:" + d));
  const rows = await p.exec();
  const out = { days: [], sources: {}, countries: {}, langs: {}, pages: {}, totals: { views: 0, visits: 0 } };
  const bags = { "s:": out.sources, "c:": out.countries, "l:": out.langs, "p:": out.pages };
  rows.forEach((h, i) => {
    h = h || {};
    const views = Number(h.views || 0), visits = Number(h.visits || 0);
    out.days.push({ date: dates[i], views, visits });
    out.totals.views += views; out.totals.visits += visits;
    for (const [k, v] of Object.entries(h)) {
      const bag = bags[k.slice(0, 2)];
      if (bag) addTo(bag, k.slice(2), Number(v));
    }
  });
  return out;
}
