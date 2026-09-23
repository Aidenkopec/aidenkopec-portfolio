'use client';

import React, { useRef } from 'react';

import SectionHeader from '@/components/chart/SectionHeader';
import { type Technology } from '@/constants';

/**
 * Hairline cells over the swarm, like a catalogue plate. One pointer handler writes each tile's cursor
 * offset to CSS variables, and the tiles draw their own spotlight border from
 * those, so edges near the cursor light up as it sweeps across the grid.
 */
const TechGrid: React.FC<{ technologies: Technology[] }> = ({
  technologies,
}) => {
  const gridRef = useRef<HTMLUListElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLUListElement>) => {
    const tiles =
      gridRef.current?.querySelectorAll<HTMLElement>('.tech-tile') ?? [];
    for (const tile of tiles) {
      const rect = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      tile.style.setProperty('--my', `${event.clientY - rect.top}px`);
    }
  };

  return (
    <>
      <SectionHeader
        title='Tech stack'
        intro='The tools I reach for every day.'
      />

      <ul
        ref={gridRef}
        onPointerMove={handlePointerMove}
        className='tech-grid mt-12 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6'
      >
        {technologies.map((technology) => (
          <li key={technology.name}>
            <div
              tabIndex={0}
              className='tech-tile'
              style={
                {
                  '--brand': technology.color,
                  '--icon': `url(${technology.icon})`,
                } as React.CSSProperties
              }
            >
              <span aria-hidden='true' className='tech-glow' />
              <span aria-hidden='true' className='tech-logo' />
              <span className='tech-name'>{technology.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TechGrid;
