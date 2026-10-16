import { useEffect, useState } from 'react';
import { s } from '../../lib/css.js';
import PolaroidLineCarousel from '../../components/PolaroidLineCarousel.jsx';

const MAX_POSTS = 14;
const LOCALES = { en: 'en-GB', pt: 'pt-BR', nl: 'nl-NL' };
const IG_ICON = (
  <>
    <rect x="2" y="2" width="20" height="20" rx="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </>
);

// Turns the raw feed into cards; posts without an image are skipped.
function toCards(posts) {
  const out = [];
  for (const p of posts || []) {
    const url = p && (p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url);
    if (!url) continue;
    const caption = String(p.caption || '').trim();
    // Hashtag-only lines are dropped so the text shown is the story itself.
    const title = caption.split('\n').filter((l) => !/^(#\S+\s*)+$/.test(l.trim())).join('\n').replace(/\n{2,}/g, '\n').trim();
    out.push({ id: p.id, url, title, timestamp: p.timestamp, permalink: p.permalink });
    if (out.length >= MAX_POSTS) break;
  }
  return out;
}

function formatDate(ts, lang) {
  if (!ts) return '';
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(LOCALES[lang] || 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

export default function Instagram({ t, lang, links }) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    let alive = true;
    fetch('/api/instagram-feed')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (alive) setCards(toCards(data && data.posts)); })
      .catch(() => { if (alive) setCards([]); });
    return () => { alive = false; };
  }, []);

  if (!cards.length) return null;

  const slides = cards.map((post) => ({
    image: post.url,
    title: post.title || '@atelierdanique',
    caption: formatDate(post.timestamp, lang),
    alt: post.title.split('\n')[0].slice(0, 120),
    href: post.permalink,
  }));
  // The last print sends people to her profile.
  slides.push({
    title: '@atelierdanique',
    caption: t.igSeeMore,
    href: links.instagramUrl,
    node: (
      <div style={s('position:absolute;inset:0;background:#E7E5DA;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:22px')}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#E36B54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{IG_ICON}</svg>
        <p style={s('margin:0;font-size:14px;color:#455459;line-height:1.5')}>{t.igSeeMore}</p>
      </div>
    ),
  });

  return (
    <section id="instagram" style={s('background:#F1EFE8;padding:clamp(48px,7vw,100px) 0 clamp(24px,3vw,48px)')}>
      <div data-reveal="" style={s('max-width:1400px;margin:0 auto;padding:0 clamp(24px,5vw,80px)')}>
        <div style={s('margin-bottom:clamp(8px,1.5vw,20px)')}>
          <p style={s('margin:0 0 10px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#E36B54')}>{t.igEyebrow}</p>
          <div style={s('display:flex;align-items:center;gap:clamp(12px,1.4vw,18px)')}>
            <h2 style={s("margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(36px,4.4vw,60px);line-height:1;letter-spacing:-.02em")}>{t.igTitle}</h2>
            <a href={links.instagramUrl} target="_blank" rel="noopener" aria-label={t.igSeeMore} title="@atelierdanique" className="h-bg-coral-dark"
              style={s('flex:0 0 auto;width:clamp(38px,3.6vw,48px);height:clamp(38px,3.6vw,48px);background:#E36B54;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#FCFAF6;transition:background .25s')}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{IG_ICON}</svg>
            </a>
          </div>
        </div>
      </div>
      <PolaroidLineCarousel slides={slides} height="clamp(540px,74vh,740px)" ariaLabel={t.igEyebrow} />
    </section>
  );
}
