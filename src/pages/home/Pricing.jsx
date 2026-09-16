import { s } from '../../lib/css.js';
import Slot from '../../components/Slot.jsx';

const ICON = 'flex-shrink:0;margin-top:2px';
const svgProps = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: '#E36B54', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', style: s(ICON) };

const INCLUDED = [
  { key: 'inc1', icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.7-3.7a2 2 0 0 0-2.8 0L6 20" /></> },
  { key: 'inc2', icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /> },
  { key: 'inc3', icon: <><line x1="22" x2="2" y1="6" y2="6" /><line x1="22" x2="2" y1="18" y2="18" /><line x1="6" x2="6" y1="2" y2="22" /><line x1="18" x2="18" y1="2" y2="22" /></> },
  { key: 'inc4', icon: <><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></> },
  { key: 'inc5', icon: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" /></> },
  { key: 'inc6', icon: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 16 14" /></> },
  { key: 'inc7', icon: <><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M14 9h4l4 4v4a1 1 0 0 1-1 1h-1" /><circle cx="7.5" cy="18.5" r="2.5" /><circle cx="17.5" cy="18.5" r="2.5" /></> },
  { key: 'inc9', icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></> },
];

const PHOTO_BOX = 'position:relative;width:100%;aspect-ratio:3/4;margin-top:18px;border-radius:6px;overflow:hidden';
const PRICE = "margin: 0; font-family: 'Cardo',serif; font-size: clamp(38px,4vw,52px); line-height: 1; color: #C0503B";
const SIZE = 'margin: 0; font-size: 14px; letter-spacing: .18em; text-transform: uppercase; color: #85949A';
const MM = 'font-size: 13px; letter-spacing: normal; text-transform: none;';

export default function Pricing({ t }) {
  return (
    <section id="pricing" style={s('padding: clamp(48px,7vw,104px) clamp(24px,5vw,80px); background-color: #F1EFE8')}>
      <div data-reveal="" style={s('max-width:1400px;margin:0 auto')}>
        <div style={s('max-width:64ch;margin:0 auto clamp(36px,4.5vw,60px);text-align:center;display:flex;flex-direction:column;gap:16px;align-items:center')}>
          <h2 style={s("margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(32px,3.8vw,52px);line-height:1.05;letter-spacing:-.02em")}>{t.priceTitle}</h2>
        </div>
        <div style={s('display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(20px,2.6vw,36px);max-width:1000px;margin:0 auto clamp(32px,4vw,48px)')}>
          <div style={s('background: #FCFAF6; border: 1px solid #D3CFC4; border-radius: 6px; padding: clamp(24px,3vw,32px); display: flex; flex-direction: column; gap: 8px; text-align: center; color: #26454F00; border-color: #ECE7DE')}>
            <div style={s(PHOTO_BOX)}>
              <Slot slotId="ad-price-a5" src="/uploads/a5-sheet.jpg" placeholder="A5 paper photo" />
            </div>
            <p style={s(PRICE)}>€50</p>
            <p style={s(SIZE)}>{t.sizeLabelA5}{' '}<span style={s(MM)}>148 × 210 mm</span></p>
          </div>
          <div style={s('background: #FCFAF6; border: 1px solid #E36B54; border-radius: 6px; padding: clamp(24px,3vw,32px); display: flex; flex-direction: column; gap: 8px; text-align: center; position: relative; border-width: 1px')}>
            <div style={s(PHOTO_BOX)}>
              <Slot slotId="ad-price-a4" src="/uploads/a4-sheet.jpg" placeholder="A4 paper photo" />
            </div>
            <p style={s(PRICE)}>€75</p>
            <p style={s(SIZE)}>{t.sizeLabelA4}{' '}<span style={s(MM)}>210 × 297 mm</span></p>
          </div>
        </div>

        <div style={s('max-width:720px;margin:0 auto;border-top:1px solid #D3CFC4;padding-top:clamp(24px,3vw,36px)')}>
          <p style={s('margin:0 0 16px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#26454F;text-align:center')}>{t.included}</p>
          <div style={s('display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px 32px')}>
            {INCLUDED.map((inc) => (
              <div key={inc.key} style={s('display:flex;gap:12px;align-items:flex-start;font-size:15px;color:#455459;font-weight:300')}>
                <svg {...svgProps}>{inc.icon}</svg>
                <span>{t[inc.key]}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={s('display:flex;justify-content:center;margin-top:clamp(32px,4vw,48px)')}>
          <a href="/commission" className="h-bg-coral-dark" style={s('background:#E36B54;color:#FCFAF6;padding:17px 32px;font-size:15px;border-radius:2px;transition:background .25s')}>{t.ctaCommission}{'  '}→</a>
        </div>
      </div>
    </section>
  );
}
