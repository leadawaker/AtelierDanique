import { useState } from 'react';
import { HERO_TWEAKS } from '../home/settings.js';

// The header banner's cream gradient, and the glow behind the title words,
// as sliders. Saved as 'ad-hero-settings' and layered over HERO_TWEAKS (see
// home/settings.js), so a field she has never touched keeps the designed default.

const FIELDS = [
  { key: 'reach', label: 'How far the gradient reaches', unit: '%', min: 0, max: 100, step: 1 },
  { key: 'softness', label: 'Softness of the fade', unit: '%', min: 0, max: 100, step: 1 },
  { key: 'opacity', label: 'Gradient strength', unit: '%', min: 0, max: 100, step: 1 },
  { key: 'glow', label: 'Glow under the title', unit: '%', min: 0, max: 100, step: 1 },
];

const BTN = { border: 0, borderRadius: 2, padding: '12px 22px', fontSize: 14, cursor: 'pointer', minHeight: 44 };

export default function HeroSettingsDialog({ value, onCancel, onSave }) {
  const [draft, setDraft] = useState({ ...HERO_TWEAKS, ...value });

  const set = (key, v) => setDraft((prev) => ({ ...prev, [key]: v }));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Header settings"
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(20,38,44,.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, overflowY: 'auto' }}
      onPointerDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{ background: '#FCFAF6', borderRadius: 6, padding: 'clamp(16px,3vw,28px)', width: 'min(560px, 100%)', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '92vh', overflowY: 'auto' }}>
        <div>
          <h3 style={{ margin: 0, fontFamily: "'Cardo',serif", fontWeight: 400, fontSize: 24, color: '#26454F' }}>Header settings</h3>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#85949A', fontWeight: 300 }}>The cream gradient over the header photo, and the glow behind the title. Changes apply as soon as you save.</p>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          {FIELDS.map((f) => {
            const value = draft[f.key];
            return (
              <label key={f.key} style={{ display: 'grid', gap: 6 }}>
                <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: '#26454F' }}>
                  <span>{f.label}</span>
                  <span style={{ color: '#85949A' }}>{value}{f.unit}</span>
                </span>
                <input
                  type="range" min={f.min} max={f.max} step={f.step} value={value}
                  onChange={(e) => set(f.key, Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </label>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setDraft({ ...HERO_TWEAKS })} className="h-color-coral"
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
