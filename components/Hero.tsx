'use client';
import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const Hero: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const nameRef = useRef<HTMLHeadingElement>(null);

  // The navbar hides its own copy of the name while this one is on screen.
  useEffect(() => {
    const name = nameRef.current;
    if (!name) return;
    const root = document.documentElement;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) root.dataset.heroInView = '';
      else delete root.dataset.heroInView;
    });
    observer.observe(name);
    return () => {
      observer.disconnect();
      delete root.dataset.heroInView;
    };
  }, []);

  return (
    // Pressing and holding anywhere in the hero grows a black hole.
    <section className='relative mx-auto h-screen w-full' data-swarm-hold-zone>
      <div className='absolute inset-0 flex flex-col items-center justify-center padding-x text-center'>
        {/* The particle swarm samples this text and forms over it, then the
            text fades to transparent. It stays in the DOM for screen readers,
            search and selection, and stays visible if the swarm never runs. */}
        <h1 ref={nameRef} className='hero-head-text' data-swarm-slot='name'>
          Aiden Kopec
        </h1>
        <p className='hero-sub-text'>Full-Stack Developer</p>
        {/* Shown by the swarm once the name has formed, until the first hold. */}
        <p className='hero-hint' aria-hidden='true'>
          <span className='pointer-coarse:hidden'>Press and hold</span>
          <span className='hidden pointer-coarse:inline'>Touch and hold</span>
        </p>
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
