import { useEffect, useRef, useState } from 'react';
import { s } from '../../lib/css.js';

// Optional photo picker for the commission form. Shows a small preview once
// chosen. The file itself is only sent with "Send by email".
export default function PhotoField({ t, file, onChange, label }) {
  const input = useRef(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!file) { setPreview(''); return undefined; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div style={s('display:grid;gap:10px')}>
      <span style={label}>{t.fPhoto}</span>
      <div style={s('border:1px dashed #CDBCA4;padding:24px;text-align:center;background:#FCFAF6;display:grid;gap:14px;justify-items:center')}>
        {preview && <img src={preview} alt="" style={s('max-width:100%;max-height:220px;border-radius:4px;display:block')} />}
        {file && <p style={s('margin:0;font-size:13px;color:#455459;word-break:break-word')}>{file.name}</p>}
        <input ref={input} type="file" accept="image/*" hidden
          onChange={(e) => { onChange(e.target.files && e.target.files[0] ? e.target.files[0] : null); e.target.value = ''; }} />
        <div style={s('display:flex;gap:18px;flex-wrap:wrap;justify-content:center')}>
          <button type="button" onClick={() => input.current && input.current.click()} className="h-fill-coral"
            style={s('min-height:44px;background:none;border:1px solid #CDBCA4;border-radius:2px;padding:10px 20px;font-size:14px;color:#26454F;cursor:pointer;transition:background .2s,color .2s')}>
            {file ? t.fPhotoChange : t.fPhotoPick}
          </button>
          {file && (
            <button type="button" onClick={() => onChange(null)} className="h-color-coral"
              style={s('background:none;border:0;padding:10px 2px;font-size:14px;color:#85949A;cursor:pointer')}>{t.fPhotoRemove}</button>
          )}
        </div>
        <p style={s('margin:0;font-size:13px;font-weight:300;color:#85949A;line-height:1.6;max-width:44ch')}>{t.fPhotoNote}</p>
      </div>
    </div>
  );
}
