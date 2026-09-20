import { useEffect, useRef, useState } from 'react';
import Slot from '../../components/Slot.jsx';
import { HERO_PHONE_DEFAULT, HERO_PHONE_SLOT, PALETTE_DROP, PALETTE_RATIO, PALETTE_SLOT, PALETTE_SRC } from '../../lib/heroPhone.js';
import { croppedRatio, placement, usePhoto } from '../../lib/photos.js';
import { s } from '../../lib/css.js';

// The phone hero's picture layers, filling the hero section: the studio-chosen
// background photo, and (with `palette`) a transparent paint-palette layer over
// it. The palette layer is tied to the photo's own box (same scale, same crop,
// from the same placement maths the photo uses), not to the section, so the two
// stay lined up on every screen size. It is as wide as the photo and hangs a
// little below it, so on phones it crosses onto the gallery.
const FALLBACK_RATIO = 853 / 1844;

// Width / height of an image once loaded; `fallback` until then.
function useNaturalRatio(url, fallback, active) {
  const [n, setN] = useState({ url: '', ratio: fallback });
  useEffect(() => {
    if (!active || !url) return undefined;
    const img = new Image();
    img.onload = () => { if (img.naturalWidth && img.naturalHeight) setN({ url, ratio: img.naturalWidth / img.naturalHeight }); };
    img.src = url;
    return () => { img.onload = null; };
  }, [url, active]);
  return n.url === url ? n.ratio : fallback;
}

// `preview`: shown in the studio, where the phone-widths-only rule (index.css) must not apply.
export default function PhoneHeroArt({ palette = false, preview = false }) {
  const photo = usePhoto(HERO_PHONE_SLOT, HERO_PHONE_DEFAULT);
  const layer = usePhoto(PALETTE_SLOT, PALETTE_SRC);
  const frameRef = useRef(null);
  const [frame, setFrame] = useState(null);
  const url = photo && photo.url;
  const photoRatio = useNaturalRatio(url, FALLBACK_RATIO, palette);
  const layerRatio = useNaturalRatio(layer && layer.url, PALETTE_RATIO, palette);

  useEffect(() => {
    const el = frameRef.current;
    if (!palette || !el) return undefined;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) setFrame({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [palette]);

  let overlay = null;
  if (palette && layer) {
    let pos = { opacity: 0 };
    if (frame && photo) {
      const box = placement(photo, croppedRatio(photo, photoRatio), frame.w / frame.h);
      const bw = box.w / 100 * frame.w;
      const bottom = (box.top + box.h) / 100 * frame.h + PALETTE_DROP * bw;
      const height = bw / layerRatio;
      pos = { opacity: 1, left: box.left / 100 * frame.w, top: bottom - height, width: bw, height };
    }
    overlay = (
      <img src={layer.url} alt="" aria-hidden="true" data-hero-palette="" className={preview ? undefined : 'hero-palette'} decoding="async"
        style={{ position: 'absolute', maxWidth: 'none', pointerEvents: 'none', zIndex: 1, transition: 'opacity .3s', ...pos }} />
    );
  }

  return (
    <div ref={frameRef} style={s('position:absolute;inset:0')}>
      <div style={s('position:absolute;inset:0')}>
        <Slot slotId={HERO_PHONE_SLOT} src={HERO_PHONE_DEFAULT} alt="" />
      </div>
      {overlay}
    </div>
  );
}
