'use client';
import { motion } from 'framer-motion';
import React from 'react';

import { styles } from '../styles';

import { ComputersCanvas } from './canvas';

const Hero: React.FC = () => {
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
            Dream. Design. Deliver. <br />
            turning ideas into reality
          </p>
        </div>
      </div>

      <ComputersCanvas />
      <div className='absolute bottom-32 flex w-full items-center justify-center sm:bottom-10 md:hidden'>
        <a href='#about'>
          <div className='border-secondary relative flex h-[64px] w-[35px] items-start justify-center rounded-3xl border-4 p-2'>
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
