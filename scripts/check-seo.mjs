// Fails the build if the prerendered output is missing anything search
// engines or AI crawlers need.
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { LANGS, PAGES, HTML_LANG } from '../src/lib/routes.js';
import { STRINGS } from '../src/lib/strings.js';

const SITE = 'https://www.atelierdanique.com';

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
    assert.ok(html.includes('ad-reveal'), where + ': reveal fallback for the hidden SSR markup');
    assert.ok(html.includes('window.__AD_CONTENT__='), where + ': inlined content');
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(ld, where + ': JSON-LD present');
    const graph = JSON.parse(ld[1])['@graph'];
    assert.ok(!/Huygensweg/i.test(html), where + ': street address must never be published');
    if (page === '') {
      const types = graph.map((node) => node['@type']);
      assert.ok(types.includes('LocalBusiness'), where + ': JSON-LD LocalBusiness');
      assert.ok(types.includes('Person'), where + ': JSON-LD Person');
      assert.ok(types.includes('FAQPage'), where + ': JSON-LD FAQPage');
      const business = graph.find((node) => node['@type'] === 'LocalBusiness');
      assert.equal(business.address.streetAddress, undefined, where + ': street address must not be in JSON-LD');
    }
    if (page === '') assert.ok(html.includes(STRINGS[lang].faq[0].q.replace(/'/g, '&#x27;')) || html.includes(STRINGS[lang].faq[0].q), where + ': FAQ text in HTML');
  }
}
// The studio pages are real files (no rewrite reaches them under cleanUrls).
for (const studio of ['login', 'edit']) {
  const html = await readFile(`dist/${studio}.html`, 'utf8');
  assert.ok(html.includes('<div id="root"></div>'), `dist/${studio}.html: plain client-rendered shell`);
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.equal((sitemap.match(/<loc>/g) || []).length, 12, 'sitemap has 12 urls');
assert.ok((await readFile('dist/robots.txt', 'utf8')).includes('Sitemap: ' + SITE + '/sitemap.xml'), 'robots.txt sitemap line');
const llms = await readFile('dist/llms.txt', 'utf8');
assert.ok(llms.includes('half up front, the rest when the painting is finished, before shipping'), 'llms.txt: payment line');
const notFound = await readFile('dist/404.html', 'utf8');
assert.ok(notFound.includes('<div id="root">') && !notFound.includes('<div id="root" data-ssr'), '404.html: client renders from the address bar, no hydration');
assert.ok(!notFound.includes('rel="canonical"') && !notFound.includes('hreflang='), '404.html: no canonical or hreflang');
assert.ok(notFound.includes('<meta name="robots" content="noindex">'), '404.html: noindex');
for (const [name, text] of [['llms.txt', llms], ['404.html', notFound], ['sitemap.xml', sitemap]]) {
  assert.ok(!/Huygensweg/i.test(text), name + ': street address must never be published');
}
console.log('check-seo: all good');
