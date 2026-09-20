import { LANGS, HTML_LANG, pathFor } from '../lib/routes.js';
import { SITE, metaFor, ogImage } from './meta.js';
import { jsonLd } from './jsonld.js';

const OG_LOCALE = { nl: 'nl_NL', en: 'en_GB', pt: 'pt_BR' };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Everything that goes into <head> for one page, as one string. With
// `noindex` (the 404 page) there is no canonical or hreflang, only noindex.
export function headFor(lang, page, content, { noindex = false } = {}) {
  const { title, description } = metaFor(lang, page);
  const url = SITE + pathFor(lang, page);
  const alternates = LANGS.map((l) => `<link rel="alternate" hreflang="${HTML_LANG[l]}" href="${SITE + pathFor(l, page)}">`).join('\n')
    + `\n<link rel="alternate" hreflang="x-default" href="${SITE}/${page}">`;
  const image = ogImage(content);
  const ld = JSON.stringify(jsonLd(lang, page, content)).replace(/</g, '\\u003c');
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    noindex ? `<meta name="robots" content="noindex">` : `<link rel="canonical" href="${url}">`,
    noindex ? '' : alternates,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Atelier Danique">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${esc(image)}">`,
    `<meta property="og:locale" content="${OG_LOCALE[lang]}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<script type="application/ld+json">${ld}</script>`,
    // Phones hide the desktop-layout markup until hydration removes data-ssr. The
    // animation reveals it after 4s anyway, so a failed or slow chunk (or no JS) never leaves a blank page.
    `<style>@media (max-width:1000px){#root[data-ssr]{visibility:hidden;animation:ad-reveal 0s 4s forwards}}@keyframes ad-reveal{to{visibility:visible}}</style>`,
  ].filter(Boolean).join('\n');
}
