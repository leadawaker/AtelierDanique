import { s } from '../../lib/css.js';
import Slot from '../../components/Slot.jsx';
import { pathFor } from '../../lib/routes.js';

export default function Contact({ t, lang }) {
  return (
    <section id="contact" style={s('position:relative;background:#26454F;color:#F1F4F2;overflow:hidden')}>
      <div style={s('display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));align-items:stretch')}>
        <div style={s('position:relative;min-height:min(66vh,600px)')}>
          <Slot slotId="ad-about-portrait" src="/uploads/danique.jpg" placeholder="Photo of Danique" />
        </div>
        <div data-reveal="" style={s('padding:clamp(40px,6vw,92px) clamp(24px,5vw,76px);display:flex;flex-direction:column;gap:24px;justify-content:center')}>
          <p style={s('margin:0;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#EAC66B')}>{t.ctaEyebrow}</p>
          <h2 style={s("margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(34px,4.2vw,58px);line-height:1.03;letter-spacing:-.02em")}>{t.ctaTitle}</h2>
          <p style={s('margin:0;max-width:44ch;font-size:16px;line-height:1.8;color:#CBD8D6;font-weight:300;text-wrap:pretty')}>{t.ctaBody1}<br />{t.ctaBody2}</p>
          <a href={pathFor(lang, 'commission')} className="h-bg-coral-light" style={s('align-self:flex-start;background:#E36B54;color:#FCFAF6;padding:17px 32px;font-size:15px;border-radius:2px;transition:background .25s')}>{t.ctaSend}{'  '}→</a>
          <div style={s('display:flex;gap:26px;flex-wrap:wrap;font-size:13px')}>
            <a href="#which-photo" className="h-color-light" style={s('color:#BCCCCA;border-bottom:1px solid #456871;padding-bottom:3px')}>{t.ctaNotSure} →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
