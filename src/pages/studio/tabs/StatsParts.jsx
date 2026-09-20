import { s } from '../../../lib/css.js';

// Small building blocks for the Stats tab: a number tile, a bar chart
// of visits per day, and a short ranked list with a proportional bar. Kept
// separate from StatsTab.jsx so neither file grows past ~200 lines.

const PANEL = 'background:#F1EFE8;border:1px solid #E2DED4;border-radius:6px;padding:16px';

export function Tile({ label, value }) {
  return (
    <div style={s(PANEL)}>
      <p style={s('margin:0 0 6px;font-size:12px;letter-spacing:.04em;color:#85949A')}>{label}</p>
      <p style={s("margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(22px,2.6vw,30px);color:#26454F")}>{value}</p>
    </div>
  );
}

const CHART_H = 90;

// One bar per day, height proportional to that day's visits. The bars share
// the box width; with many days they keep a minimum width and the box scrolls.
// A native title gives the hover with the date and count. `caption` says what
// the chart shows, in plain words.
export function DailyBars({ days, caption }) {
  const list = days || [];
  const max = Math.max(1, ...list.map((d) => d.visits || 0));
  const gap = list.length > 40 ? 2 : 4;
  return (
    <div style={s(PANEL)}>
      <div style={s('overflow-x:auto')}>
        <div role="img" aria-label={caption || 'Visits per day'}
          style={s('display:flex;align-items:flex-end;gap:' + gap + 'px;height:' + CHART_H + 'px;min-width:' + list.length * (4 + gap) + 'px')}>
          {list.map((d) => {
            const h = Math.max(2, Math.round(((d.visits || 0) / max) * (CHART_H - 14)));
            return (
              <div key={d.date} title={d.date + ': ' + (d.visits || 0) + (d.visits === 1 ? ' visit' : ' visits')}
                style={s('flex:1 1 0;min-width:4px;background:#E36B54;border-radius:3px 3px 0 0;height:' + h + 'px')} />
            );
          })}
        </div>
      </div>
      {caption && <p style={s('margin:10px 0 0;font-size:12px;color:#85949A;font-weight:300')}>{caption}</p>}
    </div>
  );
}

// A short list (already sorted, top 6) with a thin proportional bar under
// each row so the relative sizes are visible at a glance.
export function RankedList({ title, items }) {
  const max = Math.max(1, ...items.map((it) => it.value || 0));
  return (
    <div>
      <p style={s('margin:0 0 10px;font-size:14px;color:#26454F')}>{title}</p>
      {items.length === 0 ? (
        <p style={s('margin:0;font-size:13px;color:#85949A;font-weight:300')}>Nothing yet.</p>
      ) : (
        <ul style={s('list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px')}>
          {items.map((it) => (
            <li key={it.key ?? it.label} style={s('display:flex;flex-direction:column;gap:4px')}>
              <div style={s('display:flex;justify-content:space-between;gap:10px;font-size:13px;color:#455459')}>
                <span style={s('overflow:hidden;text-overflow:ellipsis;white-space:nowrap')}>{it.label}</span>
                <span style={s('color:#85949A;flex:0 0 auto')}>{it.value}</span>
              </div>
              <div style={s('height:4px;background:#E2DED4;border-radius:2px;overflow:hidden')}>
                <div style={s('height:100%;background:#26454F;border-radius:2px;width:' + Math.max(4, Math.round(((it.value || 0) / max) * 100)) + '%')} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
