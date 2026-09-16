import { s } from '../../lib/css.js';
import Slot from '../../components/Slot.jsx';

const PHOTO = '/uploads/Project (20260915085353).jpg';
const TITLE = "margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(32px,3.8vw,52px);line-height:1.05;letter-spacing:-.02em;color:#FCFAF6";

function Checklist({ items, color }) {
  return (
    <ul style={s('margin:6px 0 0;padding:0;list-style:none;display:grid;gap:12px')}>
      {(items || []).map((c, i) => (
        <li key={i} style={s('display:flex;gap:12px;align-items:baseline;font-size:15px;color:' + color + ';font-weight:300')}>
          <span style={s('color:#EAC66B')}>✓</span><span>{c}</span>
        </li>
      ))}
    </ul>
  );
}

export default function WhichPhoto({ t, compact, links }) {
  return (
    <section id="which-photo" style={s('background:#F1EFE8')}>
      {compact ? (
        <div style={s('position:relative;min-height:min(70vh,560px);display:flex;align-items:center')}>
          <div style={s('position:absolute;inset:0')}>
            <Slot slotId="ad-which-photo" src={PHOTO} placeholder="Photo for the advice section" />
          </div>
          <div style={s('position:absolute;inset:0;background:rgba(20,38,44,.66)')}></div>
          <div data-reveal="" style={s('position:relative;z-index:1;padding:clamp(40px,10vw,64px) clamp(24px,6vw,40px);display:flex;flex-direction:column;gap:22px')}>
            <p style={s('margin:0;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#EAC66B')}>{t.whichEyebrow}</p>
            <h2 style={s(TITLE)}>{t.whichTitle}</h2>
            <p style={s('margin:0;max-width:48ch;font-size:16px;line-height:1.8;color:#E4EDEA;font-weight:300;text-wrap:pretty')}>{t.whichBody}</p>
            <Checklist items={t.checklist} color="#E4EDEA" />
          </div>
        </div>
      ) : (
        <div style={s('display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));align-items:stretch;background:#1F3C46')}>
          <div data-reveal="" style={s('padding:clamp(40px,6vw,88px) clamp(24px,5vw,72px);display:flex;flex-direction:column;gap:22px;justify-content:center')}>
            <h2 style={s(TITLE)}>{t.whichTitle}</h2>
            <p style={s('margin:0;max-width:48ch;font-size:16px;line-height:1.8;color:#CBD8D6;font-weight:300;text-wrap:pretty')}>{t.whichBody}</p>
            <Checklist items={t.checklist} color="#CBD8D6" />
            <a href={links.whatsappUrl} target="_blank" rel="noopener" className="h-bg-coral-light" style={s('align-self:flex-start;margin-top:10px;display:flex;align-items:center;gap:10px;background:#E36B54;color:#FCFAF6;padding:16px 28px;font-size:15px;border-radius:2px;transition:background .25s')}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.03c-.24.68-1.42 1.3-1.96 1.35-.54.05-1.05.24-3.53-.74-2.99-1.18-4.86-4.3-5.01-4.5-.15-.2-1.18-1.57-1.18-3s.74-2.13 1.01-2.42c.27-.29.58-.37.78-.37s.39 0 .56.01c.18.01.42-.07.66.5.24.58.83 2.01.9 2.16.07.15.12.32.02.51-.1.2-.15.32-.29.49s-.31.39-.44.52c-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.29.15.46.12.63-.07.17-.2.73-.85.93-1.14.2-.29.39-.24.66-.15.27.1 1.7.8 1.99.95.29.15.49.22.56.34.07.12.07.71-.17 1.39z"></path></svg>
              <span>{t.whichCta}</span>
            </a>
          </div>
          <div style={s('position:relative;min-height:min(60vh,520px)')}>
            <Slot slotId="ad-which-photo" src={PHOTO} placeholder="Photo for the advice section" />
            <div style={s('position:absolute;inset:0;background:linear-gradient(to right,#1F3C46 0%,rgba(31,60,70,.65) 28%,rgba(31,60,70,0) 68%);pointer-events:none')}></div>
          </div>
        </div>
      )}
    </section>
  );
}
