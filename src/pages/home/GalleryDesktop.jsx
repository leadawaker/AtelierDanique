import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { s } from '../../lib/css.js';
import Slot from '../../components/Slot.jsx';
import { GALLERY_TWEAKS } from './settings.js';

// Share of the free room each visible column gets: col 0 (open), 1, 2, 3.
const SHARES = [-0.06, 0.61, 0.3, 0.15];
const STRETCHED = [0, 0.71, 0.4, 0.25];
const SQUEEZED = [-0.12, 0.59, 0.28, 0.13];

const SQ = {
  h: GALLERY_TWEAKS.height,
  gap: GALLERY_TWEAKS.gap,
  slat: GALLERY_TWEAKS.slatWidth,
  slatGap: GALLERY_TWEAKS.slatGap,
  radius: GALLERY_TWEAKS.radius,
  ms: GALLERY_TWEAKS.duration,
  hoverGrow: GALLERY_TWEAKS.hoverGrow !== false,
};

const WRAP_STYLE = 'container-type:inline-size;--sq-h:' + SQ.h + 'px;--sq-gap:' + SQ.gap + 'px;--sq-slat-gap:' + SQ.slatGap + 'px;--sq-slat:' + SQ.slat + 'px;--sq-ms:' + SQ.ms + 'ms;--sq-ease:cubic-bezier(.16,1,.3,1);--sq-hero:calc(var(--sq-h) * 16 / 9);--sq-room:calc(100cqi - var(--sq-hero) - 3 * var(--sq-slat-gap) - 3 * var(--sq-gap) - 3 * var(--sq-slat))';

const ARROW = 'width:44px;height:44px;border-radius:6px;border:0;background:#E36B54;color:#FCFAF6;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:opacity .2s';

// Desktop "squeeze" strip. The strip is three copies of the gallery so columns
// 1-3 always have cards. After a step settles, the index slides back by one
// period with transitions off: identical picture, so the reset is invisible.
export default function GalleryDesktop({ items }) {
  const N = Math.max(1, items.length);
  const loop = [...items, ...items, ...items];

  const [openIdx, setOpenIdx] = useState(N);
  const [hoverIdx, setHoverIdx] = useState(null);
  const [still, setStill] = useState(false);

  const openRef = useRef(openIdx);
  const pausedRef = useRef(false);
  const nRef = useRef(N);
  const stripRef = useRef(null);
  const autoT = useRef(null);
  const settleT = useRef(null);
  const rafRef = useRef(null);

  openRef.current = openIdx;
  nRef.current = N;

  // Item count changed (piece added or hidden): start again at the first piece.
  const [seenN, setSeenN] = useState(N);
  if (seenN !== N) {
    setSeenN(N);
    setOpenIdx(N);
    setHoverIdx(null);
  }

  const scheduleAuto = useCallback(() => {
    clearTimeout(autoT.current);
    if (GALLERY_TWEAKS.autoplay === false) return;
    autoT.current = setTimeout(() => {
      if (pausedRef.current) scheduleAuto();
      else stepRef.current(1);
    }, GALLERY_TWEAKS.interval);
  }, []);

  const stepRef = useRef(null);
  const step = useCallback((by) => {
    clearTimeout(settleT.current);
    scheduleAuto();
    const next = openRef.current + by;
    openRef.current = next;
    setStill(false);
    setOpenIdx(next);
    settleT.current = setTimeout(() => {
      const n0 = nRef.current;
      let n = openRef.current;
      if (n >= 2 * n0) n -= n0;
      else if (n < n0) n += n0;
      if (n === openRef.current) return;
      const delta = n - openRef.current;
      openRef.current = n;
      flushSync(() => {
        setStill(true);
        setOpenIdx(n);
        setHoverIdx((h) => (h === null ? null : h + delta));
      });
      // Force a style pass with transitions off before turning them back on.
      if (stripRef.current) stripRef.current.getBoundingClientRect();
      rafRef.current = requestAnimationFrame(() => setStill(false));
    }, SQ.ms + 40);
  }, [scheduleAuto]);
  stepRef.current = step;

  useEffect(() => {
    scheduleAuto();
    return () => {
      clearTimeout(autoT.current);
      clearTimeout(settleT.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleAuto]);

  const titleAt = (i) => (items[i] && items[i].title) || '';
  const capAt = (i) => (items[i] && items[i].caption) || '';
  const hoverCol = hoverIdx === null ? -9 : hoverIdx - openIdx;
  const hoverActive = SQ.hoverGrow && hoverCol >= 0 && hoverCol <= 3;
  const trans = (props) => (still ? 'none' : props);

  return (
    <div
      style={s(WRAP_STYLE)}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; setHoverIdx(null); }}
    >
      <div style={s('width:100%;overflow:hidden;height:var(--sq-h)')}>
        <div
          ref={stripRef}
          style={s('display:flex;height:100%;width:max-content;transform:translateX(calc(-' + openIdx + ' * (var(--sq-slat) + var(--sq-gap))));transition:' + trans('transform var(--sq-ms) var(--sq-ease)'))}
        >
          {loop.map((it, i) => {
            const col = i - openIdx;
            const shares = hoverActive ? (hoverCol === col ? STRETCHED : SQUEEZED) : SHARES;
            const width = (col < 0 || col > 3)
              ? 'var(--sq-slat)'
              : (col === 0
                ? 'calc(var(--sq-hero) + var(--sq-room) * ' + shares[0] + ')'
                : 'calc(var(--sq-room) * ' + shares[col] + ')');
            const panelStyle = 'position:relative;height:100%;flex-shrink:0;overflow:hidden;cursor:pointer;background:#E3E1D8;width:' + width
              + ';margin-left:' + (i === 0 ? '0' : (col < 4 ? 'var(--sq-gap)' : 'var(--sq-slat-gap)'))
              + ';border-radius:min(' + SQ.radius + 'px, calc(' + width + ' / 2));transition:' + trans('width var(--sq-ms) var(--sq-ease),margin-left var(--sq-ms) var(--sq-ease)');
            const imageWrapStyle = 'position:absolute;top:0;bottom:0;left:50%;transform:translateX(-50%);width:var(--sq-hero);min-width:100%;'
              + (col === 0 ? '' : 'pointer-events:none');
            return (
              <div
                key={i}
                onClick={() => { if (col !== 0) step(col); }}
                onMouseMove={() => { if (hoverIdx !== i) setHoverIdx(i); }}
                style={s(panelStyle)}
              >
                <div style={s(imageWrapStyle)}>
                  <Slot slotId={it.slotId} placeholder={it.placeholder} alt={it.title} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={s('margin-top:26px;display:flex;align-items:flex-start;justify-content:space-between;gap:32px;flex-wrap:wrap')}>
        <p style={s('margin:0;max-width:46rem;font-size:17px;line-height:1.6;text-wrap:balance')}>
          <span style={s('color:#FCFAF6')}>{titleAt(openIdx % N)}</span>{' '}
          <span style={s('color:#AEC0BE;font-weight:300')}>{capAt(openIdx % N)}</span>
        </p>
        <div style={s('display:flex;gap:8px;flex-shrink:0')}>
          <button type="button" onClick={() => step(-1)} aria-label="Previous" className="h-opacity" style={s(ARROW)}>←</button>
          <button type="button" onClick={() => step(1)} aria-label="Next" className="h-opacity" style={s(ARROW)}>→</button>
        </div>
      </div>
    </div>
  );
}
