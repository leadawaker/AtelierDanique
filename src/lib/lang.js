import { useCallback, useState } from 'react';
import { STRINGS } from './strings.js';
import { parsePath, pathFor } from './routes.js';

const KEY = 'ad-lang';

function readLang() {
  try { const v = localStorage.getItem(KEY); if (v && STRINGS[v]) return v; } catch (e) { /* private mode */ }
  const m = typeof document !== 'undefined' && document.cookie.match(/(?:^|; )ad-lang=(nl|en|pt)/);
  return m ? m[1] : 'en';
}

// The visitor's own pick. The cookie lets vercel.json send them to the same
// language next time they open the bare address.
function remember(id) {
  try { localStorage.setItem(KEY, id); } catch (e) { /* private mode */ }
  document.cookie = KEY + '=' + id + ';path=/;max-age=31536000;samesite=lax';
}

// On public pages the language comes from the URL (routeLang). Switching
// swaps the prefix in place, without a reload. The studio has no prefix and
// uses the remembered choice.
export function useLang(routeLang) {
  const [lang, setLangState] = useState(() => routeLang || readLang());
  const setLang = useCallback((id) => {
    remember(id);
    setLangState(id);
    if (routeLang) {
      const { page } = parsePath(window.location.pathname);
      window.history.replaceState(null, '', pathFor(id, page) + window.location.search + window.location.hash);
    }
  }, [routeLang]);
  return [lang, setLang];
}
