// Values that were designer "tweaks" (data-props) in Atelier Danique.dc.html,
// frozen at the values the design was showing.
export const LINKS = {
  instagramUrl: 'https://instagram.com/atelierdanique',
  whatsappUrl: 'https://wa.me/31617862359',
  whatsappNumber: '+31 6 17862359',
  email: 'hello@atelierdanique.com',
};

export const FLOATING_WHATSAPP = true;

export const HERO_VEIL = { reach: 74, softness: 47, opacity: 86, mobileOpacity: 85 };

// Design defaults. Danique's own choices, saved from the studio's gallery
// settings panel as 'ad-gallery-settings', are layered on top field by field,
// so a setting she has never touched keeps behaving exactly as designed.
export const GALLERY_TWEAKS = {
  height: 550,
  slatWidth: 3,
  slatGap: 5,
  gap: 23,
  radius: 6,
  duration: 1000,
  interval: 9000,
  autoplay: true,
  hoverGrow: true,
};

export function galleryTweaks(content) {
  return { ...GALLERY_TWEAKS, ...(content && content['ad-gallery-settings']) };
}

export function whatsappLink(base, text) {
  return base + (base.indexOf('?') === -1 ? '?' : '&') + 'text=' + encodeURIComponent(text);
}
