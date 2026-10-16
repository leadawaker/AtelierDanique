import { useCallback, useEffect, useRef, useState } from 'react';

// Polaroid line carousel: prints pegged to a sagging string. Drag the line
// (or use the arrows / ←→) and the prints slide along it, swinging with the
// speed you give them. The centred print is the active one; clicking it opens
// its `href`, clicking a side print brings it to the centre.
// Ported from 21st.dev/@kedhareswer/polaroid-line-carousel, without the
// painted-landscape fallback (every slide here has an image or a `node`).
//
// slides: [{ image?, node?, title?, caption?, alt?, href? }]

const wrapClamp = (v, a, b) => Math.min(b, Math.max(a, v));

// Height of a string sagging by `sag` between (0, y0) and (w, y0), at x.
function stringY(x, w, y0, sag) {
  const t = wrapClamp(x / w, 0, 1);
  return y0 + 4 * sag * t * (1 - t);
}

// One step of a critically damped spring toward target.
function springStep(x, v, target, dt, k = 70) {
  const c = 2 * Math.sqrt(k);
  const nv = v + (k * (target - x) - c * v) * dt;
  return [x + nv * dt, nv];
}

// One step of a print's swing: it lags behind the motion, gravity pulls it back.
function swingStep(a, w, lineVel, dt, gain) {
  const nw = w + (-38 * a - 4.2 * w + lineVel * 0.0034 * gain) * dt;
  return [wrapClamp(a + nw * dt, -0.6, 0.6), nw];
}

const nearestAt = (off, spacing, n) => wrapClamp(Math.round(off / spacing), 0, Math.max(0, n - 1));
const pad2 = (n) => (n < 10 ? '0' + n : String(n));

const PL_CSS = `
.pl-root{position:relative;width:100%;overflow:hidden;background:var(--pl-bg);color:var(--pl-ink);user-select:none;-webkit-user-select:none;touch-action:pan-y;outline:none;cursor:grab}
.pl-root[data-drag='1']{cursor:grabbing}
.pl-root:focus-visible{box-shadow:inset 0 0 0 2px var(--pl-ink)}
.pl-string{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:visible}
.pl-card{position:absolute;left:0;top:0;width:var(--pl-cw);transform-origin:50% 0;will-change:transform;cursor:inherit}
.pl-card[data-on='1'][data-link='1']{cursor:pointer}
.pl-print{margin-top:10px;background:#FFFEFB;padding:10px 10px 0;box-shadow:0 1px 2px rgba(38,69,79,.12),0 18px 30px -16px rgba(38,69,79,.45);transition:transform .5s cubic-bezier(.2,.7,.2,1),filter .5s ease}
.pl-card[data-on='0'] .pl-print{transform:scale(.9);filter:saturate(.7) brightness(.96)}
.pl-shot{position:relative;aspect-ratio:3/4;overflow:hidden;background:#E3E1D8}
.pl-shot img{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;display:block;pointer-events:none}
.pl-note{height:34px}
.pl-peg{position:absolute;left:50%;top:0;width:10px;height:26px;margin-left:-5px;border-radius:2px;background:linear-gradient(90deg,#c9a67a,#e3c9a1 45%,#b8915f);box-shadow:0 2px 3px rgba(0,0,0,.25)}
.pl-peg::after{content:'';position:absolute;left:4px;top:8px;width:2px;height:7px;background:rgba(80,60,30,.45);border-radius:1px}
.pl-bar{position:absolute;left:clamp(24px,5vw,80px);right:clamp(24px,5vw,80px);bottom:clamp(16px,3vh,32px);display:flex;align-items:center;gap:clamp(12px,2vw,24px);cursor:default}
.pl-cap{flex:1;min-width:0;overflow:hidden;padding-bottom:.15em}
.pl-cap>*{display:block;animation:pl-in .55s cubic-bezier(.2,.8,.2,1) both}
.pl-title{max-width:760px;font:400 clamp(14px,1.2vw,16px)/1.5 'Cardo',Georgia,serif;color:var(--pl-ink);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;white-space:pre-line}
a.pl-title:hover{color:#E36B54}
.pl-sub{margin-top:4px;font-size:12px;font-weight:300;letter-spacing:.04em;color:var(--pl-muted)}
.pl-count{font-size:12px;letter-spacing:.14em;color:var(--pl-muted)}
.pl-count b{color:var(--pl-ink);font-weight:400}
.pl-btn{appearance:none;flex:0 0 auto;width:40px;height:40px;border-radius:50%;border:1px solid var(--pl-line);background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer;transition:background .2s ease,color .2s ease,border-color .2s ease}
.pl-btn:hover{background:#E36B54;border-color:#E36B54;color:#FCFAF6}
.pl-btn:focus-visible{outline:2px solid var(--pl-ink);outline-offset:2px}
.pl-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (max-width:639px){.pl-count,.pl-btn{display:none}.pl-title{-webkit-line-clamp:4}}
@keyframes pl-in{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}
@media (prefers-reduced-motion:reduce){.pl-cap>*{animation:none}.pl-print{transition:none}}
`;

function openHref(href) {
  if (href) window.open(href, '_blank', 'noopener');
}

export default function PolaroidLineCarousel({
  slides,
  height = '100svh',
  cardWidth = 300,
  sag = 46,
  swing = 1,
  autoplay = 4500,
  string = '#85949A',
  background = '#F1EFE8',
  ink = '#26454F',
  ariaLabel = 'Image carousel',
}) {
  const n = slides.length;
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [size, setSize] = useState({ w: 1200, h: 800, cw: cardWidth });
  const rootRef = useRef(null);
  const pathRef = useRef(null);
  const cards = useRef([]);
  const sim = useRef({ off: 0, vel: 0, target: 0, a: [], w: [] });
  const drag = useRef(null);
  const lastTouch = useRef(0);
  const activeRef = useRef(0);
  const opts = useRef({ sag, swing });
  opts.current = { sag, swing };

  const spacing = size.cw * 1.08;
  const goTo = useCallback((i) => { sim.current.target = wrapClamp(i, 0, n - 1) * spacing; }, [n, spacing]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const ro = new ResizeObserver(() => {
      const r = root.getBoundingClientRect();
      // Narrow screens get a bigger share of the width so the print stays legible.
      const share = r.width < 640 ? 0.6 : 0.42;
      const cw = Math.round(Math.max(150, Math.min(cardWidth, r.width * share, r.height * 0.34)));
      setSize({ w: r.width, h: r.height, cw });
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [cardWidth]);

  // keep the target on the active print when the spacing changes
  useEffect(() => {
    sim.current.target = activeRef.current * spacing;
    sim.current.off = activeRef.current * spacing;
  }, [spacing]);

  // the simulation, written straight to the DOM each frame
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    let raf = 0;
    let prev = performance.now();
    const S = sim.current;
    const frame = (now) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      const { w, h, cw } = size;
      const y0 = Math.max(40, h * 0.12);
      const d = drag.current;
      let lineVel;
      if (d && d.moved) {
        lineVel = d.v * 1000;
      } else {
        const before = S.off;
        [S.off, S.vel] = springStep(S.off, S.vel, S.target, dt);
        lineVel = -(S.off - before) / Math.max(dt, 1e-3);
      }
      const o = opts.current;
      const g = reduce ? 0 : o.swing;
      const near = nearestAt(S.off, spacing, n);
      for (let i = 0; i < n; i++) {
        const el = cards.current[i];
        if (!el) continue;
        const x = w / 2 + i * spacing - S.off;
        if (x < -cw * 1.5 || x > w + cw * 1.5) {
          el.style.visibility = 'hidden';
          continue;
        }
        el.style.visibility = 'visible';
        let a = S.a[i] || 0;
        let av = S.w[i] || 0;
        [a, av] = swingStep(a, av, lineVel, dt, g);
        if (g) a += Math.sin(now / 1300 + i * 1.7) * 0.0009 * g;
        S.a[i] = a;
        S.w[i] = av;
        const y = stringY(x, w, y0, o.sag) - 6;
        el.style.transform = `translate(${(x - cw / 2).toFixed(1)}px,${y.toFixed(1)}px) rotate(${a.toFixed(4)}rad)`;
        el.style.zIndex = String(i === near ? n + 1 : n - Math.abs(i - near));
      }
      pathRef.current?.setAttribute('d', `M0 ${y0} Q${w / 2} ${y0 + 2 * o.sag} ${w} ${y0}`);
      if (near !== activeRef.current) {
        activeRef.current = near;
        setActive(near);
      }
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(root);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [size, spacing, n]);

  // autoplay, back to the first print after the last
  useEffect(() => {
    if (!autoplay || n < 2) return undefined;
    const t = window.setInterval(() => {
      if (document.hidden || drag.current || performance.now() - lastTouch.current < autoplay) return;
      goTo(activeRef.current >= n - 1 ? 0 : activeRef.current + 1);
    }, autoplay);
    return () => window.clearInterval(t);
  }, [autoplay, n, goTo]);

  const onDown = (e) => {
    if (e.target.closest('.pl-bar')) return;
    lastTouch.current = performance.now();
    drag.current = { x: e.clientX, off: sim.current.off, lx: e.clientX, lt: e.timeStamp, v: 0, moved: false };
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      setDragging(true);
      rootRef.current?.setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    const dt = Math.max(1, e.timeStamp - d.lt);
    d.v = 0.7 * ((e.clientX - d.lx) / dt) + 0.3 * d.v;
    d.lx = e.clientX;
    d.lt = e.timeStamp;
    const max = (n - 1) * spacing;
    let off = d.off - dx;
    if (off < 0) off *= 0.35;
    if (off > max) off = max + (off - max) * 0.35;
    sim.current.off = off;
  };
  const onUp = (e) => {
    const d = drag.current;
    drag.current = null;
    lastTouch.current = performance.now();
    if (!d) return;
    if (d.moved) {
      setDragging(false);
      sim.current.vel = -d.v * 1000;
      goTo(nearestAt(sim.current.off - d.v * 180, spacing, n));
      return;
    }
    if (e.type === 'pointercancel') return;
    const card = e.target.closest('[data-i]');
    if (!card) return;
    const i = Number(card.getAttribute('data-i'));
    if (i === activeRef.current) openHref(slides[i]?.href);
    else goTo(i);
  };
  const step = (dir) => {
    lastTouch.current = performance.now();
    goTo(wrapClamp(activeRef.current + dir, 0, n - 1));
  };
  const onKey = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Enter') openHref(slides[activeRef.current]?.href);
    else return;
    e.preventDefault();
  };

  const cur = slides[active] || {};

  return (
    <div
      ref={rootRef}
      className="pl-root"
      style={{
        height,
        '--pl-bg': background,
        '--pl-ink': ink,
        '--pl-muted': 'color-mix(in srgb, var(--pl-ink) 55%, transparent)',
        '--pl-line': 'color-mix(in srgb, var(--pl-ink) 22%, transparent)',
        '--pl-cw': size.cw + 'px',
      }}
      data-drag={dragging ? '1' : '0'}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <style>{PL_CSS}</style>
      <svg className="pl-string" aria-hidden="true">
        <path ref={pathRef} fill="none" stroke={string} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {slides.map((sl, i) => (
        <div
          key={i}
          className="pl-card"
          data-i={i}
          data-on={i === active ? '1' : '0'}
          data-link={sl.href ? '1' : '0'}
          ref={(el) => { cards.current[i] = el; }}
          aria-hidden={i === active ? undefined : true}
        >
          <div className="pl-print">
            <div className="pl-shot">
              {sl.node || (sl.image ? <img src={sl.image} alt={sl.alt || sl.title || ''} draggable={false} loading="lazy" /> : null)}
            </div>
            <div className="pl-note" />
          </div>
          <div className="pl-peg" />
        </div>
      ))}
      <div className="pl-bar">
        <div className="pl-cap" key={active}>
          {cur.title
            ? (cur.href
              ? <a className="pl-title" href={cur.href} target="_blank" rel="noopener">{cur.title}</a>
              : <span className="pl-title">{cur.title}</span>)
            : null}
          {cur.caption ? <span className="pl-sub">{cur.caption}</span> : null}
        </div>
        <span className="pl-count" aria-hidden="true">
          <b>{pad2(active + 1)}</b> / {pad2(n)}
        </span>
        <button type="button" className="pl-btn" aria-label="Previous" onClick={() => step(-1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.4" /></svg>
        </button>
        <button type="button" className="pl-btn" aria-label="Next" onClick={() => step(1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.4" /></svg>
        </button>
      </div>
      <div className="pl-sr" aria-live="polite">
        {`Print ${active + 1} of ${n}${cur.title ? ': ' + cur.title : ''}`}
      </div>
    </div>
  );
}
