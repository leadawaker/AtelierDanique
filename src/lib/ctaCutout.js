// The bottom call to action on phones: a rounded photo card of Danique, cut off
// at her neck, with a transparent cut-out of her laid on top so her head rises
// above the card. Both pictures have the same shape (888 x 1182) and line up.
// Studio uploads to the cut-out slot keep their transparency.
export const CUTOUT_SLOT = 'ad-about-cutout';
export const CUTOUT_SRC = '/uploads/danique-pop-top.webp';
export const CARD_SLOT = 'ad-about-cutout-card';
export const CARD_SRC = '/uploads/danique-pop-bottom.webp';

export const POP_W = 888;
export const POP_H = 1182;
// Where the card starts, counted from the top of the picture (around her neck).
export const POP_CARD_TOP = 450;
export const POP_CARD_H = POP_H - POP_CARD_TOP;
export const POP_RADIUS = 22;
// The card shows the bottom part of its picture.
export const CARD_FOCUS = { fx: 0.5, fy: 1 };
