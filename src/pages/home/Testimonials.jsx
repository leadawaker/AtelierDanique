import { useState } from 'react';
import { s } from '../../lib/css.js';
import { usePhoto } from '../../lib/photos.js';
import { buildTestimonials } from '../../lib/testimonials.js';
import Slot from '../../components/Slot.jsx';

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
    <section id="testimonials" style={s('padding: clamp(48px,7vw,100px) clamp(24px,5vw,80px); background-color: #FCFAF6')}>
      <div data-reveal="" style={s('max-width:1400px;margin:0 auto')}>
        <div style={s('margin-bottom:clamp(28px,4vw,52px)')}>
          <p style={s('display:flex;align-items:center;gap:18px;margin:0 0 10px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#E36B54')}>{t.testEyebrow}<span aria-hidden="true" style={s('width:56px;height:1px;background:rgba(227,107,84,.55)')}></span></p>
          <h2 style={s("margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(32px,3.8vw,52px);line-height:1.05;letter-spacing:-.02em")}>{t.testTitle}</h2>
        </div>
        <div data-noscrollbar="" style={s(gridStyle(compact))}>
          {items.map((item, i) => (
            <Card
              key={item.slotId}
              item={item}
              compact={compact}
              style={cardStyle(compact, items.length)}
              hovered={hoverT === i || bareT === i}
              onToggle={() => setBareT(bareT === i ? null : i)}
              onEnter={() => setHoverT(i)}
              onLeave={() => setHoverT(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ item, compact, style, hovered, onToggle, onEnter, onLeave }) {
  const avatar = usePhoto(item.avatarSlotId, item.avatar || undefined);
  const textStyle = "margin:0;font-family:'Newsreader',serif;font-weight:400;color:#26454F;text-wrap:pretty;font-size:" + (compact ? '14.5px;line-height:1.55' : '15.5px;line-height:1.6');
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
        <Slot slotId={item.slotId} placeholder="Photo of the client or their piece" />
      </div>
      <div className="tm-gap" aria-hidden="true"></div>
      <figcaption className="tm-panel">
        <span aria-hidden="true" style={s("font-family:'Cardo',serif;font-size:56px;line-height:.55;height:22px;color:#C69B4A")}>“</span>
        {item.lines.filter(Boolean).map((line, j) => (
          <p key={j} style={s(textStyle)}>{line}</p>
        ))}
        <div style={s('display:flex;align-items:center;gap:12px;margin-top:auto;padding-top:10px')}>
          {avatar ? (
            <div className="tm-avatar" role="img" aria-label={item.name}>
              <Slot slotId={item.avatarSlotId} src={item.avatar || undefined} radius="50%" />
            </div>
          ) : null}
          <span style={s('display:flex;flex-direction:column;gap:2px;min-width:0')}>
            {item.name ? <span style={s('font-size:14px;color:#26454F;letter-spacing:.02em')}>{item.name}</span> : null}
            {item.from ? <span style={s('font-size:12.5px;color:#6E7440;letter-spacing:.03em;overflow-wrap:anywhere')}>{item.from}</span> : null}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}
