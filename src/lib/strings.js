// Built-in site text, ported verbatim from Atelier Danique.dc.html.
// Danique's edits from the studio (ad-copy) are layered on top by withCopy().
// Keep this as the default: an untouched site must look exactly like the design.

export const STRINGS = {
  en: {
    navHome: 'Home', navGallery: 'Gallery', navProcess: 'How it works', navWhich: 'Which photo?', navAbout: 'About', navContact: 'Contact',
    heroEyebrow: 'Hand-painted watercolour & ink', heroT1: 'Real moments.', heroT2: 'Lasting', heroT3: 'forever.',
    heroBody: 'I create custom, hand-crafted artworks from your photos, turning the people and moments you love into timeless pieces for your home.',
    ctaCommission: 'Commission your piece',
    meetEyebrow: 'IN HER OWN WORDS', meetTitle: 'Meet Danique', watch: 'Meet Danique', waPrefill: 'Hi, I would like to know more about your artwork.',
    tagline: 'Real moments. Real art. Real people.',
    galEyebrow: 'Curated portfolio', galTitle: 'Gallery', galSeeMore: 'See more work on Instagram',
    hintSwipe: 'Swipe for the next piece', hintClick: 'Click a strip to open it',
    galTitles: ['Meaningful places','Couples','Family','Pets','Portraits','Homes','Travel','Small details','Weddings','Childhood homes','Landscapes'],
    galCaptions: ['The places that touched us.','Love, adventure, together.','The people who make life rich.',"They're family too.",'Your story, in art.','The walls that held a life.','A place you keep going back to.','The little things you remember.','The day itself, kept.','Where it all started.','A view you never forgot.'],
    procEyebrow: 'The process', procTitle: 'How it works', procIntro: 'From your photo to a finished artwork, I make it simple and personal.',
    step1T: '1 - CHOOSE YOUR MOMENT', step1B: 'Think about a photo that means something special to you.',
    step2T: '2 - SEND YOUR PHOTO', step2B: 'Upload it through our secure form and tell us a little about the moment.',
    step3T: '3 - DANIQUE CREATES THE ARTWORK', step3B: 'Danique turns your photo into a custom, hand-crafted piece using her unique artistic style.',
    step4T: '4 - RECEIVE YOUR ARTWORK', step4B: 'Your finished piece is carefully packaged and delivered to your home.',
    priceTitle: 'Pricing per size', sizeLabelA5: 'SIZE A5 -', sizeLabelA4: 'SIZE A4 -', included: "What's included",
    inc1: 'Painted on 300g cold pressed cotton paper', inc2: 'A short conversation about why it matters', inc3: 'Unframed, sized to standard A4/A5 frames',
    inc4: 'Signed by hand', inc5: 'Care card included', inc6: 'Ready in a few days',
    inc7: 'Free tracked shipping within NL', inc8: 'Your photos stay private, never shared without asking', inc9: '30 days guarantee',
    testEyebrow: 'What clients say', testTitle: 'Testimonials',
    whichEyebrow: 'Not sure which photo to choose?', whichTitle: 'Get expert advice.',
    whichBody: "You don't need a perfect photo. Send me what you have and I'll tell you honestly what will work, from lighting and composition to emotional impact, before you commit to anything.",
    whichCta: 'Get advice on WhatsApp',
    checklist: ['Good lighting','Clear composition','Visible faces and expressions','Emotional significance','High resolution if possible'],
    igEyebrow: 'Latest from Instagram', igTitle: 'Follow along', igSeeMore: 'See more on Instagram',
    faqEyebrow: 'Good to know', faqTitle: 'FAQ',
    faq: [
      { q: 'How long does it take?', a: 'A few days within the Netherlands. Internationally, allow up to three to four weeks including shipping.' },
      { q: 'Do you ship outside the Netherlands?', a: 'Yes, worldwide. Shipping within NL is free and tracked; elsewhere the cost is added at cost price and I confirm it with you first.' },
      { q: 'What if my photo is not good enough?', a: "Send it anyway. I'll tell you honestly whether it will work, and if it won't, I'll help you pick another one before anything is started." },
      { q: 'Is it framed?', a: 'No, it arrives unframed on 300g cold pressed cotton paper, cut to standard A4 or A5 so any shop frame fits.' },
      { q: 'When do I pay?', a: 'Half up front once we agree on the photo and the size, and the other half after your artwork is delivered.' },
      { q: 'What does the 30 days guarantee cover?', a: 'Your artwork is painted and sent within 30 days of us agreeing on the photo, or you get your money back. The only exception is an international shipping delay once the parcel has left my hands.' }
    ],
    posts: [
      { title: 'Meaningful places', date: '2 September 2026', description: 'A commission of the house where a family spent every summer. Ink and wash, A4.' },
      { title: 'Couples', date: '26 August 2026', description: 'Two years after the photo was taken on a beach in Zeeland, it became an artwork.' },
      { title: 'Family', date: '18 August 2026', description: 'Four generations in one frame. The hardest and most rewarding piece so far.' },
      { title: 'Pets', date: '9 August 2026', description: 'Nox, on the windowsill where he always sat. A5, a gift for his owner.' },
      { title: 'Portraits', date: '1 August 2026', description: 'A birthday portrait worked up from a phone photo taken in low light.' },
      { title: 'Weddings', date: '24 July 2026', description: 'The view from the ceremony, painted from a guest\u2019s phone photo.' },
      { title: 'Childhood homes', date: '12 July 2026', description: 'The kitchen table where three generations had breakfast.' },
      { title: 'First homes', date: '2 July 2026', description: 'A first apartment, painted as a housewarming gift.' }
    ],
    ctaEyebrow: 'Have a photo in mind?', ctaTitle: 'Commission your piece.',
    ctaBody1: 'Upload your photo and tell me a little about the moment.', ctaBody2: "I'll get back to you with next steps.",
    ctaSend: 'Send me your photo', ctaNotSure: 'Not sure which photo?',
    footTagline: 'Turning meaningful moments into timeless artwork.', footLocation: "'s-Hertogenbosch, the Netherlands",
    footCopy: "© 2026 Atelier Danique · 's-Hertogenbosch · All artwork made by hand.",
    videoSoon: 'The film is being made. Drop the video file in later and it plays right here.'
  },
  pt: {
    navHome: 'Início', navGallery: 'Galeria', navProcess: 'Como funciona', navWhich: 'Qual foto?', navAbout: 'Sobre', navContact: 'Contato',
    heroEyebrow: 'Pintado à mão em aquarela e tinta', heroT1: 'Momentos reais.', heroT2: 'Que duram', heroT3: 'para sempre.',
    heroBody: 'Crio obras feitas à mão a partir das suas fotos, transformando as pessoas e os momentos que você ama em peças atemporais para a sua casa.',
    ctaCommission: 'Encomende sua obra',
    meetEyebrow: 'NAS PALAVRAS DELA', meetTitle: 'Conheça a Danique', watch: 'Conheça a Danique', waPrefill: 'Oi! Gostaria de saber mais sobre as suas obras.',
    tagline: 'Momentos reais. Arte real. Pessoas reais.',
    galEyebrow: 'Portfólio selecionado', galTitle: 'Galeria', galSeeMore: 'Veja mais trabalhos no Instagram',
    hintSwipe: 'Arraste para ver a próxima obra', hintClick: 'Clique em uma faixa para abrir',
    galTitles: ['Lugares com significado','Casais','Família','Bichos de estimação','Retratos','Casas','Viagens','Pequenos detalhes','Casamentos','Casas de infância','Paisagens'],
    galCaptions: ['Os lugares que nos tocaram.','Amor, aventura, juntos.','As pessoas que enriquecem a vida.','Também são família.','Sua história, em arte.','As paredes que abrigaram uma vida.','Um lugar ao qual você sempre volta.','As pequenas coisas que ficam na memória.','O próprio dia, guardado.','Onde tudo começou.','Uma vista que você nunca esqueceu.'],
    procEyebrow: 'O processo', procTitle: 'Como funciona', procIntro: 'Da sua foto à obra finalizada, tudo de forma simples e pessoal.',
    step1T: '1 - ESCOLHA SEU MOMENTO', step1B: 'Pense em uma foto que signifique algo especial para você.',
    step2T: '2 - ENVIE SUA FOTO', step2B: 'Envie pelo nosso formulário seguro e conte um pouco sobre o momento.',
    step3T: '3 - DANIQUE CRIA A OBRA', step3B: 'Danique transforma sua foto em uma peça feita à mão, com seu estilo artístico único.',
    step4T: '4 - RECEBA SUA OBRA', step4B: 'Sua peça finalizada é embalada com cuidado e entregue na sua casa.',
    priceTitle: 'Preço por tamanho', sizeLabelA5: 'TAMANHO A5 -', sizeLabelA4: 'TAMANHO A4 -', included: 'O que está incluído',
    inc1: 'Pintado em papel de algodão 300g prensado a frio', inc2: 'Uma conversa breve sobre o que aquilo significa', inc3: 'Sem moldura, no tamanho padrão A4/A5',
    inc4: 'Assinado à mão', inc5: 'Cartão de cuidados incluído', inc6: 'Pronto em poucos dias na Holanda, até 3–4 semanas no exterior',
    inc7: 'Frete rastreado grátis na Holanda', inc8: 'Suas fotos ficam privadas, nunca compartilhadas sem permissão', inc9: 'Garantia de 30 dias',
    testEyebrow: 'O que dizem os clientes', testTitle: 'Depoimentos',
    whichEyebrow: 'Não sabe qual foto escolher?', whichTitle: 'Receba orientação.',
    whichBody: 'Você não precisa de uma foto perfeita. Envie o que tiver e eu digo com sinceridade o que vai funcionar, da luz e da composição ao impacto emocional, antes de assumir qualquer compromisso.',
    whichCta: 'Peça orientação no WhatsApp',
    checklist: ['Boa iluminação','Composição clara','Rostos e expressões visíveis','Significado emocional','Alta resolução, se possível'],
    igEyebrow: 'Últimos posts do Instagram', igTitle: 'Acompanhe', igSeeMore: 'Veja mais no Instagram',
    faqEyebrow: 'Bom saber', faqTitle: 'Perguntas frequentes',
    faq: [
      { q: 'Quanto tempo leva?', a: 'Poucos dias na Holanda. No exterior, considere de três a quatro semanas, incluindo o envio.' },
      { q: 'Você envia para fora da Holanda?', a: 'Sim, para o mundo todo. O frete na Holanda é grátis e rastreado; nos outros países o custo é acrescentado pelo preço real e confirmado com você antes.' },
      { q: 'E se minha foto não for boa o suficiente?', a: 'Envie de qualquer forma. Eu digo com sinceridade se ela funciona e, se não funcionar, ajudo você a escolher outra antes de começar.' },
      { q: 'Vem com moldura?', a: 'Não, chega sem moldura em papel de algodão 300g prensado a frio, no tamanho padrão A4 ou A5, que serve em qualquer moldura de loja.' },
      { q: 'Quando eu pago?', a: 'Metade no início, quando definimos a foto e o tamanho, e a outra metade depois da entrega da obra.' },
      { q: 'O que cobre a garantia de 30 dias?', a: 'Sua obra é pintada e enviada em até 30 dias depois de definirmos a foto, ou seu dinheiro é devolvido. A única exceção é atraso no envio internacional depois que o pacote sai das minhas mãos.' }
    ],
    posts: [
      { title: 'Lugares com significado', date: '2 de setembro de 2026', description: 'Uma encomenda da casa onde uma família passava todos os verões. Nanquim e aquarela, A4.' },
      { title: 'Casais', date: '26 de agosto de 2026', description: 'Dois anos depois da foto tirada numa praia da Zelândia, ela virou obra.' },
      { title: 'Família', date: '18 de agosto de 2026', description: 'Quatro gerações no mesmo quadro. A peça mais difícil e mais gratificante até agora.' },
      { title: 'Bichos de estimação', date: '9 de agosto de 2026', description: 'Nox, no parapeito onde sempre ficava. A5, um presente para sua tutora.' },
      { title: 'Retratos', date: '1 de agosto de 2026', description: 'Um retrato de aniversário feito a partir de uma foto de celular com pouca luz.' },
      { title: 'Casamentos', date: '24 de julho de 2026', description: 'A vista da cerimônia, pintada a partir da foto de celular de um convidado.' },
      { title: 'Casas de infância', date: '12 de julho de 2026', description: 'A mesa da cozinha onde três gerações tomaram café.' },
      { title: 'Primeira casa', date: '2 de julho de 2026', description: 'Um primeiro apartamento, pintado como presente de inauguração.' }
    ],
    ctaEyebrow: 'Já tem uma foto em mente?', ctaTitle: 'Encomende sua obra.',
    ctaBody1: 'Envie sua foto e me conte um pouco sobre o momento.', ctaBody2: 'Eu retorno com os próximos passos.',
    ctaSend: 'Envie sua foto', ctaNotSure: 'Não sabe qual foto?',
    footTagline: 'Transformando momentos especiais em obras atemporais.', footLocation: "'s-Hertogenbosch, Holanda",
    footCopy: "© 2026 Atelier Danique · 's-Hertogenbosch · Todas as obras feitas à mão.",
    videoSoon: 'O filme está sendo feito. Depois basta colocar o vídeo aqui que ele toca neste espaço.'
  },
  nl: {
    navHome: 'Home', navGallery: 'Galerij', navProcess: 'Hoe het werkt', navWhich: 'Welke foto?', navAbout: 'Over', navContact: 'Contact',
    heroEyebrow: 'Met de hand geschilderd in aquarel en inkt', heroT1: 'Echte momenten.', heroT2: 'Die blijven', heroT3: 'voor altijd.',
    heroBody: "Ik maak met de hand gemaakte kunstwerken van jouw foto's en verander de mensen en momenten die je liefhebt in tijdloze stukken voor je huis.",
    ctaCommission: 'Bestel jouw werk',
    meetEyebrow: 'IN HAAR EIGEN WOORDEN', meetTitle: 'Maak kennis met Danique', watch: 'Maak kennis met Danique', waPrefill: 'Hoi! Ik wil graag meer weten over je kunstwerken.',
    tagline: 'Echte momenten. Echte kunst. Echte mensen.',
    galEyebrow: 'Geselecteerd portfolio', galTitle: 'Galerij', galSeeMore: 'Bekijk meer werk op Instagram',
    hintSwipe: 'Swipe voor het volgende werk', hintClick: 'Klik op een strook om te openen',
    galTitles: ['Betekenisvolle plekken','Koppels','Familie','Huisdieren','Portretten','Huizen','Reizen','Kleine details','Bruiloften','Ouderlijk huis','Landschappen'],
    galCaptions: ['De plekken die ons raakten.','Liefde, avontuur, samen.','De mensen die het leven rijk maken.','Ook zij zijn familie.','Jouw verhaal, in kunst.','De muren die een leven omsloten.','Een plek waar je steeds naar terugkeert.','De kleine dingen die je bijblijven.','De dag zelf, bewaard.','Waar het allemaal begon.','Een uitzicht dat je nooit vergat.'],
    procEyebrow: 'Het proces', procTitle: 'Hoe het werkt', procIntro: 'Van jouw foto tot een afgerond kunstwerk, simpel en persoonlijk.',
    step1T: '1 - KIES JE MOMENT', step1B: 'Denk aan een foto die iets bijzonders voor je betekent.',
    step2T: '2 - STUUR JE FOTO', step2B: 'Upload hem via ons beveiligde formulier en vertel iets over het moment.',
    step3T: '3 - DANIQUE MAAKT HET WERK', step3B: 'Danique maakt van je foto een handgemaakt werk in haar eigen stijl.',
    step4T: '4 - ONTVANG JE WERK', step4B: 'Je afgeronde werk wordt zorgvuldig ingepakt en bij je thuis bezorgd.',
    priceTitle: 'Prijs per formaat', sizeLabelA5: 'FORMAAT A5 -', sizeLabelA4: 'FORMAAT A4 -', included: 'Wat is inbegrepen',
    inc1: 'Geschilderd op 300g koudgeperst katoenpapier', inc2: 'Een kort gesprek over waarom het bijzonder is', inc3: 'Zonder lijst, in standaard A4/A5-formaat',
    inc4: 'Met de hand gesigneerd', inc5: 'Onderhoudskaartje inbegrepen', inc6: 'Binnen een paar dagen klaar in NL, internationaal tot 3–4 weken',
    inc7: 'Gratis verzending met tracking binnen NL', inc8: "Je foto's blijven privé, nooit gedeeld zonder te vragen", inc9: '30 dagen garantie',
    testEyebrow: 'Wat klanten zeggen', testTitle: 'Ervaringen',
    whichEyebrow: 'Weet je niet welke foto je moet kiezen?', whichTitle: 'Krijg deskundig advies.',
    whichBody: 'Je hebt geen perfecte foto nodig. Stuur wat je hebt en ik vertel je eerlijk wat gaat werken, van licht en compositie tot emotionele impact, voordat je iets vastlegt.',
    whichCta: 'Vraag advies via WhatsApp',
    checklist: ['Goed licht','Heldere compositie','Zichtbare gezichten en uitdrukkingen','Emotionele waarde','Hoge resolutie indien mogelijk'],
    igEyebrow: 'Laatste van Instagram', igTitle: 'Volg mee', igSeeMore: 'Bekijk meer op Instagram',
    faqEyebrow: 'Goed om te weten', faqTitle: 'Veelgestelde vragen',
    faq: [
      { q: 'Hoe lang duurt het?', a: 'Een paar dagen binnen Nederland. Internationaal duurt het tot drie of vier weken, inclusief verzending.' },
      { q: 'Verstuur je ook buiten Nederland?', a: 'Ja, wereldwijd. Verzending binnen NL is gratis en met tracking; daarbuiten komen de werkelijke verzendkosten erbij, die ik eerst met je bevestig.' },
      { q: 'Wat als mijn foto niet goed genoeg is?', a: 'Stuur hem toch. Ik zeg je eerlijk of het gaat werken, en zo niet help ik je een andere foto kiezen voordat er iets begint.' },
      { q: 'Zit er een lijst bij?', a: 'Nee, het komt zonder lijst op 300g koudgeperst katoenpapier, op standaard A4- of A5-formaat, dus elke winkellijst past.' },
      { q: 'Wanneer betaal ik?', a: 'De helft vooraf, zodra we de foto en het formaat hebben afgesproken, en de andere helft na levering van je werk.' },
      { q: 'Wat dekt de 30 dagen garantie?', a: 'Je werk wordt binnen 30 dagen na het afspreken van de foto geschilderd en verzonden, of je krijgt je geld terug. De enige uitzondering is vertraging bij internationale verzending zodra het pakket uit mijn handen is.' }
    ],
    posts: [
      { title: 'Betekenisvolle plekken', date: '2 september 2026', description: 'Een opdracht van het huis waar een familie elke zomer doorbracht. Inkt en aquarel, A4.' },
      { title: 'Koppels', date: '26 augustus 2026', description: 'Twee jaar na de foto op een strand in Zeeland werd het een kunstwerk.' },
      { title: 'Familie', date: '18 augustus 2026', description: 'Vier generaties in één beeld. Het moeilijkste en mooiste werk tot nu toe.' },
      { title: 'Huisdieren', date: '9 augustus 2026', description: 'Nox, op de vensterbank waar hij altijd zat. A5, een cadeau voor zijn baasje.' },
      { title: 'Portretten', date: '1 augustus 2026', description: 'Een verjaardagsportret gemaakt van een telefoonfoto bij weinig licht.' },
      { title: 'Bruiloften', date: '24 juli 2026', description: 'Het uitzicht van de ceremonie, geschilderd naar de telefoonfoto van een gast.' },
      { title: 'Ouderlijk huis', date: '12 juli 2026', description: 'De keukentafel waar drie generaties ontbeten.' },
      { title: 'Eerste huis', date: '2 juli 2026', description: 'Een eerste appartement, geschilderd als housewarmingcadeau.' }
    ],
    ctaEyebrow: 'Heb je al een foto in gedachten?', ctaTitle: 'Bestel jouw werk.',
    ctaBody1: 'Upload je foto en vertel me iets over het moment.', ctaBody2: 'Ik kom bij je terug met de volgende stappen.',
    ctaSend: 'Stuur me je foto', ctaNotSure: 'Weet je niet welke foto?',
    footTagline: 'Betekenisvolle momenten omgezet in tijdloze kunst.', footLocation: "'s-Hertogenbosch, Nederland",
    footCopy: "© 2026 Atelier Danique · 's-Hertogenbosch · Alle werken met de hand gemaakt.",
    videoSoon: 'De film wordt gemaakt. Zet de video er later in en hij speelt hier.'
  }
};

export const LANGS = [
  { code: 'EN', id: 'en', name: 'English' },
  { code: 'PT', id: 'pt', name: 'Português' },
  { code: 'NL', id: 'nl', name: 'Nederlands' },
];

// Wraps one language's strings with the studio overrides so callers keep
// reading t.heroTitle etc. Only plain string keys can be overridden; an
// empty override falls back to the built-in translation.
export function withCopy(lang, copy) {
  const base = STRINGS[lang] || STRINGS.en;
  if (!copy || typeof copy !== 'object') return base;
  const out = { ...base };
  for (const key of Object.keys(copy)) {
    const v = copy[key] && copy[key][lang];
    if (typeof base[key] === 'string' && typeof v === 'string' && v.trim()) out[key] = v;
  }
  return out;
}
