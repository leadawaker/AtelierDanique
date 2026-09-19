import { useCallback, useEffect, useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { EMPTY_CONTENT, fetchContent } from '../../lib/content.js';
import { shrinkImage } from '../../lib/image.js';

// ---- Session (password checked on the server, HttpOnly cookie) ----

export async function getSession() {
  try {
    const res = await fetch('/api/auth', { cache: 'no-store' });
    return res.ok && (await res.json()).authed === true;
  } catch (e) { return false; }
}

// Resolves true / false for right / wrong password; throws on network trouble.
export async function login(password) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (res.status === 401) return false;
  if (!res.ok) throw new Error('login ' + res.status);
  return true;
}

export async function logout() {
  await fetch('/api/auth', { method: 'DELETE' }).catch(() => {});
}

// ---- Content: optimistic local state, saved per key after a short pause ----

const SAVE_DELAY = 600;

// status: 'idle' | 'saving' | 'saved' | 'error'. `update(key, value)` changes
// the page immediately; the write to the server is debounced per key so typing
// does not send a request per keystroke. Nothing needs a Save button.
export function useStudioContent({ onUnauthorized } = {}) {
  const [content, setContent] = useState(EMPTY_CONTENT);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [status, setStatus] = useState('idle');
  const timers = useRef({});
  const pending = useRef(new Set());

  useEffect(() => {
    fetchContent({ fresh: true })
      .then((c) => { setContent(c); setReady(true); })
      .catch(() => setLoadError(true));
  }, []);

  const flush = useCallback(async (key, value) => {
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (res.status === 401) { onUnauthorized && onUnauthorized(); throw new Error('unauthorized'); }
      if (!res.ok) throw new Error('save ' + res.status);
      pending.current.delete(key);
      if (!pending.current.size) setStatus('saved');
    } catch (e) {
      setStatus('error');
    }
  }, [onUnauthorized]);

  const update = useCallback((key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setStatus('saving');
    pending.current.add(key);
    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(() => flush(key, value), SAVE_DELAY);
  }, [flush]);

  // Warn before closing the tab with an unsaved change.
  useEffect(() => {
    const onLeave = (e) => { if (pending.current.size) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, []);

  return { content, ready, loadError, status, update };
}

// ---- Stats: visitor numbers, search numbers, and the "update Google" button ----

export async function fetchStats(days = 28) {
  const res = await fetch('/api/stats?days=' + days, { cache: 'no-store' });
  if (!res.ok) throw new Error('stats ' + res.status);
  return res.json();
}

export async function fetchSearchStats() {
  const res = await fetch('/api/search-stats', { cache: 'no-store' });
  if (!res.ok) throw new Error('search ' + res.status);
  return res.json();
}

export async function requestRebuild() {
  const res = await fetch('/api/cron/rebuild', { method: 'POST' });
  if (res.status === 429) return 'busy';
  return res.ok ? 'ok' : 'error';
}

// ---- Photo upload: shrink in the browser, then upload straight to Blob ----

// Returns the public URL of the uploaded photo.
export async function uploadPhoto(file, slotId) {
  const small = await shrinkImage(file);
  const body = small || file;
  const ext = small ? 'jpg' : (file.name.split('.').pop() || 'jpg').toLowerCase();
  const safeSlot = String(slotId).replace(/[^\w-]/g, '');
  const result = await upload('photos/' + safeSlot + '.' + ext, body, {
    access: 'public',
    handleUploadUrl: '/api/upload',
    contentType: small ? 'image/jpeg' : file.type || undefined,
  });
  return result.url;
}
