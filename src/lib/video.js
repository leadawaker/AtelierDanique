import { useEffect, useState } from 'react';

// Parses a pasted Vimeo or YouTube link into an embeddable player URL.
// Returns null for anything it does not recognise.
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
    return { provider: 'youtube', id, embedUrl: 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1' };
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const idx = parts.findIndex((p) => /^\d+$/.test(p));
    if (idx === -1) return null;
    const id = parts[idx];
    const hash = url.searchParams.get('h') || (parts[idx + 1] && /^[\da-f]+$/i.test(parts[idx + 1]) ? parts[idx + 1] : '');
    return {
      provider: 'vimeo',
      id,
      embedUrl: 'https://player.vimeo.com/video/' + id + '?autoplay=1&dnt=1' + (hash ? '&h=' + hash : ''),
    };
  }
  return null;
}

// The still shown before a visitor presses play: the video's own thumbnail,
// not a separately uploaded photo. YouTube's thumbnail URL is predictable;
// Vimeo's is not, so it comes from their oEmbed endpoint.
export function useVideoThumbnail(video) {
  const [url, setUrl] = useState(null);
  const id = video && video.id;
  const provider = video && video.provider;

  useEffect(() => {
    if (!id) { setUrl(null); return undefined; }
    if (provider === 'youtube') { setUrl('https://img.youtube.com/vi/' + id + '/hqdefault.jpg'); return undefined; }
    let alive = true;
    setUrl(null);
    fetch('https://vimeo.com/api/oembed.json?url=' + encodeURIComponent('https://vimeo.com/' + id))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (alive && data) setUrl(data.thumbnail_url || null); })
      .catch(() => {});
    return () => { alive = false; };
  }, [id, provider]);

  return url;
}
