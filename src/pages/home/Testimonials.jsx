import { useEffect, useRef, useState } from 'react';
import { s } from '../../lib/css.js';
import { usePhoto } from '../../lib/photos.js';
import { buildTestimonials } from '../../lib/testimonials.js';
import Slot from '../../components/Slot.jsx';
import GoogleReviewsLink from './GoogleReviewsLink.jsx';

const GAP = 'clamp(18px,2vw,28px)';

// A horizontal swipe rail on every screen size; desktop adds arrows and mouse drag.
function railStyle(compact) {
  if (compact) return 'display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:6px';
  return 'display:flex;gap:' + GAP + ';overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;padding:4px 2px 24px;cursor:grab';
}

function cardStyle(compact) {
  if (compact) return 'flex:0 0 86%;scroll-snap-align:center';
  return 'min-width:0;flex:0 0 clamp(240px,20vw,280px);scroll-snap-align:start';
}

// Mouse/pen drag-to-scroll; a drag swallows the click that ends it.
function useDragScroll(ref, enabled) {
  useEffect(() => {
    const rail = ref.current;
    if (!rail || !enabled) return undefined;
    let down = false, startX = 0, startLeft = 0, moved = false;
    const onDown = (e) => {
      if (e.pointerType === 'touch') return;
      down = true; moved = false; startX = e.clientX; startLeft = rail.scrollLeft;
      rail.style.scrollSnapType = 'none';
    };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      rail.scrollLeft = startLeft - dx;
    };
    const end = () => { if (!down) return; down = false; rail.style.scrollSnapType = ''; };
    const onClick = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
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
  }, [ref, enabled]);
}

const ARROW = 'flex:0 0 auto;width:40px;height:40px;border-radius:50%;border:1px solid rgba(38,69,79,.22);background:transparent;color:#26454F;display:grid;place-items:center;cursor:pointer;transition:background .2s,color .2s,border-color .2s';

export default function Testimonials({ t, lang, compact, content }) {
  const [hoverT, setHoverT] = useState(null);
  const [bareT, setBareT] = useState(null);
  const railRef = useRef(null);
  const items = buildTestimonials(content, lang);
  useDragScroll(railRef, !compact && items.length > 0);
  if (!items.length) return null;

  const nudge = (dir) => {
    const rail = railRef.current;
    const card = rail && rail.firstElementChild;
    if (card) rail.scrollBy({ left: dir * (card.getBoundingClientRect().width + 24), behavior: 'smooth' });
  };

  return (
    <section id="testimonials" style={s('padding: clamp(48px,7vw,100px) clamp(24px,5vw,80px); background-color: #F1EFE8')}>
      <div data-reveal="" style={s('max-width:1400px;margin:0 auto')}>
        <div style={s('margin-bottom:clamp(28px,4vw,52px);display:flex;align-items:flex-end;justify-content:space-between;gap:24px')}>
          <div>
          <p style={s('display:flex;align-items:center;gap:18px;margin:0 0 10px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#E36B54')}>{t.testEyebrow}<span aria-hidden="true" style={s('width:56px;height:1px;background:rgba(227,107,84,.55)')}></span></p>
          <h2 style={s("margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(32px,3.8vw,52px);line-height:1.05;letter-spacing:-.02em")}>{t.testTitle}</h2>
          </div>
          {compact ? null : (
            <div style={s('display:flex;gap:12px')}>
              <button type="button" className="h-fill-coral" aria-label="Previous" onClick={() => nudge(-1)} style={s(ARROW)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.4" /></svg>
              </button>
              <button type="button" className="h-fill-coral" aria-label="Next" onClick={() => nudge(1)} style={s(ARROW)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.4" /></svg>
              </button>
            </div>
          )}
        </div>
        <div ref={railRef} data-noscrollbar="" style={s(railStyle(compact))}>
          {items.map((item, i) => (
            <Card
              t={t}
              key={item.slotId}
              item={item}
              style={cardStyle(compact)}
              hovered={hoverT === i || bareT === i}
              onToggle={() => setBareT(bareT === i ? null : i)}
              onEnter={() => setHoverT(i)}
              onLeave={() => setHoverT(null)}
            />
          ))}
        </div>
        <GoogleReviewsLink t={t} content={content} />
      </div>
    </section>
  );
}

function Card({ t, item, style, hovered, onToggle, onEnter, onLeave }) {
  const avatar = usePhoto(item.avatarSlotId, item.avatar || undefined);
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); }
  };

  return (
    <figure
      className="tm-card"
      data-open={hovered ? 'true' : 'false'}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={onKey}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={s(style)}
    >
      <div className="tm-art">
        <Slot slotId={item.slotId} placeholder="Photo of the client or their piece" alt={item.name ? t.tmPhotoAlt + ' ' + item.name : ''} />
      </div>
      <div className="tm-gap" aria-hidden="true"></div>
      <figcaption className="tm-panel">
        <span className="tm-mark" aria-hidden="true">“</span>
        {item.lines.filter(Boolean).map((line, j) => (
          <p key={j} className="tm-quote">{line}</p>
        ))}
        <div className="tm-by">
          {avatar ? (
            <div className="tm-avatar" role="img" aria-label={item.name}>
              <Slot slotId={item.avatarSlotId} src={item.avatar || undefined} radius="50%" />
            </div>
          ) : null}
          <span className="tm-who">
            {item.name ? <span className="tm-name">{item.name}</span> : null}
            {item.from ? <span className="tm-handle">{item.from}</span> : null}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}
