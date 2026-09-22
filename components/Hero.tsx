'use client';
import { motion } from 'framer-motion';
import React from 'react';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const Hero: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section className='relative mx-auto h-screen w-full'>
      <div className='absolute inset-0 top-[120px] mx-auto flex max-w-7xl flex-row items-start gap-5 padding-x'>
        <div className='mt-5 flex flex-col items-center justify-center'>
          <div
            className='h-5 w-5 rounded-full'
            style={{ backgroundColor: 'var(--text-color-variable)' }}
          />
          <div className='dynamic-gradient h-40 w-1 sm:h-80' />
        </div>

        <div>
          {/* The particle swarm samples this text and forms over it, then the
              text fades to transparent. It stays in the DOM for screen readers,
              search and selection, and stays visible if the swarm never runs. */}
          <h1 className='hero-head-text' data-swarm-slot='name'>
            Aiden Kopec
          </h1>
          <p className='hero-sub-text'>
            {/*className='sm:block hidden'*/}
            Analyze. Build. Transform. <br />
            Turning business challenges into powerful solutions.
          </p>
        </div>
      </div>

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
