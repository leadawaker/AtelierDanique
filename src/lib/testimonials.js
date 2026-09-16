// Testimonials: four built-in ones plus any Danique adds in the studio.
//
// Storage shapes (all in the site content, see content.js):
//   ad-testimonials        [{slotId, quote:{en,pt,nl}, name, from}]   added by Danique
//   ad-testimonials-hidden [slotId]                                    built-ins switched off
//   ad-testimonials-text   {slotId: {quote:{en,pt,nl}, name, from}}    edits to built-ins
// A quote is plain text; blank lines separate paragraphs. A quote missing in
// the visitor's language falls back to English. Photos live in ad-photos under
// the testimonial's slotId, and its round avatar under `${slotId}-avatar`.

const RAW_TESTIMONIALS = [
  {
    slotId: 'ad-t1',
    name: 'Marcia Barbosa Fronza',
    handle: '@marciabfronza',
    instagram: 'https://www.instagram.com/marciabfronza/',
    avatar: 'uploads/avatar-marcia.jpg',
    lines: [
      'I chose a moment between me and my granddaughter that I will always remember as ours: the way she looked up at me while I was feeding her.',
      'The painting is beautiful, delicate, and deeply emotional. Danique captured not only the photograph, but the feeling behind it.'
    ]
  },
  {
    slotId: 'ad-t2',
    name: 'Martina',
    handle: '@martinamensikova',
    instagram: 'https://www.instagram.com/martinamensikova/',
    avatar: 'uploads/avatar-martina.jpg',
    lines: [
      'I was speechless because you got it perfect. Unwrapping it brought tears to my eyes.',
      'It brought me back to my childhood and all the memories of that place.',
      "Now this memory isn't only in my mind. It's captured forever, and I can look at it every day beside my grandma's photo."
    ]
  },
  {
    slotId: 'ad-t3',
    name: 'Rowan',
    handle: '',
    instagram: '',
    avatar: '',
    lines: ['Testimonial coming soon.']
  },
  {
    slotId: 'ad-t4',
    name: '',
    handle: '',
    instagram: '',
    avatar: '',
    lines: ['Testimonial coming soon.']
  }
];

export const MAX_TESTIMONIALS = 6;

export const BASE_TESTIMONIALS = RAW_TESTIMONIALS.map((r) => ({
  slotId: r.slotId,
  quote: { en: r.lines.join('\n\n'), pt: '', nl: '' },
  name: r.name,
  from: r.handle,
  avatar: r.avatar,
}));

export const avatarSlotId = (slotId) => slotId + '-avatar';

const quoteIn = (quote, lang) => {
  if (typeof quote === 'string') return quote;
  return (quote && (quote[lang] || quote.en)) || '';
};

export const toLines = (text) => text.split(/\n\s*\n/).map((l) => l.trim()).filter(Boolean);

// Everything showing on the site for one language, capped at MAX_TESTIMONIALS.
// Each item: {slotId, avatarSlotId, avatar (default src), name, from, lines}.
export function buildTestimonials(content, lang) {
  const hidden = content['ad-testimonials-hidden'] || [];
  const over = content['ad-testimonials-text'] || {};
  const added = content['ad-testimonials'] || [];
  const base = BASE_TESTIMONIALS
    .filter((b) => !hidden.includes(b.slotId))
    .map((b) => {
      const o = over[b.slotId] || {};
      const q = (o.quote && o.quote[lang]) || (lang !== 'en' && o.quote && o.quote.en) || quoteIn(b.quote, lang);
      return {
        slotId: b.slotId,
        avatarSlotId: avatarSlotId(b.slotId),
        avatar: b.avatar,
        name: typeof o.name === 'string' && o.name.trim() ? o.name : b.name,
        from: typeof o.from === 'string' && o.from.trim() ? o.from : b.from,
        lines: toLines(q),
      };
    });
  const extra = added.map((a) => ({
    slotId: a.slotId,
    avatarSlotId: avatarSlotId(a.slotId),
    avatar: '',
    name: a.name || '',
    from: a.from || '',
    lines: toLines(quoteIn(a.quote, lang)),
  }));
  return base.concat(extra).slice(0, MAX_TESTIMONIALS);
}
