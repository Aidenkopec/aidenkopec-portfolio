'use client';

import { useEffect, useRef } from 'react';

// How far down the viewport the head of the path sits while scrolling. The
// navbar tracks the same line, so its route strip agrees with this one.
export const HEAD = 0.62;
// Spacing of the length to height lookup, in CSS pixels along the path.
const SAMPLE_STEP = 6;
// The last stretch into the galaxy fades out over this many pixels.
const FADE = 220;

type Sample = { length: number; x: number; y: number };
type Stop = { element: HTMLElement; y: number };

const visible = (element: HTMLElement) => element.getClientRects().length > 0;

/**
 * The route the page takes from the hero to the contact galaxy. It threads a
 * curve through every [data-waypoint] inside its parent, in page order, and
 * draws itself up to a line a little below the middle of the viewport, so the
 * reader's position is always the head of the path. Stops the head has passed
 * get `data-reached`.
 *
 * Every segment leaves and enters its stops vertically, which keeps the curve
 * monotonic in y. That is what lets scroll position map to a length with a
 * simple lookup.
 */
export default function FlightPath() {
  const svgRef = useRef<SVGSVGElement>(null);
  const plannedRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const flownRef = useRef<SVGPathElement>(null);
  const probeRef = useRef<SVGGElement>(null);
  const fadeStartRef = useRef<SVGStopElement>(null);
  const fadeEndRef = useRef<SVGStopElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const root = svg?.parentElement;
    const planned = plannedRef.current;
    const glow = glowRef.current;
    const flown = flownRef.current;
    const probe = probeRef.current;
    if (!svg || !root || !planned || !glow || !flown || !probe) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let samples: Sample[] = [];
    let stops: Stop[] = [];
    let total = 0;
    let frame = 0;

    const draw = () => {
      frame = 0;
      if (total === 0) return;

      const head = window.innerHeight * HEAD - root.getBoundingClientRect().top;
      // First sample at or below the head, or the end under reduced motion.
      let index = samples.length - 1;
      if (!reduced.matches) {
        let low = 0;
        while (low < index) {
          const mid = (low + index) >> 1;
          if (samples[mid]!.y < head) low = mid + 1;
          else index = mid;
        }
      }
      const at = samples[index]!;
      const length = !reduced.matches && head <= 0 ? 0 : at.length;

      const offset = String(total - length);
      flown.style.strokeDashoffset = offset;
      glow.style.strokeDashoffset = offset;

      const flying = !reduced.matches && length > 0 && length < total;
      probe.style.opacity = flying ? '1' : '0';
      probe.setAttribute('transform', `translate(${at.x} ${at.y})`);

      for (const stop of stops) {
        const reached = reduced.matches || stop.y <= head;
        if (reached) stop.element.dataset.reached = '';
        else delete stop.element.dataset.reached;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const build = () => {
      const box = root.getBoundingClientRect();
      const width = box.width;
      const height = box.height;
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

      const points = Array.from(
        root.querySelectorAll<HTMLElement>('[data-waypoint]'),
      )
        .filter(visible)
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            element,
            x: rect.left + rect.width / 2 - box.left,
            y: rect.top + rect.height / 2 - box.top,
          };
        })
        .sort((a, b) => a.y - b.y);

      if (points.length === 0) {
        total = 0;
        return;
      }

      // Leaves the hero from the middle of the page.
      let previous = { x: width / 2, y: 0 };
      let d = `M ${previous.x} ${previous.y}`;
      for (const point of points) {
        const bend = (point.y - previous.y) / 2;
        d += ` C ${previous.x} ${previous.y + bend} ${point.x} ${point.y - bend} ${point.x} ${point.y}`;
        previous = point;
      }
      for (const path of [planned, glow, flown]) path.setAttribute('d', d);

      total = flown.getTotalLength();
      samples = [];
      for (let length = 0; length < total; length += SAMPLE_STEP) {
        const { x, y } = flown.getPointAtLength(length);
        samples.push({ length, x, y });
      }
      samples.push({ length: total, x: previous.x, y: previous.y });

      const dash = String(total);
      flown.style.strokeDasharray = dash;
      glow.style.strokeDasharray = dash;

      // The route dissolves into the galaxy instead of ending on a point.
      const end = previous.y / height;
      fadeStartRef.current?.setAttribute(
        'offset',
        String(Math.max(0, (previous.y - FADE) / height)),
      );
      fadeEndRef.current?.setAttribute('offset', String(end));

      stops = points.map(({ element, y }) => ({ element, y }));
      draw();
    };

    let buildFrame = 0;
    const scheduleBuild = () => {
      cancelAnimationFrame(buildFrame);
      buildFrame = requestAnimationFrame(build);
    };

    // Images, fonts and the GitHub data all land after first paint, and each
    // moves the stops, so the route is rebuilt whenever the page resizes.
    const observer = new ResizeObserver(scheduleBuild);
    observer.observe(root);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', scheduleBuild);
    reduced.addEventListener('change', schedule);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', scheduleBuild);
      reduced.removeEventListener('change', schedule);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(buildFrame);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden='true'
      className='pointer-events-none absolute inset-0 h-full w-full overflow-visible'
      preserveAspectRatio='none'
    >
      <defs>
        <linearGradient
          id='flight-fade'
          gradientUnits='objectBoundingBox'
          x1='0'
          y1='0'
          x2='0'
          y2='1'
        >
          <stop ref={fadeStartRef} offset='0.97' stopColor='white' />
          <stop ref={fadeEndRef} offset='1' stopColor='white' stopOpacity='0' />
        </linearGradient>
        <mask id='flight-mask' maskUnits='userSpaceOnUse'>
          <rect width='100%' height='100%' fill='url(#flight-fade)' />
        </mask>
      </defs>

      <g mask='url(#flight-mask)' fill='none' strokeLinecap='round'>
        {/* The route still ahead, as a dotted course line. */}
        <path
          ref={plannedRef}
          stroke='var(--chart-line)'
          strokeWidth={2}
          strokeDasharray='0.5 10'
        />
        <path
          ref={glowRef}
          stroke='var(--text-color-variable)'
          strokeOpacity={0.18}
          strokeWidth={7}
        />
        <path
          ref={flownRef}
          stroke='var(--text-color-variable)'
          strokeWidth={1.5}
        />
      </g>

      <g ref={probeRef} style={{ opacity: 0, transition: 'opacity 0.3s' }}>
        <circle r={14} fill='var(--text-color-variable)' opacity={0.15} />
        <circle r={5} fill='var(--text-color-variable)' opacity={0.5} />
        <circle r={2.5} fill='var(--star)' />
      </g>
    </svg>
  );
}
