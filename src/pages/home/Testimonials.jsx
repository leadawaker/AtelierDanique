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
  const base = 'position:relative;display:grid;grid-template-columns:minmax(0,1fr);overflow:hidden;border-radius:6px;cursor:pointer;';
  if (compact) return base + 'flex:0 0 86%;scroll-snap-align:center';
  const perRow = count === 4 ? 4 : 3;
  return base + 'min-width:0;flex:0 0 calc((100% - ' + (perRow - 1) + ' * var(--tg)) / ' + perRow + ')';
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
          <p style={s('margin:0 0 10px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#E36B54')}>{t.testEyebrow}</p>
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
  const veilStyle = 'position:absolute;inset:0;pointer-events:none;background:rgba(20,38,44,.72);transition:opacity .5s ease;opacity:' + (hovered ? 0 : 1);
  const captionStyle = 'grid-area:1/1;align-self:start;position:relative;z-index:1;padding:' + (compact ? '16px' : 'clamp(20px,2.2vw,28px)') + ';display:flex;flex-direction:column;gap:' + (compact ? '9px' : '12px') + ';transition:opacity .5s ease;opacity:' + (hovered ? 0 : 1);
  const textStyle = compact
    ? "margin:0;font-family:'Newsreader',serif;font-size:14px;line-height:1.5;color:#FCFAF6;font-weight:600;text-wrap:pretty"
    : "margin:0;font-family:'Newsreader',serif;font-size:15.5px;line-height:1.65;color:#FCFAF6;font-weight:600;text-wrap:pretty";

  return (
    <div onClick={onToggle} onMouseEnter={onEnter} onMouseLeave={onLeave} style={s(style)}>
      <div style={s('position:absolute;inset:0')}>
        <Slot slotId={item.slotId} placeholder="Photo of the client or their piece" />
      </div>
      <div style={s(veilStyle)}></div>
      <div aria-hidden="true" style={s('grid-area:1/1;width:100%;aspect-ratio:4/5')}></div>
      <figcaption style={s(captionStyle)}>
        <span style={s("font-family:'Cardo',serif;font-size:66px;line-height:.5;color:#EAC66B")}>“</span>
        {item.lines.filter(Boolean).map((line, j) => (
          <p key={j} style={s(textStyle)}>{line}</p>
        ))}
        <div style={s('display:flex;align-items:center;gap:11px;margin-top:4px')}>
          {avatar ? (
            <div role="img" aria-label={item.name} style={s('position:relative;width:38px;height:38px;border-radius:50%;flex-shrink:0;border:1px solid rgba(252,250,246,.5);overflow:hidden')}>
              <Slot slotId={item.avatarSlotId} src={item.avatar || undefined} radius="50%" />
            </div>
          ) : null}
          <span style={s('display:flex;flex-direction:column;gap:2px')}>
            {item.name ? <span style={s('font-size:13.5px;color:#FCFAF6;letter-spacing:.02em')}>{item.name}</span> : null}
            {item.from ? <span style={s('font-size:12px;color:#EAC66B;letter-spacing:.04em')}>{item.from}</span> : null}
          </span>
        </div>
      </figcaption>
    </div>
  );
}
