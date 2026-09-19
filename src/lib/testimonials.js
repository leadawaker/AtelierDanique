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
    lines: {
      en: [
        'I chose a moment between me and my granddaughter that I will always remember as ours: the way she looked up at me while I was feeding her.',
        'The painting is beautiful, delicate, and deeply emotional. Danique captured not only the photograph, but the feeling behind it.'
      ],
      pt: [
        'Escolhi um momento entre mim e minha neta que sempre vou lembrar como nosso: o jeito como ela olhou para mim enquanto eu a alimentava.',
        'A pintura é linda, delicada e profundamente emocionante. A Danique capturou não só a fotografia, mas o sentimento por trás dela.'
      ],
      nl: [
        'Ik koos een moment tussen mij en mijn kleindochter dat ik altijd als ons moment zal herinneren: de manier waarop ze naar me opkeek terwijl ik haar voedde.',
        'Het schilderij is prachtig, verfijnd en diep ontroerend. Danique legde niet alleen de foto vast, maar ook het gevoel erachter.'
      ]
    }
  },
  {
    slotId: 'ad-t2',
    name: 'Martina',
    handle: '@martinamensikova',
    instagram: 'https://www.instagram.com/martinamensikova/',
    avatar: 'uploads/avatar-martina.jpg',
    lines: {
      en: [
        'I was speechless because you got it perfect. Unwrapping it brought tears to my eyes.',
        'It brought me back to my childhood and all the memories of that place.',
        "Now this memory isn't only in my mind. It's captured forever, and I can look at it every day beside my grandma's photo."
      ],
      pt: [
        'Fiquei sem palavras porque ficou perfeito. Abrir o pacote trouxe lágrimas aos meus olhos.',
        'Me trouxe de volta à minha infância e a todas as memórias daquele lugar.',
        'Agora essa lembrança não existe só na minha mente. Ela está capturada para sempre, e posso olhar para ela todos os dias ao lado da foto da minha avó.'
      ],
      nl: [
        'Ik was sprakeloos omdat het perfect was geworden. Het uitpakken bracht me tranen in de ogen.',
        'Het bracht me terug naar mijn kindertijd en alle herinneringen aan die plek.',
        'Deze herinnering leeft nu niet meer alleen in mijn hoofd. Ze is voor altijd vastgelegd, en ik kan er elke dag naar kijken naast de foto van mijn oma.'
      ]
    }
  },
  {
    slotId: 'ad-t3',
    name: 'Rowan & Joppe',
    handle: '@rowanvandekerkhof',
    instagram: 'https://www.instagram.com/rowanvandekerkhof/',
    avatar: '',
    lines: {
      en: [
        'This takes me straight back to our van trip around Spain.',
        'The surf, the sea, and that feeling of being completely free.',
        'Danique captured such a special moment for us. We love having it on our wall.'
      ],
      pt: [
        'Isso me leva direto de volta à nossa viagem de van pela Espanha.',
        'O surf, o mar e aquela sensação de ser completamente livre.',
        'A Danique capturou um momento tão especial para nós. Adoramos tê-lo na nossa parede.'
      ],
      nl: [
        'Dit brengt me meteen terug naar onze busreis door Spanje.',
        'De surf, de zee en dat gevoel van totale vrijheid.',
        'Danique heeft zo\'n bijzonder moment voor ons vastgelegd. We vinden het heerlijk om het aan onze muur te hebben.'
      ]
    }
  },
  {
    slotId: 'ad-t4',
    name: 'Lore Merckx',
    handle: '@loremerckxx',
    instagram: 'https://www.instagram.com/loremerckxx/',
    avatar: '',
    lines: {
      en: [
        'I was immediately impressed when I first saw the painting. The warm, vibrant colours and beautiful details brought back so many memories of this place and the sense of freedom it gave me.',
        'Now it hangs on my wall, bringing not only colour but a wonderful feeling of nostalgia. The personal note that came with it made it even more special. ❤️'
      ],
      pt: [
        'Fiquei impressionada assim que vi a pintura pela primeira vez. As cores quentes e vibrantes e os detalhes lindos trouxeram de volta tantas memórias deste lugar e a sensação de liberdade que ele me deu.',
        'Agora ela está na minha parede, trazendo não só cor, mas uma maravilhosa sensação de nostalgia. O bilhete pessoal que veio junto a tornou ainda mais especial. ❤️'
      ],
      nl: [
        'Ik was meteen onder de indruk toen ik het schilderij voor het eerst zag. De warme, levendige kleuren en mooie details brachten zoveel herinneringen terug aan deze plek en aan het gevoel van vrijheid dat ik er had.',
        'Nu hangt het aan mijn muur en brengt het niet alleen kleur, maar ook een heerlijk gevoel van nostalgie. Het persoonlijke briefje dat erbij zat maakte het nog specialer. ❤️'
      ]
    }
  }
];

export const MAX_TESTIMONIALS = 6;

// How each testimonial painting is framed on its card: the photos show the
// painting lying on wood or paper, so `crop` (fractions of the upload) cuts to
// the painting alone, aimed at the part that makes the card recognisable
// (bell tower top, surfboards and sky, the face). Each entry only applies while
// the slot still holds that exact upload (`match` is part of its file name):
// a new photo uploaded in the studio falls back to the studio's own framing.
export const PAINTING_FRAMES = {
  'ad-t1': { match: 'ad-t1-LECpPMRgtdRsWykts9oIE0xEMS8hrK', crop: { x: 0.3458, y: 0.1200, w: 0.4655, h: 0.7650 } },
  'ad-t2': { match: 'ad-t2-UrrWWf2wmPzI50jyifWhoIfGyKMS5G', crop: { x: 0.2793, y: 0.2013, w: 0.6185, h: 0.5571 } },
  'ad-t3': { match: 'ad-t3-RXqdoVVXT5P5lRb7ptzBxj7AvNNO3C', crop: { x: 0.4289, y: 0.3686, w: 0.3000, h: 0.2700 } },
  'ad-t4': { match: 'ad-t4-mA9Rf1khSx48XxlFbPW7ZwX6Nghs6U', crop: { x: 0.5350, y: 0.1180, w: 0.3200, h: 0.6825 } },
};

export const BASE_TESTIMONIALS = RAW_TESTIMONIALS.map((r) => ({
  slotId: r.slotId,
  quote: {
    en: r.lines.en.join('\n\n'),
    pt: (r.lines.pt || []).join('\n\n'),
    nl: (r.lines.nl || []).join('\n\n'),
  },
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
