// The hero background on phones (the compact layout). Two built-in choices,
// picked in the studio's Photos tab. The first is the default.
export const HERO_PHONE_SLOT = 'ad-hero-mobile';

export const HERO_PHONE_PRESETS = [
  { id: 'brush-right', name: 'Brush and palette on the right', url: '/uploads/hero-phone-1.webp' },
  { id: 'palette-left', name: 'Palette on the left, brush on the right', url: '/uploads/hero-phone-2.webp' },
];

export const HERO_PHONE_DEFAULT = HERO_PHONE_PRESETS[0].url;
