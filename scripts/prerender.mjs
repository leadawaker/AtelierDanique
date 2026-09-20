// Runs after `vite build` and the SSR build. Writes one static HTML file per
// language and page (cleanUrls serves dist/nl/commission.html at /nl/commission),
// plus sitemap.xml, robots.txt and llms.txt. Danique's content comes from the
// live API, so what crawlers see matches the site as of this build.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { LANGS, PAGES, HTML_LANG } from '../src/lib/routes.js';
import { render, headFor, sitemapXml, robotsTxt, llmsTxt } from '../dist-ssr/entry-server.js';

const CONTENT_URL = process.env.SITE_CONTENT_URL || 'https://www.atelierdanique.com/api/content?fresh=1';

async function liveContent() {
  try {
    const res = await fetch(CONTENT_URL, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('status ' + res.status);
    return await res.json();
  } catch (e) {
    // On Vercel, fail the build so the previous deployment stays live instead of publishing default content for a day.
    if (process.env.VERCEL) throw e;
    console.warn('prerender: could not load live content, using defaults (' + e.message + ')');
    return {};
  }
}

const template = await readFile('dist/index.html', 'utf8');
const content = await liveContent();
const inline = `<script>window.__AD_CONTENT__=${JSON.stringify(content).replace(/</g, '\\u003c')}</script>`;

// `ssr: false` (the 404 page) leaves off data-ssr so the client renders from
// the address bar instead of hydrating markup for a different URL.
function page(lang, name, html, { ssr = true, noindex = false } = {}) {
  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${HTML_LANG[lang]}">`)
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta name="description"[^>]*>\s*/, '')
    .replace('</head>', headFor(lang, name, content, { noindex }) + '\n</head>')
    .replace('<div id="root"></div>', `<div id="root"${ssr ? ' data-ssr' : ''}>${html}</div>${inline}`);
}

async function write(file, text) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, text);
}

for (const lang of LANGS) {
  for (const name of PAGES) {
    const url = '/' + lang + (name ? '/' + name : '');
    const html = await render(url, content);
    await write(`dist${url}.html`, page(lang, name, html));
  }
}
// Unknown addresses: the English home page, marked noindex, served with a 404.
await write('dist/404.html', page('en', '', await render('/en', content), { ssr: false, noindex: true }));
// The studio is a plain client-rendered page. cleanUrls does not accept a
// rewrite to /index.html, so /login and /edit are real files (the unmarked
// shell, which main.jsx renders with createRoot).
await write('dist/login.html', template);
await write('dist/edit.html', template);
await write('dist/sitemap.xml', sitemapXml());
await write('dist/robots.txt', robotsTxt());
await write('dist/llms.txt', llmsTxt(content));
await rm('dist-ssr', { recursive: true, force: true });
console.log('prerender: wrote', LANGS.length * PAGES.length, 'pages');
