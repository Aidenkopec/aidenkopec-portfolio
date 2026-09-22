/**
 * Shape builders. A shape is a flat list of local points [x0, y0, x1, y1, ...]
 * in CSS pixels, measured from the top left of its slot element with y down.
 */

/**
 * Samples the text of an element exactly where the browser rendered it. Each
 * character is drawn at its own client rect, so kerning, letter spacing and
 * line wrapping all match the real DOM text. Edge pixels are listed twice,
 * which biases particles toward stroke outlines and keeps letters crisp.
 */
export function sampleText(element: HTMLElement): Float32Array {
  const box = element.getBoundingClientRect();
  const width = Math.ceil(box.width);
  const height = Math.ceil(box.height);
  if (width === 0 || height === 0) return new Float32Array(0);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return new Float32Array(0);

  const style = getComputedStyle(element);
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'alphabetic';
  // A character's client rect spans the font's ascent plus descent, so the
  // baseline sits one ascent below its top.
  const ascent = ctx.measureText('M').fontBoundingBoxAscent;

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i]!;
      if (char.trim() === '') continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const rect = range.getBoundingClientRect();
      ctx.fillText(char, rect.left - box.left, rect.top - box.top + ascent);
    }
  }

  const { data } = ctx.getImageData(0, 0, width, height);
  const filled = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < width && y < height
      ? data[(y * width + x) * 4 + 3]! > 127
      : false;

  const points: number[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!filled(x, y)) continue;
      points.push(x, y);
      const edge =
        !filled(x - 1, y) ||
        !filled(x + 1, y) ||
        !filled(x, y - 1) ||
        !filled(x, y + 1);
      if (edge) points.push(x, y);
    }
  }

  return new Float32Array(points);
}

/**
 * Writes a shape into the simulation's target texture data. The first `count`
 * particles take a random shape point each, jittered within its pixel, and are
 * marked as bound (w = 1). The rest are spare (w = 0) and keep drifting.
 */
export function writeTargets(
  target: Float32Array,
  points: Float32Array,
  count: number,
) {
  const pointCount = points.length / 2;
  const particles = target.length / 4;

  for (let i = 0; i < particles; i++) {
    const o = i * 4;
    if (i >= count || pointCount === 0) {
      target[o + 3] = 0;
      continue;
    }
    const p = Math.floor(Math.random() * pointCount) * 2;
    target[o] = points[p]! + Math.random();
    target[o + 1] = points[p + 1]! + Math.random();
    target[o + 2] = 0;
    target[o + 3] = 1;
  }
}
