import { useRef, useState } from 'react';
import { s } from '../../../lib/css.js';
import { PALETTE_SLOT, paletteOn } from '../../../lib/heroPhone.js';
import PhoneHeroArt from '../../home/PhoneHeroArt.jsx';
import { uploadPhoto } from '../api.js';

// Photos tab, "Paint palette on top": a preview of the phone hero (background
// plus palette), a switch to turn the palette off, and a way to replace it.
// The palette is a transparent layer as wide as the background photo, so a
// replacement should be the same shape as the background, palette in the corner.

const NOTE = 'margin:0;font-size:13px;line-height:1.6;color:#85949A;font-weight:300';
const BTN = 'min-height:44px;background:#FCFAF6;border:1px solid #D3CFC4;border-radius:2px;padding:10px 18px;font-size:14px;color:#26454F;cursor:pointer';

export default function PhonePalette({ photos, onChange, content, update }) {
  const on = paletteOn(content);
  const hasOwn = !!(photos[PALETTE_SLOT] && photos[PALETTE_SLOT].url);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const pick = async (file) => {
    if (!file || !/^image\//.test(file.type || 'image/')) { setError('That file is not a picture.'); return; }
    setBusy(true); setError('');
    try {
      const url = await uploadPhoto(file, PALETTE_SLOT, true);
      onChange({ ...photos, [PALETTE_SLOT]: { url, s: 1, fx: 0.5, fy: 0.5 } });
    } catch (e) {
      setError('The upload did not work. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const original = () => {
    const next = { ...photos };
    delete next[PALETTE_SLOT];
    onChange(next);
  };

  return (
    <div style={s('margin-top:clamp(24px,3vw,36px);display:flex;flex-wrap:wrap;gap:clamp(18px,3vw,32px);align-items:flex-start')}>
      <div style={s('position:relative;flex:0 0 auto;width:min(100%,260px);aspect-ratio:9/17;border-radius:6px;overflow:hidden;background:#E3E1D8;border:1px solid #E2DED4')}>
        <PhoneHeroArt palette={on} preview />
      </div>
      <div style={s('display:flex;flex-direction:column;gap:14px;flex:1 1 240px;max-width:420px')}>
        <p style={s('margin:0;font-size:15px;line-height:1.3')}>Paint palette on top</p>
        <label style={s('display:flex;align-items:center;gap:12px;min-height:44px;font-size:14px;color:#26454F;cursor:pointer')}>
          <input type="checkbox" checked={on} onChange={(e) => update('ad-hero-palette', { enabled: e.target.checked })} style={s('width:20px;height:20px;accent-color:#E36B54;flex:none')} />
          <span>Show the palette on phones</span>
        </label>
        <div style={s('display:flex;flex-wrap:wrap;gap:10px')}>
          <button type="button" style={s(BTN)} onClick={() => inputRef.current.click()} disabled={busy}>{busy ? 'Uploading…' : 'Replace palette'}</button>
          {hasOwn && <button type="button" style={s(BTN)} onClick={original} disabled={busy}>Original</button>}
        </div>
        {error && <p role="alert" style={s('margin:0;font-size:13px;color:#C0503B')}>{error}</p>}
        <p style={s(NOTE)}>It lays over the corner of the background photo and hangs a little onto the gallery. A replacement should be a picture with a transparent background, the same shape as the background (tall, like a phone), with the palette in the bottom-right corner. It then lines up with the photo on every screen size.</p>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files && e.target.files[0]); e.target.value = ''; }} />
      </div>
    </div>
  );
}
