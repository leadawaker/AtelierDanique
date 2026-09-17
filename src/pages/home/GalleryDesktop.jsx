import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { s } from '../../lib/css.js';
import Slot from '../../components/Slot.jsx';
import { PhotosContext, croppedRatio, resolvePhoto } from '../../lib/photos.js';
import { galleryColumns } from '../../lib/galleryLayout.js';

// Shape assumed for a piece whose image has not loaded yet (or has no photo).
const DEFAULT_RATIO = 16 / 9;

// Style string for one gallery instance's tweaks, computed per render since
// they now come from the studio rather than being fixed at build time.
function sqStyle(SQ) {
  return '--sq-h:' + SQ.h + 'px;--sq-gap:' + SQ.gap + 'px;--sq-slat-gap:' + SQ.slatGap + 'px;--sq-slat:' + SQ.slat + 'px;--sq-ms:' + SQ.ms + 'ms;--sq-ease:cubic-bezier(.16,1,.3,1)';
}

const ARROW = 'width:44px;height:44px;border-radius:6px;border:0;background:#E36B54;color:#FCFAF6;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:opacity .2s';

// Desktop "squeeze" strip. The strip is three copies of the gallery so columns
// 1-3 always have cards. After a step settles, the index slides back by one
// period with transitions off: identical picture, so the reset is invisible.
export default function GalleryDesktop({ items, tweaks }) {
  const SQ = {
    h: tweaks.height,
    gap: tweaks.gap,
    slat: tweaks.slatWidth,
    slatGap: tweaks.slatGap,
    radius: tweaks.radius,
    ms: tweaks.duration,
    hoverGrow: tweaks.hoverGrow !== false,
    dim: Math.min(1, Math.max(0, (tweaks.dim || 0) / 100)),
  };
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

  // The strip's width, measured before paint so the first frame is laid out.
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    setWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(() => setWidth(el.getBoundingClientRect().width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Each piece's shape (width/height), read from the image itself, so the open
  // piece can be framed at its real proportions instead of a fixed 16:9.
  const photos = useContext(PhotosContext);
  const shots = items.map((it) => resolvePhoto(photos, it.slotId));
  const urls = shots.map((p) => (p && p.url) || '');
  const [ratios, setRatios] = useState({});
  const urlKey = urls.join('|');
  useEffect(() => {
    let live = true;
    urls.forEach((url) => {
      if (!url || ratios[url]) return;
      const img = new Image();
      img.onload = () => {
        if (live && img.naturalWidth && img.naturalHeight) {
          setRatios((prev) => ({ ...prev, [url]: img.naturalWidth / img.naturalHeight }));
        }
      };
      img.src = url;
    });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey]);
  const ratioAt = (i) => {
    const k = ((i % N) + N) % N;
    const natural = ratios[urls[k]];
    return natural ? croppedRatio(shots[k], natural) : DEFAULT_RATIO;
  };

  // Item count changed (piece added or hidden): start again at the first piece.
  const [seenN, setSeenN] = useState(N);
  if (seenN !== N) {
    setSeenN(N);
    setOpenIdx(N);
    setHoverIdx(null);
  }

  const scheduleAuto = useCallback(() => {
    clearTimeout(autoT.current);
    if (tweaks.autoplay === false) return;
    autoT.current = setTimeout(() => {
      if (pausedRef.current) scheduleAuto();
      else stepRef.current(1);
    }, tweaks.interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tweaks.autoplay, tweaks.interval]);

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
  const trans = (props) => (still ? 'none' : props);

  const cols = galleryColumns({
    width: width || 1200,
    height: SQ.h,
    gap: SQ.gap,
    slat: SQ.slat,
    slatGap: SQ.slatGap,
    ratio: ratioAt(openIdx),
    hoverCol: SQ.hoverGrow ? hoverCol : -1,
  });
  const lastCol = cols.side.length;
  const colWidth = (col) => {
    if (col === 0) return cols.open;
    if (col < 0 || col > lastCol) return SQ.slat;
    return cols.side[col - 1];
  };

  return (
    <div
      ref={wrapRef}
      style={s(sqStyle(SQ))}
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
            const w = colWidth(col);
            const panelStyle = 'position:relative;height:100%;flex-shrink:0;overflow:hidden;cursor:pointer;background:#E3E1D8;width:' + w + 'px'
              + ';margin-left:' + (i === 0 ? '0' : (col <= lastCol ? 'var(--sq-gap)' : 'var(--sq-slat-gap)'))
              + ';border-radius:' + Math.min(SQ.radius, w / 2) + 'px;transition:' + trans('width var(--sq-ms) var(--sq-ease),margin-left var(--sq-ms) var(--sq-ease)');
            // The image keeps its own full width inside a narrower panel, so a
            // column opening up reveals more of it rather than rescaling it.
            const imageWrapStyle = 'position:absolute;top:0;bottom:0;left:50%;transform:translateX(-50%);width:' + (SQ.h * ratioAt(i)) + 'px;min-width:100%;'
              + (col === 0 ? '' : 'pointer-events:none');
            // Fades with the same easing as the width change, so a slide
            // arriving at the open spot loses its tint at the same pace it
            // grows into it, rather than snapping dark or clear.
            const dimStyle = 'position:absolute;inset:0;background:#14262C;pointer-events:none;opacity:' + (col === 0 ? 0 : SQ.dim)
              + ';transition:' + trans('opacity var(--sq-ms) var(--sq-ease)');
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
                {SQ.dim > 0 && <div style={s(dimStyle)} />}
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
