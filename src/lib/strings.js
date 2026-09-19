// Built-in site text, ported verbatim from Atelier Danique.dc.html.
// Danique's edits from the studio (ad-copy) are layered on top by withCopy().
// Keep this as the default: an untouched site must look exactly like the design.

export const STRINGS = {
  en: {
    navHome: 'Home', navGallery: 'Gallery', navProcess: 'How it works', navPricing: 'Pricing', navTestimonials: 'Testimonials', navFaq: 'FAQ', navAbout: 'About',
    heroEyebrow: 'Hand-painted watercolour & ink', heroAlt: 'Watercolour painting by Danique', heroSpots: 'Launch prices · {left} of {total} spots remaining', heroT1: 'Real moments.', heroT2: 'Lasting', heroT3: 'forever.',
    heroBody: 'I create custom, hand-crafted artworks from your photos, turning the people and moments you love into timeless pieces for your home.',
    ctaCommission: 'Commission your piece',
    meetEyebrow: 'IN HER OWN WORDS', meetTitle: 'Meet Danique', watch: 'Meet Danique', waPrefill: 'Hi Danique!',
    tagline: 'Real moments. Real art. Real people.',
    galEyebrow: 'Curated portfolio', galTitle: 'Gallery', galSeeMore: 'See more work on Instagram',
    hintSwipe: 'Swipe for the next piece', hintClick: 'Click a strip to open it',
    galTitles: ['Meaningful places','Couples','Family','Pets','Portraits','Homes','Travel','Small details','Weddings','Childhood homes','Landscapes'],
    galCaptions: ['The places that touched us.','Love, adventure, together.','The people who make life rich.',"They're family too.",'Your story, in art.','The walls that held a life.','A place you keep going back to.','The little things you remember.','The day itself, kept.','Where it all started.','A view you never forgot.'],
    procEyebrow: 'The process', procTitle: 'From a moment to something you can keep.',
    step1T: 'Choose your moment', step1B: 'Choose a photo that holds a special memory for you.',
    step2T: 'Send your photo', step2B: 'Upload your photo and tell me a little about the moment.',
    step3T: 'I create your artwork', step3B: 'I transform your photo into a unique, hand-crafted piece.',
    step4T: 'Receive your artwork', step4B: 'Your finished piece is carefully packaged and delivered to you.',
    procCloseA: "You choose the moment and I'll take care of the rest.",
    priceTitle: 'Pricing per size', included: "What's included",
    priceHeadline: 'Choose the format that feels right for your piece.',
    priceDescA5: 'A smaller, intimate size, perfect for a personal touch or a cosy space.',
    priceDescA4: 'A larger format for more presence, ideal if you want a bold, statement piece.',
    priceLabel: 'Launch price', popularLabel: 'Most popular',
    launchTitle: 'Launch pricing', launchCount: '{left} of {total}', launchCountLabel: 'Launch spots remaining',
    launchBody: "You're among the first {total}. Current prices are {prices}.\nPrices will increase once the launch spots are filled.",
    inc1: 'Painted on 300g cold pressed cotton paper', inc2: 'A short conversation about why it matters', inc3: 'Unframed, sized to standard A4/A5 frames',
    inc4: 'Signed by hand', inc5: 'Care card included', inc6: 'Sent in 5 working days',
    inc7: 'Tracked shipping: €5 NL, €10 Europe + UK, €15 rest of the world', inc10: "Free pick-up in 's-Hertogenbosch", inc8: 'Your photos stay private, never shared without asking', inc9: '10 days guarantee',
    testEyebrow: 'What clients say', testTitle: 'Testimonials',
    faqPhotoQ: 'Not sure which photo to choose?',
    faqPhotoA: "You don't need a perfect photo. Send me what you have and I'll tell you honestly what will work, from lighting and composition to emotional impact, before you commit to anything. If it won't work, I'll help you pick another one.",
    checklist: ['Good lighting','Clear composition','Visible faces and expressions','Emotional significance','High resolution if possible'],
    igEyebrow: 'Latest from Instagram', igTitle: 'Follow along', igSeeMore: 'See more on Instagram',
    faqEyebrow: 'Good to know', faqTitle: 'FAQ',
    faq: [
      { q: 'How long does it take?', a: 'Your painting is ready in 5 working days. In the Netherlands, add a day or two for it to arrive. Within Europe, allow about a week, and up to four weeks worldwide, depending on the location.' },
      { q: 'Do you ship outside the Netherlands?', a: "Yes, worldwide, always with track and trace. Shipping is €5 within the Netherlands, €10 to the rest of Europe and the UK, and €15 to the rest of the world. You can also pick up your artwork for free in 's-Hertogenbosch." },
      { q: 'Is it framed?', a: 'No, it arrives unframed on 300g cold pressed cotton paper, cut to standard A4 or A5 so any shop frame fits.' },
      { q: 'When do I pay?', a: 'Half up front once we agree on the photo and the size, and the other half when your artwork is finished, before I send it.' },
      { q: 'How does the 10 days guarantee work?', a: 'You have 10 days after receiving your painting to change your mind. If it is not right for you, just let me know within those 10 days.' }
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
    footCopy: "© 2026 Atelier Danique · 's-Hertogenbosch · All artwork made by hand.", footPrivacy: 'Privacy policy', footTerms: 'Terms & conditions',
    videoSoon: 'The film is being made. Drop the video file in later and it plays right here.'
  },
  pt: {
    navHome: 'Início', navGallery: 'Galeria', navProcess: 'Como funciona', navPricing: 'Preços', navTestimonials: 'Depoimentos', navFaq: 'Dúvidas', navAbout: 'Sobre',
    heroEyebrow: 'Pintado à mão em aquarela e tinta', heroAlt: 'Aquarela pintada por Danique', heroSpots: 'Preços de lançamento · {left} de {total} vagas restantes', heroT1: 'Momentos reais.', heroT2: 'Que duram', heroT3: 'para sempre.',
    heroBody: 'Crio obras feitas à mão a partir das suas fotos, transformando as pessoas e os momentos que você ama em peças atemporais para a sua casa.',
    ctaCommission: 'Encomende sua obra',
    meetEyebrow: 'NAS PALAVRAS DELA', meetTitle: 'Conheça a Danique', watch: 'Conheça a Danique', waPrefill: 'Oi Danique!',
    tagline: 'Momentos reais. Arte real. Pessoas reais.',
    galEyebrow: 'Portfólio selecionado', galTitle: 'Galeria', galSeeMore: 'Veja mais trabalhos no Instagram',
    hintSwipe: 'Arraste para ver a próxima obra', hintClick: 'Clique em uma faixa para abrir',
    galTitles: ['Lugares com significado','Casais','Família','Bichos de estimação','Retratos','Casas','Viagens','Pequenos detalhes','Casamentos','Casas de infância','Paisagens'],
    galCaptions: ['Os lugares que nos tocaram.','Amor, aventura, juntos.','As pessoas que enriquecem a vida.','Também são família.','Sua história, em arte.','As paredes que abrigaram uma vida.','Um lugar ao qual você sempre volta.','As pequenas coisas que ficam na memória.','O próprio dia, guardado.','Onde tudo começou.','Uma vista que você nunca esqueceu.'],
    procEyebrow: 'O processo', procTitle: 'De um momento a algo para guardar.',
    step1T: 'Escolha seu momento', step1B: 'Escolha uma foto que guarda uma memória especial para você.',
    step2T: 'Envie sua foto', step2B: 'Envie sua foto e conte um pouco sobre o momento.',
    step3T: 'Eu crio a sua obra', step3B: 'Transformo sua foto em uma peça única, feita à mão.',
    step4T: 'Receba sua obra', step4B: 'Sua peça finalizada é embalada com cuidado e entregue a você.',
    procCloseA: "Você escolhe o momento e eu cuido do resto.",
    priceTitle: 'Preço por tamanho', included: 'O que está incluído',
    priceHeadline: 'Escolha o formato que combina com a sua obra.',
    priceDescA5: 'Um tamanho menor e mais íntimo, perfeito para um toque pessoal ou um cantinho aconchegante.',
    priceDescA4: 'Um formato maior, com mais presença, ideal para quem quer uma peça marcante.',
    priceLabel: 'Preço de lançamento', popularLabel: 'Mais popular',
    launchTitle: 'Preços de lançamento', launchCount: '{left} de {total}', launchCountLabel: 'Vagas de lançamento restantes',
    launchBody: 'Você está entre os primeiros {total}. Os preços atuais são {prices}.\nOs preços vão aumentar quando as vagas de lançamento forem preenchidas.',
    inc1: 'Pintado em papel de algodão 300g prensado a frio', inc2: 'Uma conversa breve sobre o que aquilo significa', inc3: 'Sem moldura, no tamanho padrão A4/A5',
    inc4: 'Assinado à mão', inc5: 'Cartão de cuidados incluído', inc6: 'Enviado em 5 dias úteis',
    inc7: 'Frete rastreado: €5 Holanda, €10 Europa + Reino Unido, €15 resto do mundo', inc10: "Retirada grátis em 's-Hertogenbosch", inc8: 'Suas fotos ficam privadas, nunca compartilhadas sem permissão', inc9: 'Garantia de 10 dias',
    testEyebrow: 'O que dizem os clientes', testTitle: 'Depoimentos',
    faqPhotoQ: 'Não sabe qual foto escolher?',
    faqPhotoA: 'Você não precisa de uma foto perfeita. Envie o que tiver e eu digo com sinceridade o que vai funcionar, da luz e da composição ao impacto emocional, antes de assumir qualquer compromisso. Se não funcionar, ajudo você a escolher outra.',
    checklist: ['Boa iluminação','Composição clara','Rostos e expressões visíveis','Significado emocional','Alta resolução, se possível'],
    igEyebrow: 'Últimos posts do Instagram', igTitle: 'Acompanhe', igSeeMore: 'Veja mais no Instagram',
    faqEyebrow: 'Bom saber', faqTitle: 'Perguntas frequentes',
    faq: [
      { q: 'Quanto tempo leva?', a: 'Sua obra fica pronta em 5 dias úteis. Na Holanda, some um ou dois dias para a entrega. Dentro da Europa, considere cerca de uma semana, e até quatro semanas para o resto do mundo, dependendo do local.' },
      { q: 'Você envia para fora da Holanda?', a: "Sim, para o mundo todo, sempre com rastreamento. O frete custa €5 na Holanda, €10 para o resto da Europa e o Reino Unido, e €15 para o resto do mundo. Você também pode retirar sua obra de graça em 's-Hertogenbosch." },
      { q: 'Vem com moldura?', a: 'Não, chega sem moldura em papel de algodão 300g prensado a frio, no tamanho padrão A4 ou A5, que serve em qualquer moldura de loja.' },
      { q: 'Quando eu pago?', a: 'Metade no início, quando definimos a foto e o tamanho, e a outra metade quando a obra estiver pronta, antes de eu enviar.' },
      { q: 'Como funciona a garantia de 10 dias?', a: 'Você tem 10 dias, depois de receber sua obra, para mudar de ideia. Se ela não for o que você esperava, é só me avisar dentro desses 10 dias.' }
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
    footCopy: "© 2026 Atelier Danique · 's-Hertogenbosch · Todas as obras feitas à mão.", footPrivacy: 'Política de privacidade', footTerms: 'Termos e condições',
    videoSoon: 'O filme está sendo feito. Depois basta colocar o vídeo aqui que ele toca neste espaço.'
  },
  nl: {
    navHome: 'Home', navGallery: 'Galerij', navProcess: 'Hoe het werkt', navPricing: 'Prijzen', navTestimonials: 'Ervaringen', navFaq: 'Vragen', navAbout: 'Over',
    heroEyebrow: 'Met de hand geschilderd in aquarel en inkt', heroAlt: 'Aquarel geschilderd door Danique', heroSpots: 'Introductieprijzen · nog {left} van {total} plekken', heroT1: 'Echte momenten.', heroT2: 'Die blijven', heroT3: 'voor altijd.',
    heroBody: "Ik maak met de hand gemaakte kunstwerken van jouw foto's en verander de mensen en momenten die je liefhebt in tijdloze stukken voor je huis.",
    ctaCommission: 'Bestel jouw werk',
    meetEyebrow: 'IN HAAR EIGEN WOORDEN', meetTitle: 'Maak kennis met Danique', watch: 'Maak kennis met Danique', waPrefill: 'Hoi Danique!',
    tagline: 'Echte momenten. Echte kunst. Echte mensen.',
    galEyebrow: 'Geselecteerd portfolio', galTitle: 'Galerij', galSeeMore: 'Bekijk meer werk op Instagram',
    hintSwipe: 'Swipe voor het volgende werk', hintClick: 'Klik op een strook om te openen',
    galTitles: ['Betekenisvolle plekken','Koppels','Familie','Huisdieren','Portretten','Huizen','Reizen','Kleine details','Bruiloften','Ouderlijk huis','Landschappen'],
    galCaptions: ['De plekken die ons raakten.','Liefde, avontuur, samen.','De mensen die het leven rijk maken.','Ook zij zijn familie.','Jouw verhaal, in kunst.','De muren die een leven omsloten.','Een plek waar je steeds naar terugkeert.','De kleine dingen die je bijblijven.','De dag zelf, bewaard.','Waar het allemaal begon.','Een uitzicht dat je nooit vergat.'],
    procEyebrow: 'Het proces', procTitle: 'Van een moment naar iets om te bewaren.',
    step1T: 'Kies je moment', step1B: 'Kies een foto met een bijzondere herinnering voor jou.',
    step2T: 'Stuur je foto', step2B: 'Upload je foto en vertel me kort iets over het moment.',
    step3T: 'Ik maak het werk', step3B: 'Ik maak van je foto een uniek, handgemaakt werk.',
    step4T: 'Ontvang je werk', step4B: 'Je afgeronde werk wordt zorgvuldig ingepakt en bij je bezorgd.',
    procCloseA: "Jij kiest het moment en ik zorg voor de rest.",
    priceTitle: 'Prijs per formaat', included: 'Wat is inbegrepen',
    priceHeadline: 'Kies het formaat dat bij jouw werk past.',
    priceDescA5: 'Een kleiner, intiem formaat, perfect voor een persoonlijk accent of een gezellig hoekje.',
    priceDescA4: 'Een groter formaat met meer aanwezigheid, ideaal als je een gedurfd, opvallend werk wilt.',
    priceLabel: 'Introductieprijs', popularLabel: 'Meest populair',
    launchTitle: 'Introductieprijzen', launchCount: '{left} van {total}', launchCountLabel: 'Introductieplekken beschikbaar',
    launchBody: 'Je hoort bij de eerste {total}. De huidige prijzen zijn {prices}.\nDe prijzen gaan omhoog zodra de introductieplekken vol zijn.',
    inc1: 'Geschilderd op 300g koudgeperst katoenpapier', inc2: 'Een kort gesprek over waarom het bijzonder is', inc3: 'Zonder lijst, in standaard A4/A5-formaat',
    inc4: 'Met de hand gesigneerd', inc5: 'Onderhoudskaartje inbegrepen', inc6: 'Verzonden binnen 5 werkdagen',
    inc7: 'Verzending met track & trace: €5 NL, €10 Europa + VK, €15 rest van de wereld', inc10: "Gratis ophalen in 's-Hertogenbosch", inc8: "Je foto's blijven privé, nooit gedeeld zonder te vragen", inc9: '10 dagen garantie',
    testEyebrow: 'Wat klanten zeggen', testTitle: 'Ervaringen',
    faqPhotoQ: 'Weet je niet welke foto je moet kiezen?',
    faqPhotoA: 'Je hebt geen perfecte foto nodig. Stuur wat je hebt en ik vertel je eerlijk wat gaat werken, van licht en compositie tot emotionele impact, voordat je iets vastlegt. Werkt hij niet, dan help ik je een andere kiezen.',
    checklist: ['Goed licht','Heldere compositie','Zichtbare gezichten en uitdrukkingen','Emotionele waarde','Hoge resolutie indien mogelijk'],
    igEyebrow: 'Laatste van Instagram', igTitle: 'Volg mee', igSeeMore: 'Bekijk meer op Instagram',
    faqEyebrow: 'Goed om te weten', faqTitle: 'Veelgestelde vragen',
    faq: [
      { q: 'Hoe lang duurt het?', a: 'Je werk is binnen 5 werkdagen klaar. Binnen Nederland komt er een dag of twee bij voor de bezorging. Binnen Europa duurt het ongeveer een week, en wereldwijd tot vier weken, afhankelijk van de locatie.' },
      { q: 'Verstuur je ook buiten Nederland?', a: "Ja, wereldwijd, altijd met track & trace. Verzending kost €5 binnen Nederland, €10 naar de rest van Europa en het VK, en €15 naar de rest van de wereld. Je kunt je werk ook gratis ophalen in 's-Hertogenbosch." },
      { q: 'Zit er een lijst bij?', a: 'Nee, het komt zonder lijst op 300g koudgeperst katoenpapier, op standaard A4- of A5-formaat, dus elke winkellijst past.' },
      { q: 'Wanneer betaal ik?', a: 'De helft vooraf, zodra we de foto en het formaat hebben afgesproken, en de andere helft als je werk klaar is, voordat ik het verstuur.' },
      { q: 'Hoe werkt de 10 dagen garantie?', a: 'Je hebt 10 dagen na ontvangst van je schilderij om je te bedenken. Is het toch niet wat je had verwacht, laat het me dan binnen die 10 dagen weten.' }
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
    footCopy: "© 2026 Atelier Danique · 's-Hertogenbosch · Alle werken met de hand gemaakt.", footPrivacy: 'Privacybeleid', footTerms: 'Algemene voorwaarden',
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
