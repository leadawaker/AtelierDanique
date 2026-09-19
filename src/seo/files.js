import { LANGS, PAGES, HTML_LANG, pathFor } from '../lib/routes.js';
import { SITE } from './meta.js';
import { sitePricing, formatMoney } from '../lib/pricing.js';

export function sitemapXml() {
  const urls = PAGES.flatMap((page) => LANGS.map((lang) => {
    const alts = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${HTML_LANG[l]}" href="${SITE + pathFor(l, page)}"/>`).join('');
    return `<url><loc>${SITE + pathFor(lang, page)}</loc>${alts}</url>`;
  }));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}

// AI crawlers are welcome: being quoted by assistants is the point.
export function robotsTxt() {
  return ['User-agent: *', 'Allow: /', 'Disallow: /login', 'Disallow: /edit', 'Disallow: /api/', '',
    `Sitemap: ${SITE}/sitemap.xml`, ''].join('\n');
}

// A plain summary for AI tools (llmstxt.org). Cheap, possibly useful.
export function llmsTxt(content) {
  const p = sitePricing(content);
  return `# Atelier Danique

> Handmade watercolour and ink paintings of meaningful places, painted by Danique from the client's photo and story. Studio in 's-Hertogenbosch, the Netherlands. Ships worldwide.

- Sizes and prices: A5 ${formatMoney(p.a5.eur, 'eur')}, A4 ${formatMoney(p.a4.eur, 'eur')} (unframed, 300g cotton paper)
- Turnaround: 5 working days, plus shipping
- Shipping: ${formatMoney(5, 'eur')} Netherlands, ${formatMoney(10, 'eur')} Europe and UK, ${formatMoney(15, 'eur')} rest of the world, free pickup in 's-Hertogenbosch
- Payment: half up front, the rest when the painting is finished, before shipping
- Languages: English, Dutch, Portuguese

## Pages
- [Home (English)](${SITE}/en)
- [Home (Nederlands)](${SITE}/nl)
- [Início (Português)](${SITE}/pt)
- [Commission a painting](${SITE}/en/commission)
- [Terms](${SITE}/en/terms)

## Contact
- Email: hello@atelierdanique.com
- Instagram: https://instagram.com/atelierdanique
`;
}
