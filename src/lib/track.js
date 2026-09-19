// One anonymous "someone looked at this page" signal. No cookie, nothing
// stored on the device, no IP kept. `ref` / `utm_source` in the address
// (e.g. the Instagram bio link ?ref=ig) says where the visit came from when
// the browser hides the referrer.
export function trackView(lang) {
  try {
    const q = new URLSearchParams(window.location.search);
    const data = { p: window.location.pathname, l: lang, r: document.referrer, s: q.get('ref') || q.get('utm_source') || '' };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    if (!(navigator.sendBeacon && navigator.sendBeacon('/api/track', blob))) {
      fetch('/api/track', { method: 'POST', body: blob, keepalive: true }).catch(() => {});
    }
  } catch (e) { /* never break the page for a counter */ }
}
