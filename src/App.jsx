import { lazy, Suspense, useEffect } from 'react';
import Home from './pages/home/Home.jsx';
import { parsePath, pathFor, PAGES } from './lib/routes.js';
import { useLang } from './lib/lang.js';

const Commission = lazy(() => import('./pages/commission/Commission.jsx'));
const Studio = lazy(() => import('./pages/studio/Studio.jsx'));
const Legal = lazy(() => import('./pages/legal/Legal.jsx'));

// `url` is passed by the prerender script. In the browser it is the address bar.
// The studio answers at /login (the header's Login button) and at its old
// address /edit; it has no language prefix.
export default function App({ url }) {
  const pathname = url || window.location.pathname;
  const { lang: routeLang, page } = parsePath(pathname);
  if (page === 'login' || page === 'edit') return <Suspense fallback={null}><Studio /></Suspense>;
  return <PublicPage routeLang={routeLang} page={PAGES.includes(page) ? page : ''} />;
}

function PublicPage({ routeLang, page }) {
  const [lang, setLang] = useLang(routeLang || undefined);

  // Local dev has no vercel.json redirects: put the prefix in the address bar.
  useEffect(() => {
    if (!routeLang) window.history.replaceState(null, '', pathFor(lang, page) + window.location.search + window.location.hash);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const props = { lang, setLang, page };
  let body = <Home {...props} />;
  if (page === 'commission') body = <Commission {...props} />;
  if (page === 'privacy' || page === 'terms') body = <Legal doc={page} {...props} />;
  return <Suspense fallback={null}>{body}</Suspense>;
}
