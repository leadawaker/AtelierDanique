import { HTML_LANG, pathFor } from '../lib/routes.js';
import { sitePricing } from '../lib/pricing.js';
import { withCopy } from '../lib/strings.js';
import { SITE, metaFor, ogImage } from './meta.js';

const INSTAGRAM = 'https://instagram.com/atelierdanique';
const id = (frag) => SITE + '/#' + frag;

function offer(name, eur, brl) {
  const service = { '@type': 'Service', name, serviceType: 'Custom watercolour painting from a photo' };
  return [
    { '@type': 'Offer', price: String(eur), priceCurrency: 'EUR', itemOffered: service },
    { '@type': 'Offer', price: String(brl), priceCurrency: 'BRL', itemOffered: service },
  ];
}

// Who and what Atelier Danique is, in schema.org terms. The street address is
// deliberately left out: only the city is public.
export function jsonLd(lang, page, content) {
  const p = sitePricing(content);
  const t = withCopy(lang, content?.['ad-copy']);
  const graph = [
    { '@type': 'WebSite', '@id': id('website'), url: SITE + '/', name: 'Atelier Danique', inLanguage: ['nl', 'en', 'pt-BR'], publisher: { '@id': id('business') } },
    {
      '@type': 'LocalBusiness', '@id': id('business'), name: 'Atelier Danique',
      description: metaFor(lang, '').description,
      url: SITE + pathFor(lang), image: ogImage(content), logo: SITE + '/apple-touch-icon.png',
      email: 'hello@atelierdanique.com', telephone: '+31617862359',
      address: { '@type': 'PostalAddress', addressLocality: "'s-Hertogenbosch", addressRegion: 'Noord-Brabant', addressCountry: 'NL' },
      areaServed: 'Worldwide', founder: { '@id': id('danique') }, sameAs: [INSTAGRAM],
      priceRange: '€' + Math.min(p.a5.eur, p.a4.eur, p.a3.eur) + '-€' + Math.max(p.a5.eur, p.a4.eur, p.a3.eur),
      makesOffer: [
        ...offer('A5 watercolour painting', p.a5.eur, p.a5.brl),
        ...offer('A4 watercolour painting', p.a4.eur, p.a4.brl),
        ...offer('A3 watercolour painting', p.a3.eur, p.a3.brl),
      ],
    },
    { '@type': 'Person', '@id': id('danique'), name: 'Danique', jobTitle: 'Watercolour artist', worksFor: { '@id': id('business') }, sameAs: [INSTAGRAM] },
    { '@type': 'WebPage', '@id': SITE + pathFor(lang, page), url: SITE + pathFor(lang, page), name: metaFor(lang, page).title, inLanguage: HTML_LANG[lang], isPartOf: { '@id': id('website') }, about: { '@id': id('business') } },
  ];
  if (page === '' && Array.isArray(t.faq)) {
    graph.push({
      '@type': 'FAQPage', '@id': SITE + pathFor(lang) + '#faq',
      mainEntity: t.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
