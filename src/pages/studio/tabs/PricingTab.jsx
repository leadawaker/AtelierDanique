import { s } from '../../../lib/css.js';
import { discountActive, sitePricing } from '../../../lib/pricing.js';

// Pricing tab: the two euro prices, the two reais prices (each with its own
// optional "was" price for a strikethrough), and one shared end date that
// controls both discounts at once. Past that date the website quietly goes
// back to showing a plain price, no strikethrough, no note.

const SECTION = 'margin-bottom:clamp(44px,6vw,72px)';
const H2 = "margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(22px,2.4vw,30px);line-height:1.1";
const H2_WRAP = 'border-bottom:1px solid #DDD9CF;padding-bottom:12px;margin-bottom:22px';
const NOTE = 'margin:0;font-size:13px;line-height:1.6;color:#85949A;font-weight:300';
const PANEL = 'background:#F1EFE8;border:1px solid #E2DED4;border-radius:6px;padding:18px';
const LABEL = 'font-size:13px;color:#455459';
const INPUT = 'background:#FCFAF6;border:1px solid #D3CFC4;border-radius:2px;padding:12px 14px;font-size:16px;outline:none;color:#26454F;width:100%';

const SIZES = [
  { id: 'a5', name: 'A5' },
  { id: 'a4', name: 'A4' },
];

export default function PricingTab({ content, update }) {
  const pricing = sitePricing(content);
  const active = discountActive(pricing.until);

  const setSize = (id, field, raw) => {
    const num = raw === '' ? null : Number(raw);
    const next = { ...pricing, [id]: { ...pricing[id], [field]: Number.isFinite(num) ? num : null } };
    update('ad-pricing', next);
  };

  const setUntil = (value) => {
    update('ad-pricing', { ...pricing, until: value });
  };

  return (
    <div>
      <section style={s(SECTION)}>
        <div style={s(H2_WRAP)}>
          <h2 style={s(H2)}>Prices</h2>
        </div>
        <p style={s(NOTE + ';margin-bottom:22px;font-size:14px')}>
          Fill in "Was" only while a size is on a discount. Leave it empty for a plain price with no strikethrough.
        </p>
        <div style={s('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:clamp(18px,2.4vw,28px)')}>
          {SIZES.map((size) => {
            const v = pricing[size.id];
            return (
              <div key={size.id} style={s('display:flex;flex-direction:column;gap:16px;' + PANEL)}>
                <p style={s('margin:0;font-size:15px')}>{size.name}</p>
                <CurrencyFields
                  currencyLabel="Euros (€)"
                  price={v.eur} was={v.eurWas}
                  onPrice={(val) => setSize(size.id, 'eur', val)}
                  onWas={(val) => setSize(size.id, 'eurWas', val)}
                />
                <CurrencyFields
                  currencyLabel="Reais (R$)"
                  price={v.brl} was={v.brlWas}
                  onPrice={(val) => setSize(size.id, 'brl', val)}
                  onWas={(val) => setSize(size.id, 'brlWas', val)}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div style={s(H2_WRAP)}>
          <h2 style={s(H2)}>Discount end date</h2>
        </div>
        <div style={s('display:flex;flex-direction:column;gap:12px;max-width:320px')}>
          <label htmlFor="ad-pricing-until" style={s(LABEL)}>Show the "Was" prices until</label>
          <input
            id="ad-pricing-until" type="date" value={pricing.until}
            onChange={(e) => setUntil(e.target.value)}
            style={s(INPUT)}
          />
          <p style={s(NOTE)}>
            {pricing.until
              ? (active
                ? 'The strikethrough and this date are showing on the website now. They will disappear on their own the day after.'
                : "This date has passed, so the website is showing a plain price now, even though a \"Was\" price is still filled in above. Clear the \"Was\" fields or pick a new date to bring it back.")
              : 'No date set: the website always shows a plain price, whatever is in "Was" above.'}
          </p>
        </div>
      </section>
    </div>
  );
}

function CurrencyFields({ currencyLabel, price, was, onPrice, onWas }) {
  return (
    <div style={s('display:flex;flex-direction:column;gap:8px')}>
      <p style={s('margin:0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#85949A')}>{currencyLabel}</p>
      <div style={s('display:grid;grid-template-columns:1fr 1fr;gap:10px')}>
        <div style={s('display:flex;flex-direction:column;gap:6px')}>
          <label style={s(LABEL)}>Price</label>
          <input type="number" inputMode="decimal" min="0" value={price ?? ''} onChange={(e) => onPrice(e.target.value)} style={s(INPUT)} />
        </div>
        <div style={s('display:flex;flex-direction:column;gap:6px')}>
          <label style={s(LABEL)}>Was (optional)</label>
          <input type="number" inputMode="decimal" min="0" value={was ?? ''} onChange={(e) => onWas(e.target.value)} style={s(INPUT)} />
        </div>
      </div>
    </div>
  );
}
