import { STRINGS } from './strings.js';

// The 11 built-in gallery pieces, in carousel order. Titles and captions come
// from STRINGS (galTitles / galCaptions by index), not from these English
// fields, which are only kept as a readable reference.
export const GALLERY = [
  { slotId: 'ad-gal-places', category: 'places', title: 'Meaningful places', caption: 'The places that touched us.', placeholder: 'Place artwork, framed' },
  { slotId: 'ad-gal-couples', category: 'people', title: 'Couples', caption: 'Love, adventure, together.', placeholder: 'Couple artwork' },
  { slotId: 'ad-gal-family', category: 'people', title: 'Family', caption: 'The people who make life rich.', placeholder: 'Family artwork' },
  { slotId: 'ad-gal-pets', category: 'animals', title: 'Pets', caption: "They're family too.", placeholder: 'Pet artwork' },
  { slotId: 'ad-gal-portraits', category: 'people', title: 'Portraits', caption: 'Your story, in art.', placeholder: 'Portrait artwork' },
  { slotId: 'ad-gal-homes', category: 'places', title: 'Homes', caption: 'The walls that held a life.', placeholder: 'Home artwork' },
  { slotId: 'ad-gal-travel', category: 'travel', title: 'Travel', caption: 'A place you keep going back to.', placeholder: 'Travel artwork' },
  { slotId: 'ad-gal-details', category: 'details', title: 'Small details', caption: 'The little things you remember.', placeholder: 'Detail artwork' },
  { slotId: 'ad-gal-weddings', category: 'people', title: 'Weddings', caption: 'The day itself, kept.', placeholder: 'Wedding artwork' },
  { slotId: 'ad-gal-childhood', category: 'places', title: 'Childhood homes', caption: 'Where it all started.', placeholder: 'Childhood home artwork' },
  { slotId: 'ad-gal-landscapes', category: 'travel', title: 'Landscapes', caption: 'A view you never forgot.', placeholder: 'Landscape artwork' }
];

const pickLang = (v, lang) => (typeof v === 'string' ? (lang === 'en' ? v : '') : (v && v[lang]) || '');

// Danique's chosen display order (an array of slotIds, from the studio's
// drag-to-reorder list) applied on top of a list of {slotId, ...}. A piece
// not mentioned in `order` yet (just added, or just put back from hidden)
// falls in at the end, in the order it already had.
export function applyOrder(items, order) {
  if (!order || !order.length) return items;
  const bySlot = new Map(items.map((it) => [it.slotId, it]));
  const ordered = order.map((id) => bySlot.get(id)).filter(Boolean);
  const seen = new Set(ordered.map((it) => it.slotId));
  return ordered.concat(items.filter((it) => !seen.has(it.slotId)));
}

// The pieces showing on the site for one language: base pieces minus hidden,
// with text overrides applied, then the pieces Danique added, in Danique's
// chosen order.
// Shapes: extra = [{slotId, title:{en,pt,nl}, caption:{en,pt,nl}, category}],
// hidden = [slotId], text = {slotId: {title:{..}, caption:{..}}}, order = [slotId].
export function buildGallery(content, lang) {
  const t = STRINGS[lang] || STRINGS.en;
  const over = content['ad-gallery-text'] || {};
  const hidden = content['ad-gallery-hidden'] || [];
  const extras = content['ad-gallery-extra'] || [];
  const order = content['ad-gallery-order'] || [];
  const items = GALLERY
    .map((g, i) => {
      const o = over[g.slotId] || {};
      return {
        ...g,
        title: (o.title && o.title[lang]) || t.galTitles[i],
        caption: (o.caption && o.caption[lang]) || t.galCaptions[i],
      };
    })
    .filter((g) => !hidden.includes(g.slotId))
    .concat(extras.map((e) => ({
      slotId: e.slotId,
      category: e.category || '',
      placeholder: 'Artwork',
      title: pickLang(e.title, lang) || pickLang(e.title, 'en'),
      caption: pickLang(e.caption, lang) || pickLang(e.caption, 'en'),
    })));
  return applyOrder(items, order);
}

// Built-in default text for a base piece, used by the studio as the fallback.
export function galleryDefaults(slotId, lang) {
  const i = GALLERY.findIndex((g) => g.slotId === slotId);
  const t = STRINGS[lang] || STRINGS.en;
  return i === -1 ? { title: '', caption: '' } : { title: t.galTitles[i], caption: t.galCaptions[i] };
}
