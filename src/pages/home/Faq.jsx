import { useEffect, useState } from 'react';
import { s } from '../../lib/css.js';
import Slot from '../../components/Slot.jsx';

// FAQ, which also holds the old "Get expert advice" section: its photo sits
// behind everything under a dark teal wash, and "Not sure which photo?" is
// the first question. Links to #which-photo (Contact section) land on that
// question and open it.

const PHOTO = '/uploads/Project (20260915085353).jpg';
const PHOTO_ID = 'which-photo';
const TITLE = "margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(32px,3.8vw,52px);line-height:1.05;letter-spacing:-.02em;color:#FCFAF6";
const WASH = 'position:absolute;inset:0;background:linear-gradient(to bottom,rgba(20,38,44,.66) 0%,rgba(26,50,58,.86) 40%,rgba(31,60,70,.94) 100%)';
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

export default function Faq({ t, compact, links }) {
  const [faqOpen, setFaqOpen] = useState(null);
  useOpenOnHash(setFaqOpen);

  const items = [
    { id: PHOTO_ID, q: t.faqPhotoQ, a: <div style={s('display:flex;flex-direction:column;gap:16px')}><p style={s(ANSWER)}>{t.faqPhotoA}</p><Checklist items={t.checklist} /></div> },
    ...(t.faq || []).map((f) => ({ q: f.q, a: <p style={s(ANSWER)}>{f.a}</p> })),
  ];
  const gridStyle = compact
    ? 'display:flex;flex-direction:column'
    : 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:clamp(32px,4vw,72px);align-items:start';

  return (
    <section id="faq" style={s('position:relative;overflow:hidden;background:#1F3C46')}>
      <div style={s('position:absolute;inset:0')}>
        <Slot slotId="ad-which-photo" src={PHOTO} placeholder="Photo behind the FAQ" />
      </div>
      <div style={s(WASH)}></div>
      <div data-reveal="" style={s('position:relative;max-width:1100px;margin:0 auto;padding:clamp(48px,7vw,100px) clamp(24px,5vw,80px)')}>
        <div style={s('display:flex;flex-direction:column;gap:18px;margin-bottom:clamp(32px,4vw,52px);max-width:60ch')}>
          <p style={s('margin:0;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#EAC66B')}>{t.faqEyebrow}</p>
          <h2 style={s(TITLE)}>{t.faqTitle}</h2>
          <p style={s('margin:0;font-size:16px;line-height:1.8;color:#E4EDEA;font-weight:300;text-wrap:pretty')}>{t.faqIntro}</p>
          <a href={links.whatsappUrl} target="_blank" rel="noopener" className="h-bg-coral-light" style={s('align-self:flex-start;margin-top:6px;display:flex;align-items:center;gap:10px;background:#E36B54;color:#FCFAF6;padding:16px 28px;font-size:15px;border-radius:2px;transition:background .25s')}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.03c-.24.68-1.42 1.3-1.96 1.35-.54.05-1.05.24-3.53-.74-2.99-1.18-4.86-4.3-5.01-4.5-.15-.2-1.18-1.57-1.18-3s.74-2.13 1.01-2.42c.27-.29.58-.37.78-.37s.39 0 .56.01c.18.01.42-.07.66.5.24.58.83 2.01.9 2.16.07.15.12.32.02.51-.1.2-.15.32-.29.49s-.31.39-.44.52c-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.29.15.46.12.63-.07.17-.2.73-.85.93-1.14.2-.29.39-.24.66-.15.27.1 1.7.8 1.99.95.29.15.49.22.56.34.07.12.07.71-.17 1.39z"></path></svg>
            <span>{t.faqCta}</span>
          </a>
        </div>
        <div style={s(gridStyle)}>
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
    </section>
  );
}
