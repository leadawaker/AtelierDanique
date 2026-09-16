import { BASE_TESTIMONIALS, MAX_TESTIMONIALS } from '../../../lib/testimonials.js';
import TestimonialCard from './TestimonialCard.jsx';

// Testimonials tab. Built-in testimonials are edited through overrides in
// ad-testimonials-text (an empty box or the original text removes the
// override) and switched off with ad-testimonials-hidden. The ones Danique
// adds live, edited in place, in ad-testimonials. Photos go to ad-photos.

const EMPTY_QUOTE = { en: '', pt: '', nl: '' };

const asQuote = (q) => (typeof q === 'string' ? { en: q, pt: '', nl: '' } : { ...EMPTY_QUOTE, ...(q || {}) });

export default function TestimonialsTab({ content, update }) {
  const hidden = content['ad-testimonials-hidden'] || [];
  const over = content['ad-testimonials-text'] || {};
  const added = content['ad-testimonials'] || [];
  const photos = content['ad-photos'] || {};
  const onPhotos = (next) => update('ad-photos', next);

  // Built-in edits: same rules as the gallery's setOver in the design.
  const setOver = (slotId, field, value, fallback, lang) => {
    const entry = { ...(over[slotId] || {}) };
    const clean = value.trim();
    const same = !clean || clean === (fallback || '').trim();
    if (field === 'quote') {
      const quote = { ...(entry.quote || {}) };
      if (same) delete quote[lang]; else quote[lang] = value;
      if (Object.keys(quote).length) entry.quote = quote; else delete entry.quote;
    } else if (same) {
      delete entry[field];
    } else {
      entry[field] = value;
    }
    const next = { ...over };
    if (Object.keys(entry).length) next[slotId] = entry; else delete next[slotId];
    update('ad-testimonials-text', next);
  };

  const setAdded = (i, field, value, lang) => {
    const next = added.slice();
    const cur = { ...next[i] };
    if (field === 'quote') cur.quote = { ...asQuote(cur.quote), [lang]: value };
    else cur[field] = value;
    next[i] = cur;
    update('ad-testimonials', next);
  };

  const toggleHidden = (slotId, off) => {
    update('ad-testimonials-hidden', off ? hidden.filter((s) => s !== slotId) : hidden.concat([slotId]));
  };

  const remove = (i) => {
    const who = (added[i].name || '').trim();
    if (!window.confirm('Remove ' + (who ? 'the testimonial from ' + who : 'this testimonial') + '? This cannot be undone.')) return;
    update('ad-testimonials', added.filter((_, j) => j !== i));
  };

  const hiddenCount = BASE_TESTIMONIALS.filter((b) => hidden.includes(b.slotId)).length;
  const wanted = BASE_TESTIMONIALS.length - hiddenCount + added.length;
  const showing = Math.min(wanted, MAX_TESTIMONIALS);
  const full = wanted >= MAX_TESTIMONIALS;

  const add = () => {
    if (full) return;
    update('ad-testimonials', added.concat([{
      slotId: 'ad-t-x' + Date.now().toString(36), quote: { ...EMPTY_QUOTE }, name: '', from: '',
    }]));
  };

  // Walk the cards in website order to know which ones fall beyond the cap.
  let position = 0;
  const badgeFor = (off, addedByYou) => {
    if (off) return { badge: 'Hidden', badgeColor: '#C0503B' };
    position += 1;
    if (position > MAX_TESTIMONIALS) return { badge: 'Not shown (the website shows ' + MAX_TESTIMONIALS + ')', badgeColor: '#C0503B' };
    return { badge: addedByYou ? 'Added by you' : 'On the website' };
  };

  const cards = BASE_TESTIMONIALS.map((b) => {
    const off = hidden.includes(b.slotId);
    const o = over[b.slotId] || {};
    const oq = o.quote || {};
    const values = {
      name: (typeof o.name === 'string' && o.name.trim()) ? o.name : b.name,
      from: (typeof o.from === 'string' && o.from.trim()) ? o.from : b.from,
      quote: { en: oq.en || b.quote.en, pt: oq.pt || b.quote.pt, nl: oq.nl || b.quote.nl },
    };
    return (
      <TestimonialCard
        key={b.slotId}
        item={b}
        values={values}
        faded={off}
        {...badgeFor(off, false)}
        action={{ label: off ? 'Put back' : 'Hide', strong: off, onClick: () => toggleHidden(b.slotId, off) }}
        onEdit={(field, value, lang) => setOver(b.slotId, field, value, field === 'quote' ? b.quote[lang] : b[field], lang)}
        photos={photos}
        onPhotos={onPhotos}
      />
    );
  }).concat(added.map((a, i) => (
    <TestimonialCard
      key={a.slotId}
      item={{ slotId: a.slotId, avatar: '' }}
      values={{ name: a.name || '', from: a.from || '', quote: asQuote(a.quote) }}
      {...badgeFor(false, true)}
      action={{ label: 'Remove', onClick: () => remove(i) }}
      onEdit={(field, value, lang) => setAdded(i, field, value, lang)}
      photos={photos}
      onPhotos={onPhotos}
    />
  )));

  const countLabel = showing + ' showing on the website'
    + (wanted > MAX_TESTIMONIALS ? ' · ' + (wanted - MAX_TESTIMONIALS) + ' not shown' : '')
    + (hiddenCount ? ' · ' + hiddenCount + ' hidden' : '')
    + (added.length ? ' · ' + added.length + ' added by you' : '');

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', borderBottom: '1px solid #DDD9CF', paddingBottom: 12, marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontFamily: "'Cardo',serif", fontWeight: 400, fontSize: 'clamp(22px,2.4vw,30px)', lineHeight: 1.1 }}>Testimonials</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#85949A', fontWeight: 300 }}>{countLabel}</p>
      </div>

      <p style={{ margin: '0 0 22px', maxWidth: '64ch', fontSize: 15, lineHeight: 1.8, color: '#455459', fontWeight: 300 }}>
        The website shows up to 6. With 3 they sit in one row, with 4 in two rows of two, with 5 or 6 in rows of three.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <button type="button" onClick={add} disabled={full} className={full ? undefined : 'h-bg-coral-dark'}
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: full ? '#D3CFC4' : '#E36B54', color: '#FCFAF6', border: 0, padding: '15px 26px', fontSize: 15, borderRadius: 2, cursor: full ? 'not-allowed' : 'pointer', transition: 'background .25s' }}>
          <span style={{ fontSize: 19, lineHeight: 1 }}>+</span><span>Add a testimonial</span>
        </button>
        <p style={{ margin: 0, fontSize: 13, color: '#85949A', fontWeight: 300 }}>
          {full
            ? 'The website already shows 6. Hide or remove one to add another.'
            : 'New testimonials appear after the others.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 'clamp(18px,2.4vw,28px)' }}>
        {cards}
      </div>
    </section>
  );
}
