// Prices shown on the home page and the commission form, editable from the
// studio's Pricing tab. Stored as 'ad-pricing' in site content: euro and
// Brazilian reais price per size, plus the launch spots note (how many spots
// in total, how many are still open). Portuguese visitors see the reais
// price, everyone else sees euros. With 0 spots left the note disappears.

export const BRL_MULTIPLIER = 6;

export const DEFAULT_PRICING = {
  a5: { eur: 65, brl: 65 * BRL_MULTIPLIER },
  a4: { eur: 90, brl: 90 * BRL_MULTIPLIER },
  spotsTotal: 7,
  spotsLeft: 5,
};

// null is kept (a field Danique cleared to retype), anything else invalid
// falls back to the default.
const num = (v, fallback) => (v === null || (typeof v === 'number' && Number.isFinite(v)) ? v : fallback);

// Only the known fields are kept, so older stored data (the retired
// "was" prices and end date) drops out the next time the tab saves.
function sizePricing(raw, def) {
  return { eur: num(raw?.eur, def.eur), brl: num(raw?.brl, def.brl) };
}

export function sitePricing(content) {
  const raw = (content && content['ad-pricing']) || {};
  return {
    a5: sizePricing(raw.a5, DEFAULT_PRICING.a5),
    a4: sizePricing(raw.a4, DEFAULT_PRICING.a4),
    spotsTotal: num(raw.spotsTotal, DEFAULT_PRICING.spotsTotal),
    spotsLeft: num(raw.spotsLeft, DEFAULT_PRICING.spotsLeft),
  };
}

export const currencyFor = (lang) => (lang === 'pt' ? 'brl' : 'eur');

export function formatMoney(n, currency) {
  const rounded = Math.round(Number(n) || 0);
  return currency === 'brl' ? 'R$' + rounded : '€' + rounded;
}

const spotsLeft = (pricing) => Math.max(0, Math.round(pricing.spotsLeft));

// The two lines under the price cards, or null when no spots are left.
export function launchNote(t, pricing) {
  const left = spotsLeft(pricing);
  if (!left) return null;
  return {
    intro: t.launchIntro.replace('{total}', Math.round(pricing.spotsTotal)),
    left: (left === 1 ? t.launchLeftOne : t.launchLeft).replace('{n}', left),
  };
}

// The short line above the hero buttons, or null when no spots are left.
export function heroSpots(t, pricing) {
  const left = spotsLeft(pricing);
  if (!left) return null;
  return t.heroSpots.replace('{left}', left).replace('{total}', Math.round(pricing.spotsTotal));
}
