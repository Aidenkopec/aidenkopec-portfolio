'use client';

import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { probeWebGL, useSupportsWebGL } from '@/hooks/useSupportsWebGL';

// Loaded on demand so three.js stays out of the initial bundle.
const SwarmCanvas = dynamic(() => import('./SwarmCanvas'), { ssr: false });

/**
 * Fixed layer behind all homepage content. `app/page.tsx` is a Server Component
 * and `ssr: false` is not allowed there, so the dynamic import and the gate live
 * in this island. Without WebGL nothing mounts and the page reads as plain text.
 */
const SwarmStage: React.FC = () => {
  const supportsWebGL = useSupportsWebGL();
  const prefersReducedMotion = usePrefersReducedMotion();

  // The head script only checks that WebGL 2 exists. If no context can be
  // created the swarm never mounts to claim the intro, so show the name now.
  useEffect(() => {
    if (!probeWebGL()) delete document.documentElement.dataset.swarmIntro;
  }, []);

  return (
    <div
      aria-hidden='true'
      data-swarm-stage
      className='pointer-events-none fixed inset-0 -z-10 h-screen w-full'
    >
      {supportsWebGL && <SwarmCanvas calm={prefersReducedMotion} />}
    </div>
  );
};

export default SwarmStage;
