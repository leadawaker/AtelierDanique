import { useEffect, useState } from 'react';
import { s } from '../../lib/css.js';
import { LANGS } from '../../lib/strings.js';

const SECTION_IDS = ['gallery', 'meet', 'process', 'pricing', 'testimonials', 'which-photo', 'contact'];
const PAD = 'clamp(24px,5vw,80px)';

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

export default function Header({ t, lang, setLang, compact }) {
  const active = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);

  // Leaving the compact layout closes the menu.
  useEffect(() => { if (!compact) setMenuOpen(false); }, [compact]);

  const navLinks = [
    { id: 'top', href: '#top', label: t.navHome },
    { id: 'gallery', href: '#gallery', label: t.navGallery },
    { id: 'meet', href: '#meet', label: t.navAbout },
    { id: 'process', href: '#process', label: t.navProcess },
    { id: 'pricing', href: '#pricing', label: t.navPricing },
    { id: 'testimonials', href: '#testimonials', label: t.navTestimonials },
    { id: 'which-photo', href: '#which-photo', label: t.navWhich },
    { id: 'contact', href: '#contact', label: t.navContact },
  ];
  const menuLinks = [...navLinks, { id: 'commission', href: '/commission', label: t.ctaCommission }];

  const navStyle = compact
    ? 'display:none'
    : 'margin-left:auto;display:flex;align-items:center;gap:clamp(14px,1.6vw,28px);font-size:13.5px;font-weight:400;letter-spacing:.02em;flex-wrap:nowrap;white-space:nowrap';

  return (
    <header style={s('position:sticky;top:0;z-index:40;background:rgba(252,250,246,.94);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid #DDD9CF;padding:9px ' + PAD)}>
      <div style={s('display:flex;align-items:center;gap:clamp(16px,2.2vw,40px);flex-wrap:nowrap')}>
        <a href="#top" style={s("font-family:'Satisfy',cursive;font-size:24px;color:#26454F;line-height:1;letter-spacing:.5px;white-space:nowrap")}>Atelier Danique</a>
        <nav style={s(navStyle)} data-nav="">
          {navLinks.map((l) => (
            <a key={l.id} href={l.href} className="h-color-teal" style={navStyleFor(active, l.id)}>{l.label}</a>
          ))}
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
          {menuLinks.map((l) => (
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
        </nav>
      ) : null}
    </header>
  );
}
