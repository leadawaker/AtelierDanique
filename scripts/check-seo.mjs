// Fails the build if the prerendered output is missing anything search
// engines or AI crawlers need.
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { STRINGS } from '../src/lib/strings.js';

const SITE = 'https://www.atelierdanique.com';
const LANGS = ['nl', 'en', 'pt'];
const PAGES = ['', 'commission', 'privacy', 'terms'];
const HTML_LANG = { nl: 'nl', en: 'en', pt: 'pt-BR' };

for (const lang of LANGS) {
  for (const page of PAGES) {
    const path = '/' + lang + (page ? '/' + page : '');
    const html = await readFile(`dist${path}.html`, 'utf8');
    const where = `dist${path}.html`;
    assert.match(html, new RegExp(`<html lang="${HTML_LANG[lang]}">`), where + ': html lang');
    assert.equal((html.match(/<title>/g) || []).length, 1, where + ': exactly one <title>');
    assert.ok(html.includes(`<link rel="canonical" href="${SITE}${path}">`), where + ': canonical');
    assert.equal((html.match(/hreflang=/g) || []).length, 4, where + ': 3 hreflang + x-default');
    assert.ok(html.includes('<div id="root" data-ssr><'), where + ': root has rendered markup');
    assert.ok(html.includes('window.__AD_CONTENT__='), where + ': inlined content');
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(ld, where + ': JSON-LD present');
    JSON.parse(ld[1]);
    assert.ok(!/Huygensweg/i.test(html), where + ': street address must never be published');
    if (page === '') assert.ok(html.includes(STRINGS[lang].faq[0].q.replace(/'/g, '&#x27;')) || html.includes(STRINGS[lang].faq[0].q), where + ': FAQ text in HTML');
  }
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.equal((sitemap.match(/<loc>/g) || []).length, 12, 'sitemap has 12 urls');
assert.ok((await readFile('dist/robots.txt', 'utf8')).includes('Sitemap: ' + SITE + '/sitemap.xml'), 'robots.txt sitemap line');
await readFile('dist/llms.txt', 'utf8');
console.log('check-seo: all good');
