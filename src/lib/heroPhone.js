// The hero background on phones (the compact layout). Two built-in choices,
// picked in the studio's Photos tab. The first is the default.
export const HERO_PHONE_SLOT = 'ad-hero-mobile';

export const HERO_PHONE_PRESETS = [
  { id: 'brush-right', name: 'Brush and palette on the right', url: '/uploads/hero-phone-1.webp' },
  { id: 'palette-left', name: 'Palette on the left, brush on the right', url: '/uploads/hero-phone-2.webp' },
];

export const HERO_PHONE_DEFAULT = HERO_PHONE_PRESETS[0].url;

// The paint palette laid over the phone hero's background photo. It is a
// transparent layer as wide as the photo, palette in the bottom-right corner,
// hanging PALETTE_DROP (x the photo's width) below the photo. Studio: replace it,
// or switch it off with ad-hero-palette {enabled: false}.
export const PALETTE_SLOT = 'ad-hero-palette';
export const PALETTE_SRC = '/uploads/hero-phone-palette.webp';
export const PALETTE_RATIO = 768 / 1366;
export const PALETTE_DROP = 0.045;
export const paletteOn = (content) => !(content && content['ad-hero-palette'] && content['ad-hero-palette'].enabled === false);
