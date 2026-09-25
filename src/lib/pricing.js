// Prices shown on the home page and the commission form, editable from the
// studio's Pricing tab. Stored as 'ad-pricing' in site content: euro and
// Brazilian reais price per size, plus the launch spots (how many in total,
// how many are still open) and Danique's own text for the launch banner above
// the price cards, one per language, where {total}, {left} and {prices} (the
// current price range) are filled in. Portuguese visitors see the reais
// price, everyone else sees euros. With 0 spots left the banner, the
// "launch price" labels and the hero line disappear.

export const BRL_MULTIPLIER = 6;

export const DEFAULT_PRICING = {
  a5: { eur: 65, brl: 65 * BRL_MULTIPLIER },
  a4: { eur: 90, brl: 90 * BRL_MULTIPLIER },
  a3: { eur: 150, brl: 150 * BRL_MULTIPLIER },
  spotsTotal: 7,
  spotsLeft: 5,
};

export const NOTE_LANGS = ['en', 'pt', 'nl'];

// The three paper sizes, smallest first: the order the price cards, the
// commission form's buttons and the studio's Pricing tab all follow.
export const SIZE_IDS = ['a5', 'a4', 'a3'];

// The A4 card's photo starts 20% zoomed in inside its frame (s = 1.2 around
// the paper). Used by the page and by the studio's Photos tab, so both show
// the same default; a photo saved from the studio replaces it.
export const A4_PHOTO_FOCUS = { s: 1.2, fx: 0.5, fy: 0.49 };

// null is kept (a field Danique cleared to retype), anything else invalid
// falls back to the default.
const num = (v, fallback) => (v === null || (typeof v === 'number' && Number.isFinite(v)) ? v : fallback);

// Only the known fields are kept, so older stored data (the retired
// "was" prices and end date) drops out the next time the tab saves.
function sizePricing(raw, def) {
  return { eur: num(raw?.eur, def.eur), brl: num(raw?.brl, def.brl) };
}

function bannerTexts(raw) {
  const out = {};
  for (const l of NOTE_LANGS) if (raw && typeof raw[l] === 'string') out[l] = raw[l];
  return out;
}

export function sitePricing(content) {
  const raw = (content && content['ad-pricing']) || {};
  return {
    a5: sizePricing(raw.a5, DEFAULT_PRICING.a5),
    a4: sizePricing(raw.a4, DEFAULT_PRICING.a4),
    a3: sizePricing(raw.a3, DEFAULT_PRICING.a3),
    spotsTotal: num(raw.spotsTotal, DEFAULT_PRICING.spotsTotal),
    spotsLeft: num(raw.spotsLeft, DEFAULT_PRICING.spotsLeft),
    banner: bannerTexts(raw.banner),
  };
}

export const currencyFor = (lang) => (lang === 'pt' ? 'brl' : 'eur');

export function formatMoney(n, currency) {
  const rounded = Math.round(Number(n) || 0);
  return currency === 'brl' ? 'R$' + rounded : '€' + rounded;
}

const spotsLeft = (pricing) => Math.max(0, Math.round(pricing.spotsLeft || 0));

export const launchActive = (pricing) => spotsLeft(pricing) > 0;

// "€65–€150": the lowest and highest price in the visitor's currency.
export function priceRange(pricing, currency) {
  const values = SIZE_IDS.map((id) => pricing[id][currency]).filter((v) => typeof v === 'number');
  if (!values.length) return '';
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  return lo === hi ? formatMoney(lo, currency) : formatMoney(lo, currency) + '–' + formatMoney(hi, currency);
}

// Put the numbers into a text: {total}, {left} and, when given, {prices}.
export function fillSpots(text, pricing, prices = '') {
  return text
    .replaceAll('{total}', String(Math.round(pricing.spotsTotal || 0)))
    .replaceAll('{left}', String(spotsLeft(pricing)))
    .replaceAll('{prices}', prices);
}

// The banner text for one language: Danique's own from the studio, or the
// built-in one when she has left it empty.
export function bannerText(pricing, lang, fallback) {
  const own = pricing.banner[lang];
  return own && own.trim() ? own : fallback;
}

// The launch banner above the price cards, or null when no spots are left.
export function launchBanner(t, pricing, lang) {
  if (!launchActive(pricing)) return null;
  const prices = priceRange(pricing, currencyFor(lang));
  const lines = fillSpots(bannerText(pricing, lang, t.launchBody), pricing, prices)
    .split('\n').map((l) => l.trim()).filter(Boolean);
  return {
    title: t.launchTitle,
    lines,
    count: fillSpots(t.launchCount, pricing),
    countLabel: t.launchCountLabel,
  };
}

// The short line above the hero buttons, or null when no spots are left.
export function heroSpots(t, pricing) {
  if (!launchActive(pricing)) return null;
  return fillSpots(t.heroSpots, pricing);
}
