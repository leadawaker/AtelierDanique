import { useLayoutEffect, useRef, useState } from 'react';

// Shared studio form pieces (language list, field styles, DraftField).

export const LANGS = [
  { id: 'en', label: 'English' },
  { id: 'pt', label: 'Portuguese' },
  { id: 'nl', label: 'Dutch' },
];

export const FIELD = {
  width: '100%', background: '#FCFAF6', border: 0, borderBottom: '1px solid #D3C1A9',
  padding: '8px 0', outline: 'none', fontWeight: 300, color: '#26454F', fontSize: 15,
  lineHeight: 1.55, borderRadius: 0,
};

export const SMALL_LABEL = { fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#A4AFB3' };

// A text box that keeps what she types while it has focus (so an emptied box
// does not snap back to the original under her caret), and shows the saved
// value again once she leaves it. onEdit(text) runs on every keystroke.
export function DraftField({ value, onEdit, long = false, placeholder = '', style, label }) {
  const [draft, setDraft] = useState(null);
  const ref = useRef(null);
  const shown = draft !== null ? draft : (value || '');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!long || !el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 2 + 'px';
  }, [long, shown]);

  const common = {
    ref,
    value: shown,
    placeholder,
    'aria-label': label,
    className: 'f-coral',
    onFocus: () => setDraft(value || ''),
    onBlur: () => setDraft(null),
    onChange: (e) => { setDraft(e.target.value); onEdit(e.target.value); },
    style: { ...FIELD, ...style },
  };
  if (long) return <textarea rows={2} {...common} style={{ ...common.style, resize: 'none', overflow: 'hidden', display: 'block' }} />;
  return <input type="text" {...common} />;
}
