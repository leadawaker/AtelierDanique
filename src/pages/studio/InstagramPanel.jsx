import { useEffect, useState } from 'react';
import { s } from '../../lib/css.js';

// Instagram section on /edit: shows when the posts were last fetched and lets
// her fetch them now instead of waiting for the daily 19:00 update.

const H2 = "margin:0;font-family:'Cardo',serif;font-weight:400;font-size:clamp(22px,2.4vw,30px);line-height:1.1";
const NOTE = 'margin:0;font-size:13px;line-height:1.6;color:#85949A;font-weight:300';

function formatWhen(iso) {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(d);
}

export default function InstagramPanel() {
  const [info, setInfo] = useState(null);
  const [state, setState] = useState('idle');
  const [detail, setDetail] = useState('');

  useEffect(() => {
    fetch('/api/instagram-feed?t=' + Date.now())
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setInfo({ count: (d.posts || []).length, updatedAt: d.updatedAt }))
      .catch(() => {});
  }, []);

  const refresh = async () => {
    setState('working');
    setDetail('');
    try {
      const res = await fetch('/api/cron/refresh-instagram', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error('Your login has expired. Log out and in again.');
      if (!res.ok || !data.ok) throw new Error(data.error || 'Error ' + res.status);
      setInfo({ count: data.count, updatedAt: data.updatedAt });
      setState('done');
    } catch (e) {
      setDetail(e.message);
      setState('error');
    }
  };

  const when = info && formatWhen(info.updatedAt);
  return (
    <section style={s('margin-top:clamp(44px,6vw,72px)')}>
      <div style={s('border-bottom:1px solid #DDD9CF;padding-bottom:12px;margin-bottom:22px')}>
        <h2 style={s(H2)}>Instagram</h2>
      </div>
      <div style={s('display:flex;flex-direction:column;gap:12px;max-width:640px')}>
        <p style={s('margin:0;font-size:15px;line-height:1.7;color:#455459;font-weight:300')}>
          Your latest Instagram posts show on the home page. They update on their own every evening at 7pm. Press the button to update them right now.
        </p>
        <p aria-live="polite" style={s('margin:0;font-size:14px;line-height:1.6;color:#26454F')}>
          {state === 'working' ? 'Fetching your posts…'
            : state === 'error' ? <span style={s('color:#C0503B')}>Couldn't fetch your posts. Send Gabriel a screenshot of this message.</span>
            : when ? (state === 'done' ? '✓ ' : '') + info.count + ' posts, last updated ' + when + '.'
            : info ? 'Not fetched yet, so the Instagram section is hidden on the website.' : ''}
        </p>
        {detail && <p style={s(NOTE + ';word-break:break-word')}>{detail}</p>}
        <button type="button" onClick={refresh} disabled={state === 'working'} className="h-fill-coral"
          style={s('align-self:flex-start;min-height:44px;background:none;border:1px solid #D3CFC4;border-radius:2px;padding:10px 20px;font-size:14px;color:#26454F;cursor:pointer;transition:background .2s,color .2s')}>
          {state === 'working' ? 'Updating…' : 'Update Instagram posts now'}
        </button>
        <p style={s(NOTE)}>The website can take up to 5 minutes to show the new posts.</p>
      </div>
    </section>
  );
}
