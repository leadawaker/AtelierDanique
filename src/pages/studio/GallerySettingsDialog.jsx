import { useState } from 'react';
import { GALLERY_TWEAKS } from '../home/settings.js';

// The gallery's sizing, spacing and timing, as sliders. Saved as
// 'ad-gallery-settings' and layered over GALLERY_TWEAKS (see home/settings.js),
// so a field she has never touched keeps the designed default.
//
// Interval and duration are edited in seconds, which is what she is actually
// judging ("how long does a picture sit before it changes"), and converted to
// milliseconds only when saved.

const FIELDS = [
  { key: 'height', label: 'Gallery height', unit: 'px', min: 350, max: 750, step: 10 },
  { key: 'gap', label: 'Space between pictures', unit: 'px', min: 8, max: 40, step: 1 },
  { key: 'slatWidth', label: 'Peeking edge width', unit: 'px', min: 1, max: 12, step: 1 },
  { key: 'slatGap', label: 'Space around the peeking edge', unit: 'px', min: 2, max: 16, step: 1 },
  { key: 'radius', label: 'Corner roundness', unit: 'px', min: 0, max: 24, step: 1 },
  { key: 'duration', label: 'Change speed', unit: 's', min: 0.4, max: 2, step: 0.1, toUi: (ms) => ms / 1000, toStored: (s) => Math.round(s * 1000) },
  { key: 'interval', label: 'Time on each picture', unit: 's', min: 4, max: 20, step: 0.5, toUi: (ms) => ms / 1000, toStored: (s) => Math.round(s * 1000) },
  { key: 'dim', label: 'Darken the other pictures', unit: '%', min: 0, max: 100, step: 1 },
];

const BTN = { border: 0, borderRadius: 2, padding: '12px 22px', fontSize: 14, cursor: 'pointer', minHeight: 44 };

export default function GallerySettingsDialog({ value, onCancel, onSave }) {
  const [draft, setDraft] = useState({ ...GALLERY_TWEAKS, ...value });

  const set = (key, v) => setDraft((prev) => ({ ...prev, [key]: v }));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gallery settings"
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(20,38,44,.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, overflowY: 'auto' }}
      onPointerDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{ background: '#FCFAF6', borderRadius: 6, padding: 'clamp(16px,3vw,28px)', width: 'min(560px, 100%)', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '92vh', overflowY: 'auto' }}>
        <div>
          <h3 style={{ margin: 0, fontFamily: "'Cardo',serif", fontWeight: 400, fontSize: 24, color: '#26454F' }}>Gallery settings</h3>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#85949A', fontWeight: 300 }}>How the gallery on your homepage looks and moves. Changes apply as soon as you save.</p>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          {FIELDS.map((f) => {
            const raw = draft[f.key];
            const ui = f.toUi ? f.toUi(raw) : raw;
            const shown = Number.isInteger(ui) ? ui : ui.toFixed(1);
            return (
              <label key={f.key} style={{ display: 'grid', gap: 6 }}>
                <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: '#26454F' }}>
                  <span>{f.label}</span>
                  <span style={{ color: '#85949A' }}>{shown}{f.unit}</span>
                </span>
                <input
                  type="range" min={f.min} max={f.max} step={f.step} value={ui}
                  onChange={(e) => set(f.key, f.toStored ? f.toStored(Number(e.target.value)) : Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </label>
            );
          })}

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#26454F', cursor: 'pointer' }}>
            <input type="checkbox" checked={draft.autoplay !== false} onChange={(e) => set('autoplay', e.target.checked)} />
            Change pictures on its own
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#26454F', cursor: 'pointer' }}>
            <input type="checkbox" checked={draft.hoverGrow !== false} onChange={(e) => set('hoverGrow', e.target.checked)} />
            Grow a picture when the mouse rests on it
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setDraft({ ...GALLERY_TWEAKS })} className="h-color-coral"
            style={{ ...BTN, background: 'none', color: '#26454F', padding: '12px 2px' }}>
            Reset to defaults
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onCancel} style={{ ...BTN, background: '#E3E1D8', color: '#26454F' }}>Cancel</button>
            <button type="button" onClick={() => onSave(draft)} className="h-bg-coral-dark"
              style={{ ...BTN, background: '#E36B54', color: '#FCFAF6' }}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
