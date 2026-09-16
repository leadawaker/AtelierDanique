import { useContext, useRef, useState } from 'react';
import Slot from '../../components/Slot.jsx';
import { PhotosContext, photoBox, resolvePhoto } from '../../lib/photos.js';
import { uploadPhoto } from './api.js';

// Studio photo frame. Fills its positioned parent (give the parent an
// aspect-ratio, like the public page does). Danique can:
//   - drop a photo on it, or click "Replace photo" to pick one
//   - drag the photo to move it inside the frame, and zoom with the slider
//   - go back to the original photo
// Every change calls onChange(nextPhotos) with the whole ad-photos object.
//
// Props: slotId, src (built-in default), placeholder, radius, photos
// (current ad-photos), onChange(nextPhotos), compact (small frames: one
// "Change" button below the frame instead of controls over it).
export default function EditableSlot({ slotId, src, placeholder = 'Drop a photo here', radius = 0, photos, onChange, compact = false }) {
  const inherited = useContext(PhotosContext);
  const all = photos || inherited || {};
  const photo = resolvePhoto(all, slotId, src);
  const hasOwn = !!(all[slotId] && all[slotId].url);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [over, setOver] = useState(false);
  const [draft, setDraft] = useState(null);
  const frameRef = useRef(null);
  const inputRef = useRef(null);
  const imgRatio = useRef(null);
  const shown = draft || photo;

  const commit = (next) => {
    const copy = { ...all };
    if (next) copy[slotId] = next; else delete copy[slotId];
    onChange(copy);
  };

  const pick = async (file) => {
    if (!file || !/^image\//.test(file.type || 'image/')) { setError('That file is not a photo.'); return; }
    setBusy(true); setError('');
    try {
      const url = await uploadPhoto(file, slotId);
      commit({ url, s: 1, x: 0, y: 0 });
    } catch (e) {
      setError('The upload did not work. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const clamp = (p) => {
    const el = frameRef.current;
    if (!el || !imgRatio.current) return p;
    const r = el.getBoundingClientRect();
    const box = photoBox(p, imgRatio.current, r.width / r.height);
    return { ...p, x: Math.max(-box.maxX, Math.min(box.maxX, p.x)), y: Math.max(-box.maxY, Math.min(box.maxY, p.y)) };
  };

  const onPointerDown = (e) => {
    if (!photo || busy || e.button > 0) return;
    const el = frameRef.current;
    const r = el.getBoundingClientRect();
    const start = { px: e.clientX, py: e.clientY, base: photo };
    let latest = photo;
    el.setPointerCapture(e.pointerId);
    const move = (ev) => {
      latest = clamp({ ...start.base, x: start.base.x + (ev.clientX - start.px) / r.width * 100, y: start.base.y + (ev.clientY - start.py) / r.height * 100 });
      setDraft(latest);
    };
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      setDraft(null);
      if (latest !== photo) commit(latest);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };

  const small = { background: 'rgba(252,250,246,.94)', border: '1px solid #D3CFC4', borderRadius: 2, padding: '6px 10px', fontSize: 12, color: '#26454F', cursor: 'pointer' };

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files && e.dataTransfer.files[0]); }}
        style={{ position: 'absolute', inset: 0, cursor: photo ? 'grab' : 'pointer', touchAction: photo ? 'none' : 'auto', borderRadius: radius, overflow: 'hidden' }}
        onClick={() => { if (!photo && !busy) inputRef.current.click(); }}
        title={photo ? 'Drag to move the photo inside the frame' : 'Click or drop a photo'}
      >
        <Slot slotId={slotId} src={src} placeholder={placeholder} radius={radius} photo={shown} />
        <RatioProbe url={photo && photo.url} onRatio={(r) => { imgRatio.current = r; }} />
        {(over || busy) && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(38,69,79,.55)', color: '#FCFAF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, textAlign: 'center', padding: 12 }}>
            {busy ? 'Uploading…' : 'Drop to use this photo'}
          </div>
        )}
      </div>

      {compact ? (
        <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6, display: 'flex', gap: 6, whiteSpace: 'nowrap' }}>
          <button type="button" style={small} onClick={() => inputRef.current.click()} disabled={busy}>Change</button>
          {hasOwn && <button type="button" style={small} onClick={() => commit(null)} disabled={busy}>Original</button>}
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 8, right: 8, bottom: 8, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', pointerEvents: 'none' }}>
          <button type="button" style={{ ...small, pointerEvents: 'auto' }} onClick={() => inputRef.current.click()} disabled={busy}>Replace photo</button>
          {photo && (
            <label style={{ ...small, pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 6, cursor: 'default' }}>
              <span>Zoom</span>
              <input
                type="range" min="1" max="3" step="0.01" value={shown.s}
                onChange={(e) => setDraft(clamp({ ...(draft || photo), s: Number(e.target.value) }))}
                onPointerUp={() => { if (draft) { commit(draft); setDraft(null); } }}
                onKeyUp={() => { if (draft) { commit(draft); setDraft(null); } }}
                style={{ width: 70 }}
                aria-label="Zoom"
              />
            </label>
          )}
          {hasOwn && (
            <button type="button" style={{ ...small, pointerEvents: 'auto' }} onClick={() => commit(null)} disabled={busy}>Use original</button>
          )}
        </div>
      )}
      {error && (
        <p style={{ position: 'absolute', top: 8, left: 8, right: 8, margin: 0, background: '#FCFAF6', color: '#C0503B', fontSize: 12, padding: '6px 8px', borderRadius: 2 }}>{error}</p>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files && e.target.files[0]); e.target.value = ''; }} />
    </div>
  );
}

// Loads the image off-screen once to learn its aspect ratio (for clamping).
function RatioProbe({ url, onRatio }) {
  if (!url) return null;
  return (
    <img src={url} alt="" aria-hidden="true" style={{ display: 'none' }}
      onLoad={(e) => { const { naturalWidth: w, naturalHeight: h } = e.currentTarget; if (w && h) onRatio(w / h); }} />
  );
}
