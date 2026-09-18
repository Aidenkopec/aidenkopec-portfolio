'use client';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import React, { useCallback, useState } from 'react';

import { styles } from '../styles';

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

  const handleReady = useCallback(() => setModelReady(true), []);

  return (
    <section className={`relative mx-auto h-screen w-full`}>
      <div
        className={`absolute inset-0 top-[120px] mx-auto max-w-7xl ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className='mt-5 flex flex-col items-center justify-center'>
          <div
            className='h-5 w-5 rounded-full'
            style={{ backgroundColor: 'var(--text-color-variable)' }}
          />
          <div className='dynamic-gradient h-40 w-1 sm:h-80' />
        </div>

        <div>
          <h1 className={`${styles.heroHeadText}`}>
            Hi, I&apos;m
            <span style={{ color: 'var(--text-color-variable)' }}> Aiden</span>
          </h1>
          <p className={`${styles.heroSubText}`}>
            {/*className='sm:block hidden'*/}
            Analyze. Build. Transform. <br />
            Turning business challenges into powerful solutions.
          </p>
        </div>
      </div>

      {!modelReady && <HeroLoader />}

      <ComputersCanvas onReady={handleReady} />

      <div className='absolute bottom-32 flex w-full items-center justify-center sm:bottom-10 md:hidden'>
        <a href='#about'>
          <div className='relative flex h-[64px] w-[35px] items-start justify-center rounded-3xl border-4 border-secondary p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
                opacity: [1, 0.5, 1],
              }}
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
