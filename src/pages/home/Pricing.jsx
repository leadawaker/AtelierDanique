import { s } from '../../lib/css.js';
import Slot from '../../components/Slot.jsx';
import { currencyFor, formatMoney, launchActive, launchBanner, sitePricing } from '../../lib/pricing.js';

const ICON = 'flex-shrink:0;margin-top:2px';
const svgProps = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: '#E0A92E', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', style: s(ICON) };

const INCLUDED = [
  { key: 'inc1', icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.7-3.7a2 2 0 0 0-2.8 0L6 20" /></> },
  { key: 'inc2', icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /> },
  { key: 'inc3', icon: <><line x1="22" x2="2" y1="6" y2="6" /><line x1="22" x2="2" y1="18" y2="18" /><line x1="6" x2="6" y1="2" y2="22" /><line x1="18" x2="18" y1="2" y2="22" /></> },
  { key: 'inc4', icon: <><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></> },
  { key: 'inc5', icon: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" /></> },
  { key: 'inc6', icon: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 16 14" /></> },
  { key: 'inc7', icon: <><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M14 9h4l4 4v4a1 1 0 0 1-1 1h-1" /><circle cx="7.5" cy="18.5" r="2.5" /><circle cx="17.5" cy="18.5" r="2.5" /></> },
  { key: 'inc10', icon: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></> },
  { key: 'inc9', icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></> },
];

const CORAL = '#C0503B';
const LINE = '#E3BFB1';
const PHOTO_BOX = 'position:relative;width:100%;aspect-ratio:3/4;border-radius:6px;overflow:hidden';
const PRICE = "margin:0;font-family:'Cardo',serif;font-size:clamp(38px,4vw,52px);line-height:1;color:" + CORAL;
const CAPS = 'margin:0;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:' + CORAL;
const STROKE = { fill: 'none', stroke: CORAL, strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', style: s('flex-shrink:0') };

function LeafIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" {...STROKE}>
      <path d="M12 22V9" />
      <path d="M12 16c-4 0-6-2.4-6.5-5.5C9 10.5 11.5 12.5 12 16Z" />
      <path d="M12 12.5c0-3.6 2-5.6 6-6 .5 3.6-2 6-6 6Z" />
      <path d="M12 9c0-2.6.9-4.6 2.2-6.2C15.6 4.4 16 6.6 15 8.5c-.8 1-1.8 1.5-3 .5Z" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" {...STROKE}>
      <circle cx="12" cy="7.5" r="2.3" />
      <circle cx="5.8" cy="9.5" r="1.8" />
      <circle cx="18.2" cy="9.5" r="1.8" />
      <path d="M8.2 19.5v-2.3a3.8 3.8 0 0 1 7.6 0v2.3" />
      <path d="M2.5 18.5v-1.7a3 3 0 0 1 3.4-3" />
      <path d="M21.5 18.5v-1.7a3 3 0 0 0-3.4-3" />
    </svg>
  );
}

// Warm banner above the cards: what the launch pricing is, and how many
// spots are left. Its text comes from the studio (Pricing tab, per language).
function LaunchBanner({ banner, compact }) {
  const rule = compact ? 'height:1px;width:100%;background:' + LINE : 'width:1px;align-self:stretch;background:' + LINE;
  return (
    <div style={s('max-width:1000px;margin:0 auto clamp(24px,3vw,36px);background:#F7E5DD;border-radius:20px;padding:clamp(20px,2.4vw,28px) clamp(20px,3vw,40px);display:flex;align-items:center;gap:clamp(18px,2.6vw,36px);' + (compact ? 'flex-direction:column;align-items:flex-start' : ''))}>
      <div style={s('display:flex;align-items:center;gap:clamp(16px,2.4vw,32px);flex:1;min-width:0')}>
        {compact ? null : <><LeafIcon /><span style={s('width:1px;align-self:stretch;background:' + LINE)}></span></>}
        <div style={s('display:flex;flex-direction:column;gap:6px')}>
          <p style={s(CAPS)}>{banner.title}</p>
          <div style={s('display:flex;flex-direction:column;gap:2px')}>
            {banner.lines.map((line, i) => (
              <p key={i} style={s('margin:0;font-size:15px;line-height:1.6;color:#455459;font-weight:300;text-wrap:pretty')}>{line}</p>
            ))}
          </div>
        </div>
      </div>
      <span style={s(rule)}></span>
      <div style={s('display:flex;align-items:center;gap:14px;flex-shrink:0')}>
        <PeopleIcon />
        <div style={s('display:flex;flex-direction:column;gap:3px')}>
          <p style={s(CAPS + ';font-size:clamp(18px,1.8vw,22px);letter-spacing:.14em;white-space:nowrap')}>{banner.count}</p>
          <p style={s('margin:0;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#5E6C71')}>{banner.countLabel}</p>
        </div>
      </div>
    </div>
  );
}

function PriceCard({ slotId, src, placeholder, size, dims, desc, price, label, badge }) {
  return (
    <div style={s('background:#FFFFFF;border:1px solid ' + (badge ? '#E36B54' : '#EAE4DA') + ';border-radius:10px;box-shadow:0 10px 30px rgba(38,69,79,.08);padding:clamp(24px,3vw,32px);display:flex;flex-direction:column;align-items:center;text-align:center;position:relative')}>
      {badge ? (
        <span style={s('position:absolute;top:0;left:50%;transform:translate(-50%,-50%);background:' + CORAL + ';color:#FCFAF6;padding:7px 18px;border-radius:999px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap')}>{badge}</span>
      ) : null}
      <div style={s(PHOTO_BOX)}>
        <Slot slotId={slotId} src={src} placeholder={placeholder} />
      </div>
      <h3 style={s("margin:22px 0 0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(30px,3vw,36px);line-height:1;color:#26454F")}>{size}</h3>
      <p style={s('margin:10px 0 0;font-size:13px;letter-spacing:.14em;color:#5E6C71')}>{dims}</p>
      <p style={s("flex:1 1 auto;margin:14px 0 0;max-width:30ch;font-family:'Cardo',serif;font-size:17px;line-height:1.5;color:#5E6C71;text-wrap:balance")}>{desc}</p>
      <p style={s(PRICE + ';margin-top:22px')}>{price}</p>
      {label ? <p style={s(CAPS + ';margin-top:8px')}>{label}</p> : null}
    </div>
  );
}

export default function Pricing({ t, lang, content, compact }) {
  const pricing = sitePricing(content);
  const currency = currencyFor(lang);
  const banner = launchBanner(t, pricing, lang);
  const label = launchActive(pricing) ? t.priceLabel : '';

  return (
    <section id="pricing" style={s('padding: clamp(48px,7vw,104px) clamp(24px,5vw,80px); background-color: #FCFAF6')}>
      <div data-reveal="" style={s('max-width:1400px;margin:0 auto')}>
        <div style={s('margin:0 auto clamp(28px,3.6vw,44px);text-align:center;display:flex;flex-direction:column;gap:18px;align-items:center')}>
          <div style={s('display:flex;align-items:center;justify-content:center;gap:clamp(12px,2vw,24px)')}>
            <span style={s('height:1px;width:clamp(28px,7vw,88px);background:#D3CFC4')}></span>
            <p style={s('margin:0;font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#85949A')}>{t.priceTitle}</p>
            <span style={s('height:1px;width:clamp(28px,7vw,88px);background:#D3CFC4')}></span>
          </div>
          <h2 style={s("margin:0;max-width:22ch;font-family:'Cardo',serif;font-weight:400;font-size:clamp(32px,3.8vw,52px);line-height:1.08;letter-spacing:-.02em;text-wrap:balance")}>{t.priceHeadline}</h2>
        </div>

        {banner ? <LaunchBanner banner={banner} compact={compact} /> : null}

        <div style={s('display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(24px,2.6vw,36px);max-width:1000px;margin:0 auto clamp(32px,4vw,48px)')}>
          <PriceCard slotId="ad-price-a5" src="/uploads/a5-sheet.jpg" placeholder="A5 paper photo"
            size="A5" dims="148 × 210 mm" desc={t.priceDescA5} price={formatMoney(pricing.a5[currency], currency)} label={label} />
          <PriceCard slotId="ad-price-a4" src="/uploads/a4-sheet.jpg" placeholder="A4 paper photo"
            size="A4" dims="210 × 297 mm" desc={t.priceDescA4} price={formatMoney(pricing.a4[currency], currency)} label={label} badge={t.popularLabel} />
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
          <a href="/commission" className="h-bg-coral-dark" style={s('background:#E36B54;color:#FCFAF6;padding:17px 32px;font-size:15px;border-radius:2px;transition:background .25s')}>{t.ctaCommission}{'  '}→</a>
        </div>
      </div>
    </section>
  );
}
