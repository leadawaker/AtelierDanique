import { useState } from 'react';
import { s } from '../../../lib/css.js';
import { parseVideo } from '../../../lib/video.js';
import EditableSlot from '../EditableSlot.jsx';
import InstagramPanel from '../InstagramPanel.jsx';

// Photos tab: the fixed photos around the site, the hero layout switch and
// the video link and the Instagram update button.

const SITE_PHOTOS = [
  { slotId: 'ad-hero-banner', name: 'Hero banner', where: 'Top of the home page, behind the headline.', src: '/uploads/Project%20(20260915100023).jpg', focus: { fx: 1, fy: 0.5 }, ratio: '16/9' },
  { slotId: 'ad-which-photo', name: 'FAQ background', where: 'Behind the FAQ section, under a dark teal wash.', src: '/uploads/Project (20260915085353).jpg', ratio: '4/3' },
  { slotId: 'ad-price-a5', name: 'A5 commission card', where: 'Pricing, the A5 option.', src: '/uploads/a5-sheet.jpg', ratio: '3/4' },
  { slotId: 'ad-price-a4', name: 'A4 commission card', where: 'Pricing, the A4 option.', src: '/uploads/a4-sheet.jpg', ratio: '3/4' },
  { slotId: 'ad-process-1', name: 'How it works, step 1', where: 'Above "Choose your moment". Shown without a frame, so a picture on a light or white background looks best.', src: '/uploads/Project%20(20260919052116).webp', ratio: '5/4' },
  { slotId: 'ad-process-2', name: 'How it works, step 2', where: 'Above "Send your photo".', src: '/uploads/Project2%20(20260919052438).webp', ratio: '5/4' },
  { slotId: 'ad-process-3', name: 'How it works, step 3', where: 'Above "I create your artwork" (the highlighted step).', src: '/uploads/Project%20(20260919055618).webp', ratio: '5/4' },
  { slotId: 'ad-process-4', name: 'How it works, step 4', where: 'Above "Receive your artwork".', src: '/uploads/proc-4.jpg', ratio: '5/4' },
  { slotId: 'ad-about-portrait', name: 'Portrait of Danique', where: 'The About section near the footer.', src: '/uploads/danique.jpg', ratio: '3/4' },
];

const SECTION = 'margin-bottom:clamp(44px,6vw,72px)';
const H2 = "margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(22px,2.4vw,30px);line-height:1.1";
const H2_WRAP = 'border-bottom:1px solid #DDD9CF;padding-bottom:12px;margin-bottom:22px';
const NOTE = 'margin:0;font-size:13px;line-height:1.6;color:#85949A;font-weight:300';
const PANEL = 'background:#F1EFE8;border:1px solid #E2DED4;border-radius:6px;padding:14px';

export default function PhotosTab({ content, update }) {
  return (
    <div>
      <SitePhotos photos={content['ad-photos']} onChange={(next) => update('ad-photos', next)} />
      <HeroLayout value={content['ad-hero-layout']} onChange={(v) => update('ad-hero-layout', v)} />
      <VideoLink value={content['ad-video-url'] || ''} onChange={(v) => update('ad-video-url', v)} />
      <InstagramPanel />
    </div>
  );
}

function SitePhotos({ photos, onChange }) {
  return (
    <section style={s(SECTION)}>
      <div style={s(H2_WRAP)}>
        <h2 style={s(H2)}>Photos around the website</h2>
      </div>
      <div style={s('display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,290px),1fr));gap:clamp(18px,2.4vw,28px)')}>
        {SITE_PHOTOS.map((p) => (
          <div key={p.slotId} style={s('display:flex;flex-direction:column;gap:12px;' + PANEL)}>
            <div style={s('position:relative;aspect-ratio:' + p.ratio + ';border-radius:6px;overflow:hidden;background:#E3E1D8')}>
              <EditableSlot slotId={p.slotId} src={p.src || undefined} focus={p.focus} placeholder="Drop a new photo" radius={6} photos={photos} onChange={onChange} />
            </div>
            <div>
              <p style={s('margin:0 0 4px;font-size:15px;line-height:1.3')}>{p.name}</p>
              <p style={s(NOTE)}>{p.where}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const LAYOUTS = [
  { id: 'banner', label: 'Photo across the whole top (text over the photo)' },
  { id: 'split', label: 'Text left, photo right' },
];

function HeroLayout({ value, onChange }) {
  const current = value === 'split' ? 'split' : 'banner';
  return (
    <section style={s(SECTION)}>
      <div style={s(H2_WRAP)}>
        <h2 style={s(H2)}>Top of the page layout</h2>
      </div>
      <p style={s(NOTE + ';margin-bottom:18px;font-size:14px')}>Choose how the first thing visitors see is laid out. The photo is the "Hero banner" above.</p>
      <div role="radiogroup" aria-label="Top of the page layout"
        style={s('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:14px;max-width:640px')}>
        {LAYOUTS.map((l) => {
          const on = l.id === current;
          return (
            <button key={l.id} type="button" role="radio" aria-checked={on} onClick={() => onChange(l.id)}
              className={on ? '' : 'h-border-coral'}
              style={s('display:flex;flex-direction:column;gap:12px;text-align:left;cursor:pointer;border-radius:6px;padding:14px;min-height:44px;transition:border-color .2s;'
                + (on ? 'background:#FCFAF6;border:2px solid #E36B54' : 'background:#F1EFE8;border:2px solid #E2DED4'))}>
              <Schematic kind={l.id} />
              <span style={s('display:flex;align-items:flex-start;gap:10px;font-size:14px;line-height:1.45;color:#26454F')}>
                <span aria-hidden="true" style={s('flex:0 0 auto;width:16px;height:16px;margin-top:2px;border-radius:50%;border:1.5px solid ' + (on ? '#E36B54' : '#A4AFB3')
                  + ';box-shadow:inset 0 0 0 3px #FCFAF6;background:' + (on ? '#E36B54' : 'transparent'))} />
                <span>{l.label}{on ? <span style={s('display:block;font-size:12px;color:#85949A;font-weight:300')}>On the website now</span> : null}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// Tiny drawing of each layout: grey lines for text, a teal block for the photo.
function Schematic({ kind }) {
  const lines = (
    <div style={s('display:flex;flex-direction:column;gap:5px;width:100%')}>
      <div style={s('height:7px;width:80%;background:#26454F;border-radius:1px')} />
      <div style={s('height:4px;width:60%;background:#85949A;border-radius:1px')} />
      <div style={s('height:4px;width:50%;background:#85949A;border-radius:1px')} />
      <div style={s('height:8px;width:34%;background:#E36B54;border-radius:1px;margin-top:3px')} />
    </div>
  );
  if (kind === 'split') {
    return (
      <div aria-hidden="true" style={s('display:flex;aspect-ratio:16/7;width:100%;border-radius:3px;overflow:hidden;background:#FCFAF6;border:1px solid #DDD9CF')}>
        <div style={s('flex:1;display:flex;align-items:center;padding:0 10%')}>{lines}</div>
        <div style={s('flex:1;background:linear-gradient(135deg,#6F8C8F,#26454F)')} />
      </div>
    );
  }
  return (
    <div aria-hidden="true" style={s('position:relative;aspect-ratio:16/7;width:100%;border-radius:3px;overflow:hidden;border:1px solid #DDD9CF;background:linear-gradient(135deg,#6F8C8F,#26454F)')}>
      <div style={s('position:absolute;inset:0;background:linear-gradient(90deg,rgba(252,250,246,.95) 0%,rgba(252,250,246,.75) 40%,rgba(252,250,246,0) 70%)')} />
      <div style={s('position:absolute;inset:0;display:flex;align-items:center;padding:0 8%;width:55%')}>{lines}</div>
    </div>
  );
}

function VideoLink({ value, onChange }) {
  const [previewing, setPreviewing] = useState('');
  const video = parseVideo(value);
  const name = video && (video.provider === 'vimeo' ? 'Vimeo' : 'YouTube');
  const showPreview = video && previewing === video.embedUrl;

  let feedback;
  if (!value.trim()) {
    feedback = <p style={s(NOTE + ';font-size:14px')}>No video yet. Visitors see the 'film is being made' message.</p>;
  } else if (video) {
    feedback = <p style={s('margin:0;font-size:14px;line-height:1.6;color:#26454F')}>✓ {name} video found. It plays when a visitor presses play.</p>;
  } else {
    feedback = <p style={s('margin:0;font-size:14px;line-height:1.6;color:#C0503B')}>That link doesn't look like a Vimeo or YouTube video.</p>;
  }

  return (
    <section>
      <div style={s(H2_WRAP)}>
        <h2 style={s(H2)}>Video</h2>
      </div>
      <div style={s('display:flex;flex-direction:column;gap:12px;max-width:640px')}>
        <label htmlFor="ad-video-url" style={s('font-size:15px;line-height:1.3')}>Paste a Vimeo or YouTube link</label>
        <input
          id="ad-video-url" type="url" inputMode="url" autoComplete="off" spellCheck={false}
          value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://vimeo.com/…"
          className="f-coral"
          style={s('background:#F1EFE8;border:1px solid #D3CFC4;border-radius:2px;padding:14px 16px;font-size:16px;outline:none;color:#26454F;width:100%')}
        />
        <div aria-live="polite">{feedback}</div>

        {video && (
          <div style={s('display:flex;flex-direction:column;gap:12px')}>
            {showPreview ? (
              <div style={s('position:relative;aspect-ratio:16/9;border-radius:6px;overflow:hidden;background:#1F3C46')}>
                <iframe src={video.embedUrl} title="Video preview" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
                  style={s('position:absolute;inset:0;width:100%;height:100%;border:0')} />
              </div>
            ) : null}
            <button type="button" onClick={() => setPreviewing(showPreview ? '' : video.embedUrl)}
              className="h-fill-coral"
              style={s('align-self:flex-start;min-height:44px;background:none;border:1px solid #D3CFC4;border-radius:2px;padding:10px 20px;font-size:14px;color:#26454F;cursor:pointer;transition:background .2s,color .2s')}>
              {showPreview ? 'Close preview' : 'Preview'}
            </button>
          </div>
        )}

        <p style={s(NOTE)}>Before the video plays, visitors see the thumbnail from Vimeo or YouTube itself, whatever you picked there.</p>
        <p style={s(NOTE)}>Tip: on Vimeo, set the video to Unlisted for the cleanest player.</p>
      </div>
    </section>
  );
}
