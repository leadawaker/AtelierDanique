import { useState } from 'react';
import { s } from '../../lib/css.js';
import { LINKS, whatsappLink } from '../home/settings.js';
import { SIZE_IDS, currencyFor, formatMoney, sitePricing } from '../../lib/pricing.js';
import { pathFor } from '../../lib/routes.js';
import PhotoField from './PhotoField.jsx';
import { sendByEmail } from './send.js';

// The commission form. Two ways to send the same answers:
// - "Send by email": the site emails Danique the answers and photo (api/commission.js).
// - "Send on WhatsApp": opens WhatsApp with every answer prefilled; the client
//   attaches their photo in that chat.

// Prices follow the studio's Pricing tab, in reais for Portuguese visitors.
function sizesFor(content, lang) {
  const pricing = sitePricing(content);
  const currency = currencyFor(lang);
  return SIZE_IDS.map((id) => ({ label: id.toUpperCase(), price: formatMoney(pricing[id][currency], currency) }));
}

const EMPTY = { name: '', contact: '', what: '', why: '', feel: '', extra: '' };

const LABEL = s('font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#85949A');
const FIELD = s('background:transparent;border:0;border-bottom:1px solid #D3C1A9;padding:10px 0;outline:none;font-size:16px;font-weight:300');
const AREA = s('background:transparent;border:0;border-bottom:1px solid #D3C1A9;padding:10px 0;outline:none;font-size:16px;font-weight:300;resize:vertical');
const PANEL = s('border:1px solid #D9C9B3;background:#F1EFE8;padding:clamp(32px,5vw,72px);text-align:center');
const PANEL_T = s("margin:0 0 12px;font-family:'Newsreader',serif;font-size:30px;line-height:1.2");
const PANEL_B = s('margin:0 0 14px;font-size:15px;color:#455459;font-weight:300;line-height:1.8');
const LINK = s('color:#E36B54;border-bottom:1px solid #E0C2AE;padding-bottom:2px');
const BUTTON = 'border-radius:2px;padding:17px 28px;font-size:15px;cursor:pointer;transition:background .25s,color .25s,border-color .25s;';

function buildMessage(t, form, size, sizes) {
  const price = sizes.find((x) => x.label === size)?.price || '';
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

export default function CommissionForm({ t, lang, content }) {
  const sizes = sizesFor(content, lang);
  const [form, setForm] = useState(EMPTY);
  const [size, setSize] = useState('A4');
  const [file, setFile] = useState(null);
  const [website, setWebsite] = useState('');
  const [sentUrl, setSentUrl] = useState('');
  const [mailed, setMailed] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const bind = (key) => ({
    name: key,
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const via = e.nativeEvent.submitter && e.nativeEvent.submitter.value;
    if (via !== 'email') {
      const url = whatsappLink(LINKS.whatsappUrl, buildMessage(t, form, size, sizes));
      setSentUrl(url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      openWhatsapp(url);
      return;
    }
    setSending(true);
    try {
      await sendByEmail({ form, size, lang, file, website });
      setMailed(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message === 'too-large' ? t.errTooLarge : t.errSend);
    } finally {
      setSending(false);
    }
  };

  if (mailed) {
    return (
      <div style={PANEL}>
        <p style={PANEL_T}>{t.mailThanks}</p>
        <p style={PANEL_B}>{t.mailThanksB1}<br />{t.mailThanksB2}</p>
        {!file && <p style={s('margin:0 0 14px;font-size:14px;color:#85949A;font-weight:300;line-height:1.8')}>{t.mailThanksNoPhoto}</p>}
        <p style={s('margin:12px 0 0')}><a href={pathFor(lang)} style={LINK}>{'←  '}{t.back}</a></p>
      </div>
    );
  }

  if (sentUrl) {
    return (
      <div style={PANEL}>
        <p style={PANEL_T}>{t.thanks}</p>
        <p style={PANEL_B}>{t.thanksB1}<br />{t.thanksB2}</p>
        <p style={s('margin:0 0 26px;font-size:14px;color:#85949A;font-weight:300;line-height:1.8')}>
          {t.thanksRetry}{' '}
          <a href={sentUrl} onClick={(e) => { e.preventDefault(); openWhatsapp(sentUrl); }} target="_blank" rel="noopener" style={LINK}>{t.thanksRetryLink}</a>
        </p>
        <a href={pathFor(lang)} style={LINK}>{'←  '}{t.back}</a>
      </div>
    );
  }

  const sizeStyle = (v) => s('display:flex;align-items:baseline;gap:10px;padding:13px 22px;border-radius:2px;cursor:pointer;font-size:14px;letter-spacing:.02em;transition:all .25s;' +
    (size === v ? 'border:1px solid #E36B54;background:#F6E6DB;color:#C0503B' : 'border:1px solid #D3C1A9;background:transparent;color:#455459'));
  const priceStyle = (v) => s("font-family:'Newsreader',serif;font-size:17px;" + (size === v ? 'color:#C0503B' : 'color:#85949A'));

  return (
    <form onSubmit={submit} style={s('background:#F1EFE8;border:1px solid #E2D6C4;padding:clamp(24px,4vw,52px);display:grid;gap:28px')}>
      <div style={s('display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:28px')}>
        <label style={s('display:grid;gap:8px')}><span style={LABEL}>{t.fName}</span><input {...bind('name')} required autoComplete="name" className="f-coral" style={FIELD} /></label>
        <label style={s('display:grid;gap:8px')}><span style={LABEL}>{t.fContact}</span><input {...bind('contact')} type="email" required autoComplete="email" className="f-coral" style={FIELD} /></label>
      </div>
      <PhotoField t={t} file={file} onChange={setFile} label={LABEL} />
      <label style={s('display:grid;gap:8px')}><span style={LABEL}>{t.fWhat}</span><input {...bind('what')} className="f-coral" style={FIELD} /></label>
      <label style={s('display:grid;gap:8px')}><span style={LABEL}>{t.fWhy}</span><textarea {...bind('why')} rows={3} className="f-coral" style={AREA} /></label>
      <label style={s('display:grid;gap:8px')}><span style={LABEL}>{t.fFeel}</span><textarea {...bind('feel')} rows={3} className="f-coral" style={AREA} /></label>
      <fieldset style={s('border:0;padding:0;margin:0;display:grid;gap:12px')}>
        <legend style={s('padding:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#85949A')}>{t.fSize}</legend>
        <div style={s('display:flex;gap:12px;flex-wrap:wrap')}>
          {sizes.map((x) => (
            <button key={x.label} type="button" onClick={() => setSize(x.label)} aria-pressed={size === x.label} style={sizeStyle(x.label)}>
              {x.label}<span style={priceStyle(x.label)}>{x.price}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <label style={s('display:grid;gap:8px')}><span style={LABEL}>{t.fExtra}</span><textarea {...bind('extra')} rows={2} className="f-coral" style={AREA} /></label>
      {/* Honeypot for spam bots: hidden from people and screen readers. */}
      <input name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true"
        style={s('position:absolute;left:-9999px;width:1px;height:1px;opacity:0')} />
      <div style={s('display:grid;gap:14px')}>
        <div style={s('display:flex;align-items:center;gap:14px;flex-wrap:wrap')}>
          <button type="submit" value="email" disabled={sending} className="h-bg-coral-dark"
            style={s(BUTTON + 'background:#E36B54;color:#FCFAF6;border:1px solid #E36B54' + (sending ? ';opacity:.7;cursor:wait' : ''))}>
            {sending ? t.fSending : t.fSubmitEmail}
          </button>
          <button type="submit" value="whatsapp" disabled={sending} className="h-fill-coral"
            style={s(BUTTON + 'background:transparent;color:#26454F;border:1px solid #CDBCA4')}>
            {t.fSubmit}
          </button>
        </div>
        {error && <p role="alert" style={s('margin:0;font-size:14px;color:#C0503B;line-height:1.6')}>{error}</p>}
        <p style={s('margin:0;font-size:13px;color:#85949A;font-weight:300')}>{t.fNoPay}</p>
      </div>
    </form>
  );
}
