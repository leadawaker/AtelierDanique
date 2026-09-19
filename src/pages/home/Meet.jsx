import { useEffect, useRef } from 'react';
import Player from '@vimeo/player';
import { s } from '../../lib/css.js';
import { parseVideo, VIMEO_TRACK } from '../../lib/video.js';

export default function Meet({ t, content, lang }) {
  const video = parseVideo(content['ad-video-url'], lang);
  const frame = useRef(null);

  // The URL hint alone loses to Vimeo's own pick (it favours the browser's
  // language, or a track the visitor chose before), and Vimeo re-applies that
  // pick when playback starts. So switch the matching track on when the player
  // is ready and again at the first play. English is left to Vimeo. A missing
  // track is silently skipped.
  const wanted = video && video.provider === 'vimeo' ? VIMEO_TRACK[lang] : '';
  useEffect(() => {
    if (!wanted || !frame.current) return undefined;
    let live = true;
    const player = new Player(frame.current);
    const norm = (code) => String(code || '').toLowerCase().replace('_', '-');
    const pick = () => player.getTextTracks()
      .then((tracks) => {
        console.info('[meet] vimeo tracks', tracks.map((x) => x.language + '/' + x.kind + '/' + x.mode), 'wanted', wanted);
        const want = norm(wanted);
        const hit = tracks.find((x) => norm(x.language) === want)
          || tracks.find((x) => norm(x.language).split('-')[0] === want.split('-')[0]);
        if (live && hit && hit.mode !== 'showing') return player.enableTextTrack(hit.language, hit.kind);
        return null;
      })
      .catch((e) => console.info('[meet] subtitle switch failed', e && e.name));
    const onFirstPlay = () => { player.off('play', onFirstPlay); pick(); };
    player.ready().then(pick).catch(() => {});
    player.on('play', onFirstPlay);
    return () => { live = false; player.off('play', onFirstPlay); };
  }, [wanted, video && video.embedUrl]);

  return (
    <section id="meet" style={s('background:#FCFAF6;padding:clamp(48px,7vw,100px) clamp(24px,5vw,80px)')}>
      <div data-reveal="" style={s('max-width:1400px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:clamp(28px,3.4vw,48px)')}>
        <div style={s('display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center')}>
          <p style={s('margin:0;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#E36B54')}>{t.meetEyebrow}</p>
          <h2 style={s("margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(30px,3.4vw,48px);line-height:1.1;letter-spacing:-.015em")}>{t.meetTitle}</h2>
        </div>
        <div style={s('position:relative;aspect-ratio:16/10;width:100%;max-width:900px;min-width:0')}>
          {video ? (
            <iframe
              ref={frame}
              key={video.embedUrl}
              src={video.embedUrl}
              title={t.meetTitle || 'Video'}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              style={s('position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:6px;display:block;background:#26454F')}
            />
          ) : (
            <div style={s('position:absolute;inset:0;border-radius:6px;background:#26454F;display:flex;align-items:center;justify-content:center;color:#BCCCCA;font-size:13px;letter-spacing:.02em;text-align:center;padding:24px')}>{t.videoSoon}</div>
          )}
        </div>
        <div style={s('display:flex;flex-direction:column;gap:20px;align-items:center;text-align:center;max-width:56ch')}>
          <p style={s("margin:0;font-family:'Satisfy',cursive;font-size:clamp(24px,2.6vw,34px);line-height:1.5;color:#E36B54")}>{t.tagline}</p>
        </div>
      </div>
    </section>
  );
}
