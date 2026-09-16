import { DraftField, LANGS, SMALL_LABEL } from '../fields.jsx';
import { COPY_GROUPS } from '../../../lib/copyFields.js';
import { STRINGS } from '../../../lib/strings.js';

// Copy tab: every editable line of the home page, in English, Portuguese and
// Dutch. The box shows what is on the website now (her change, or the
// original). Stored in ad-copy as {key: {en, pt, nl}}; an empty box or the
// original text removes that language from the store.

const original = (lang, key) => {
  const v = STRINGS[lang] && STRINGS[lang][key];
  return typeof v === 'string' ? v : '';
};

export default function CopyTab({ content, update }) {
  const copy = content['ad-copy'] || {};

  const setText = (key, lang, value) => {
    const fallback = original(lang, key);
    const entry = { ...(copy[key] || {}) };
    const clean = value.trim();
    if (!clean || clean === fallback.trim()) delete entry[lang]; else entry[lang] = value;
    const next = { ...copy };
    if (Object.keys(entry).length) next[key] = entry; else delete next[key];
    update('ad-copy', next);
  };

  const useOriginal = (key) => {
    const next = { ...copy };
    delete next[key];
    update('ad-copy', next);
  };

  const jump = (id) => {
    const el = document.getElementById('copy-' + id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      <p style={{ margin: '0 0 20px', maxWidth: '64ch', fontSize: 15, lineHeight: 1.8, color: '#455459', fontWeight: 300 }}>
        Change any text on the home page. Leave a box empty to use the original text.
      </p>

      <nav aria-label="Sections" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 'clamp(28px,4vw,40px)' }}>
        <span style={{ ...SMALL_LABEL, alignSelf: 'center', marginRight: 4 }}>Go to</span>
        {COPY_GROUPS.map((g) => (
          <button key={g.id} type="button" onClick={() => jump(g.id)} className="h-border-coral h-color-coral"
            style={{ background: '#FCFAF6', border: '1px solid #D3CFC4', borderRadius: 999, padding: '6px 12px', fontSize: 13, color: '#455459', cursor: 'pointer' }}>
            {g.name}
          </button>
        ))}
      </nav>

      {COPY_GROUPS.map((g) => (
        <section key={g.id} id={'copy-' + g.id} style={{ marginBottom: 'clamp(36px,5vw,56px)', scrollMarginTop: 16 }}>
          <div style={{ borderBottom: '1px solid #DDD9CF', paddingBottom: 12, marginBottom: 18 }}>
            <h2 style={{ margin: 0, fontFamily: "'Cardo',serif", fontWeight: 400, fontSize: 'clamp(22px,2.4vw,30px)', lineHeight: 1.1 }}>{g.name}</h2>
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            {g.fields.map((f) => (
              <CopyRow key={f.key} field={f} over={copy[f.key]} onEdit={setText} onReset={useOriginal} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CopyRow({ field, over, onEdit, onReset }) {
  const changed = !!(over && LANGS.some((l) => over[l.id]));
  return (
    <div style={{ background: '#F1EFE8', border: '1px solid #E2DED4', borderRadius: 6, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 15, lineHeight: 1.3 }}>{field.label}</span>
          {changed && (
            <span style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: '#E36B54' }}>Changed</span>
          )}
        </div>
        {changed && (
          <button type="button" onClick={() => onReset(field.key)} className="h-color-coral"
            style={{ background: 'none', border: 0, padding: '4px 2px', fontSize: 13, color: '#85949A', cursor: 'pointer' }}>
            Use original
          </button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px 20px' }}>
        {LANGS.map((l) => {
          const own = over && over[l.id];
          const base = original(l.id, field.key);
          return (
            <label key={l.id} style={{ display: 'grid', gap: 4, alignContent: 'start' }}>
              <span style={SMALL_LABEL}>{l.label}</span>
              <DraftField
                value={own || base}
                long={!!field.long}
                label={field.label + ', ' + l.label}
                placeholder={base ? '' : 'Empty'}
                onEdit={(v) => onEdit(field.key, l.id, v)}
                style={{ fontSize: field.long ? 14 : 15 }}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
