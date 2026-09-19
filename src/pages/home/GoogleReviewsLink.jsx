import { s } from '../../lib/css.js';

// Off until Danique switches it on in the studio (Testimonials tab), once
// there are a few Google reviews to point to.
export default function GoogleReviewsLink({ t, content }) {
  const g = content['ad-google-reviews'] || {};
  if (!g.enabled || !g.url) return null;
  return (
    <p style={s('margin:28px 0 0;text-align:center;font-size:14px')}>
      <a href={g.url} target="_blank" rel="noopener noreferrer" className="h-color-coral" style={s('color:#5E6C71;border-bottom:1px solid #D3CFC4;padding-bottom:2px')}>
        {'★ '}{t.googleReviews}{'  →'}
      </a>
    </p>
  );
}
