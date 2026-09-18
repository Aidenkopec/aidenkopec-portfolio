'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import { useCanRender3D } from '../hooks/useCanRender3D';
import { useInViewport } from '../hooks/useInViewport';

// Loaded on demand so three.js stays out of the initial bundle.
const StarsCanvas = dynamic(() => import('./canvas/Stars'), { ssr: false });

/**
 * `app/page.tsx` is a Server Component and `ssr: false` is not allowed there, so
 * the dynamic import and the gates live in this island instead.
 *
 * The positioning wrapper lives here rather than in `Stars.tsx` so the box is
 * identical whether or not the canvas mounts. There is no fallback: the field is
 * decorative and `WavyLines` already covers this background.
 */
const StarsBackdrop: React.FC = () => {
  const canRender3D = useCanRender3D();
  const { ref, mounted, paused } = useInViewport<HTMLDivElement>(canRender3D);

  return (
    <div ref={ref} className='absolute inset-0 -z-10 h-auto w-full'>
      {canRender3D && mounted && <StarsCanvas paused={paused} />}
    </div>
  );
};

export default StarsBackdrop;
