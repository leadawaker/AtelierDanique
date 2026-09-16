import { s } from '../../lib/css.js';
import { FLOATING_WHATSAPP } from './settings.js';

export default function FloatingWhatsapp({ links }) {
  if (!FLOATING_WHATSAPP) return null;
  return (
    <a href={links.whatsappUrl} target="_blank" rel="noopener" aria-label="WhatsApp" className="h-wa-float" style={s('position:fixed;right:20px;bottom:20px;z-index:50;width:56px;height:56px;border-radius:50%;background:#26454F;color:#FCFAF6;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(38,69,79,.28);transition:background .25s,transform .25s')}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.15-.15.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" /><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22.5l5.79-1.52c1.45.79 3.08 1.21 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C22.46 6.45 17.5 2 12.04 2Zm0 18.14h-.01c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.16 8.16 0 0 1-1.25-4.35c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.2-8.24 8.2Z" /></svg>
    </a>
  );
}
