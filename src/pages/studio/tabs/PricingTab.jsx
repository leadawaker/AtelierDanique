import { s } from '../../../lib/css.js';
import { NOTE_LANGS, SIZE_IDS, launchBanner, sitePricing } from '../../../lib/pricing.js';
import { STRINGS } from '../../../lib/strings.js';

// Pricing tab: the euro and reais price per size, and the launch banner above
// the price cards: the two spot numbers, plus the banner's text in each
// language with {total}, {left} and {prices} standing for the numbers.
// Danique lowers "Spots still available" as commissions come in; at 0 the
// banner disappears from the website.

const SECTION = 'margin-bottom:clamp(44px,6vw,72px)';
const H2 = "margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(22px,2.4vw,30px);line-height:1.1";
const H2_WRAP = 'border-bottom:1px solid #DDD9CF;padding-bottom:12px;margin-bottom:22px';
const NOTE = 'margin:0;font-size:13px;line-height:1.6;color:#85949A;font-weight:300';
const PANEL = 'background:#F1EFE8;border:1px solid #E2DED4;border-radius:6px;padding:18px';
const LABEL = 'font-size:13px;color:#455459';
const INPUT = 'background:#FCFAF6;border:1px solid #D3CFC4;border-radius:2px;padding:12px 14px;font-size:16px;outline:none;color:#26454F;width:100%';

const LANG_NAMES = { en: 'English', pt: 'Português', nl: 'Nederlands' };

const SIZES = SIZE_IDS.map((id) => ({ id, name: id.toUpperCase() }));

const toNumber = (raw) => {
  const num = raw === '' ? null : Number(raw);
  return Number.isFinite(num) ? num : null;
};

export default function PricingTab({ content, update }) {
  const pricing = sitePricing(content);

  const setSize = (id, field, raw) => {
    update('ad-pricing', { ...pricing, [id]: { ...pricing[id], [field]: toNumber(raw) } });
  };

  const setSpots = (field, raw) => {
    update('ad-pricing', { ...pricing, [field]: toNumber(raw) });
  };

  const setBanner = (lang, text) => {
    update('ad-pricing', { ...pricing, banner: { ...pricing.banner, [lang]: text } });
  };

  return (
    <div>
      <section style={s(SECTION)}>
        <div style={s(H2_WRAP)}>
          <h2 style={s(H2)}>Prices</h2>
        </div>
        <p style={s(NOTE + ';margin-bottom:22px;font-size:14px')}>
          Visitors who pick Portuguese see the reais price, everyone else sees euros.
        </p>
        <div style={s('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:clamp(18px,2.4vw,28px)')}>
          {SIZES.map((size) => {
            const v = pricing[size.id];
            return (
              <div key={size.id} style={s('display:flex;flex-direction:column;gap:16px;' + PANEL)}>
                <p style={s('margin:0;font-size:15px')}>{size.name}</p>
                <div style={s('display:grid;grid-template-columns:1fr 1fr;gap:10px')}>
                  <NumberField id={`ad-price-${size.id}-eur`} label="Euros (€)" value={v.eur} onChange={(val) => setSize(size.id, 'eur', val)} />
                  <NumberField id={`ad-price-${size.id}-brl`} label="Reais (R$)" value={v.brl} onChange={(val) => setSize(size.id, 'brl', val)} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div style={s(H2_WRAP)}>
          <h2 style={s(H2)}>Launch spots</h2>
        </div>
        <div style={s('display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:420px;margin-bottom:18px')}>
          <NumberField id="ad-spots-total" label="Spots in total" value={pricing.spotsTotal} onChange={(val) => setSpots('spotsTotal', val)} />
          <NumberField id="ad-spots-left" label="Spots still available" value={pricing.spotsLeft} onChange={(val) => setSpots('spotsLeft', val)} />
        </div>
        <p style={s(NOTE + ';margin-bottom:22px')}>
          Lower "Spots still available" each time a commission is booked. At 0 the launch banner above the prices, the "launch price" labels and the line at the top of the page disappear on their own. Raising the prices afterwards is still done by hand, above.
        </p>

        <p style={s('margin:0 0 6px;font-size:15px')}>Text in the launch banner</p>
        <p style={s(NOTE + ';margin-bottom:18px;max-width:64ch')}>
          Write {'{total}'} where the total number of spots goes, {'{left}'} where the spots still available go and {'{prices}'} where the current prices go (for example €65–€150, filled in from the prices above). Each line of the box becomes a line in the banner. The title and the "spots remaining" label next to the number are in the Copy tab. Leave a box empty to go back to the original text.
        </p>
        <div style={s('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:clamp(18px,2.4vw,28px)')}>
          {NOTE_LANGS.map((lang) => {
            const preview = launchBanner(STRINGS[lang], pricing, lang);
            return (
              <div key={lang} style={s('display:flex;flex-direction:column;gap:10px;' + PANEL)}>
                <label htmlFor={'ad-note-' + lang} style={s('margin:0;font-size:15px')}>{LANG_NAMES[lang]}</label>
                <textarea
                  id={'ad-note-' + lang} rows={5}
                  value={pricing.banner[lang] ?? STRINGS[lang].launchBody}
                  onChange={(e) => setBanner(lang, e.target.value)}
                  style={s(INPUT + ';resize:vertical;line-height:1.5;font-family:inherit')}
                />
                <p style={s(NOTE)}>On the website:</p>
                {preview ? (
                  <div style={s('display:flex;flex-direction:column;gap:4px;background:#F7E5DD;border-radius:12px;padding:14px 16px')}>
                    <p style={s('margin:0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#C0503B')}>{preview.title}</p>
                    {preview.lines.map((line, i) => (
                      <p key={i} style={s('margin:0;font-size:14px;line-height:1.5;color:#455459;font-weight:300')}>{line}</p>
                    ))}
                    <p style={s('margin:6px 0 0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#C0503B')}>{preview.count} · {preview.countLabel}</p>
                  </div>
                ) : (
                  <p style={s(NOTE)}>Nothing: no spots left.</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function NumberField({ id, label, value, onChange }) {
  return (
    <div style={s('display:flex;flex-direction:column;gap:6px')}>
      <label htmlFor={id} style={s(LABEL)}>{label}</label>
      <input id={id} type="number" inputMode="decimal" min="0" value={value ?? ''} onChange={(e) => onChange(e.target.value)} style={s(INPUT)} />
    </div>
  );
}
