'use client';

import React, { useEffect, useRef } from 'react';

import { type Service } from '@/constants';

const CELL = 200;
const FIGURE = 130;
const INSET = (CELL - FIGURE) / 2;

// A fixed scatter of faint background stars. Seeded, so the server and the
// client draw the same sky.
const FIELD = (() => {
  let seed = 7;
  const next = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: 70 }, () => ({
    x: next() * CELL * 2,
    y: next() * CELL * 2,
    r: 0.4 + next() * 0.9,
    o: 0.15 + next() * 0.35,
  }));
})();

/**
 * The services as four constellations on one plate. Their lines draw in the
 * first time the plate scrolls into view; hovering one lights it up.
 */
const Constellations: React.FC<{ services: Service[] }> = ({ services }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        svg.dataset.inView = '';
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  return (
    <figure>
      <svg
        ref={ref}
        viewBox={`0 0 ${CELL * 2} ${CELL * 2}`}
        className='constellations w-full overflow-visible'
        role='img'
        aria-label={`Four constellations: ${services.map((s) => s.title).join(', ')}`}
      >
        {/* Right ascension and declination lines, as on a printed chart. */}
        <g stroke='var(--chart-faint)' fill='none'>
          <circle cx={CELL} cy={CELL} r={CELL * 0.98} />
          <ellipse cx={CELL} cy={CELL} rx={CELL * 0.98} ry={CELL * 0.45} />
          <ellipse cx={CELL} cy={CELL} rx={CELL * 0.45} ry={CELL * 0.98} />
          <line x1={0} y1={CELL} x2={CELL * 2} y2={CELL} />
          <line x1={CELL} y1={0} x2={CELL} y2={CELL * 2} />
        </g>

        <g fill='var(--star)'>
          {FIELD.map((star, i) => (
            <circle
              key={i}
              cx={star.x}
              cy={star.y}
              r={star.r}
              opacity={star.o}
            />
          ))}
        </g>

        {services.map((service, index) => {
          const ox = (index % 2) * CELL + INSET;
          const oy = Math.floor(index / 2) * CELL + INSET - 8;
          const point = (i: number) => {
            const [x, y] = service.stars[i]!;
            return { x: ox + (x / 100) * FIGURE, y: oy + (y / 100) * FIGURE };
          };

          return (
            <g
              key={service.title}
              className='constellation'
              style={{ '--i': index } as React.CSSProperties}
            >
              {/* A wide transparent target, so the whole figure takes hover. */}
              <rect
                x={ox - INSET / 2}
                y={oy - INSET / 2}
                width={FIGURE + INSET}
                height={FIGURE + INSET + 24}
                fill='transparent'
              />
              {service.edges.map(([a, b]) => {
                const from = point(a);
                const to = point(b);
                return (
                  <line
                    key={`${a}-${b}`}
                    className='constellation-edge'
                    pathLength={1}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                  />
                );
              })}
              {service.stars.map(([, , size], i) => {
                const { x, y } = point(i);
                return (
                  <g key={i} className='constellation-star'>
                    <circle cx={x} cy={y} r={size * 2.6} opacity={0.14} />
                    <circle cx={x} cy={y} r={size * 0.9} />
                  </g>
                );
              })}
              <text
                x={ox + FIGURE / 2}
                y={oy + FIGURE + 30}
                textAnchor='middle'
                className='constellation-label'
              >
                {service.title}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
};

export default Constellations;
