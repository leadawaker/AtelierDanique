import { useEffect, useRef, useState } from 'react';

// Full-screen crop: the whole upload with a box Danique drags by its corners
// and edges (or moves by its middle) to cut away what isn't the artwork, such
// as the table a painting was photographed on. Any shape is allowed, because
// the website frames each gallery piece at whatever shape the crop leaves.
//
// Props: url, crop (current {x, y, w, h} in fractions, or undefined),
// onCancel(), onSave(crop | null). Saving the whole image saves null.

const FULL = { x: 0, y: 0, w: 1, h: 1 };
const MIN = 0.05;
const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// The box after dragging `handle` by (dx, dy), in fractions of the image.
function dragged(start, handle, dx, dy) {
  if (handle === 'move') {
    return { ...start, x: clamp(start.x + dx, 0, 1 - start.w), y: clamp(start.y + dy, 0, 1 - start.h) };
  }
  let left = start.x;
  let top = start.y;
  let right = start.x + start.w;
  let bottom = start.y + start.h;
  if (handle.includes('w')) left = clamp(left + dx, 0, right - MIN);
  if (handle.includes('e')) right = clamp(right + dx, left + MIN, 1);
  if (handle.includes('n')) top = clamp(top + dy, 0, bottom - MIN);
  if (handle.includes('s')) bottom = clamp(bottom + dy, top + MIN, 1);
  return { x: left, y: top, w: right - left, h: bottom - top };
}

function handleStyle(id) {
  const pos = { position: 'absolute', width: 32, height: 32, transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none' };
  pos.left = id.includes('w') ? '0%' : id.includes('e') ? '100%' : '50%';
  pos.top = id.includes('n') ? '0%' : id.includes('s') ? '100%' : '50%';
  const cursors = { nw: 'nwse-resize', se: 'nwse-resize', ne: 'nesw-resize', sw: 'nesw-resize', n: 'ns-resize', s: 'ns-resize', e: 'ew-resize', w: 'ew-resize' };
  pos.cursor = cursors[id];
  return pos;
}

const BTN = { border: 0, borderRadius: 2, padding: '12px 22px', fontSize: 14, cursor: 'pointer', minHeight: 44 };

export default function CropDialog({ url, crop, onCancel, onSave }) {
  const [box, setBox] = useState(crop || FULL);
  const areaRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const startDrag = (handle) => (e) => {
    if (e.button > 0) return;
    e.preventDefault();
    e.stopPropagation();
    const r = areaRef.current.getBoundingClientRect();
    const origin = { px: e.clientX, py: e.clientY, box };
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const move = (ev) => {
      setBox(dragged(origin.box, handle, (ev.clientX - origin.px) / r.width, (ev.clientY - origin.py) / r.height));
    };
    const up = () => {
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', up);
      target.removeEventListener('pointercancel', up);
    };
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', up);
    target.addEventListener('pointercancel', up);
  };

  const whole = box.x < 0.005 && box.y < 0.005 && box.w > 0.99 && box.h > 0.99;
  const pct = (v) => v * 100 + '%';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Crop the photo"
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(20,38,44,.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onPointerDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{ background: '#FCFAF6', borderRadius: 6, padding: 'clamp(16px,3vw,28px)', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: '100%', maxHeight: '100%' }}>
        <div>
          <h3 style={{ margin: 0, fontFamily: "'Cardo',serif", fontWeight: 400, fontSize: 24, color: '#26454F' }}>Crop the photo</h3>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#85949A', fontWeight: 300 }}>Drag the corners or edges to cut away what isn't the artwork. Drag the middle to move the box.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', minHeight: 0 }}>
          <div ref={areaRef} style={{ position: 'relative', lineHeight: 0, userSelect: 'none', overflow: 'hidden', borderRadius: 2 }}>
            <img src={url} alt="" draggable={false} style={{ display: 'block', maxWidth: 'min(86vw, 960px)', maxHeight: '64vh', width: 'auto', height: 'auto' }} />
            <div
              onPointerDown={startDrag('move')}
              style={{
                position: 'absolute', left: pct(box.x), top: pct(box.y), width: pct(box.w), height: pct(box.h),
                boxShadow: '0 0 0 9999px rgba(20,38,44,.6)', outline: '2px solid #FCFAF6', cursor: 'move', touchAction: 'none',
              }}
            >
              {HANDLES.map((id) => (
                <span key={id} onPointerDown={startDrag(id)} style={handleStyle(id)}>
                  <span style={{ width: 14, height: 14, background: '#E36B54', border: '2px solid #FCFAF6', borderRadius: 2 }} />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setBox(FULL)} disabled={whole}
            style={{ ...BTN, background: 'none', color: whole ? '#C9CFD1' : '#26454F', padding: '12px 2px', cursor: whole ? 'default' : 'pointer' }}>
            Show the whole photo
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onCancel} style={{ ...BTN, background: '#E3E1D8', color: '#26454F' }}>Cancel</button>
            <button type="button" onClick={() => onSave(whole ? null : box)} className="h-bg-coral-dark"
              style={{ ...BTN, background: '#E36B54', color: '#FCFAF6' }}>Save crop</button>
          </div>
        </div>
      </div>
    </div>
  );
}
