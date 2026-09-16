import { s } from '../../lib/css.js';
import { buildGallery } from '../../lib/gallery.js';
import GalleryDesktop from './GalleryDesktop.jsx';
import GalleryMobile from './GalleryMobile.jsx';

export default function Gallery({ t, lang, compact, content, links }) {
  const items = buildGallery(content, lang);

  return (
    <section id="gallery" style={s('padding: clamp(48px,7vw,100px) clamp(24px,5vw,80px); background-color: #1F3C46')}>
      <div data-reveal="" style={s('max-width:1400px;margin:0 auto')}>
        <div style={s('display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:clamp(28px,4vw,52px)')}>
          <div>
            <p style={s('margin:0 0 10px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#EAC66B')}>{t.galEyebrow}</p>
            <h2 style={s("margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(36px,4.4vw,60px);line-height:1;letter-spacing:-.02em;color:#FCFAF6")}>{t.galTitle}</h2>
            <p style={s('margin:12px 0 0;font-size:13px;color:#AEC0BE;font-weight:300;letter-spacing:.04em')}>{compact ? t.hintSwipe : t.hintClick}</p>
          </div>
          <a href={links.instagramUrl} target="_blank" rel="noopener" className="h-color-gold" style={s('font-size:14px;color:#E4EDEA;border-bottom:1px solid #EAC66B;padding-bottom:3px')}>{t.galSeeMore}{'  →'}</a>
        </div>
        {compact ? <GalleryMobile items={items} /> : <GalleryDesktop items={items} />}
      </div>
    </section>
  );
}
