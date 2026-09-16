import { s } from '../../lib/css.js';

const STEPS = [
  { key: 1, img: '/uploads/file_000000008c2c81f4b76b39e10d47da72.png', size: 'width: 109px; height: 85px; object-fit: contain' },
  { key: 2, img: '/uploads/file_0000000042fc81f69e3a883039be48c0.png', size: 'width: 87px; height: 93px; object-fit: contain' },
  { key: 3, img: '/uploads/file_0000000037388210bdfbc0d04949de0d.png', size: 'width: 81px; height: 83px; object-fit: contain' },
  { key: 4, img: '/uploads/Project (20260914102905).png', size: 'width: 101px; height: 114px; object-fit: contain' },
];

export default function Process({ t }) {
  return (
    <section id="process" style={s('background:#FCFAF6;padding:clamp(48px,7vw,100px) clamp(24px,5vw,80px)')}>
      <div data-reveal="" style={s('max-width:1400px;margin:0 auto')}>
        <div style={s('display:flex;flex-direction:column;gap:16px;margin-bottom:clamp(36px,4.5vw,60px);max-width:60ch')}>
          <p style={s('margin:0;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#E36B54')}>{t.procEyebrow}</p>
          <h2 style={s("margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(34px,4vw,54px);line-height:1.02;letter-spacing:-.02em")}>{t.procTitle}</h2>
          <p style={s('margin:0;font-size:16px;line-height:1.8;color:#455459;font-weight:300;text-wrap:pretty')}>{t.procIntro}</p>
        </div>
        <div style={s('overflow-x:auto;padding-bottom:6px')}>
          <div style={s('--g:clamp(18px,2.2vw,34px);position:relative;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--g);min-width:640px')}>
            {STEPS.map((step) => (
              <div key={step.key} style={s('position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;min-width:0')}>
                <div style={s('width:54px;height:54px;border-radius:50%;background:#FCFAF6;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;z-index:1')}>
                  <img src={step.img} alt="" style={s(step.size)} />
                </div>
                <div style={s('display:flex;flex-direction:column;align-items:center;gap:8px')}>
                  <p style={s('margin: 0; font-size: 14px; letter-spacing: .12em; text-transform: uppercase; line-height: 1.5; color: #26454F')}>{t['step' + step.key + 'T']}</p>
                  <p style={s('margin:0;font-size:14px;line-height:1.7;color:#5E6C71;font-weight:300;text-wrap:pretty')}>{t['step' + step.key + 'B']}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
