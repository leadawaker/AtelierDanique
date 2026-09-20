import { s } from '../../lib/css.js';
import Slot from '../../components/Slot.jsx';
import { heroSpots, sitePricing } from '../../lib/pricing.js';
import { HERO_PHONE_DEFAULT, HERO_PHONE_SLOT } from '../../lib/heroPhone.js';
import { HERO_VEIL } from './settings.js';

const BANNER_SRC = '/uploads/Project%20(20260915100023).jpg';
// Aim at the right side of the photo, so narrow (phone) frames show it.
const BANNER_FOCUS = { fx: 1, fy: 0.5 };
const TEXT_PAD = 'padding:clamp(56px,6vw,104px) clamp(24px,4vw,56px) clamp(52px,6vw,104px) clamp(24px,5vw,80px)';

// Cream veil over the banner photo, fading out left to right. Desktop only:
// on compact screens the phone background is used instead.
function veilStyle() {
  const { reach, softness } = HERO_VEIL;
  const op = HERO_VEIL.opacity / 100;
  const solid = Math.max(0, reach * (1 - softness / 100));
  const mid = solid + (reach - solid) * 0.45;
  return 'position:absolute;inset:0;background:linear-gradient(to right,'
    + 'rgba(252,250,246,' + op + ') 0%,'
    + 'rgba(252,250,246,' + op + ') ' + solid.toFixed(1) + '%,'
    + 'rgba(252,250,246,' + (op * 0.45).toFixed(3) + ') ' + mid.toFixed(1) + '%,'
    + 'rgba(252,250,246,0) ' + reach.toFixed(1) + '%)';
}

// Phones: the studio-chosen background behind the hero text, in place of cream.
function PhoneBackground() {
  return (
    <div style={s('position:absolute;inset:0')}>
      <Slot slotId={HERO_PHONE_SLOT} src={HERO_PHONE_DEFAULT} alt="" />
    </div>
  );
}

function HeroText({ t, compact, links, content }) {
  const spots = heroSpots(t, sitePricing(content));
  const igStyle = 'display:flex;align-items:center;gap:10px;border:1px solid #E36B54;color:#455459;padding:16px 26px;font-size:15px;border-radius:2px;transition:border-color .25s,color .25s,background .25s;'
    + (compact ? 'background:#FCFAF6' : 'background:transparent');
  return (
    <>
      <p style={s('margin:0;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#85949A')}>{t.heroEyebrow}</p>
      <h1 style={s("margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(44px,5.6vw,84px);line-height:1.02;letter-spacing:-.02em")}>
        {t.heroT1}<br />{t.heroT2}{' '}
        <em style={s('font-style:italic;color:#E36B54;text-decoration:underline;text-decoration-color:#EAC66B;text-decoration-thickness:2px;text-underline-offset:.06em')}>{t.heroT3}</em>
      </h1>
      <p style={s('margin:0;max-width:40ch;font-size:17px;line-height:1.75;color:#3B4C52;font-weight:300;text-wrap:pretty')}>{t.heroBody}</p>
      <div style={s('display:flex;flex-direction:column;gap:14px')}>
        {spots ? (
          <p style={s('margin:0;display:flex;align-items:center;gap:10px;font-size:14px;letter-spacing:.02em;color:#C0503B')}>
            <span aria-hidden="true" style={s('width:6px;height:6px;border-radius:50%;background:#E36B54;flex-shrink:0')}></span>
            {spots}
          </p>
        ) : null}
        <div style={s('display:flex;gap:14px;align-items:center;flex-wrap:wrap')}>
          <a href="/commission" className="h-bg-coral-dark" style={s('background:#E36B54;color:#FCFAF6;padding:17px 32px;font-size:15px;border-radius:2px;letter-spacing:.01em;transition:background .25s')}>{t.ctaCommission}{'  →'}</a>
          <a href={links.instagramUrl} target="_blank" rel="noopener" className="h-ig-outline" style={s(igStyle)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </>
  );
}

export default function Hero(props) {
  const { compact, content } = props;
  const split = content['ad-hero-layout'] === 'split';
  const slot = <Slot slotId="ad-hero-banner" src={BANNER_SRC} focus={BANNER_FOCUS} placeholder="Hero banner photo" alt="" />;

  if (!split) {
    return (
      <section style={s('position:relative;background:#F1EFE8;overflow:hidden')}>
        {compact ? <PhoneBackground /> : (
          <>
            <div style={s('position:absolute;inset:0')}>{slot}</div>
            <div style={s(veilStyle())}></div>
          </>
        )}
        <div data-reveal="" style={s('position:relative;max-width:1400px;margin:0 auto;min-height:min(72vh,640px);' + TEXT_PAD + ';display:flex;flex-direction:column;justify-content:center;gap:26px')}>
          <HeroText {...props} />
        </div>
      </section>
    );
  }

  // Split: text on cream on the left, photo on the right, no veil.
  // Compact stacks the text above a 4:3 photo.
  if (compact) {
    return (
      <section style={s('position:relative;background:#F1EFE8;overflow:hidden')}>
        <div style={s('position:relative')}>
          <PhoneBackground />
          <div data-reveal="" style={s('position:relative;' + TEXT_PAD + ';display:flex;flex-direction:column;justify-content:center;gap:26px')}>
            <HeroText {...props} />
          </div>
        </div>
        <div style={s('position:relative;width:100%;aspect-ratio:4/3')}>{slot}</div>
      </section>
    );
  }

  return (
    <section style={s('position:relative;background:#F1EFE8;overflow:hidden;display:grid;grid-template-columns:repeat(2,minmax(0,1fr))')}>
      <div data-reveal="" style={s('position:relative;min-width:0;min-height:min(72vh,640px);' + TEXT_PAD + ';display:flex;flex-direction:column;justify-content:center;gap:26px')}>
        <HeroText {...props} />
      </div>
      <div style={s('position:relative;min-width:0;min-height:min(72vh,640px)')}>{slot}</div>
    </section>
  );
}
