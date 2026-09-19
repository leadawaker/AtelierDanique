import { lazy, Suspense, useEffect, useLayoutEffect } from 'react';
import Home from './pages/home/Home.jsx';
import { parsePath, pathFor, PAGES, HTML_LANG } from './lib/routes.js';
import { useLang } from './lib/lang.js';
import { trackView } from './lib/track.js';
import { metaFor } from './seo/meta.js';

const Commission = lazy(() => import('./pages/commission/Commission.jsx'));
const Studio = lazy(() => import('./pages/studio/Studio.jsx'));
const Legal = lazy(() => import('./pages/legal/Legal.jsx'));

// `url` is passed by the prerender script. In the browser it is the address bar.
// The studio answers at /login (the footer's Login link) and at its old
// address /edit; it has no language prefix.
export default function App({ url }) {
  const pathname = url || window.location.pathname;
  const { lang: routeLang, page } = parsePath(pathname);
  if (page === 'login' || page === 'edit') return <Suspense fallback={null}><Studio /></Suspense>;
  return <PublicPage routeLang={routeLang} page={PAGES.includes(page) ? page : ''} />;
}

function PublicPage({ routeLang, page }) {
  const [lang, setLang] = useLang(routeLang || undefined);

  // One anonymous view signal per page load. Language switches are not new views.
  useEffect(() => { trackView(lang); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Local dev has no vercel.json redirects: put the prefix in the address bar.
  useEffect(() => {
    if (!routeLang) window.history.replaceState(null, '', pathFor(lang, page) + window.location.search + window.location.hash);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // The prerender hides the SSR markup on narrow screens until hydration,
  // because the static HTML is the desktop layout.
  useLayoutEffect(() => { document.getElementById('root')?.removeAttribute('data-ssr'); }, []);

  // Keep the tab title and <html lang> in sync on the client (the prerender
  // already set them for the page it wrote).
  useEffect(() => { document.title = metaFor(lang, page).title; document.documentElement.lang = HTML_LANG[lang]; }, [lang, page]);

  const props = { lang, setLang, page };
  let body = <Home {...props} />;
  if (page === 'commission') body = <Commission {...props} />;
  if (page === 'privacy' || page === 'terms') body = <Legal doc={page} {...props} />;
  return <Suspense fallback={null}>{body}</Suspense>;
}
