// Column widths for the desktop "squeeze" gallery.
//
// The open (main) piece is framed at its own shape: height × the image's
// aspect ratio, so nothing is cropped. Whatever width is left goes to the
// pieces after it. A portrait leaves a lot left over, and handing all of it to
// three columns made the next piece wider than the one on show, so a narrower
// main piece shows more columns instead (3 up to 5), and no column may be
// wider than the main piece unless there is no other way to fill the row.

// Share of the leftover width per visible column after the open one.
const WEIGHTS = {
  3: [0.575, 0.283, 0.142],
  4: [0.46, 0.26, 0.17, 0.11],
  5: [0.38, 0.24, 0.17, 0.12, 0.09],
};

// Slats peeking in at the right edge after the last full column.
const TRAILING_SLATS = 3;
// A panorama still leaves room for the pieces after it.
const MAX_OPEN_SHARE = 0.68;
const HOVER_GROW = 0.08;

// Split `total` by `weights` without any part passing its cap. Callers make
// sure the caps add up to at least `total`.
function fill(total, weights, caps) {
  const out = weights.map(() => 0);
  let free = weights.map((_, i) => i);
  let left = total;
  while (free.length) {
    const sum = free.reduce((a, i) => a + weights[i], 0) || 1;
    const over = free.filter((i) => (left * weights[i]) / sum > caps[i]);
    if (!over.length) {
      free.forEach((i) => { out[i] = (left * weights[i]) / sum; });
      break;
    }
    over.forEach((i) => { out[i] = caps[i]; left -= caps[i]; });
    free = free.filter((i) => !over.includes(i));
  }
  return out;
}

// width: the strip's width in px. ratio: the open piece's width/height.
// hoverCol: the hovered column (1..n grows it, anything else changes nothing).
// Returns { open, side: [px per column after the open one] }.
export function galleryColumns({ width, height, gap, slat, slatGap, ratio, hoverCol }) {
  const open = Math.min(height * ratio, width * MAX_OPEN_SHARE);
  const roomFor = (n) => width - open - n * gap - TRAILING_SLATS * (slat + slatGap);

  let n = 5;
  for (const k of [3, 4]) {
    if (roomFor(k) * WEIGHTS[k][0] <= open * 1.05) { n = k; break; }
  }
  const room = Math.max(0, roomFor(n));

  const weights = [...WEIGHTS[n]];
  const hovered = hoverCol >= 1 && hoverCol <= n ? hoverCol - 1 : -1;
  if (hovered !== -1) {
    weights.forEach((_, i) => {
      weights[i] += i === hovered ? HOVER_GROW : -HOVER_GROW / (n - 1);
    });
  }

  // Never wider than the main piece, except when even equal columns would be.
  const cap = Math.max(open, room / n);
  const caps = weights.map((_, i) => (i === hovered ? cap * 1.25 : cap));
  return { open, side: fill(room, weights, caps) };
}
