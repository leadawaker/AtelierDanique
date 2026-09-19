import { s } from '../../../lib/css.js';
import { launchNote, sitePricing } from '../../../lib/pricing.js';
import { STRINGS } from '../../../lib/strings.js';

// Pricing tab: the euro and reais price per size, and the launch spots note
// under the price cards ("I'm opening my first 7 commission spots...").
// Danique lowers "Spots still available" as commissions come in; at 0 the
// note disappears from the website.

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

const toNumber = (raw) => {
  const num = raw === '' ? null : Number(raw);
  return Number.isFinite(num) ? num : null;
};

export default function PricingTab({ content, update }) {
  const pricing = sitePricing(content);
  const note = launchNote(STRINGS.en, pricing);

  const setSize = (id, field, raw) => {
    update('ad-pricing', { ...pricing, [id]: { ...pricing[id], [field]: toNumber(raw) } });
  };

  const setSpots = (field, raw) => {
    update('ad-pricing', { ...pricing, [field]: toNumber(raw) });
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
        {note ? (
          <div style={s(PANEL + ';max-width:560px;display:flex;flex-direction:column;gap:6px')}>
            <p style={s(NOTE)}>The website shows, under the prices:</p>
            <p style={s('margin:0;font-size:15px;line-height:1.6;color:#26454F')}>{note.intro}<br />{note.left}</p>
          </div>
        ) : (
          <p style={s(NOTE)}>No spots left, so the website shows no note under the prices.</p>
        )}
        <p style={s(NOTE + ';margin-top:12px')}>
          Lower "Spots still available" each time a commission is booked. At 0 the note disappears on its own. Raising the prices afterwards is still done by hand, above.
        </p>
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
