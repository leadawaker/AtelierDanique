import { useContext, useRef, useState } from 'react';
import Slot from '../../components/Slot.jsx';
import { PhotosContext, croppedRatio, focusOf, placement, resolvePhoto } from '../../lib/photos.js';
import { uploadPhoto } from './api.js';
import CropDialog from './CropDialog.jsx';

// Studio photo frame. Fills its positioned parent (give the parent an
// aspect-ratio, like the public page does). Danique can:
//   - drop a photo on it, or click "Replace photo" to pick one
//   - drag the photo to move it inside the frame, and zoom with the slider
// Every change calls onChange(nextPhotos) with the whole ad-photos object.
// Positions are saved as a focal point (see lib/photos.js), so the website
// shows the same part of the photo in frames of any shape.
//
// Props: slotId, src (built-in default), focus (its focal point), placeholder, radius, photos
// (current ad-photos), onChange(nextPhotos), compact (small frames: one
// "Change" button below the frame instead of controls over it), croppable
// (adds a "Crop" button that cuts the upload down, see lib/photos.js), transparent
// (a cut-out picture: uploads keep their transparency and the frame shows through).
export default function EditableSlot({ slotId, src, focus, placeholder = 'Drop a photo here', radius = 0, photos, onChange, compact = false, croppable = false, transparent = false }) {
  const inherited = useContext(PhotosContext);
  const all = photos || inherited || {};
  const photo = resolvePhoto(all, slotId, src, focus);
  const hasOwn = !!(all[slotId] && all[slotId].url);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [over, setOver] = useState(false);
  const [draft, setDraft] = useState(null);
  const [cropping, setCropping] = useState(false);
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
      const url = await uploadPhoto(file, slotId, transparent);
      commit({ url, s: 1, fx: 0.5, fy: 0.5 });
    } catch (e) {
      setError('The upload did not work. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  // Zoom and focal point work on the cropped part, so every calculation below
  // uses its shape rather than the upload's.
  const ratioOf = (p) => croppedRatio(p, imgRatio.current);
  // Carried through every drag and zoom, which otherwise rebuild the photo
  // from url, s and focal point and would silently drop it.
  const cropOf = (p) => (p.crop ? { crop: p.crop } : {});

  // The focal point this frame actually shows (legacy x/y and out-of-reach
  // points resolved), so dragging always starts from what is on screen.
  const measure = (p) => {
    const el = frameRef.current;
    if (!el || !imgRatio.current) return null;
    const r = el.getBoundingClientRect();
    const box = placement(p, ratioOf(p), r.width / r.height);
    return { r, box, fx: (50 - box.left) / box.w, fy: (50 - box.top) / box.h };
  };

  const toFocus = (p) => {
    const el = frameRef.current;
    if (!el || !imgRatio.current || 'fx' in p) return p;
    const r = el.getBoundingClientRect();
    return { url: p.url, s: p.s, ...focusOf(p, ratioOf(p), r.width / r.height), ...cropOf(p) };
  };

  const onPointerDown = (e) => {
    if (!photo || busy || e.button > 0) return;
    const el = frameRef.current;
    const m = measure(photo);
    if (!m) return;
    const start = { px: e.clientX, py: e.clientY };
    let latest = photo;
    el.setPointerCapture(e.pointerId);
    // Dragging may push the point past what this frame can show (clamped to
    // the photo's edges): a wider or taller frame elsewhere will use it.
    // An axis she doesn't move keeps its saved value, so a vertical nudge here
    // doesn't undo a sideways aim that only a phone frame can show.
    const saved = focusOf(photo, ratioOf(photo), m.r.width / m.r.height);
    const axis = (delta, eff, size, keep) => (Math.abs(delta) < 3 ? keep : Math.min(1, Math.max(0, eff - delta / size)));
    const move = (ev) => {
      const fx = axis(ev.clientX - start.px, m.fx, m.r.width * m.box.w / 100, saved.fx);
      const fy = axis(ev.clientY - start.py, m.fy, m.r.height * m.box.h / 100, saved.fy);
      latest = { url: photo.url, s: photo.s, fx, fy, ...cropOf(photo) };
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
        <Slot slotId={slotId} src={src} placeholder={placeholder} radius={radius} photo={shown} style={transparent ? { background: 'transparent' } : undefined} />
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
                onChange={(e) => setDraft({ ...toFocus(draft || photo), s: Number(e.target.value) })}
                onPointerUp={() => { if (draft) { commit(draft); setDraft(null); } }}
                onKeyUp={() => { if (draft) { commit(draft); setDraft(null); } }}
                style={{ width: 70 }}
                aria-label="Zoom"
              />
            </label>
          )}
          {croppable && photo && (
            <button type="button" style={{ ...small, pointerEvents: 'auto' }} onClick={() => setCropping(true)} disabled={busy}>Crop</button>
          )}
        </div>
      )}
      {error && (
        <p style={{ position: 'absolute', top: 8, left: 8, right: 8, margin: 0, background: '#FCFAF6', color: '#C0503B', fontSize: 12, padding: '6px 8px', borderRadius: 2 }}>{error}</p>
      )}
      {cropping && photo && (
        <CropDialog
          url={photo.url}
          crop={photo.crop}
          onCancel={() => setCropping(false)}
          onSave={(crop) => {
            setCropping(false);
            // A new crop is a new picture: the old zoom and aim were set on
            // the previous shape, so start centred again.
            commit({ url: photo.url, s: 1, fx: 0.5, fy: 0.5, ...(crop ? { crop } : {}) });
          }}
        />
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
