import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { s } from '../../lib/css.js';
import Slot from '../../components/Slot.jsx';

const BTN_STYLE = 'width:36px;height:36px;border-radius:999px;border:0;padding:0;background:rgba(252,250,246,.14);display:flex;align-items:center;justify-content:center;color:#FCFAF6;cursor:pointer';
// Room kept for the button row, caption and gutters, so a tall piece shrinks
// to fit the screen instead of running off the bottom.
const RESERVED_HEIGHT = 190;

// Full-width view of one gallery piece over a darkened, blurred page. The
// photo shows at its own (studio-cropped) shape with no gallery framing, the
// caption sits below it, and the maximize button opens the original upload.
// Tapping anywhere but the photo or the buttons closes it.
export default function GalleryLightbox({ item, photo, ratio, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  // The frame already has the piece's shape, so drop any zoom or focal point
  // set for the gallery card: the whole (cropped) photo fits exactly.
  const whole = photo ? { ...photo, s: 1, fx: 0.5, fy: 0.5 } : null;
  const width = 'min(calc(100vw - 24px), calc((100dvh - ' + RESERVED_HEIGHT + 'px) * ' + ratio + '))';
  const stop = (e) => e.stopPropagation();

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      style={s('position:fixed;inset:0;z-index:1000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px;background:rgba(12,24,28,.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:ad-lightbox-in .2s ease-out')}
    >
      <style>{'@keyframes ad-lightbox-in{from{opacity:0}to{opacity:1}}'}</style>
      <div style={s('width:' + width + ';display:flex;justify-content:flex-end;gap:8px;margin-bottom:10px')}>
        {photo && photo.url && (
          <a
            href={photo.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={stop}
            aria-label="Open full image in a new tab"
            style={s(BTN_STYLE)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
          </a>
        )}
        <button type="button" onClick={onClose} aria-label="Close" style={s(BTN_STYLE)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div onClick={stop} style={s('position:relative;width:' + width + ';aspect-ratio:' + ratio + ';border-radius:6px;overflow:hidden;background:#E3E1D8')}>
        <Slot slotId={item.slotId} photo={whole} placeholder={item.placeholder} alt={[item.title, item.caption].filter(Boolean).join('. ')} />
      </div>
      <div style={s('width:' + width + ';margin-top:14px;display:flex;flex-direction:column;gap:4px')}>
        <p style={s("margin:0;font-family:'Cardo',serif;font-size:21px;line-height:1.15;color:#FCFAF6")}>{item.title}</p>
        {item.caption && <p style={s('margin:0;font-size:13px;line-height:1.55;color:#E4EDEA;font-weight:300')}>{item.caption}</p>}
      </div>
    </div>,
    document.body,
  );
}
