import { lazy, Suspense } from 'react';
import Home from './pages/home/Home.jsx';

const Commission = lazy(() => import('./pages/commission/Commission.jsx'));
const Studio = lazy(() => import('./pages/studio/Studio.jsx'));

// Three pages, so a pathname switch is enough. Links between pages are plain
// <a href> full navigations. The studio answers at /login (the header's
// Login button) and at its old address /edit.
export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  let page = <Home />;
  if (path === '/commission') page = <Commission />;
  if (path === '/login' || path === '/edit') page = <Studio />;
  return <Suspense fallback={null}>{page}</Suspense>;
}
