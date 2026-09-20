import { useEffect, useRef, useState } from 'react';
import Slot from '../../components/Slot.jsx';
import { HERO_PHONE_DEFAULT, HERO_PHONE_SLOT } from '../../lib/heroPhone.js';
import { croppedRatio, placement, usePhoto } from '../../lib/photos.js';
import { s } from '../../lib/css.js';

// The phone hero's picture layers, filling the hero section: the studio-chosen
// background photo, and (with `palette`) a cut-out paint palette laid over its
// bottom-right corner. The palette is tied to the photo's own box (same scale,
// same crop, from the same placement maths the photo uses), not to the section,
// so the two stay lined up on every screen size. It hangs a little below the
// photo, so on phones it crosses onto the gallery.
const PALETTE = { src: '/uploads/hero-phone-palette.webp', ratio: 768 / 1366, drop: 0.045 }; // drop: x photo width
const FALLBACK_RATIO = 853 / 1844;

export default function PhoneHeroArt({ palette = false }) {
  const photo = usePhoto(HERO_PHONE_SLOT, HERO_PHONE_DEFAULT);
  const frameRef = useRef(null);
  const [frame, setFrame] = useState(null);
  const [natural, setNatural] = useState({ url: '', ratio: FALLBACK_RATIO });
  const url = photo && photo.url;

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

  useEffect(() => {
    if (!palette || !url) return undefined;
    const img = new Image();
    img.onload = () => { if (img.naturalWidth && img.naturalHeight) setNatural({ url, ratio: img.naturalWidth / img.naturalHeight }); };
    img.src = url;
    return () => { img.onload = null; };
  }, [palette, url]);

  let overlay = null;
  if (palette) {
    let pos = { opacity: 0 };
    if (frame && photo) {
      const ratio = natural.url === url ? natural.ratio : FALLBACK_RATIO;
      const box = placement(photo, croppedRatio(photo, ratio), frame.w / frame.h);
      const bw = box.w / 100 * frame.w;
      const bl = box.left / 100 * frame.w;
      const bottom = (box.top + box.h) / 100 * frame.h + PALETTE.drop * bw;
      const height = bw / PALETTE.ratio;
      pos = { opacity: 1, left: bl, top: bottom - height, width: bw, height };
    }
    overlay = (
      <img src={PALETTE.src} alt="" aria-hidden="true" className="hero-palette" width="768" height="1366" decoding="async"
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
