// Server-side copy of CONTENT_KEYS from src/lib/content.js (the API does not
// import from src/). Keep the two lists in sync. `type` drives validation.
export const CONTENT_TYPES = {
  "ad-gallery-extra": "array",
  "ad-gallery-hidden": "array",
  "ad-gallery-text": "object",
  "ad-photos": "object",
  "ad-gallery-settings": "object",
  "ad-testimonials": "array",
  "ad-testimonials-hidden": "array",
  "ad-testimonials-text": "object",
  "ad-video-url": "string",
  "ad-hero-layout": "string",
  "ad-copy": "object",
  "ad-pricing": "object",
  "ad-google-reviews": "object",
};

export const CONTENT_KEYS = Object.keys(CONTENT_TYPES);
