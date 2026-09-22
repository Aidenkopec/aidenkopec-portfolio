'use client';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import React, { useCallback, useState } from 'react';

import { useCanRender3D } from '@/hooks/useCanRender3D';
import { useInViewport } from '@/hooks/useInViewport';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

import CanvasPlaceholder from './CanvasPlaceholder';

// Client only: the canvas needs a real WebGL context, so there is nothing for
// the server to render. The spinner below holds the space until it mounts.
const ComputersCanvas = dynamic(() => import('./canvas/Computers'), {
  ssr: false,
});

/** Holds the model's space while the chunk and the model are still coming down. */
function HeroLoader() {
  return (
    <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
      <span
        className='h-10 w-10 animate-spin rounded-full border-2 border-transparent'
        style={{ borderTopColor: 'var(--text-color-variable)' }}
        role='status'
        aria-label='Loading 3D scene'
      />
    </div>
  );
}

const Hero: React.FC = () => {
  const [modelReady, setModelReady] = useState(false);
  const canRender3D = useCanRender3D();
  const prefersReducedMotion = usePrefersReducedMotion();
  // The section is the observed box: it is already h-screen, so nothing needs a
  // wrapper. Unmounting on scroll-away hands the WebGL context back to the
  // sections below, which is the same ceiling TechGrid works around.
  const { ref, mounted, paused } = useInViewport<HTMLElement>(canRender3D);

  const handleReady = useCallback(() => setModelReady(true), []);

  return (
    <section ref={ref} className='relative mx-auto h-screen w-full'>
      <div className='absolute inset-0 top-[120px] mx-auto flex max-w-7xl flex-row items-start gap-5 padding-x'>
        <div className='mt-5 flex flex-col items-center justify-center'>
          <div
            className='h-5 w-5 rounded-full'
            style={{ backgroundColor: 'var(--text-color-variable)' }}
          />
          <div className='dynamic-gradient h-40 w-1 sm:h-80' />
        </div>

        <div>
          <h1 className='hero-head-text'>
            Hi, I&apos;m
            <span style={{ color: 'var(--text-color-variable)' }}> Aiden</span>
          </h1>
          <p className='hero-sub-text'>
            {/*className='sm:block hidden'*/}
            Analyze. Build. Transform. <br />
            Turning business challenges into powerful solutions.
          </p>
        </div>
      </div>

      {/* Gated on the canvas actually mounting: without WebGL or under reduced
          motion nothing ever calls onReady, so an ungated spinner would spin
          forever for exactly the visitors who should see no motion. */}
      {canRender3D && mounted && !modelReady && <HeroLoader />}

      {canRender3D && mounted ? (
        <ComputersCanvas onReady={handleReady} paused={paused} />
      ) : (
        <CanvasPlaceholder />
      )}

      <div className='absolute bottom-32 flex w-full items-center justify-center sm:bottom-10 md:hidden'>
        <a href='#about' aria-label='Scroll to the About section'>
          <div className='relative flex h-[64px] w-[35px] items-start justify-center rounded-3xl border-4 border-secondary p-2'>
            {/* MotionConfig drops the `y` keyframes under reduced motion but
                not the opacity ones, and this loop is infinite, so it needs an
                explicit guard. */}
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: [0, 24, 0],
                      opacity: [1, 0.5, 1],
                    }
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
              }}
              className='chevron h-3 w-3'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
