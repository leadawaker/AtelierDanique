import { shrinkImage } from '../../lib/image.js';

// "Send by email": shrink the photo in the browser, then POST the answers and
// the photo (base64) to /api/commission, which emails Danique.
// Throws Error('too-large') when the photo can't be made small enough.

const MAX_ORIGINAL = 3 * 1024 * 1024;

function toBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] || '');
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

async function preparePhoto(file) {
  if (!file) return null;
  const small = await shrinkImage(file, 2400, 0.85);
  if (small) return { type: 'image/jpeg', data: await toBase64(small) };
  if (file.size > MAX_ORIGINAL) throw new Error('too-large');
  return { type: file.type || 'image/jpeg', data: await toBase64(file) };
}

export async function sendByEmail({ form, size, lang, file, website }) {
  const photo = await preparePhoto(file);
  const res = await fetch('/api/commission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form, size, lang, website, photo }),
  });
  if (res.status === 413) throw new Error('too-large');
  if (!res.ok) throw new Error('send-' + res.status);
}
