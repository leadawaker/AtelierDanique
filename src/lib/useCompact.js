import { useLayoutEffect, useState } from 'react';

const QUERY = '(max-width: 1000px)';

// True under 1000px, the design's single breakpoint.
// Starts as desktop so the server HTML and the first client render match,
// then corrects itself before the first paint.
export function useCompact() {
  const [compact, setCompact] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia(QUERY);
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return compact;
}
