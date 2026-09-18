import { useState } from 'react';
import { s } from '../../lib/css.js';
import { parseVideo, useVideoThumbnail } from '../../lib/video.js';

export default function Meet({ t, content }) {
  const video = parseVideo(content['ad-video-url']);
  const thumb = useVideoThumbnail(video);
  // 'playing' only when a real video parsed; otherwise toggles the "coming soon" note.
  const [open, setOpen] = useState(false);
  const playing = open && video;

  return (
    <section id="meet" style={s('background:#FCFAF6;padding:clamp(48px,7vw,100px) clamp(24px,5vw,80px)')}>
      <div data-reveal="" style={s('max-width:1400px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:clamp(28px,3.4vw,48px)')}>
        <div style={s('display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center')}>
          <p style={s('margin:0;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#E36B54')}>{t.meetEyebrow}</p>
          <h2 style={s("margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(30px,3.4vw,48px);line-height:1.1;letter-spacing:-.015em")}>{t.meetTitle}</h2>
        </div>
        <div style={s('position:relative;aspect-ratio:16/10;width:100%;max-width:900px;min-width:0')}>
          {playing ? (
            <iframe
              key={video.embedUrl}
              src={video.embedUrl}
              title={t.meetTitle || 'Video'}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              style={s('position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:6px;display:block;background:#26454F')}
            />
          ) : (
            <>
              {thumb ? (
                <img src={thumb} alt="" style={s('position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:6px;display:block')} />
              ) : (
                <div style={s('position:absolute;inset:0;border-radius:6px;background:#E3E1D8')} />
              )}
              <div style={s('position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none')}>
                <button
                  type="button"
                  onClick={() => setOpen((o) => !o)}
                  aria-label="Play the video"
                  className="h-play"
                  style={s('pointer-events:auto;width:clamp(62px,6vw,84px);height:clamp(62px,6vw,84px);border-radius:50%;border:1px solid rgba(252,250,246,.8);background:rgba(38,69,79,.34);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);color:#FCFAF6;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .3s,transform .3s')}
                >▶</button>
              </div>
              <div style={s('position:absolute;left:0;right:0;bottom:0;padding:18px 20px;color:#FCFAF6;font-size:13px;letter-spacing:.02em;background:linear-gradient(to top,rgba(38,69,79,.55),transparent);pointer-events:none')}>{t.watch}</div>
              {open && !video ? (
                <div onClick={() => setOpen(false)} style={s('position:absolute;inset:0;background:#26454F;display:flex;align-items:center;justify-content:center;color:#BCCCCA;font-size:13px;letter-spacing:.02em;text-align:center;padding:24px')}>{t.videoSoon}</div>
              ) : null}
            </>
          )}
        </div>
        <div style={s('display:flex;flex-direction:column;gap:20px;align-items:center;text-align:center;max-width:56ch')}>
          <p style={s("margin:0;font-family:'Satisfy',cursive;font-size:clamp(24px,2.6vw,34px);line-height:1.5;color:#E36B54")}>{t.tagline}</p>
        </div>
      </div>
    </section>
  );
}
