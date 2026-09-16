import { useState } from 'react';
import { s } from '../../lib/css.js';

export default function Faq({ t, compact }) {
  const [faqOpen, setFaqOpen] = useState(null);
  const gridStyle = compact
    ? 'display:flex;flex-direction:column'
    : 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:clamp(32px,4vw,72px);align-items:start';

  return (
    <section id="faq" style={s('padding: clamp(48px,7vw,100px) clamp(24px,5vw,80px); background-color: #FFFEFB')}>
      <div data-reveal="" style={s('max-width:1100px;margin:0 auto')}>
        <div style={s('display:flex;flex-direction:column;gap:14px;margin-bottom:clamp(32px,4vw,52px);max-width:60ch')}>
          <p style={s('margin:0;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#E36B54')}>{t.faqEyebrow}</p>
          <h2 style={s("margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(32px,3.8vw,52px);line-height:1.05;letter-spacing:-.02em")}>{t.faqTitle}</h2>
        </div>
        <div style={s(gridStyle)}>
          {(t.faq || []).map((f, i) => {
            const open = faqOpen === i;
            const iconStyle = 'font-family:"Jost",sans-serif;font-size:22px;font-weight:300;line-height:1;color:#E36B54;flex-shrink:0;transition:transform .3s cubic-bezier(.22,.61,.36,1);transform:rotate(' + (open ? '135deg' : '0deg') + ')';
            const answerStyle = 'overflow:hidden;transition:max-height .4s cubic-bezier(.22,.61,.36,1),opacity .3s ease;max-height:' + (open ? '340px' : '0px') + ';opacity:' + (open ? 1 : 0);
            return (
              <div key={i} style={s('border-top:1px solid #E6E2D9;border-bottom:1px solid #E6E2D9;margin-top:-1px')}>
                <button type="button" aria-expanded={open} onClick={() => setFaqOpen(open ? null : i)} className="h-color-coral" style={s('width:100%;background:none;border:0;padding:20px 0;display:flex;align-items:center;justify-content:space-between;gap:20px;cursor:pointer;text-align:left')}>
                  <span style={s("font-family:'Cardo',serif;font-size:clamp(18px,1.6vw,21px);line-height:1.3;color:inherit")}>{f.q}</span>
                  <span style={s(iconStyle)}>+</span>
                </button>
                <div style={s(answerStyle)}>
                  <p style={s('margin:0 0 20px;max-width:70ch;font-size:15px;line-height:1.75;color:#5E6C71;font-weight:300;text-wrap:pretty')}>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
