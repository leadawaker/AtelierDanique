import { s } from '../../../lib/css.js';
import { HERO_PHONE_DEFAULT, HERO_PHONE_PRESETS, HERO_PHONE_SLOT } from '../../../lib/heroPhone.js';
import { resolvePhoto } from '../../../lib/photos.js';
import EditableSlot from '../EditableSlot.jsx';
import PhonePalette from './PhonePalette.jsx';

// Photos tab, "Hero background on phones": pick one of the built-in
// backgrounds or drop your own, then drag, zoom and crop it in a phone-shaped frame.

const NOTE = 'margin:0;font-size:13px;line-height:1.6;color:#85949A;font-weight:300';

export default function PhoneHero({ photos, onChange, content, update, h2, h2Wrap, section }) {
  const current = resolvePhoto(photos, HERO_PHONE_SLOT, HERO_PHONE_DEFAULT);
  const choose = (url) => onChange({ ...photos, [HERO_PHONE_SLOT]: { url, s: 1, fx: 0.5, fy: 0.5 } });

  return (
    <section style={s(section)}>
      <div style={s(h2Wrap)}>
        <h2 style={s(h2)}>Hero background on phones</h2>
      </div>
      <p style={s(NOTE + ';margin-bottom:18px;font-size:14px')}>The picture behind the headline on a phone. Pick one, then drag it to move it, and use Zoom or Crop to fine-tune. The frame below is phone-shaped, so what you see is what phones get.</p>
      <div style={s('display:flex;flex-wrap:wrap;gap:clamp(18px,3vw,32px);align-items:flex-start')}>
        <div style={s('position:relative;flex:0 0 auto;width:min(100%,260px);aspect-ratio:9/17;border-radius:6px;overflow:hidden;background:#E3E1D8;border:1px solid #E2DED4')}>
          <EditableSlot slotId={HERO_PHONE_SLOT} src={HERO_PHONE_DEFAULT} placeholder="Drop a new photo" radius={6} photos={photos} onChange={onChange} croppable />
        </div>
        <div role="radiogroup" aria-label="Built-in phone backgrounds" style={s('display:flex;flex-wrap:wrap;gap:14px')}>
          {HERO_PHONE_PRESETS.map((p) => {
            const on = current && current.url === p.url;
            return (
              <button key={p.id} type="button" role="radio" aria-checked={on} onClick={() => choose(p.url)}
                className={on ? '' : 'h-border-coral'}
                style={s('display:flex;flex-direction:column;gap:8px;width:120px;text-align:left;cursor:pointer;border-radius:6px;padding:8px;transition:border-color .2s;'
                  + (on ? 'background:#FCFAF6;border:2px solid #E36B54' : 'background:#F1EFE8;border:2px solid #E2DED4'))}>
                <img src={p.url} alt="" draggable={false} style={s('width:100%;aspect-ratio:9/17;object-fit:cover;border-radius:3px;display:block')} />
                <span style={s('font-size:12px;line-height:1.4;color:#26454F')}>{p.name}{on ? <span style={s('display:block;color:#85949A;font-weight:300')}>On the website now</span> : null}</span>
              </button>
            );
          })}
        </div>
      </div>
      <PhonePalette photos={photos} onChange={onChange} content={content} update={update} />
    </section>
  );
}
