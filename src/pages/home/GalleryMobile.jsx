import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { s } from '../../lib/css.js';
import Slot from '../../components/Slot.jsx';
import GalleryLightbox from './GalleryLightbox.jsx';
import { PhotosContext, croppedRatio, resolvePhoto } from '../../lib/photos.js';
// Shape assumed for a piece whose image has not loaded yet.
const DEFAULT_RATIO = 4 / 5;
// A cap rather than a fixed height: a very tall photo would otherwise make a
// phone card fill the whole screen, so past this it crops like before.
const MAX_HEIGHT = 562;
const SLIDE_STYLE = 'flex:0 0 86%;scroll-snap-align:center;position:relative;border-radius:6px;overflow:hidden;background:#E3E1D8';
// The autoplay pace and on/off are shared with the desktop strip, set from
// the studio's gallery settings; everything else about this layout is fixed.
const HOLD_MS = 9000;

// Centre `child` inside the horizontally scrolling `parent`.
function centreIn(parent, child) {
  parent.scrollTo({ left: child.offsetLeft - (parent.clientWidth - child.offsetWidth) / 2, behavior: 'smooth' });
}

// Compact gallery: snap-scrolling cards with a thumbnail strip that follows
// the centred card. Autoplay steps one card per interval and waits 9s after
// the visitor touches the track or picks a thumbnail.
export default function GalleryMobile({ items, tweaks }) {
  const trackRef = useRef(null);
  const thumbsRef = useRef(null);
  const holdRef = useRef(0);
  const idxRef = useRef(0);
  const [mobIdx, setMobIdx] = useState(0);
  // The card opened full-width in the lightbox by tapping it; null when closed.
  // Mirrored in a ref so autoplay stays paused while it is open.
  const [viewIdx, setViewIdx] = useState(null);
  const viewRef = useRef(null);
  viewRef.current = viewIdx;
  const closeView = useCallback(() => {
    holdRef.current = Date.now() + HOLD_MS;
    setViewIdx(null);
  }, []);

  // Each piece's own shape, read from the image itself, so its card is as
  // tall as the photo needs rather than always cropping to one fixed height.
  const photos = useContext(PhotosContext);
  const shots = items.map((it) => resolvePhoto(photos, it.slotId));
  const urls = shots.map((p) => (p && p.url) || '');
  const [natural, setNatural] = useState({});
  const urlKey = urls.join('|');
  useEffect(() => {
    let live = true;
    urls.forEach((url) => {
      if (!url || natural[url]) return;
      const img = new Image();
      img.onload = () => {
        if (live && img.naturalWidth && img.naturalHeight) {
          setNatural((prev) => ({ ...prev, [url]: img.naturalWidth / img.naturalHeight }));
        }
      };
      img.src = url;
    });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey]);
  const ratioAt = (i) => {
    const n = natural[urls[i]];
    return n ? croppedRatio(shots[i], n) : DEFAULT_RATIO;
  };

  // Autoplay.
  useEffect(() => {
    if (tweaks.autoplay === false) return undefined;
    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track || !track.offsetParent || viewRef.current !== null || holdRef.current > Date.now()) return;
      const card = track.firstElementChild;
      if (!card) return;
      const stepPx = card.getBoundingClientRect().width + 12;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + stepPx, behavior: 'smooth' });
    }, tweaks.interval);
    return () => clearInterval(id);
  }, [tweaks.autoplay, tweaks.interval]);

  // Touch hold and centred-card tracking.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    let idxT = null;
    const hold = () => { holdRef.current = Date.now() + HOLD_MS; };
    const syncIdx = () => {
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0, bestD = Infinity;
      for (let i = 0; i < track.children.length; i++) {
        const c = track.children[i];
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      }
      if (best !== idxRef.current) {
        idxRef.current = best;
        setMobIdx(best);
        const strip = thumbsRef.current;
        const th = strip && strip.children[best];
        if (th) centreIn(strip, th);
      }
    };
    const onScroll = () => { clearTimeout(idxT); idxT = setTimeout(syncIdx, 90); };
    track.addEventListener('pointerdown', hold);
    track.addEventListener('touchstart', hold, { passive: true });
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(idxT);
      track.removeEventListener('pointerdown', hold);
      track.removeEventListener('touchstart', hold);
      track.removeEventListener('scroll', onScroll);
    };
  }, []);

  const pick = (i) => {
    holdRef.current = Date.now() + HOLD_MS;
    const track = trackRef.current;
    const card = track && track.children[i];
    if (card) centreIn(track, card);
  };

  const active = Math.min(mobIdx, Math.max(0, items.length - 1));

  return (
    <>
      <div ref={trackRef} data-mob-gallery="" data-noscrollbar="" style={s('display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:4px')}>
        {items.map((item, i) => (
          <div
            key={item.slotId}
            onClick={() => setViewIdx(i)}
            style={s(SLIDE_STYLE + ';aspect-ratio:' + ratioAt(i) + ';max-height:' + MAX_HEIGHT + 'px;cursor:pointer')}
          >
            <Slot slotId={item.slotId} placeholder={item.placeholder} alt={item.title} />
          </div>
        ))}
      </div>
      <div ref={thumbsRef} data-mob-thumbs="" data-noscrollbar="" style={s('display:flex;gap:8px;margin-top:10px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px')}>
        {items.map((item, i) => (
          <button
            key={item.slotId}
            type="button"
            onClick={() => pick(i)}
            aria-label={item.title}
            style={s('position:relative;flex:0 0 auto;width:60px;height:60px;padding:0;border-radius:4px;overflow:hidden;cursor:pointer;background:#E3E1D8;transition:opacity .25s,border-color .25s;'
              + (i === active ? 'border:2px solid #E36B54;opacity:1' : 'border:1px solid #DDD9CF;opacity:.55'))}
          >
            <Slot slotId={item.slotId} />
          </button>
        ))}
      </div>
      {viewIdx !== null && items[viewIdx] && (
        <GalleryLightbox item={items[viewIdx]} photo={shots[viewIdx]} ratio={ratioAt(viewIdx)} onClose={closeView} />
      )}
    </>
  );
}
