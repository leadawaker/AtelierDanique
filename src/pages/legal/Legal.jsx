import { useEffect } from 'react';
import { s } from '../../lib/css.js';
import { pathFor } from '../../lib/routes.js';
import { STRINGS } from '../../lib/strings.js';
import { useCompact } from '../../lib/useCompact.js';
import Header from '../home/Header.jsx';
import Footer from '../home/Footer.jsx';
import { LINKS } from '../home/settings.js';
import { LEGAL } from './content.js';

// Privacy policy (/privacy) and terms & conditions (/terms): one plain reading
// page under the site header and footer. The text lives in content.js, one
// version per language, and follows the visitor's chosen language.

const H2 = "margin:clamp(30px,4vw,44px) 0 12px;font-family:'Cardo',serif;font-weight:400;font-size:clamp(22px,2.4vw,28px);line-height:1.2;color:#26454F";
const P = 'margin:0 0 14px;font-size:16px;line-height:1.8;color:#455459;font-weight:300;text-wrap:pretty';
const LI = 'margin:0 0 8px;font-size:16px;line-height:1.75;color:#455459;font-weight:300;text-wrap:pretty';

export default function Legal({ doc, lang, setLang }) {
  const compact = useCompact();
  const t = STRINGS[lang] || STRINGS.en;
  const page = LEGAL[doc][lang] || LEGAL[doc].en;

  useEffect(() => { window.scrollTo(0, 0); }, [doc]);

  return (
    <div style={s('background:#FCFAF6;min-height:100vh;color:#26454F')}>
      <Header t={t} lang={lang} setLang={setLang} compact={compact} base={pathFor(lang)} />
      <main style={s('padding:clamp(40px,6vw,88px) clamp(24px,5vw,80px) clamp(48px,7vw,104px)')}>
        <article style={s('max-width:760px;margin:0 auto')}>
          <p style={s('margin:0 0 14px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#E36B54')}>Atelier Danique</p>
          <h1 style={s("margin:0 0 10px;font-family:'Cardo',serif;font-weight:400;font-size:clamp(34px,4.4vw,54px);line-height:1.05;letter-spacing:-.02em")}>{page.title}</h1>
          <p style={s('margin:0 0 clamp(20px,3vw,32px);font-size:13px;letter-spacing:.04em;color:#85949A;font-weight:300')}>{page.updated}</p>
          {page.intro.map((para, i) => <p key={i} style={s(P)}>{para}</p>)}
          {page.sections.map((sec, i) => (
            <section key={i}>
              <h2 style={s(H2)}>{sec.h}</h2>
              {(sec.p || []).map((para, j) => <p key={j} style={s(P)}>{para}</p>)}
              {sec.ul ? (
                <ul style={s('margin:0 0 14px;padding:0 0 0 22px')}>
                  {sec.ul.map((li, j) => <li key={j} style={s(LI)}>{li}</li>)}
                </ul>
              ) : null}
              {(sec.after || []).map((para, j) => <p key={'a' + j} style={s(P)}>{para}</p>)}
            </section>
          ))}
        </article>
      </main>
      <Footer t={t} lang={lang} links={LINKS} base={pathFor(lang)} />
    </div>
  );
}
