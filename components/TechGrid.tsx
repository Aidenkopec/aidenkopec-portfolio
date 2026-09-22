'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import React from 'react';

import { type Technology } from '@/constants';
import { useCanRender3D } from '@/hooks/useCanRender3D';
import { useInViewport } from '@/hooks/useInViewport';

// Loaded on demand so three.js stays out of the initial bundle.
const BallCanvas = dynamic(() => import('./canvas/Ball'), { ssr: false });

/**
 * One WebGL context per icon is twelve contexts, against a browser ceiling of
 * sixteen that this page already crowds. So the whole grid shares a single
 * viewport observer and unmounts together the moment it scrolls away, freeing
 * those contexts for the sections below.
 *
 * When 3D is off, the icon itself is what the section is communicating, so the
 * fallback is the same image through next/image rather than an empty box.
 */
const TechGrid: React.FC<{ technologies: Technology[] }> = ({
  technologies,
}) => {
  const canRender3D = useCanRender3D();
  const { ref, mounted } = useInViewport<HTMLDivElement>(canRender3D);

  return (
    <div ref={ref} className='flex flex-row flex-wrap justify-center gap-10'>
      {technologies.map((technology) => (
        <div className='h-28 w-28' key={technology.name}>
          {canRender3D && mounted ? (
            <BallCanvas icon={technology.icon} />
          ) : (
            <Image
              src={technology.icon}
              alt={technology.name}
              width={112}
              height={112}
              className='h-full w-full object-contain'
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TechGrid;
