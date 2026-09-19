// Public pages live under a language prefix: /nl, /en/commission, /pt/terms.
// '' is the home page. The studio (/login, /edit) has no prefix.
export const LANGS = ['nl', 'en', 'pt'];
export const PAGES = ['', 'commission', 'privacy', 'terms'];
export const HTML_LANG = { nl: 'nl', en: 'en', pt: 'pt-BR' };

export function parsePath(pathname) {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  const lang = LANGS.includes(parts[0]) ? parts.shift() : null;
  return { lang, page: parts.join('/') };
}

export function pathFor(lang, page = '') {
  return '/' + lang + (page ? '/' + page : '');
}
