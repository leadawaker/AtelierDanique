import { useCallback, useEffect, useState } from 'react';
import { s } from '../../lib/css.js';
import { useLang } from '../../lib/lang.js';
import { pathFor } from '../../lib/routes.js';
import { PhotosContext } from '../../lib/photos.js';
import { STRINGS } from '../../lib/strings.js';
import { useCompact } from '../../lib/useCompact.js';
import Header from '../home/Header.jsx';
import { getSession, login, logout, useStudioContent } from './api.js';
import HeroSettingsDialog from './HeroSettingsDialog.jsx';
import GalleryTab from './tabs/GalleryTab.jsx';
import PhotosTab from './tabs/PhotosTab.jsx';
import TestimonialsTab from './tabs/TestimonialsTab.jsx';
import CopyTab from './tabs/CopyTab.jsx';
import PricingTab from './tabs/PricingTab.jsx';
import StatsTab from './tabs/StatsTab.jsx';

// /login (and /edit): Danique's private Website manager, under the site's
// own header. The password is checked on the server; this page only asks
// whether the session cookie is valid.

const TABS = [
  { id: 'stats', label: 'Stats', Component: StatsTab },
  { id: 'gallery', label: 'Gallery', Component: GalleryTab },
  { id: 'photos', label: 'Photos', Component: PhotosTab },
  { id: 'testimonials', label: 'Testimonials', Component: TestimonialsTab },
  { id: 'pricing', label: 'Pricing', Component: PricingTab },
  { id: 'copy', label: 'Copy', Component: CopyTab },
];

const PAGE_BG = 'background:#FCFAF6;min-height:100vh;color:#26454F';
const EYEBROW = 'margin:0 0 8px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#E36B54';

export default function Studio() {
  const [authed, setAuthed] = useState(null);
  const [lang, setLang] = useLang();
  const compact = useCompact();

  useEffect(() => {
    document.title = 'Website manager · Atelier Danique';
    let meta = document.querySelector('meta[name="robots"]');
    const created = !meta;
    const before = meta && meta.getAttribute('content');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex,nofollow');
    let alive = true;
    getSession().then((ok) => { if (alive) setAuthed(ok); });
    return () => {
      alive = false;
      if (created) meta.remove(); else meta.setAttribute('content', before || '');
    };
  }, []);

  const header = <Header t={STRINGS[lang] || STRINGS.en} lang={lang} setLang={setLang} compact={compact} base="/" />;
  if (authed === null) return header;
  return (
    <>
      {header}
      {authed ? <Manager lang={lang} onSignedOut={() => setAuthed(false)} /> : <PasswordScreen onSuccess={() => setAuthed(true)} />}
    </>
  );
}

function PasswordScreen({ onSuccess }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (ev) => {
    ev.preventDefault();
    if (busy) return;
    setBusy(true); setError('');
    try {
      if (await login(pw)) { onSuccess(); return; }
      setError("That password isn't right.");
    } catch (e) {
      setError(e.message === 'login 429'
        ? 'Too many wrong tries. Please wait 15 minutes and try again.'
        : 'Something went wrong. Please try again.');
    }
    setBusy(false);
  };

  return (
    <div style={s(PAGE_BG)}>
      <div style={s('max-width:420px;margin:0 auto;padding:min(22vh,180px) 24px 0;min-height:100vh')}>
        <p style={s(EYEBROW)}>Private studio page</p>
        <h1 style={s("margin:0 0 22px;font-family:'Cardo',serif;font-weight:400;font-size:clamp(26px,3.4vw,34px);line-height:1.1;letter-spacing:-.02em")}>Enter password</h1>
        <form onSubmit={submit} style={s('display:flex;flex-direction:column;gap:14px')}>
          <input
            type="password" value={pw} autoFocus placeholder="Password" autoComplete="current-password"
            onChange={(e) => { setPw(e.target.value); setError(''); }}
            style={s('background:#F1EFE8;border:1px solid #D3CFC4;border-radius:2px;padding:14px 16px;font-size:16px;outline:none;color:#26454F')}
          />
          {error && <p role="alert" style={s('margin:0;font-size:13px;color:#C0503B')}>{error}</p>}
          <button type="submit" disabled={busy} className="h-bg-coral-dark"
            style={s('background:#E36B54;color:#FCFAF6;border:0;padding:14px 20px;font-size:15px;border-radius:2px;cursor:pointer;transition:background .25s')}>
            {busy ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}

function readHash() {
  const id = window.location.hash.replace('#', '');
  return TABS.some((t) => t.id === id) ? id : 'stats';
}

function Manager({ lang, onSignedOut }) {
  const onUnauthorized = useCallback(() => onSignedOut(), [onSignedOut]);
  const { content, ready, loadError, status, errors, update } = useStudioContent({ onUnauthorized });
  const [tab, setTab] = useState(readHash);
  const [heroSettingsOpen, setHeroSettingsOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setTab(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const choose = (id) => {
    setTab(id);
    window.history.replaceState(null, '', '#' + id);
  };

  const signOut = async () => {
    await logout();
    onSignedOut();
  };

  const Active = TABS.find((t) => t.id === tab).Component;

  return (
    <div style={s(PAGE_BG)}>
      <div style={s('max-width:1200px;margin:0 auto;padding:clamp(24px,4vw,56px) clamp(16px,4vw,48px) 110px')}>
        <header style={s('display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;border-bottom:1px solid #DDD9CF;padding-bottom:22px;margin-bottom:14px')}>
          <div>
            <p style={s(EYEBROW)}>Private studio page</p>
            <h1 style={s("margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(30px,3.6vw,46px);line-height:1.05;letter-spacing:-.02em")}>Website manager</h1>
          </div>
          <div style={s('display:flex;align-items:center;gap:22px;flex-wrap:wrap')}>
            <button type="button" onClick={() => setHeroSettingsOpen(true)} className="h-color-coral"
              style={s('background:none;border:1px solid #D3CFC4;color:#26454F;padding:10px 18px;font-size:14px;border-radius:2px;cursor:pointer;min-height:44px')}>
              Header settings
            </button>
            <a href={pathFor(lang)} target="_blank" rel="noopener" className="h-color-coral"
              style={s('font-size:14px;color:#5E6C71;border-bottom:1px solid #D3CFC4;padding-bottom:2px')}>View the website&nbsp; →</a>
            <button type="button" onClick={signOut} className="h-color-coral"
              style={s('background:none;border:0;padding:10px 0;font-size:14px;color:#85949A;cursor:pointer')}>Log out</button>
          </div>
        </header>

        {heroSettingsOpen && (
          <HeroSettingsDialog
            value={content['ad-hero-settings']}
            onCancel={() => setHeroSettingsOpen(false)}
            onSave={(next) => { update('ad-hero-settings', next); setHeroSettingsOpen(false); }}
          />
        )}

        <SaveIndicator status={status} />

        {tab === 'photos' && (
        <p style={s('margin:18px 0 30px;max-width:64ch;font-size:15px;line-height:1.8;color:#455459;font-weight:300;text-wrap:pretty')}>
          Drop a photo onto any frame to replace what is on the website, then drag the photo to move it inside the frame. Every change here saves on its own, there is no Save button. Visitors can only look: nothing on the website can be changed from their side.
        </p>
        )}

        <nav role="tablist" aria-label="Website manager sections" data-noscrollbar
          style={s('display:flex;gap:clamp(18px,3vw,34px);overflow-x:auto;scrollbar-width:none;border-bottom:1px solid #DDD9CF;margin-bottom:clamp(26px,4vw,40px)' + (tab === 'photos' ? '' : ';margin-top:22px'))}>
          {TABS.map((t) => {
            const on = t.id === tab;
            return (
              <button key={t.id} type="button" role="tab" aria-selected={on} onClick={() => choose(t.id)}
                className={on ? '' : 'h-color-teal'}
                style={s('flex:0 0 auto;min-height:44px;background:none;border:0;border-bottom:2px solid ' + (on ? '#E36B54' : 'transparent')
                  + ";margin-bottom:-1px;padding:10px 2px;font-family:'Jost',sans-serif;font-size:15px;cursor:pointer;white-space:nowrap;color:" + (on ? '#26454F' : '#85949A'))}>
                {t.label}
              </button>
            );
          })}
        </nav>

        {loadError ? (
          <p style={s('margin:0;font-size:15px;color:#C0503B;font-weight:300')}>Couldn't load the website content. Refresh the page to try again.</p>
        ) : !ready ? (
          <p style={s('margin:0;font-size:15px;color:#85949A;font-weight:300')}>Loading your website…</p>
        ) : (
          <PhotosContext.Provider value={content['ad-photos']}>
            <div role="tabpanel">
              <Active content={content} update={update} errors={errors} />
            </div>
          </PhotosContext.Provider>
        )}
      </div>
    </div>
  );
}

function SaveIndicator({ status }) {
  const text = status === 'saving' ? 'Saving…'
    : status === 'saved' ? 'All changes saved'
    : status === 'error' ? "Couldn't save. Check your internet and try again."
    : '';
  const color = status === 'error' ? '#C0503B' : '#85949A';
  return (
    <p aria-live="polite" style={s('margin:0;min-height:20px;font-size:13px;font-weight:300;color:' + color)}>{text}</p>
  );
}
