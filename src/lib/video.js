// Parses a pasted Vimeo or YouTube link into an embeddable player URL.
// Returns null for anything it does not recognise. No autoplay: the iframe
// shows the provider's own thumbnail and play button until a visitor clicks.
//
// Handles: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID,
// youtube.com/embed/ID, vimeo.com/ID, vimeo.com/ID/HASH (unlisted),
// player.vimeo.com/video/ID?h=HASH.
export function parseVideo(input) {
  if (typeof input !== 'string' || !input.trim()) return null;
  let url;
  try {
    url = new URL(/^https?:\/\//i.test(input.trim()) ? input.trim() : 'https://' + input.trim());
  } catch (e) { return null; }
  const host = url.hostname.replace(/^(www\.|m\.)/, '');
  const parts = url.pathname.split('/').filter(Boolean);

  if (host === 'youtu.be' || host === 'youtube.com' || host === 'youtube-nocookie.com') {
    let id = '';
    if (host === 'youtu.be') id = parts[0] || '';
    else if (parts[0] === 'watch') id = url.searchParams.get('v') || '';
    else if (['shorts', 'embed', 'live', 'v'].includes(parts[0])) id = parts[1] || '';
    if (!/^[\w-]{11}$/.test(id)) return null;
    return { provider: 'youtube', id, embedUrl: 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&playsinline=1' };
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const idx = parts.findIndex((p) => /^\d+$/.test(p));
    if (idx === -1) return null;
    const id = parts[idx];
    const hash = url.searchParams.get('h') || (parts[idx + 1] && /^[\da-f]+$/i.test(parts[idx + 1]) ? parts[idx + 1] : '');
    return {
      provider: 'vimeo',
      id,
      embedUrl: 'https://player.vimeo.com/video/' + id + '?dnt=1' + (hash ? '&h=' + hash : ''),
    };
  }
  return null;
}
