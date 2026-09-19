import { s } from '../../lib/css.js';

const LINK = 'color:#455459';

export default function Footer({ t, links }) {
  return (
    <footer style={s('background:#FCFAF6;padding:clamp(40px,5vw,72px) clamp(24px,5vw,80px) 40px')}>
      <div style={s('max-width:1400px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:clamp(20px,3vw,40px);align-items:start')}>
        <div style={s('display:flex;flex-direction:column;gap:12px')}>
          <p style={s("margin:0;font-family:'Satisfy',cursive;font-size:30px;line-height:1")}>Atelier Danique</p>
          <p style={s('margin:0;max-width:30ch;font-size:14px;color:#5E6C71;font-weight:300;line-height:1.7')}>{t.footTagline}</p>
          <p style={s('margin:0;font-size:14px;color:#85949A;font-weight:300;line-height:1.7')}>{t.footLocation}</p>
        </div>
        <nav style={s('display:grid;gap:10px;font-size:14px')}>
          <a href="#gallery" className="h-color-coral" style={s(LINK)}>{t.navGallery}</a>
          <a href="#process" className="h-color-coral" style={s(LINK)}>{t.navProcess}</a>
          <a href="#faq" className="h-color-coral" style={s(LINK)}>{t.navFaq}</a>
          <a href="/commission" className="h-color-coral" style={s(LINK)}>{t.ctaCommission}</a>
        </nav>
        <div style={s('display:grid;gap:10px;font-size:14px')}>
          <a href={links.instagramUrl} target="_blank" rel="noopener" className="h-color-coral" style={s(LINK)}>Instagram</a>
          <a href={links.whatsappUrl} target="_blank" rel="noopener" className="h-color-coral" style={s(LINK)}>WhatsApp {links.whatsappNumber}</a>
          <a href={'mailto:' + links.email} className="h-color-coral" style={s(LINK)}>{links.email}</a>
        </div>
        <div style={s('display:flex;align-items:flex-start;justify-content:flex-end')}>
          <img src="/uploads/signature-bold.svg" alt="Danique's signature" style={s('width: auto; height: 74px; opacity: .85')} />
        </div>
      </div>
      <p style={s('max-width:1400px;margin:clamp(32px,4vw,56px) auto 0;padding-top:20px;border-top:1px solid #DDD9CF;font-size:12px;color:#85949A;font-weight:300;letter-spacing:.04em')}>{t.footCopy}</p>
    </footer>
  );
}
