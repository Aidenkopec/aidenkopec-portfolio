'use client';

import { motion } from 'framer-motion';
import React, { useRef } from 'react';

import { type Technology } from '@/constants';
import { fadeIn, textVariant } from '@/utils';

/**
 * Glass tiles over the swarm. One pointer handler writes each tile's cursor
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
      <motion.div variants={textVariant()}>
        <p className='section-sub-text'>What I build with</p>
        <h2 className='section-head-text'>Tech Stack.</h2>
      </motion.div>

      <ul
        ref={gridRef}
        onPointerMove={handlePointerMove}
        className='tech-grid mt-12 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6'
      >
        {technologies.map((technology, index) => (
          <motion.li
            key={technology.name}
            variants={fadeIn('up', 'spring', index * 0.05, 0.6)}
          >
            <div
              tabIndex={0}
              className='tech-tile glass'
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
          </motion.li>
        ))}
      </ul>
    </>
  );
};

export default TechGrid;
