import { useCallback, useState } from 'react';
import { STRINGS } from './strings.js';

const KEY = 'ad-lang';

function readLang() {
  try { const v = localStorage.getItem(KEY); if (v && STRINGS[v]) return v; } catch (e) { /* private mode */ }
  return 'en';
}

// Active language, shared across pages through localStorage['ad-lang'].
export function useLang() {
  const [lang, setLangState] = useState(readLang);
  const setLang = useCallback((id) => {
    try { localStorage.setItem(KEY, id); } catch (e) { /* private mode */ }
    setLangState(id);
    document.documentElement.lang = id;
  }, []);
  return [lang, setLang];
}
