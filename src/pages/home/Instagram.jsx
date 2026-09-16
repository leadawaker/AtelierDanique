import { useEffect, useRef, useState } from 'react';
import { s } from '../../lib/css.js';
import Slot from '../../components/Slot.jsx';

const MAX_POSTS = 8;
const LOCALES = { en: 'en-GB', pt: 'pt-BR', nl: 'nl-NL' };
const CARD = 'width:min(80vw,320px);flex-shrink:0;scroll-snap-align:center;background:#FFFEFB;border-radius:6px;padding:12px 12px 0;box-shadow:0 4px 10px rgba(38,69,79,.13);display:flex;flex-direction:column;transition:transform .35s cubic-bezier(.22,.61,.36,1),box-shadow .35s';
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
    const [first, ...rest] = caption.split('\n');
    const firstLine = first.trim();
    const title = firstLine.length > 60 ? firstLine.slice(0, 59).trimEnd() + '…' : firstLine;
    const description = rest.join('\n').trim() || caption;
    out.push({ id: p.id, url, title, description, timestamp: p.timestamp, permalink: p.permalink });
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
  const railRef = useRef(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/instagram-feed')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (alive) setCards(toCards(data && data.posts)); })
      .catch(() => { if (alive) setCards([]); });
    return () => { alive = false; };
  }, []);

  // Drag-to-scroll with a mouse or pen; touch keeps native scrolling.
  const hasCards = cards.length > 0;
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    let down = false, startX = 0, startLeft = 0, moved = false;
    const onDown = (e) => {
      if (e.pointerType === 'touch') return;
      down = true; moved = false; startX = e.clientX; startLeft = rail.scrollLeft; rail.style.cursor = 'grabbing';
    };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      rail.scrollLeft = startLeft - dx;
    };
    const end = () => { down = false; rail.style.cursor = 'grab'; };
    const onClick = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } };
    const onDrag = (e) => e.preventDefault();
    rail.addEventListener('pointerdown', onDown);
    rail.addEventListener('pointermove', onMove);
    rail.addEventListener('pointerup', end);
    rail.addEventListener('pointerleave', end);
    rail.addEventListener('click', onClick, true);
    rail.addEventListener('dragstart', onDrag);
    return () => {
      rail.removeEventListener('pointerdown', onDown);
      rail.removeEventListener('pointermove', onMove);
      rail.removeEventListener('pointerup', end);
      rail.removeEventListener('pointerleave', end);
      rail.removeEventListener('click', onClick, true);
      rail.removeEventListener('dragstart', onDrag);
    };
  }, [hasCards]);

  if (!hasCards) return null;

  return (
    <section id="instagram" style={s('background:#F1EFE8;padding:clamp(48px,7vw,100px) 0')}>
      <div data-reveal="" style={s('max-width:1400px;margin:0 auto;padding:0 clamp(24px,5vw,80px)')}>
        <div style={s('margin-bottom:clamp(28px,4vw,52px)')}>
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
      <div style={s('position:relative')}>
        <div ref={railRef} data-carousel="" data-noscrollbar="" style={s('overflow-x:auto;scroll-snap-type:x proximity;scroll-padding-left:clamp(24px,5vw,80px);padding:6px clamp(40px,6vw,96px) 24px calc(clamp(24px,5vw,80px) + 12px);-webkit-overflow-scrolling:touch;cursor:grab;scrollbar-width:none;mask-image:linear-gradient(to right,#000 0,#000 82%,rgba(0,0,0,.15) 100%);-webkit-mask-image:linear-gradient(to right,#000 0,#000 82%,rgba(0,0,0,.15) 100%)')}>
          <div style={s('display:flex;gap:clamp(16px,2vw,24px);width:max-content;align-items:stretch')}>
            {cards.map((post) => (
              <figure key={post.id} className="h-lift" style={s('margin:0;' + CARD)}>
                <a href={post.permalink} target="_blank" rel="noopener" aria-label="Open this post on Instagram" style={s('position:relative;display:block;aspect-ratio:3/4;overflow:hidden;background:#E3E1D8;cursor:pointer')}>
                  <Slot photo={{ url: post.url, s: 1, x: 0, y: 0 }} alt={post.title} />
                  <div className="h-show" style={s('position:absolute;inset:0;background:rgba(38,69,79,.74);opacity:0;transition:opacity .35s ease;display:flex;flex-direction:column;justify-content:flex-end;padding:16px')}>
                    <span aria-hidden="true" style={s('position:absolute;top:10px;right:10px;width:34px;height:34px;background:#E36B54;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#FCFAF6')}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{IG_ICON}</svg>
                    </span>
                    <p style={s('margin:0;font-size:13px;line-height:1.6;color:#E4EDEA;font-weight:300;text-wrap:pretty;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:8;overflow:hidden;white-space:pre-line')}>{post.description}</p>
                  </div>
                </a>
                <figcaption style={s('padding:16px 4px 20px;display:flex;flex-direction:column;gap:4px;flex:1')}>
                  <a href={post.permalink} target="_blank" rel="noopener" className="h-color-coral" style={s('margin:0;font-size:14px;color:#26454F')}>{post.title || '@atelierdanique'}</a>
                  <p style={s('margin:0;font-size:12px;color:#85949A;font-weight:300;letter-spacing:.04em')}>{formatDate(post.timestamp, lang)}</p>
                </figcaption>
              </figure>
            ))}
            <a href={links.instagramUrl} target="_blank" rel="noopener" className="h-lift" style={s(CARD)}>
              <div style={s('aspect-ratio:3/4;background:#E7E5DA;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:22px')}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E36B54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{IG_ICON}</svg>
                <p style={s('margin:0;font-size:14px;color:#455459;font-weight:400;line-height:1.5')}>{t.igSeeMore}</p>
              </div>
              <div style={s('padding:16px 4px 20px;display:flex;flex-direction:column;gap:4px;flex:1')}>
                <p style={s('margin:0;font-size:14px;color:#26454F')}>@atelierdanique</p>
                <p style={s('margin:0;font-size:12px;color:#85949A;font-weight:300;letter-spacing:.04em')}>{t.igTitle}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
