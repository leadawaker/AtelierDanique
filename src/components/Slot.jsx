import { useCallback, useEffect, useRef, useState } from 'react';
import { imageBox, isPlain, usePhoto } from '../lib/photos.js';

// Read-only photo frame: fills its (positioned) parent, crops like the Design
// tool's image-slot, and shows a soft placeholder when there is no photo.
// Pass `photo` to render a specific photo instead of looking up slotId, and
// `focus` ({fx, fy}) to aim the built-in src at part of the image.
export default function Slot({ slotId, src, focus, placeholder = '', alt = '', radius = 0, photo: forced, style }) {
  const looked = usePhoto(slotId, src, focus);
  const photo = forced || looked;
  const frameRef = useRef(null);
  const [ratios, setRatios] = useState(null);
  const plain = !photo || isPlain(photo);

  useEffect(() => {
    if (plain || !frameRef.current) return undefined;
    const el = frameRef.current;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) setRatios((prev) => ({ ...prev, frame: r.width / r.height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [plain]);

  // The prerendered <img> often finishes loading before React attaches onLoad,
  // so that load event never arrives. Measure the node on mount too, otherwise
  // a cropped photo would stay at opacity 0 and show only its grey frame.
  const measure = useCallback((node) => {
    if (node && node.complete && node.naturalWidth) {
      setRatios((prev) => ({ ...prev, image: node.naturalWidth / node.naturalHeight }));
    }
  }, [photo && photo.url]); // eslint-disable-line react-hooks/exhaustive-deps

  const frame = { position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: radius, ...style };

  if (!photo) {
    return (
      <div ref={frameRef} style={{ ...frame, background: '#E3E1D8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
        {placeholder ? <span style={{ fontSize: 12, color: '#85949A', letterSpacing: '.04em', textAlign: 'center' }}>{placeholder}</span> : null}
      </div>
    );
  }

  // A cropped photo stays invisible until it can be placed: shown uncropped
  // for a moment, the part she cut away would flash up first.
  let imgStyle = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: photo.crop ? 0 : 1 };
  if (!plain && ratios && ratios.frame && ratios.image) {
    const box = imageBox(photo, ratios.image, ratios.frame);
    imgStyle = {
      position: 'absolute', maxWidth: 'none', display: 'block',
      width: box.w + '%', height: box.h + '%',
      left: box.left + '%', top: box.top + '%',
    };
  }

  return (
    <div ref={frameRef} style={{ ...frame, background: '#E3E1D8', ...style }}>
      <img
        ref={measure}
        src={photo.url}
        alt={alt}
        draggable={false}
        loading="lazy"
        decoding="async"
        onLoad={(e) => {
          const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
          if (w && h) setRatios((prev) => ({ ...prev, image: w / h }));
        }}
        style={imgStyle}
      />
    </div>
  );
}
