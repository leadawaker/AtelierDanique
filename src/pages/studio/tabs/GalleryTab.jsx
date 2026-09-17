import { s } from '../../../lib/css.js';
import { GALLERY, galleryDefaults } from '../../../lib/gallery.js';
import EditableSlot from '../EditableSlot.jsx';

// "The gallery": the 11 built-in pieces (text overrides, hide / put back) and
// the pieces Danique added herself (free text, remove).

const LANGS = [{ id: 'en', label: 'English' }, { id: 'pt', label: 'Portuguese' }, { id: 'nl', label: 'Dutch' }];
const FIELD = 'background:#FCFAF6;border:0;border-bottom:1px solid #D3C1A9;padding:8px 0;outline:none;font-weight:300;color:#26454F;width:100%;';
const BADGE = 'font-size:11px;letter-spacing:.14em;text-transform:uppercase;';
const ACTION = 'background:none;border:0;padding:12px 2px;min-height:44px;font-size:13px;cursor:pointer;transition:color .2s;color:';
const CARD_ON = 'display:flex;flex-direction:column;gap:14px;border-radius:6px;padding:14px;transition:opacity .2s;background:#F1EFE8;border:1px solid #E2DED4';
const CARD_OFF = 'display:flex;flex-direction:column;gap:14px;border-radius:6px;padding:14px;transition:opacity .2s;background:#F6F4EE;border:1px dashed #D3CFC4;opacity:.55';

const pickLang = (v, id) => (typeof v === 'string' ? (id === 'en' ? v : '') : (v && v[id]) || '');

export default function GalleryTab({ content, update }) {
  const extras = content['ad-gallery-extra'] || [];
  const hidden = content['ad-gallery-hidden'] || [];
  const over = content['ad-gallery-text'] || {};
  const photos = content['ad-photos'];
  const onPhotos = (next) => update('ad-photos', next);

  // Clearing a field, or typing the built-in text, removes the override.
  const setOver = (slotId, key, id, value, fallback) => {
    const entry = { ...(over[slotId] || {}) };
    const group = { ...(entry[key] || {}) };
    const clean = value.trim();
    if (!clean || clean === fallback) delete group[id]; else group[id] = value;
    if (Object.keys(group).length) entry[key] = group; else delete entry[key];
    const next = { ...over };
    if (Object.keys(entry).length) next[slotId] = entry; else delete next[slotId];
    update('ad-gallery-text', next);
  };

  const setOn = (i, key, id, value) => {
    const next = extras.slice();
    const cur = typeof next[i][key] === 'string' ? { en: next[i][key] } : { ...(next[i][key] || {}) };
    cur[id] = value;
    next[i] = { ...next[i], [key]: cur };
    update('ad-gallery-extra', next);
  };

  const addPiece = () => update('ad-gallery-extra', extras.concat([{
    slotId: 'ad-gal-x' + Date.now().toString(36),
    title: { en: '', pt: '', nl: '' },
    caption: { en: '', pt: '', nl: '' },
    category: '',
  }]));

  const removePiece = (i) => {
    const name = pickLang(extras[i].title, 'en');
    const label = name ? '"' + name + '"' : 'this piece';
    if (!window.confirm('Remove ' + label + ' from the website? This cannot be undone.')) return;
    update('ad-gallery-extra', extras.filter((_, j) => j !== i));
  };

  const hiddenBase = hidden.filter((id) => GALLERY.some((g) => g.slotId === id));
  const live = GALLERY.length - hiddenBase.length + extras.length;
  const countLabel = live + ' showing on the website'
    + (hiddenBase.length ? ' · ' + hiddenBase.length + ' hidden' : '')
    + (extras.length ? ' · ' + extras.length + ' added by you' : '');

  return (
    <section>
      <div style={s('display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;border-bottom:1px solid #DDD9CF;padding-bottom:12px;margin-bottom:22px')}>
        <h2 style={s("margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(22px,2.4vw,30px);line-height:1.1")}>The gallery</h2>
        <p style={s('margin:0;font-size:13px;color:#85949A;font-weight:300')}>{countLabel}</p>
      </div>

      <div style={s('display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:24px')}>
        <button type="button" onClick={addPiece} className="h-bg-coral-dark"
          style={s('display:flex;align-items:center;gap:10px;background:#E36B54;color:#FCFAF6;border:0;padding:15px 26px;font-size:15px;border-radius:2px;cursor:pointer;transition:background .25s')}>
          <span style={s('font-size:19px;line-height:1')}>+</span><span>Add a piece</span>
        </button>
        <p style={s('margin:0;font-size:13px;color:#85949A;font-weight:300')}>New pieces appear at the end of the carousel.</p>
      </div>

      <div style={s('display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr));gap:clamp(18px,2.4vw,28px)')}>
        {GALLERY.map((g) => {
          const off = hidden.includes(g.slotId);
          const o = over[g.slotId] || {};
          return (
            <Card
              key={g.slotId}
              cardStyle={off ? CARD_OFF : CARD_ON}
              slotId={g.slotId}
              placeholder={g.placeholder}
              photos={photos}
              onPhotos={onPhotos}
              fields={LANGS.map((l) => {
                const def = galleryDefaults(g.slotId, l.id);
                return {
                  ...l,
                  title: (o.title && o.title[l.id]) || def.title,
                  caption: (o.caption && o.caption[l.id]) || def.caption,
                  setTitle: (v) => setOver(g.slotId, 'title', l.id, v, def.title),
                  setCaption: (v) => setOver(g.slotId, 'caption', l.id, v, def.caption),
                };
              })}
              badge={off ? 'Hidden' : 'On the website'}
              badgeColor={off ? '#C0503B' : '#A4AFB3'}
              action={off ? 'Put back' : 'Hide'}
              actionColor={off ? '#E36B54' : '#A4AFB3'}
              onAction={() => update('ad-gallery-hidden', off ? hidden.filter((id) => id !== g.slotId) : hidden.concat([g.slotId]))}
            />
          );
        })}
        {extras.map((e, i) => (
          <Card
            key={e.slotId}
            cardStyle={CARD_ON}
            slotId={e.slotId}
            placeholder="Drop the artwork photo"
            photos={photos}
            onPhotos={onPhotos}
            fields={LANGS.map((l) => ({
              ...l,
              title: pickLang(e.title, l.id),
              caption: pickLang(e.caption, l.id),
              setTitle: (v) => setOn(i, 'title', l.id, v),
              setCaption: (v) => setOn(i, 'caption', l.id, v),
            }))}
            badge="Added by you"
            badgeColor="#A4AFB3"
            action="Remove"
            actionColor="#A4AFB3"
            onAction={() => removePiece(i)}
          />
        ))}
      </div>
    </section>
  );
}

function Card({ cardStyle, slotId, placeholder, photos, onPhotos, fields, badge, badgeColor, action, actionColor, onAction }) {
  return (
    <div style={s(cardStyle)}>
      <div style={s('position:relative;aspect-ratio:4/5;border-radius:6px;overflow:hidden;background:#E3E1D8')}>
        <EditableSlot slotId={slotId} placeholder={placeholder} radius={6} photos={photos} onChange={onPhotos} croppable />
      </div>
      <div style={s('display:grid;gap:14px')}>
        {fields.map((f) => (
          <div key={f.id} style={s('display:grid;gap:6px')}>
            <span style={s('font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#A4AFB3')}>{f.label}</span>
            <input value={f.title} onChange={(ev) => f.setTitle(ev.target.value)} placeholder="Title" aria-label={f.label + ' title'}
              className="f-coral" style={s(FIELD + 'font-size:16px')} />
            <input value={f.caption} onChange={(ev) => f.setCaption(ev.target.value)} placeholder="One short line" aria-label={f.label + ' caption'}
              className="f-coral" style={s(FIELD + 'font-size:14px')} />
          </div>
        ))}
      </div>
      <div style={s('display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid #E2DED4;padding-top:4px')}>
        <span style={s(BADGE + 'color:' + badgeColor)}>{badge}</span>
        <button type="button" onClick={onAction} className="h-color-coral" style={s(ACTION + actionColor)}>{action}</button>
      </div>
    </div>
  );
}
