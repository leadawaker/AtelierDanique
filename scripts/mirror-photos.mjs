// Copies Danique's studio uploads from Vercel Blob into the build as resized
// WebP files under dist/img/, so visitors load them from the site itself
// instead of from Blob (whose free tier only has 10 GB of transfer a month).
// The originals stay in Blob untouched: the studio keeps saving Blob URLs, and
// a new upload shows from Blob until the next build mirrors it.
//
// Blob names carry a random suffix and never change, so finished files are
// cached between builds and each photo is downloaded from Blob only once.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const BLOB_HOST = /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//;
const CACHE_DIR = 'node_modules/.cache/ad-photos';
const OUT_DIR = 'dist/img';
// Long edge in px: the hero spans wide desktop screens, everything else shows smaller.
const maxEdge = (slotId) => (slotId.startsWith('ad-hero') ? 2000 : 1600);

async function shrunk(url, name, edge) {
  const cached = `${CACHE_DIR}/${name}`;
  try { return await readFile(cached); } catch {}
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error('status ' + res.status);
  const out = await sharp(Buffer.from(await res.arrayBuffer()))
    .rotate()
    .resize({ width: edge, height: edge, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer();
  await writeFile(cached, out);
  return out;
}

// Rewrites content['ad-photos'] in place to the local copies and returns the
// map {blobUrl: localUrl}, which the page inlines so the browser can apply it
// to fresh /api/content reads too. A photo that fails to copy keeps its Blob URL.
export async function mirrorPhotos(content) {
  const photos = content['ad-photos'] || {};
  const map = {};
  await mkdir(CACHE_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });
  for (const [slotId, photo] of Object.entries(photos)) {
    const url = photo && photo.url;
    if (typeof url !== 'string' || !BLOB_HOST.test(url)) continue;
    if (!map[url]) {
      const edge = maxEdge(slotId);
      const name = new URL(url).pathname.split('/').pop().replace(/\.[^.]+$/, '') + '-' + edge + '.webp';
      try {
        await writeFile(`${OUT_DIR}/${name}`, await shrunk(url, name, edge));
        map[url] = '/img/' + name;
      } catch (e) {
        console.warn('mirror-photos: kept Blob URL for ' + url + ' (' + e.message + ')');
        continue;
      }
    }
    photo.url = map[url];
  }
  console.log('mirror-photos: copied', Object.keys(map).length, 'photos into dist/img');
  return map;
}
