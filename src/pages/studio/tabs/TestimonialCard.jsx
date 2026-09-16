import EditableSlot from '../EditableSlot.jsx';
import { avatarSlotId } from '../../../lib/testimonials.js';
import { DraftField, LANGS, SMALL_LABEL } from '../fields.jsx';

// One testimonial in the studio. The parent decides what the values are and
// what happens on edit; this card only lays them out.
//
// Props:
//   item      {slotId, avatar}
//   values    {name, from, quote:{en,pt,nl}}   what is on the website now
//   onEdit(field, value, lang)                  field: 'name' | 'from' | 'quote'
//   badge     text, badgeColor, faded (hidden look)
//   action    {label, onClick, strong}          Hide / Put back / Remove
//   photos, onPhotos(next)

export default function TestimonialCard({ item, values, onEdit, badge, badgeColor, faded, action, photos, onPhotos }) {
  const card = {
    display: 'flex', flexDirection: 'column', gap: 14, borderRadius: 6, padding: 14, transition: 'opacity .2s', minWidth: 0,
    ...(faded
      ? { background: '#F6F4EE', border: '1px dashed #D3CFC4', opacity: 0.55 }
      : { background: '#F1EFE8', border: '1px solid #E2DED4' }),
  };

  return (
    <div style={card}>
      <div style={{ position: 'relative', aspectRatio: '4 / 5', borderRadius: 6, overflow: 'hidden', background: '#E3E1D8' }}>
        <EditableSlot slotId={item.slotId} radius={6} placeholder="Photo of the client or their piece" photos={photos} onChange={onPhotos} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 40 }}>
        <div style={{ position: 'relative', width: 96, height: 96, flex: '0 0 96px', borderRadius: 9999, background: '#E3E1D8' }}>
          <EditableSlot slotId={avatarSlotId(item.slotId)} src={item.avatar || undefined} radius={9999} placeholder="" compact photos={photos} onChange={onPhotos} />
        </div>
        <div style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: 14, lineHeight: 1.3 }}>Small round photo (optional)</span>
          <span style={{ fontSize: 12, lineHeight: 1.5, color: '#85949A', fontWeight: 300 }}>Shown next to the name.</span>
        </div>
      </div>

      <label style={{ display: 'grid', gap: 4 }}>
        <span style={SMALL_LABEL}>Name</span>
        <DraftField value={values.name} label="Name" placeholder="Their name" onEdit={(v) => onEdit('name', v)} />
      </label>

      <label style={{ display: 'grid', gap: 4 }}>
        <span style={SMALL_LABEL}>Where they are from, or their Instagram (optional)</span>
        <DraftField value={values.from} label="Where they are from, or their Instagram" placeholder="e.g. Utrecht or @name" onEdit={(v) => onEdit('from', v)} style={{ fontSize: 14 }} />
      </label>

      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gap: 2 }}>
          <span style={{ fontSize: 14, lineHeight: 1.3 }}>What they said</span>
          <span style={{ fontSize: 12, color: '#85949A', fontWeight: 300 }}>Leave an empty line between paragraphs.</span>
        </div>
        {LANGS.map((l) => (
          <label key={l.id} style={{ display: 'grid', gap: 4 }}>
            <span style={SMALL_LABEL}>{l.label}</span>
            <DraftField
              long
              value={values.quote[l.id]}
              label={'Quote, ' + l.label}
              placeholder={l.id === 'en' ? 'Their words in English' : 'Empty: the English quote is shown'}
              onEdit={(v) => onEdit('quote', v, l.id)}
              style={{ fontSize: 14 }}
            />
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderTop: '1px solid #E2DED4', paddingTop: 10, marginTop: 'auto' }}>
        <span style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: badgeColor || '#A4AFB3' }}>{badge}</span>
        <button type="button" onClick={action.onClick} className="h-color-coral"
          style={{ background: 'none', border: 0, padding: '6px 2px', fontSize: 13, cursor: 'pointer', transition: 'color .2s', color: action.strong ? '#E36B54' : '#A4AFB3', flexShrink: 0 }}>
          {action.label}
        </button>
      </div>
    </div>
  );
}
