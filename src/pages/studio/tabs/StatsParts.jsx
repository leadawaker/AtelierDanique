import { useEffect, useRef } from 'react';
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

const CHART_H = 76;
const COL_W = 28;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// One column per day: the day's visit count on top, a bar proportional to it,
// and the date underneath (day of the month, with the month name on the 1st
// and on the first column). Every column keeps a minimum width so the numbers
// stay readable; with many days the box scrolls sideways and starts at the
// latest day. `caption` says what the chart shows, in plain words.
export function DailyBars({ days, caption }) {
  const list = days || [];
  const max = Math.max(1, ...list.map((d) => d.visits || 0));
  const scroller = useRef(null);
  useEffect(() => { const el = scroller.current; if (el) el.scrollLeft = el.scrollWidth; }, [list.length]);
  return (
    <div style={s(PANEL)}>
      <div ref={scroller} style={s('overflow-x:auto;padding-bottom:2px')}>
        <div role="img" aria-label={caption || 'Visits per day'}
          style={s('display:flex;align-items:flex-end;gap:2px;min-width:' + list.length * (COL_W + 2) + 'px')}>
          {list.map((d, i) => {
            const n = d.visits || 0;
            const h = n ? Math.max(3, Math.round((n / max) * CHART_H)) : 2;
            const day = Number(d.date.slice(8, 10));
            const month = i === 0 || day === 1 ? MONTHS[Number(d.date.slice(5, 7)) - 1] : '';
            return (
              <div key={d.date} title={d.date + ': ' + n + (n === 1 ? ' visit' : ' visits')}
                style={s('flex:1 0 ' + COL_W + 'px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end')}>
                <span style={s('font-size:11px;line-height:14px;color:' + (n ? '#455459' : '#B5BDC0'))}>{n}</span>
                <div style={s('width:70%;max-width:32px;background:' + (n ? '#E36B54' : '#E2DED4') + ';border-radius:3px 3px 0 0;height:' + h + 'px')} />
                <span style={s('margin-top:4px;font-size:10px;line-height:12px;color:#85949A')}>{day}</span>
                <span style={s('font-size:9px;line-height:11px;height:11px;color:#85949A')}>{month}</span>
              </div>
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
