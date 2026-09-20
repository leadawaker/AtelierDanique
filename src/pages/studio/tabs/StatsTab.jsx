import { useEffect, useState } from 'react';
import { s } from '../../../lib/css.js';
import { parsePath } from '../../../lib/routes.js';
import { fetchStats, fetchSearchStats, requestRebuild } from '../api.js';
import { Tile, DailyBars, RankedList } from './StatsParts.jsx';

// Stats tab: plain-language visitor and Google search numbers for Danique.
// This tab has its own data (not the shared `content`/`update` from Studio),
// so it ignores the props the other tabs use.

const SECTION = 'margin-bottom:clamp(44px,6vw,72px)';
const H2 = "margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(22px,2.4vw,30px);line-height:1.1";
const H2_WRAP = 'border-bottom:1px solid #DDD9CF;padding-bottom:12px;margin-bottom:22px';
const NOTE = 'margin:0;font-size:13px;line-height:1.6;color:#85949A;font-weight:300';
const LOADING = 'margin:0;font-size:15px;color:#85949A;font-weight:300';
const ERROR = 'margin:0;font-size:15px;color:#C0503B;font-weight:300';

const SOURCE_NAMES = {
  instagram: 'Instagram', google: 'Google search', bing: 'Bing search', chatgpt: 'ChatGPT',
  perplexity: 'Perplexity', claude: 'Claude', gemini: 'Gemini', facebook: 'Facebook',
  pinterest: 'Pinterest', whatsapp: 'WhatsApp', direct: 'Typed the address or a saved link', other: 'Somewhere else',
};
const AI_SOURCES = ['google', 'bing', 'chatgpt', 'perplexity', 'claude', 'gemini'];
const PAGE_NAMES = { '': 'Home', commission: 'Commission', privacy: 'Privacy policy', terms: 'Terms' };
const PERIODS = [{ days: 7, label: 'Last 7 days' }, { days: 28, label: 'Last 28 days' }, { days: 90, label: 'Last 90 days' }];

let regionNames = null;
function countryLabel(cc) {
  if (!cc || cc === '??') return 'Unknown';
  try {
    regionNames = regionNames || new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(cc) || cc;
  } catch { return cc; }
}
function sourceLabel(name) {
  return SOURCE_NAMES[name] || (name.charAt(0).toUpperCase() + name.slice(1));
}
function pageLabel(path) {
  const { lang, page } = parsePath(path);
  if (!lang) return path;
  return (PAGE_NAMES[page] ?? (page || 'Home')) + ' (' + lang.toUpperCase() + ')';
}
function toRanked(obj, labelFn) {
  return Object.entries(obj || {}).map(([key, value]) => ({ label: labelFn(key), value }))
    .sort((a, b) => b.value - a.value).slice(0, 6);
}
const fmt = (n) => (n || 0).toLocaleString('en');

export default function StatsTab() {
  const [days, setDays] = useState(28);
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState(false);
  const [search, setSearch] = useState(null);
  const [searchError, setSearchError] = useState(false);
  const [rebuild, setRebuild] = useState('idle'); // idle | busy | ok | full | error

  useEffect(() => {
    let alive = true;
    setStatsError(false);
    fetchStats(days).then((data) => alive && setStats(data)).catch(() => alive && setStatsError(true));
    return () => { alive = false; };
  }, [days]);

  useEffect(() => {
    let alive = true;
    fetchSearchStats().then((data) => alive && setSearch(data)).catch(() => alive && setSearchError(true));
    return () => { alive = false; };
  }, []);

  const doRebuild = async () => {
    setRebuild('busy');
    try {
      const result = await requestRebuild();
      setRebuild(result === 'ok' ? 'ok' : result === 'busy' ? 'full' : 'error');
    } catch { setRebuild('error'); }
  };

  const aiTotal = stats ? AI_SOURCES.reduce((sum, key) => sum + (stats.sources?.[key] || 0), 0) : 0;

  return (
    <div>
      <section style={s(SECTION)}>
        <div style={s(H2_WRAP)}><h2 style={s(H2)}>Visitors</h2></div>

        <div role="tablist" aria-label="Time period" style={s('display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap')}>
          {PERIODS.map((p) => (
            <button key={p.days} type="button" role="tab" aria-selected={days === p.days} onClick={() => setDays(p.days)}
              style={s('border:1px solid ' + (days === p.days ? '#E36B54' : '#D3CFC4') + ';background:' + (days === p.days ? '#E36B54' : 'transparent')
                + ';color:' + (days === p.days ? '#FCFAF6' : '#455459') + ';border-radius:20px;padding:8px 16px;font-size:13px;cursor:pointer')}>
              {p.label}
            </button>
          ))}
        </div>

        {statsError ? (
          <p style={s(ERROR)}>Couldn't load the visitor numbers right now. Try again in a moment.</p>
        ) : !stats ? (
          <p style={s(LOADING)}>Loading…</p>
        ) : (
          <>
            <div style={s('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:14px;margin-bottom:24px')}>
              <Tile label="Visits" value={fmt(stats.totals?.visits)} />
              <Tile label="Pages viewed" value={fmt(stats.totals?.views)} />
              <Tile label="From Instagram" value={fmt(stats.sources?.instagram)} />
              <Tile label="From Google + AI assistants" value={fmt(aiTotal)} />
            </div>

            <DailyBars days={stats.days} />

            <div style={s('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:clamp(18px,2.4vw,28px);margin-top:28px')}>
              <RankedList title="Where visitors come from" items={toRanked(stats.sources, sourceLabel)} />
              <RankedList title="Countries" items={toRanked(stats.countries, countryLabel)} />
              <RankedList title="Pages" items={toRanked(stats.pages, pageLabel)} />
            </div>
          </>
        )}
      </section>

      <section style={s(SECTION)}>
        <div style={s(H2_WRAP)}><h2 style={s(H2)}>Google search</h2></div>
        {searchError ? (
          <p style={s(ERROR)}>Couldn't load the Google search data right now.</p>
        ) : !search ? (
          <p style={s(LOADING)}>Loading…</p>
        ) : !search.configured ? (
          <p style={s(NOTE)}>Google search data isn't connected yet.</p>
        ) : (
          <>
            <div style={s('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:14px;margin-bottom:24px')}>
              <Tile label="Seen in Google" value={fmt(search.totals?.impressions)} />
              <Tile label="Clicked" value={fmt(search.totals?.clicks)} />
              <Tile label="Average position" value={search.totals?.position == null ? '-' : (Math.round(search.totals.position * 10) / 10).toString()} />
            </div>
            <RankedList title="What people searched" items={(search.queries || []).slice(0, 6).map((q) => ({ label: q.query, value: q.clicks }))} />
          </>
        )}
      </section>

      <section>
        <div style={s(H2_WRAP)}><h2 style={s(H2)}>Keep Google up to date</h2></div>
        <p style={s(NOTE + ';margin-bottom:16px;max-width:64ch')}>
          Your changes reach Google automatically every night. Use this after a big change.
        </p>
        <button type="button" onClick={doRebuild} disabled={rebuild === 'busy'} className="h-bg-coral-dark"
          style={s('background:#E36B54;color:#FCFAF6;border:0;padding:14px 22px;font-size:15px;border-radius:2px;cursor:pointer;transition:background .25s;opacity:' + (rebuild === 'busy' ? '0.6' : '1'))}>
          {rebuild === 'busy' ? 'Updating…' : 'Update what Google sees'}
        </button>
        {rebuild === 'ok' && <p style={s('margin:12px 0 0;font-size:14px;color:#455459')}>Updating, ready in about 2 minutes.</p>}
        {rebuild === 'full' && <p style={s('margin:12px 0 0;font-size:14px;color:#455459')}>Already updating.</p>}
        {rebuild === 'error' && <p style={s('margin:12px 0 0;font-size:14px;color:#C0503B')}>Something went wrong.</p>}
      </section>
    </div>
  );
}
