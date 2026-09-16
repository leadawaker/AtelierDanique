import { useEffect, useState } from 'react';
import { s } from '../../lib/css.js';
import { useLang } from '../../lib/lang.js';
import { LANGS } from '../../lib/strings.js';
import { LINKS, whatsappLink } from '../home/settings.js';
import { STRINGS } from './strings.js';

// Commission page, ported from Commission.dc.html. The form does not upload:
// on submit it opens WhatsApp with every answer prefilled, and the client
// attaches their photo in that chat.

const SIZES = [
  { label: 'A5', price: '€50' },
  { label: 'A4', price: '€75' },
];

const EMPTY = { name: '', contact: '', what: '', why: '', feel: '', extra: '' };

const LABEL = s('font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#85949A');
const FIELD = s('background:transparent;border:0;border-bottom:1px solid #D3C1A9;padding:10px 0;outline:none;font-size:16px;font-weight:300');
const AREA = s('background:transparent;border:0;border-bottom:1px solid #D3C1A9;padding:10px 0;outline:none;font-size:16px;font-weight:300;resize:vertical');
const INFO_T = s('margin:0 0 6px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#E36B54');
const INFO_B = s('margin:0;font-size:14px;line-height:1.7;color:#5E6C71;font-weight:300');

function buildMessage(t, form, size) {
  const price = SIZES.find((x) => x.label === size)?.price || '';
  const rows = [
    [t.msgName, form.name],
    [t.fContact, form.contact],
    [t.fWhat, form.what],
    [t.fWhy, form.why],
    [t.fFeel, form.feel],
    [t.fExtra, form.extra],
  ]
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `${k}: ${v.trim()}`);
  rows.push(`${t.msgSize}: ${size} (${price})`);
  return `${t.msgHello}\n\n${rows.join('\n')}\n\n${t.msgClose}`;
}

// Phones and tablets: navigate in place so the WhatsApp app takes over.
// Desktop: a new tab (WhatsApp Web), keeping this page open behind it.
function openWhatsapp(url) {
  const mobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  if (mobile) {
    window.location.href = url;
    return;
  }
  window.open(url, '_blank', 'noopener');
}

export default function Commission() {
  const [lang, setLang] = useLang();
  const t = STRINGS[lang] || STRINGS.en;
  const [form, setForm] = useState(EMPTY);
  const [size, setSize] = useState('A4');
  const [sentUrl, setSentUrl] = useState('');

  useEffect(() => {
    document.title = 'Commission a piece · Atelier Danique';
    document.documentElement.lang = lang;
  }, [lang]);

  const talkUrl = whatsappLink(LINKS.whatsappUrl, t.waPrefill);
  const bind = (key) => ({
    name: key,
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const submit = (e) => {
    e.preventDefault();
    const url = whatsappLink(LINKS.whatsappUrl, buildMessage(t, form, size));
    setSentUrl(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    openWhatsapp(url);
  };

  const reopen = (e) => {
    e.preventDefault();
    openWhatsapp(sentUrl);
  };

  const sizeStyle = (v) => s('display:flex;align-items:baseline;gap:10px;padding:13px 22px;border-radius:2px;cursor:pointer;font-size:14px;letter-spacing:.02em;transition:all .25s;' +
    (size === v ? 'border:1px solid #E36B54;background:#F6E6DB;color:#C0503B' : 'border:1px solid #D3C1A9;background:transparent;color:#455459'));
  const priceStyle = (v) => s("font-family:'Newsreader',serif;font-size:17px;" + (size === v ? 'color:#C0503B' : 'color:#85949A'));

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
            {sentUrl ? (
              <div style={s('border:1px solid #D9C9B3;background:#F1EFE8;padding:clamp(32px,5vw,72px);text-align:center')}>
                <p style={s("margin:0 0 12px;font-family:'Newsreader',serif;font-size:30px;line-height:1.2")}>{t.thanks}</p>
                <p style={s('margin:0 0 14px;font-size:15px;color:#455459;font-weight:300;line-height:1.8')}>{t.thanksB1}<br />{t.thanksB2}</p>
                <p style={s('margin:0 0 26px;font-size:14px;color:#85949A;font-weight:300;line-height:1.8')}>
                  {t.thanksRetry}{' '}
                  <a href={sentUrl} onClick={reopen} target="_blank" rel="noopener" style={s('color:#E36B54;border-bottom:1px solid #E0C2AE;padding-bottom:2px')}>{t.thanksRetryLink}</a>
                </p>
                <a href="/" style={s('font-size:14px;color:#E36B54;border-bottom:1px solid #E0C2AE;padding-bottom:3px')}>{'←  '}{t.back}</a>
              </div>
            ) : (
              <form onSubmit={submit} style={s('background:#F1EFE8;border:1px solid #E2D6C4;padding:clamp(24px,4vw,52px);display:grid;gap:28px')}>
                <div style={s('display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:28px')}>
                  <label style={s('display:grid;gap:8px')}><span style={LABEL}>{t.fName}</span><input {...bind('name')} required autoComplete="name" className="f-coral" style={FIELD} /></label>
                  <label style={s('display:grid;gap:8px')}><span style={LABEL}>{t.fContact}</span><input {...bind('contact')} required className="f-coral" style={FIELD} /></label>
                </div>
                <div style={s('display:grid;gap:10px')}>
                  <span style={LABEL}>{t.fPhoto}</span>
                  <div style={s('border:1px dashed #CDBCA4;padding:28px;text-align:center;background:#FCFAF6')}>
                    <p style={s('margin:0;font-size:14px;font-weight:300;color:#455459;line-height:1.7')}>{t.fPhotoNote}</p>
                    <p style={s('margin:12px 0 0;font-size:13px;color:#85949A;font-weight:300')}>{t.fPhotoHint}</p>
                  </div>
                </div>
                <label style={s('display:grid;gap:8px')}><span style={LABEL}>{t.fWhat}</span><input {...bind('what')} className="f-coral" style={FIELD} /></label>
                <label style={s('display:grid;gap:8px')}><span style={LABEL}>{t.fWhy}</span><textarea {...bind('why')} rows={3} className="f-coral" style={AREA} /></label>
                <label style={s('display:grid;gap:8px')}><span style={LABEL}>{t.fFeel}</span><textarea {...bind('feel')} rows={3} className="f-coral" style={AREA} /></label>
                <fieldset style={s('border:0;padding:0;margin:0;display:grid;gap:12px')}>
                  <legend style={s('padding:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#85949A')}>{t.fSize}</legend>
                  <div style={s('display:flex;gap:12px;flex-wrap:wrap')}>
                    {SIZES.map((x) => (
                      <button key={x.label} type="button" onClick={() => setSize(x.label)} aria-pressed={size === x.label} style={sizeStyle(x.label)}>
                        {x.label}<span style={priceStyle(x.label)}>{x.price}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label style={s('display:grid;gap:8px')}><span style={LABEL}>{t.fExtra}</span><textarea {...bind('extra')} rows={2} className="f-coral" style={AREA} /></label>
                <div style={s('display:flex;align-items:center;gap:24px;flex-wrap:wrap')}>
                  <button type="submit" className="h-bg-coral-dark" style={s('background:#E36B54;color:#FCFAF6;border:0;padding:17px 32px;font-size:15px;border-radius:2px;cursor:pointer;transition:background .25s')}>{t.fSubmit}{'  →'}</button>
                  <p style={s('margin:0;font-size:13px;color:#85949A;font-weight:300')}>{t.fNoPay}</p>
                </div>
              </form>
            )}
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
