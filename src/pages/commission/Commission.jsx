import { useEffect } from 'react';
import { s } from '../../lib/css.js';
import { useSiteContent } from '../../lib/content.js';
import { useLang } from '../../lib/lang.js';
import { LANGS } from '../../lib/strings.js';
import { LINKS, whatsappLink } from '../home/settings.js';
import { STRINGS } from './strings.js';
import CommissionForm from './CommissionForm.jsx';

// Commission page, ported from Commission.dc.html. The form itself lives in
// CommissionForm.jsx (send by email or continue on WhatsApp).

const INFO_T = s('margin:0 0 6px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#E36B54');
const INFO_B = s('margin:0;font-size:14px;line-height:1.7;color:#5E6C71;font-weight:300');

export default function Commission() {
  const [lang, setLang] = useLang();
  const content = useSiteContent();
  const t = STRINGS[lang] || STRINGS.en;

  useEffect(() => {
    document.title = 'Commission a piece · Atelier Danique';
    document.documentElement.lang = lang;
  }, [lang]);

  const talkUrl = whatsappLink(LINKS.whatsappUrl, t.waPrefill);

  return (
    <div style={s('max-width:100%;min-height:100vh;background:#FCFAF6')}>

      <header style={s('position:sticky;top:0;z-index:40;background:rgba(252,250,246,.94);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid #DDD9CF;padding:10px clamp(24px,5vw,80px)')}>
        <div style={s('max-width:1400px;margin:0 auto;display:flex;align-items:center;gap:20px')}>
          <a href="/" style={s("font-family:'Satisfy',cursive;font-size:clamp(22px,2.4vw,28px);color:#26454F;line-height:1;white-space:nowrap")}>Atelier Danique</a>
          <div style={s('margin-left:auto;display:flex;align-items:center;gap:18px;flex-wrap:wrap;justify-content:flex-end')}>
            <div role="group" aria-label="Language" style={s('display:flex;align-items:center;gap:2px')}>
              {LANGS.map((l) => (
                <button key={l.id} type="button" onClick={() => setLang(l.id)} aria-label={l.name} aria-pressed={l.id === lang}
                  style={s('background:none;border:0;padding:6px 7px;cursor:pointer;font-size:11.5px;letter-spacing:.08em;line-height:1;border-radius:2px;transition:color .2s,background .2s;'
                    + (l.id === lang ? 'color:#E36B54;background:#F7D8CF' : 'color:#85949A'))}>{l.code}</button>
              ))}
            </div>
            <a href="/" className="h-color-coral" style={s('font-size:14px;color:#5E6C71;border-bottom:1px solid #D3CFC4;padding-bottom:2px;transition:color .2s')}>{'←  '}{t.back}</a>
          </div>
        </div>
      </header>

      <main style={s('padding:clamp(36px,5vw,80px) clamp(24px,5vw,80px) clamp(56px,7vw,110px)')}>
        <div style={s('max-width:1400px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:clamp(32px,4vw,72px);align-items:start')}>

          <div style={s('display:flex;flex-direction:column;gap:26px;max-width:40ch')}>
            <p style={s('margin:0;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#E36B54')}>{t.eyebrow}</p>
            <h1 style={s("margin:0;font-family:'Newsreader',serif;font-weight:400;font-size:clamp(36px,4.4vw,60px);line-height:1.04;letter-spacing:-.02em")}>{t.title1}<br />{t.title2}</h1>
            <p style={s('margin:0;font-size:16px;line-height:1.8;color:#455459;font-weight:300;text-wrap:pretty')}>{t.intro}</p>
            <img src="/uploads/IMG_3566.JPG" alt="A watercolour of birch trunks in gold, teal and coral on cotton paper" style={s('width:100%;height:auto;border-radius:6px;display:block')} />
            <div style={s('display:grid;gap:20px;border-top:1px solid #DDD9CF;padding-top:24px')}>
              <div><p style={INFO_T}>{t.secureT}</p><p style={INFO_B}>{t.secureB}</p></div>
              <div><p style={INFO_T}>{t.fastT}</p><p style={INFO_B}>{t.fastB}</p></div>
              <div><p style={INFO_T}>{t.studioT}</p><p style={INFO_B}>{t.studioB}</p></div>
            </div>
            <p style={s('margin:0;font-size:14px;color:#5E6C71;font-weight:300;line-height:1.8')}>
              {t.talkFirst}<br />
              <a href={talkUrl} target="_blank" rel="noopener" style={s('color:#E36B54;border-bottom:1px solid #E0C2AE;padding-bottom:2px')}>WhatsApp {LINKS.whatsappNumber}{'  →'}</a>
            </p>
          </div>

          <div style={s('min-width:0')}>
            <CommissionForm t={t} lang={lang} content={content} />
          </div>

        </div>
      </main>

      <footer style={s('border-top:1px solid #DDD9CF;padding:28px clamp(24px,5vw,80px) 40px')}>
        <div style={s('max-width:1400px;margin:0 auto;display:flex;gap:24px;flex-wrap:wrap;justify-content:space-between;font-size:12px;color:#85949A;font-weight:300;letter-spacing:.04em')}>
          <span>{t.footCopy}</span>
          <span><a href={talkUrl} target="_blank" rel="noopener" className="h-color-coral" style={s('color:#85949A')}>WhatsApp {LINKS.whatsappNumber}</a></span>
        </div>
      </footer>

    </div>
  );
}
