import { useEffect } from 'react';
import { useSiteContent } from '../../lib/content.js';
import { useLang } from '../../lib/lang.js';
import { PhotosContext } from '../../lib/photos.js';
import { withCopy } from '../../lib/strings.js';
import { useCompact } from '../../lib/useCompact.js';
import { LINKS, whatsappLink } from './settings.js';
import Header from './Header.jsx';
import Hero from './Hero.jsx';
import Meet from './Meet.jsx';
import Gallery from './Gallery.jsx';
import Process from './Process.jsx';
import Pricing from './Pricing.jsx';
import Testimonials from './Testimonials.jsx';
import Instagram from './Instagram.jsx';
import Faq from './Faq.jsx';
import Contact from './Contact.jsx';
import Footer from './Footer.jsx';
import FloatingWhatsapp from './FloatingWhatsapp.jsx';

// Every section gets the same props:
//   t        strings for the active language, with Danique's copy edits applied
//   lang     'en' | 'pt' | 'nl'
//   setLang  (only Header uses it)
//   compact  true under 1000px
//   content  normalized site content (see lib/content.js)
//   links    { instagramUrl, whatsappUrl (with the prefilled message), whatsappNumber, email }
export default function Home() {
  const content = useSiteContent();
  const [lang, setLang] = useLang();
  const compact = useCompact();
  const t = withCopy(lang, content['ad-copy']);
  const links = { ...LINKS, whatsappUrl: whatsappLink(LINKS.whatsappUrl, t.waPrefill) };
  const props = { t, lang, compact, content, links };

  useReveal();

  return (
    <PhotosContext.Provider value={content['ad-photos']}>
      <div id="top" style={{ maxWidth: 1440, margin: '0 auto', background: '#FCFAF6', boxShadow: '0 0 60px rgba(38,69,79,.08)' }}>
        <Header {...props} setLang={setLang} />
        <Hero {...props} />
        <Gallery {...props} />
        <Meet {...props} />
        <Process {...props} />
        <Pricing {...props} />
        <Testimonials {...props} />
        <Faq {...props} />
        <Instagram {...props} />
        <Contact {...props} />
        <Footer {...props} />
        <FloatingWhatsapp {...props} />
      </div>
    </PhotosContext.Provider>
  );
}

// Fade sections in as they scroll into view ([data-reveal] in index.css).
// Only elements starting below the fold are hidden first.
function useReveal() {
  useEffect(() => {
    const vh = window.innerHeight;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.setAttribute('data-reveal', 'in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '-8% 0px -8% 0px' });
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top > vh * 0.9) { el.setAttribute('data-reveal', 'out'); io.observe(el); }
    });
    return () => io.disconnect();
  }, []);
}
