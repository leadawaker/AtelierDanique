// Turns a CSS declaration string ("display:flex;gap:12px") into a React style
// object, so markup ported from the Design files keeps its inline styles
// verbatim. Results are cached; the strings are mostly static.
const cache = new Map();

export function s(str) {
  let out = cache.get(str);
  if (out) return out;
  out = {};
  for (const decl of splitDecls(str)) {
    const i = decl.indexOf(':');
    if (i === -1) continue;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (!prop || !value) continue;
    const key = prop.startsWith('--')
      ? prop
      : prop.replace(/^-(webkit|moz|ms)-/, (_, v) => v + '-').replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        .replace(/^(webkit|moz|ms)/, (v) => v.charAt(0).toUpperCase() + v.slice(1));
    out[key] = value;
  }
  if (cache.size > 2000) cache.clear();
  cache.set(str, out);
  return out;
}

// Split on ';' but not inside parentheses (url(data:...;base64) etc.).
function splitDecls(str) {
  const parts = [];
  let depth = 0, start = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === ';' && depth === 0) { parts.push(str.slice(start, i)); start = i + 1; }
  }
  parts.push(str.slice(start));
  return parts;
}
