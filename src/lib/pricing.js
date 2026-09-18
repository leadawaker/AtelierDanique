// Prices shown on the home page, editable from the studio's Pricing tab.
// Stored as 'ad-pricing' in site content: euro price per size, an optional
// higher "was" price that draws a strikethrough, the same two figures in
// Brazilian reais, and one shared end date for the discount. Portuguese
// visitors see the reais price, everyone else sees euros.
//
// Once the "until" date passes, the website quietly stops showing the
// strikethrough and the date note on its own. Danique still has to type the
// new, higher price into the field by hand before or after that.

export const BRL_MULTIPLIER = 6;

export const DEFAULT_PRICING = {
  a5: { eur: 50, eurWas: null, brl: 50 * BRL_MULTIPLIER, brlWas: null },
  a4: { eur: 75, eurWas: null, brl: 75 * BRL_MULTIPLIER, brlWas: null },
  until: '', // 'YYYY-MM-DD', empty = no discount
};

export function sitePricing(content) {
  const raw = (content && content['ad-pricing']) || {};
  return {
    a5: { ...DEFAULT_PRICING.a5, ...raw.a5 },
    a4: { ...DEFAULT_PRICING.a4, ...raw.a4 },
    until: typeof raw.until === 'string' ? raw.until : '',
  };
}

export const currencyFor = (lang) => (lang === 'pt' ? 'brl' : 'eur');

export function priceFor(size, currency) {
  const value = size[currency];
  const was = size[currency + 'Was'];
  return { value, was: was || null };
}

// True through the end of the "until" day, in the visitor's own timezone.
export function discountActive(until) {
  if (!until) return false;
  const end = new Date(until + 'T23:59:59');
  return !Number.isNaN(end.getTime()) && end.getTime() >= Date.now();
}

export function formatMoney(n, currency) {
  const rounded = Math.round(Number(n) || 0);
  return currency === 'brl' ? 'R$' + rounded : '€' + rounded;
}

const DATE_LOCALE = { en: 'en-GB', pt: 'pt-BR', nl: 'nl-NL' };

export function formatUntil(until, lang) {
  const d = new Date(until + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(DATE_LOCALE[lang] || 'en-GB', { day: 'numeric', month: 'long' });
}
