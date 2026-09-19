import { useEffect, useLayoutEffect, useState } from 'react';
import { s } from '../../lib/css.js';
import { pathFor } from '../../lib/routes.js';
import { LANGS } from '../../lib/strings.js';

const SECTION_IDS = ['gallery', 'meet', 'process', 'pricing', 'testimonials', 'faq'];
const PAD = 'clamp(24px,5vw,80px)';

// The header's call to action: always the last button, filled coral.
const COMMISSION_BTN = 'background:transparent;color:#E36B54;border:1px solid #E36B54;border-radius:2px;padding:8px 15px;font-size:12.5px;letter-spacing:.04em;line-height:1;white-space:nowrap;transition:background .25s,color .25s';

const navStyleFor = (active, id) => s(active === id
  ? 'color:#26454F;border-bottom:1px solid #E36B54;padding-bottom:2px'
  : 'color:#455459;transition:color .2s;border-bottom:1px solid transparent;padding-bottom:2px');

// Scroll spy: the last section whose top has passed 150px below the viewport top.
function useActiveSection() {
  const [active, setActive] = useState('top');
  useEffect(() => {
    const update = () => {
      const y = window.scrollY + 150;
      let current = 'top';
      SECTION_IDS.forEach((id) => { const el = document.getElementById(id); if (el && el.offsetTop <= y) current = id; });
      setActive(current);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);
  return active;
}

// The header has one more button than the design planned for, so it switches
// to the menu layout a little earlier than the rest of the site (1000px).
const TIGHT_QUERY = '(max-width: 1100px)';
// Starts as desktop (not tight) so the server HTML and the first client
// render match, then corrects itself before the first paint.
function useTight() {
  const [tight, setTight] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia(TIGHT_QUERY);
    const on = () => setTight(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return tight;
}

// On other pages (the studio at /login) pass base="/" so the links go back
// to the home page sections instead of jumping within the current page.
export default function Header({ t, lang, setLang, compact: siteCompact, base = '' }) {
  const tight = useTight();
  const compact = siteCompact || tight;
  const spied = useActiveSection();
  const active = base ? null : spied;
  const [menuOpen, setMenuOpen] = useState(false);

  // Leaving the compact layout closes the menu.
  useEffect(() => { if (!compact) setMenuOpen(false); }, [compact]);

  const navLinks = [
    { id: 'top', href: base + '#top', label: t.navHome },
    { id: 'gallery', href: base + '#gallery', label: t.navGallery },
    { id: 'meet', href: base + '#meet', label: t.navAbout },
    { id: 'process', href: base + '#process', label: t.navProcess },
    { id: 'pricing', href: base + '#pricing', label: t.navPricing },
    { id: 'testimonials', href: base + '#testimonials', label: t.navTestimonials },
    { id: 'faq', href: base + '#faq', label: t.navFaq },
  ];

  const navStyle = compact
    ? 'display:none'
    : 'margin-left:auto;display:flex;align-items:center;gap:clamp(14px,1.6vw,28px);font-size:13.5px;font-weight:400;letter-spacing:.02em;flex-wrap:nowrap;white-space:nowrap';

  return (
    <header style={s('position:sticky;top:0;z-index:40;background:rgba(252,250,246,.94);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid #DDD9CF;padding:9px ' + PAD)}>
      <div style={s('display:flex;align-items:center;gap:clamp(16px,2.2vw,40px);flex-wrap:nowrap')}>
        <a href={base + '#top'} style={s("font-family:'Satisfy',cursive;font-size:24px;color:#26454F;line-height:1;letter-spacing:.5px;white-space:nowrap")}>Atelier Danique</a>
        <nav style={s(navStyle)} data-nav="">
          {navLinks.map((l) => (
            <a key={l.id} href={l.href} className="h-color-teal" style={navStyleFor(active, l.id)}>{l.label}</a>
          ))}
          <a href={pathFor(lang, 'commission')} className="h-fill-coral" style={s(COMMISSION_BTN)}>{t.ctaCommission}</a>
        </nav>
        <div style={s('margin-left:auto;display:flex;align-items:center;gap:14px;flex-shrink:0')}>
          <div role="group" aria-label="Language" style={s('display:flex;align-items:center;gap:2px')}>
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                aria-label={l.name}
                aria-pressed={l.id === lang}
                style={s('background:none;border:0;cursor:pointer;letter-spacing:.08em;line-height:1;border-radius:2px;transition:color .2s,background .2s;'
                  + (compact ? 'padding:14px 9px;font-size:13px;' : 'padding:6px 7px;font-size:11.5px;')
                  + (l.id === lang ? 'color:#E36B54;background:#F7D8CF' : 'color:#85949A'))}
              >{l.code}</button>
            ))}
          </div>
          {compact ? (
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              className="h-border-coral"
              style={s('background:none;border:1px solid #D3CFC4;padding:0;width:44px;height:44px;border-radius:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;color:#26454F;flex-shrink:0')}
            >{menuOpen ? '×' : '≡'}</button>
          ) : null}
        </div>
      </div>
      {menuOpen ? (
        <nav style={s('margin:10px calc(-1 * ' + PAD + ') -9px;border-top:1px solid #DDD9CF;border-bottom:1px solid #DDD9CF;background:#FCFAF6;padding:6px ' + PAD + ' 18px;display:grid;gap:0;font-size:16px')}>
          {navLinks.map((l) => (
            <a
              key={l.id}
              href={l.href}
              target="_self"
              rel="noopener"
              onClick={() => setMenuOpen(false)}
              className="h-color-coral"
              style={s('color:#455459;padding:13px 0;border-bottom:1px solid #E6E2D9;transition:color .2s')}
            >{l.label}</a>
          ))}
          <a href={pathFor(lang, 'commission')} onClick={() => setMenuOpen(false)} className="h-fill-coral" style={s(COMMISSION_BTN + ';margin-top:16px;padding:15px 20px;text-align:center;font-size:15px')}>{t.ctaCommission}</a>
        </nav>
      ) : null}
    </header>
  );
}
