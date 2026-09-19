import Slot from '../../components/Slot.jsx';
import { s } from '../../lib/css.js';

// The step pictures are square with empty margin, so they are zoomed a little
// (s) and centred on the objects (fx, fy) to fill the frame. `brightness`
// (1 = unchanged) lightens a picture without editing the file. The frame
// normally multiplies pictures into the page, which drops a white background
// but also tints the white parts of the picture. Pictures that are already
// transparent set `plain` to keep their real colours; leave it off for a
// picture with a white background. `transform` turns or scales a picture
// inside its slot (step 3 is turned 15 degrees clockwise and 10% bigger).
const STEPS = [
  { key: 1, slotId: 'ad-process-1', src: '/uploads/Project%20(20260919052116).webp', focus: { s: 1.2, fx: 0.46, fy: 0.48 }, brightness: 1.1, plain: true },
  { key: 2, slotId: 'ad-process-2', src: '/uploads/Project%20(20260919072918).webp', focus: { s: 1.2, fx: 0.517, fy: 0.497 }, plain: true },
  { key: 3, slotId: 'ad-process-3', src: '/uploads/Project%20(20260919072504).webp', focus: { s: 1.05, fx: 0.503, fy: 0.508 }, plain: true, transform: 'rotate(15deg) scale(1.1)', current: true },
  { key: 4, slotId: 'ad-process-4', src: '/uploads/file_00000000d5b881f4a2eaa6c6bb25ef66.webp', focus: { fx: 0.527, fy: 0.51 }, plain: true },
];

const EYEBROW_RULE = 'height:1px;width:clamp(28px,7vw,88px);background:#D3CFC4';
const RULE = 'flex:1;height:1px;min-width:24px;max-width:88px;background:#D3CFC4';

export default function Process({ t }) {
  return (
    <section id="process" style={s('background:#F6F2EA;padding:clamp(48px,7vw,100px) clamp(24px,5vw,80px);overflow-x:clip')}>
      <div data-reveal="" style={s('max-width:1240px;margin:0 auto')}>
        <div style={s('display:flex;flex-direction:column;align-items:center;text-align:center;gap:18px;margin-bottom:clamp(36px,5vw,64px)')}>
          <div style={s('display:flex;align-items:center;justify-content:center;gap:clamp(12px,2vw,24px)')}>
            <span style={s(EYEBROW_RULE)} />
            <p style={s('margin:0;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#E36B54')}>{t.procEyebrow}</p>
            <span style={s(EYEBROW_RULE)} />
          </div>
          <h2 style={s("margin:0;max-width:12.6em;font-family:'Cardo',serif;font-weight:400;font-size:clamp(32px,3.8vw,52px);line-height:1.05;letter-spacing:-.02em;text-wrap:pretty")}>{t.procTitle}</h2>
        </div>

        <ol className="proc-steps">
          {STEPS.map((step) => (
            <li key={step.key} className={'proc-step' + (step.current ? ' proc-step-current' : '')}>
              <div className="proc-art" style={step.plain ? { mixBlendMode: 'normal' } : undefined}>
                <Slot slotId={step.slotId} src={step.src} focus={step.focus} placeholder={'Photo for step ' + step.key} style={{ background: 'transparent', ...(step.brightness ? { filter: 'brightness(' + step.brightness + ')' } : {}), ...(step.transform ? { transform: step.transform } : {}) }} />
              </div>
              <div className="proc-badge-row">
                <span className="proc-badge">{'0' + step.key}</span>
              </div>
              <h3 className="proc-title">{t['step' + step.key + 'T']}</h3>
              <p className="proc-body">{t['step' + step.key + 'B']}</p>
            </li>
          ))}
        </ol>

        <div style={s('display:flex;align-items:center;justify-content:center;gap:clamp(16px,3vw,36px);max-width:1100px;margin:clamp(40px,5vw,72px) auto 0')}>
          <span style={s(RULE)} />
          <p style={s("margin:0;font-family:'Satisfy',cursive;font-size:clamp(24px,2.6vw,34px);line-height:1.5;color:#E36B54;text-align:center;text-wrap:balance")}>{t.procCloseA}</p>
          <span style={s(RULE)} />
        </div>
      </div>
    </section>
  );
}
