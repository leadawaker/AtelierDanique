import { useEffect, useState } from 'react';
import { s } from '../../lib/css.js';
import Slot from '../../components/Slot.jsx';

// FAQ, which also holds the old "Get expert advice" section. The questions are
// stacked in one column with the photo beside them (below them on small
// screens), always visible and faded into the teal from the left. "Not sure
// which photo?" is the first question; links to #which-photo land on it and
// open it.

const PHOTO = '/uploads/Project (20260915085353).jpg';
const PHOTO_ID = 'which-photo';
const TITLE = "margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(32px,3.8vw,52px);line-height:1.05;letter-spacing:-.02em;color:#FCFAF6";
// Dark on the text side, clear on the far side, so the photo reads as part of
// the section. On small screens the photo sits below the questions and fades
// in from the top instead.
const FADE_SIDE = 'position:absolute;inset:0;background:linear-gradient(to right,#1F3C46 0%,rgba(31,60,70,.65) 28%,rgba(31,60,70,0) 68%);pointer-events:none';
const FADE_TOP = 'position:absolute;inset:0;background:linear-gradient(to bottom,#1F3C46 0%,rgba(31,60,70,.55) 30%,rgba(31,60,70,0) 70%);pointer-events:none';
const ANSWER = 'margin:0;max-width:70ch;font-size:15px;line-height:1.75;color:#CBD8D6;font-weight:300;text-wrap:pretty';

function Checklist({ items }) {
  return (
    <ul style={s('margin:0;padding:0;list-style:none;display:grid;gap:10px')}>
      {(items || []).map((c, i) => (
        <li key={i} style={s('display:flex;gap:12px;align-items:baseline;font-size:15px;color:#CBD8D6;font-weight:300')}>
          <span style={s('color:#EAC66B')}>✓</span><span>{c}</span>
        </li>
      ))}
    </ul>
  );
}

// Open the photo question when the page is opened or navigated to #which-photo.
function useOpenOnHash(setOpen) {
  useEffect(() => {
    const check = () => { if (window.location.hash === '#' + PHOTO_ID) setOpen(0); };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, [setOpen]);
}

export default function Faq({ t, compact }) {
  const [faqOpen, setFaqOpen] = useState(null);
  useOpenOnHash(setFaqOpen);

  const items = [
    { id: PHOTO_ID, q: t.faqPhotoQ, a: <div style={s('display:flex;flex-direction:column;gap:16px')}><p style={s(ANSWER)}>{t.faqPhotoA}</p><Checklist items={t.checklist} /></div> },
    ...(t.faq || []).map((f) => ({ q: f.q, a: <p style={s(ANSWER)}>{f.a}</p> })),
  ];
  const pad = 'padding:clamp(48px,7vw,100px) clamp(24px,5vw,72px)';

  return (
    <section id="faq" style={s('position:relative;overflow:hidden;background:#1F3C46')}>
      <div style={s('display:grid;align-items:stretch;grid-template-columns:' + (compact ? 'minmax(0,1fr)' : 'minmax(0,1.1fr) minmax(0,1fr)'))}>
        <div data-reveal="" style={s(pad + ';display:flex;flex-direction:column')}>
          <div style={s('display:flex;flex-direction:column;gap:18px;margin-bottom:clamp(28px,3.5vw,44px);max-width:60ch')}>
            <p style={s('margin:0;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#EAC66B')}>{t.faqEyebrow}</p>
            <h2 style={s(TITLE)}>{t.faqTitle}</h2>
          </div>
          <div style={s('display:flex;flex-direction:column')}>
            {items.map((f, i) => {
              const open = faqOpen === i;
              const iconStyle = 'font-family:"Jost",sans-serif;font-size:22px;font-weight:300;line-height:1;color:#EAC66B;flex-shrink:0;transition:transform .3s cubic-bezier(.22,.61,.36,1);transform:rotate(' + (open ? '135deg' : '0deg') + ')';
              const answerStyle = 'overflow:hidden;transition:max-height .4s cubic-bezier(.22,.61,.36,1),opacity .3s ease;max-height:' + (open ? '700px' : '0px') + ';opacity:' + (open ? 1 : 0);
              return (
                <div key={i} id={f.id} style={s('border-top:1px solid rgba(203,216,214,.22);border-bottom:1px solid rgba(203,216,214,.22);margin-top:-1px;scroll-margin-top:90px')}>
                  <button type="button" aria-expanded={open} onClick={() => setFaqOpen(open ? null : i)} className="h-color-coral" style={s('width:100%;background:none;border:0;padding:20px 0;display:flex;align-items:center;justify-content:space-between;gap:20px;cursor:pointer;text-align:left;color:#FCFAF6')}>
                    <span style={s("font-family:'Cardo',serif;font-size:clamp(18px,1.6vw,21px);line-height:1.3;color:inherit")}>{f.q}</span>
                    <span style={s(iconStyle)}>+</span>
                  </button>
                  <div style={s(answerStyle)}>
                    <div style={s('padding-bottom:20px')}>{f.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={s('position:relative;min-height:' + (compact ? 'min(70vw,380px)' : 'min(60vh,520px)'))}>
          <Slot slotId="ad-which-photo" src={PHOTO} placeholder="Photo beside the FAQ" />
          <div style={s(compact ? FADE_TOP : FADE_SIDE)}></div>
        </div>
      </div>
    </section>
  );
}
