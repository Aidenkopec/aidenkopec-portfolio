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
 * A spiral galaxy seen face on, centred on (0, 0) with y up: a bright bulge,
 * two logarithmic arms that widen as they wind out, and a faint disc between
 * them. `radius` is where the arms end.
 */
export function galaxyPoints(radius: number, count = 6000): Float32Array {
  const points = new Float32Array(count * 2);
  // Standard normal from two uniforms (Box Muller).
  const gauss = () =>
    Math.sqrt(-2 * Math.log(1 - Math.random())) *
    Math.cos(2 * Math.PI * Math.random());
  const inner = radius * 0.1;
  // Arm pitch: smaller winds tighter.
  const pitch = Math.tan(0.32);

  for (let i = 0; i < count; i++) {
    const kind = Math.random();
    let x: number;
    let y: number;
    if (kind < 0.22) {
      // Bulge.
      const r = Math.abs(gauss()) * radius * 0.13;
      const a = Math.random() * Math.PI * 2;
      x = Math.cos(a) * r;
      y = Math.sin(a) * r;
    } else if (kind < 0.88) {
      // Arms. Denser near the core, scattered wider further out.
      const t = Math.pow(Math.random(), 0.75);
      const r = inner + (radius - inner) * t;
      const arm = Math.random() < 0.5 ? 0 : Math.PI;
      const a = arm + Math.log(r / inner) / pitch;
      const spread = radius * (0.018 + 0.045 * t);
      x = Math.cos(a) * r + gauss() * spread;
      y = Math.sin(a) * r + gauss() * spread;
    } else {
      // Disc between the arms.
      const r = radius * Math.sqrt(Math.random()) * 1.05;
      const a = Math.random() * Math.PI * 2;
      x = Math.cos(a) * r;
      y = Math.sin(a) * r;
    }
    points[i * 2] = x;
    points[i * 2 + 1] = y;
  }

  return points;
}

/**
 * A hairline `width` px long, just under its slot's top edge. Points bunch
 * toward the middle, like the gradient line they stand in for.
 */
export function linePoints(width: number, count = 3000): Float32Array {
  const points = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    points[i * 2] = ((Math.random() + Math.random()) / 2) * width;
    points[i * 2 + 1] = 2;
  }
  return points;
}

/**
 * Writes a shape into the simulation's target texture data, over particles
 * `from` to `to` only, so several shapes can share the texture. The first
 * `count` of that range take a random shape point each, jittered within its
 * pixel, and are bound (w = 1) to `group` (z). The rest of the range is spare
 * (w = 0) and keeps drifting.
 */
export function writeTargets(
  target: Float32Array,
  points: Float32Array,
  count: number,
  { from = 0, to = target.length / 4, group = 0 } = {},
) {
  const pointCount = points.length / 2;

  for (let i = from; i < to; i++) {
    const o = i * 4;
    if (i - from >= count || pointCount === 0) {
      target[o + 3] = 0;
      continue;
    }
    const p = Math.floor(Math.random() * pointCount) * 2;
    target[o] = points[p]! + Math.random();
    target[o + 1] = points[p + 1]! + Math.random();
    target[o + 2] = group;
    target[o + 3] = 1;
  }
}
