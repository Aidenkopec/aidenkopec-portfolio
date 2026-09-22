'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import { useSupportsWebGL } from '@/hooks/useSupportsWebGL';

// Loaded on demand so three.js stays out of the initial bundle.
const SwarmCanvas = dynamic(() => import('./SwarmCanvas'), { ssr: false });

/**
 * Fixed layer behind all homepage content. `app/page.tsx` is a Server Component
 * and `ssr: false` is not allowed there, so the dynamic import and the gate live
 * in this island. Without WebGL nothing mounts and the page reads as plain text.
 */
const SwarmStage: React.FC = () => {
  const supportsWebGL = useSupportsWebGL();

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none fixed inset-0 -z-10 h-screen w-full'
    >
      {supportsWebGL && <SwarmCanvas />}
    </div>
  );
};

export default SwarmStage;
