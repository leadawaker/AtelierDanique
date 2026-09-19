import { useCallback, useEffect, useState } from 'react';
import { STRINGS } from './strings.js';

const KEY = 'ad-lang';

// The Netherlands opens in Dutch, Brazil in Portuguese, everywhere else in
// English. Only used when the visitor has not picked a language themselves.
const COUNTRY_LANG = { NL: 'nl', BR: 'pt' };

function readLang() {
  try { const v = localStorage.getItem(KEY); if (v && STRINGS[v]) return v; } catch (e) { /* private mode */ }
  return 'en';
}

function hasChosen() {
  try { const v = localStorage.getItem(KEY); return !!(v && STRINGS[v]); } catch (e) { return false; }
}

// One lookup per page load, shared by every useLang() caller.
let geoLookup = null;
function visitorLang() {
  if (!geoLookup) {
    geoLookup = fetch('/api/geo')
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => COUNTRY_LANG[d.country] || 'en')
      .catch(() => 'en');
  }
  return geoLookup;
}

// Active language, shared across pages through localStorage['ad-lang'].
// That key is only written when the visitor clicks a language, so a guess
// from their country never overrides a later choice.
export function useLang() {
  const [lang, setLangState] = useState(readLang);
  const setLang = useCallback((id) => {
    try { localStorage.setItem(KEY, id); } catch (e) { /* private mode */ }
    setLangState(id);
    document.documentElement.lang = id;
  }, []);

  useEffect(() => {
    if (hasChosen()) return undefined;
    let live = true;
    visitorLang().then((id) => {
      if (!live || hasChosen()) return;
      setLangState(id);
      document.documentElement.lang = id;
    });
    return () => { live = false; };
  }, []);

  return [lang, setLang];
}
