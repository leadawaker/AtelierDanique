export const SITE = 'https://www.atelierdanique.com';

const META = {
  en: {
    '': ['Atelier Danique · Watercolour paintings of your meaningful places', "Hand-painted watercolour and ink paintings of the places that matter to you, made from your photo and your story. By Danique in 's-Hertogenbosch, shipped worldwide."],
    commission: ['Commission a painting · Atelier Danique', 'Send your photo and tell the story behind it. A5 or A4 watercolour, ready in 5 working days, half paid up front.'],
    privacy: ['Privacy policy · Atelier Danique', 'How Atelier Danique handles your photo and your details.'],
    terms: ['Terms & conditions · Atelier Danique', 'Ordering, payment, shipping and the 10-day window at Atelier Danique.'],
  },
  nl: {
    '': ['Atelier Danique · Aquarel van jouw betekenisvolle plek', "Handgeschilderde aquarellen van de plekken die voor jou iets betekenen, gemaakt van jouw foto en jouw verhaal. Door Danique in 's-Hertogenbosch, verzending wereldwijd."],
    commission: ['Schilderij laten maken · Atelier Danique', 'Stuur je foto en vertel het verhaal erachter. Aquarel op A5 of A4, klaar in 5 werkdagen, de helft vooraf.'],
    privacy: ['Privacybeleid · Atelier Danique', 'Hoe Atelier Danique omgaat met je foto en je gegevens.'],
    terms: ['Algemene voorwaarden · Atelier Danique', 'Bestellen, betalen, verzenden en de bedenktijd van 10 dagen bij Atelier Danique.'],
  },
  pt: {
    '': ['Atelier Danique · Aquarelas dos seus lugares especiais', 'Aquarelas pintadas à mão dos lugares que marcaram você, a partir da sua foto e da sua história. Por Danique, na Holanda, com envio para o Brasil e o mundo.'],
    commission: ['Encomende uma pintura · Atelier Danique', 'Envie sua foto e conte a história por trás dela. Aquarela em A5 ou A4, pronta em 5 dias úteis, metade adiantada.'],
    privacy: ['Política de privacidade · Atelier Danique', 'Como o Atelier Danique cuida da sua foto e dos seus dados.'],
    terms: ['Termos e condições · Atelier Danique', 'Encomenda, pagamento, envio e o prazo de 10 dias no Atelier Danique.'],
  },
};

export function metaFor(lang, page) {
  const [title, description] = (META[lang] || META.en)[page] || META.en[''];
  return { title, description };
}

// Share image: the hero photo Danique chose in the studio, else the default.
const FALLBACK_IMAGE = SITE + '/uploads/Project%20(20260915100023).jpg'; // Hero.jsx BANNER_SRC
export function ogImage(content) {
  const url = content?.['ad-photos']?.['ad-hero-banner']?.url;
  return url ? (url.startsWith('http') ? url : SITE + url) : FALLBACK_IMAGE;
}
