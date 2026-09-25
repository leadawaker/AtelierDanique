import { useEffect, useState } from 'react';

// The prerender script sets this before rendering. In the browser it comes
// from the <script> the prerender inlined, so hydration matches the HTML.
let initialContent = null;
export function setInitialContent(raw) { initialContent = normalizeContent(raw); }
function startContent() {
  if (initialContent) return initialContent;
  if (typeof window !== 'undefined' && window.__AD_CONTENT__) return (initialContent = normalizeContent(window.__AD_CONTENT__));
  return EMPTY_CONTENT;
}

// Everything Danique edits in the studio is one flat JSON object, stored in
// Redis as a hash (one field per key) and served by /api/content. The keys
// match the localStorage keys from the Design brief.
export const CONTENT_KEYS = [
  'ad-gallery-extra',       // [{slotId, title:{en,pt,nl}, caption:{en,pt,nl}, category}]
  'ad-gallery-hidden',      // [slotId]
  'ad-gallery-text',        // {slotId: {title:{en,pt,nl}, caption:{en,pt,nl}}}
  'ad-photos',              // {slotId: {url, s, fx, fy}}  see photos.js
  'ad-gallery-settings',    // {height, gap, slatWidth, slatGap, radius, duration, interval, autoplay, hoverGrow}, see home/settings.js
  'ad-testimonials',        // see testimonials.js
  'ad-testimonials-hidden',
  'ad-testimonials-text',
  'ad-video-url',           // string, Vimeo or YouTube link, '' = none
  'ad-hero-layout',         // 'banner' | 'split'
  'ad-copy',                // {stringKey: {en, pt, nl}}
  'ad-pricing',             // {a5, a4, a3: {eur, brl}, spotsTotal, spotsLeft}  see lib/pricing.js
  'ad-google-reviews',      // {enabled, url}  Google review link under testimonials
  'ad-hero-palette',        // {enabled}  paint palette on the phone hero, on unless enabled is false
];

export const EMPTY_CONTENT = {
  'ad-gallery-extra': [],
  'ad-gallery-hidden': [],
  'ad-gallery-text': {},
  'ad-photos': {},
  'ad-gallery-settings': {},
  'ad-testimonials': [],
  'ad-testimonials-hidden': [],
  'ad-testimonials-text': {},
  'ad-video-url': '',
  'ad-hero-layout': 'banner',
  'ad-copy': {},
  'ad-pricing': {},
  'ad-google-reviews': {},
  'ad-hero-palette': {},
};

// Fill missing or wrongly typed keys with the empty default, so a blank or
// partly broken store renders exactly like the untouched design.
export function normalizeContent(raw) {
  const out = { ...EMPTY_CONTENT };
  if (!raw || typeof raw !== 'object') return out;
  for (const key of CONTENT_KEYS) {
    const def = EMPTY_CONTENT[key];
    const v = raw[key];
    if (Array.isArray(def) ? Array.isArray(v)
      : typeof def === 'string' ? typeof v === 'string'
      : v && typeof v === 'object' && !Array.isArray(v)) out[key] = v;
  }
  if (out['ad-hero-layout'] !== 'split') out['ad-hero-layout'] = 'banner';
  return out;
}

export async function fetchContent({ fresh = false } = {}) {
  const res = await fetch('/api/content' + (fresh ? '?fresh=1' : ''), fresh ? { cache: 'no-store' } : undefined);
  if (!res.ok) throw new Error('content ' + res.status);
  return normalizeContent(await res.json());
}

// Public pages: render defaults immediately, swap in the stored content when
// it arrives, and re-read when the tab regains focus (so an edit made in the
// studio shows up on switching back).
export function useSiteContent() {
  const [content, setContent] = useState(startContent);
  useEffect(() => {
    let alive = true;
    const load = () => fetchContent().then((c) => { if (alive) setContent(c); }).catch(() => {});
    load();
    window.addEventListener('focus', load);
    return () => { alive = false; window.removeEventListener('focus', load); };
  }, []);
  return content;
}
