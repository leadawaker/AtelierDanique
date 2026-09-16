import { useEffect, useState } from 'react';

const QUERY = '(max-width: 1000px)';

// True under 1000px, the design's single breakpoint.
export function useCompact() {
  const [compact, setCompact] = useState(() => window.matchMedia(QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const sync = () => setCompact(mq.matches);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return compact;
}
