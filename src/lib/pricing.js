// Prices shown on the home page and the commission form, editable from the
// studio's Pricing tab. Stored as 'ad-pricing' in site content: euro and
// Brazilian reais price per size, plus the launch spots (how many in total,
// how many are still open) and Danique's own text for the note under the
// prices, one per language, where {total} and {left} stand for those two
// numbers. Portuguese visitors see the reais price, everyone else sees
// euros. With 0 spots left the note and the hero line disappear.

export const BRL_MULTIPLIER = 6;

export const DEFAULT_PRICING = {
  a5: { eur: 65, brl: 65 * BRL_MULTIPLIER },
  a4: { eur: 90, brl: 90 * BRL_MULTIPLIER },
  spotsTotal: 7,
  spotsLeft: 5,
};

export const NOTE_LANGS = ['en', 'pt', 'nl'];

// null is kept (a field Danique cleared to retype), anything else invalid
// falls back to the default.
const num = (v, fallback) => (v === null || (typeof v === 'number' && Number.isFinite(v)) ? v : fallback);

// Only the known fields are kept, so older stored data (the retired
// "was" prices and end date) drops out the next time the tab saves.
function sizePricing(raw, def) {
  return { eur: num(raw?.eur, def.eur), brl: num(raw?.brl, def.brl) };
}

function noteTexts(raw) {
  const out = {};
  for (const l of NOTE_LANGS) if (raw && typeof raw[l] === 'string') out[l] = raw[l];
  return out;
}

export function sitePricing(content) {
  const raw = (content && content['ad-pricing']) || {};
  return {
    a5: sizePricing(raw.a5, DEFAULT_PRICING.a5),
    a4: sizePricing(raw.a4, DEFAULT_PRICING.a4),
    spotsTotal: num(raw.spotsTotal, DEFAULT_PRICING.spotsTotal),
    spotsLeft: num(raw.spotsLeft, DEFAULT_PRICING.spotsLeft),
    note: noteTexts(raw.note),
  };
}

export const currencyFor = (lang) => (lang === 'pt' ? 'brl' : 'eur');

export function formatMoney(n, currency) {
  const rounded = Math.round(Number(n) || 0);
  return currency === 'brl' ? 'R$' + rounded : '€' + rounded;
}

const spotsLeft = (pricing) => Math.max(0, Math.round(pricing.spotsLeft || 0));

// Put the two spot numbers into a text: {total} and {left}.
export function fillSpots(text, pricing) {
  return text
    .replaceAll('{total}', String(Math.round(pricing.spotsTotal || 0)))
    .replaceAll('{left}', String(spotsLeft(pricing)));
}

// The note text for one language: Danique's own from the studio, or the
// built-in one when she has left it empty.
export function noteText(pricing, lang, fallback) {
  const own = pricing.note[lang];
  return own && own.trim() ? own : fallback;
}

// The note under the price cards as lines (the first one is shown large),
// or null when no spots are left.
export function launchNote(t, pricing, lang) {
  if (!spotsLeft(pricing)) return null;
  const lines = fillSpots(noteText(pricing, lang, t.launchNote), pricing)
    .split('\n').map((l) => l.trim()).filter(Boolean);
  return lines.length ? lines : null;
}

// The short line above the hero buttons, or null when no spots are left.
export function heroSpots(t, pricing) {
  if (!spotsLeft(pricing)) return null;
  return fillSpots(t.heroSpots, pricing);
}
