import Slot from '../../components/Slot.jsx';
import { s } from '../../lib/css.js';

const STEPS = [
  { key: 1, slotId: 'ad-process-1', src: '/uploads/proc-1.webp' },
  { key: 2, slotId: 'ad-process-2', src: '/uploads/proc-2.jpg' },
  { key: 3, slotId: 'ad-process-3', src: '/uploads/proc-3.jpg', current: true },
  { key: 4, slotId: 'ad-process-4', src: '/uploads/proc-4.jpg' },
];

const RULE = 'flex:1;height:1px;background:#DDB9A9';

export default function Process({ t }) {
  return (
    <section id="process" style={s('background:#F6F2EA;padding:clamp(56px,8vw,110px) clamp(24px,5vw,80px)')}>
      <div data-reveal="" style={s('max-width:1240px;margin:0 auto')}>
        <div style={s('display:flex;flex-direction:column;align-items:center;text-align:center;gap:20px;margin-bottom:clamp(36px,5vw,64px)')}>
          <div style={s('display:flex;align-items:center;gap:20px;width:min(100%,340px)')}>
            <span style={s(RULE)} />
            <p style={s('margin:0;font-size:13px;letter-spacing:.24em;text-transform:uppercase;color:#E36B54;white-space:nowrap')}>{t.procEyebrow}</p>
            <span style={s(RULE)} />
          </div>
          <h2 style={s("margin:0;max-width:12.6em;font-family:'Cardo',serif;font-weight:400;font-size:clamp(34px,4.6vw,60px);line-height:1.08;letter-spacing:-.015em;text-wrap:pretty")}>{t.procTitle}</h2>
          <p style={s('margin:0;max-width:44ch;font-size:17px;line-height:1.7;color:#455459;font-weight:300;text-wrap:balance')}>{t.procIntro}</p>
        </div>

        <ol className="proc-steps">
          {STEPS.map((step) => (
            <li key={step.key} className={'proc-step' + (step.current ? ' proc-step-current' : '')}>
              <div className="proc-art">
                <Slot slotId={step.slotId} src={step.src} placeholder={'Photo for step ' + step.key} style={{ background: 'transparent' }} />
              </div>
              <div className="proc-badge-row">
                <span className="proc-badge">{'0' + step.key}</span>
              </div>
              <h3 className="proc-title">{t['step' + step.key + 'T']}</h3>
              <p className="proc-body">{t['step' + step.key + 'B']}</p>
            </li>
          ))}
        </ol>

        <div style={s('display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;margin-top:clamp(40px,5vw,72px)')}>
          <div style={s('display:flex;align-items:center;gap:clamp(16px,3vw,36px);width:100%;max-width:720px')}>
            <span style={s(RULE)} />
            <p style={s("margin:0;font-family:'Cardo',serif;font-style:italic;font-size:clamp(18px,2vw,23px);line-height:1.4;color:#26454F;text-wrap:balance")}>{t.procCloseA}</p>
            <span style={s(RULE)} />
          </div>
          <p style={s('margin:0;font-size:15px;line-height:1.6;color:#5E6C71;font-weight:300')}>{t.procCloseB}</p>
        </div>
      </div>
    </section>
  );
}
