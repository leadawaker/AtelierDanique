import { useState } from 'react';
import { s } from '../../lib/css.js';
import { normalizePhoto, usePhoto } from '../../lib/photos.js';
import { PAINTING_FRAMES, buildTestimonials } from '../../lib/testimonials.js';
import Slot from '../../components/Slot.jsx';
import GoogleReviewsLink from './GoogleReviewsLink.jsx';

const GAP = 'clamp(18px,2vw,28px)';

// Desktop layout adapts to the count: up to 4 cards share one centred row;
// 5 or 6 use rows of three with the short last row centred.
function gridStyle(compact) {
  if (compact) return 'display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:6px';
  return '--tg:' + GAP + ';display:flex;flex-wrap:wrap;justify-content:center;gap:var(--tg);max-width:1400px;margin:0 auto';
}

function cardStyle(compact, count) {
  if (compact) return 'flex:0 0 86%;scroll-snap-align:center';
  const perRow = count === 4 ? 4 : 3;
  return 'min-width:0;flex:0 0 calc((100% - ' + (perRow - 1) + ' * var(--tg)) / ' + perRow + ')';
}

export default function Testimonials({ t, lang, compact, content }) {
  const [hoverT, setHoverT] = useState(null);
  const [bareT, setBareT] = useState(null);
  const items = buildTestimonials(content, lang);
  if (!items.length) return null;

  return (
    <section id="testimonials" style={s('padding: clamp(48px,7vw,100px) clamp(24px,5vw,80px); background-color: #F1EFE8')}>
      <div data-reveal="" style={s('max-width:1400px;margin:0 auto')}>
        <div style={s('margin-bottom:clamp(28px,4vw,52px)')}>
          <p style={s('display:flex;align-items:center;gap:18px;margin:0 0 10px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#E36B54')}>{t.testEyebrow}<span aria-hidden="true" style={s('width:56px;height:1px;background:rgba(227,107,84,.55)')}></span></p>
          <h2 style={s("margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(32px,3.8vw,52px);line-height:1.05;letter-spacing:-.02em")}>{t.testTitle}</h2>
        </div>
        <div data-noscrollbar="" style={s(gridStyle(compact))}>
          {items.map((item, i) => (
            <Card
              t={t}
              key={item.slotId}
              item={item}
              style={cardStyle(compact, items.length)}
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
  const painting = usePhoto(item.slotId);
  const frame = PAINTING_FRAMES[item.slotId];
  // Top-aligned so a wider frame cuts the bottom of the crop, never the top.
  const framed = painting && frame && painting.url.includes(frame.match)
    ? normalizePhoto({ url: painting.url, s: 1, fx: 0.5, fy: 0, crop: frame.crop })
    : undefined;
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
        <Slot slotId={item.slotId} photo={framed} placeholder="Photo of the client or their piece" alt={item.name ? t.tmPhotoAlt + ' ' + item.name : ''} />
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
