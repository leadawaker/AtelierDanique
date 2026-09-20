import { s } from '../../../lib/css.js';

// Optional "Read and leave reviews on Google" link under the testimonials.
// Off by default; Danique switches it on once she has a few Google reviews
// to point visitors to.

const PANEL = 'background:#F1EFE8;border:1px solid #E2DED4;border-radius:6px;padding:18px';
const LABEL = 'font-size:13px;color:#455459';
const INPUT = 'background:#FCFAF6;border:1px solid #D3CFC4;border-radius:2px;padding:12px 14px;font-size:16px;outline:none;color:#26454F;width:100%';
const NOTE = 'margin:0;font-size:13px;line-height:1.6;color:#85949A;font-weight:300';

export default function GoogleReviewsSetting({ content, update, error }) {
  const g = content['ad-google-reviews'] || {};
  const enabled = !!g.enabled;
  const url = g.url || '';

  const set = (next) => update('ad-google-reviews', { enabled, url, ...next });

  return (
    <div style={s(PANEL + ';margin-bottom:28px;display:flex;flex-direction:column;gap:14px')}>
      <div style={s('display:flex;flex-direction:column;gap:6px')}>
        <label htmlFor="ad-google-reviews-url" style={s(LABEL)}>Your Google review link (from Google Business Profile, "Ask for reviews")</label>
        <input
          id="ad-google-reviews-url"
          type="text"
          value={url}
          onChange={(e) => set({ url: e.target.value })}
          aria-invalid={!!error}
          aria-describedby={error ? 'ad-google-reviews-error' : undefined}
          style={s(INPUT + (error ? ';border-color:#C0503B' : ''))}
        />
        {error && <p id="ad-google-reviews-error" role="alert" style={s('margin:0;font-size:13px;color:#C0503B')}>{error}</p>}
      </div>
      <label style={s('display:flex;align-items:center;gap:10px;font-size:14px;color:#26454F;cursor:' + (url ? 'pointer' : 'not-allowed'))}>
        <input
          type="checkbox"
          checked={enabled}
          disabled={!url}
          onChange={(e) => set({ enabled: e.target.checked })}
        />
        Show a Google reviews link under the testimonials
      </label>
      <p style={s(NOTE)}>Switch this on once you have 3 or more reviews.</p>
    </div>
  );
}
