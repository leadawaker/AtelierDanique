import { lazy, Suspense } from 'react';
import Home from './pages/home/Home.jsx';

const Commission = lazy(() => import('./pages/commission/Commission.jsx'));
const Studio = lazy(() => import('./pages/studio/Studio.jsx'));
const Legal = lazy(() => import('./pages/legal/Legal.jsx'));

// Three pages, so a pathname switch is enough. Links between pages are plain
// <a href> full navigations. The studio answers at /login (the footer's
// Login link) and at its old address /edit.
export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  let page = <Home />;
  if (path === '/commission') page = <Commission />;
  if (path === '/login' || path === '/edit') page = <Studio />;
  if (path === '/privacy') page = <Legal doc="privacy" />;
  if (path === '/terms') page = <Legal doc="terms" />;
  return <Suspense fallback={null}>{page}</Suspense>;
}
