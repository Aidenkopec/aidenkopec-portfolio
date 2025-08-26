'use client';
import { motion } from 'motion/react';
import Link from 'next/link';

import { Boxes } from '@/components/ui/background-boxes';

export default function NotFound() {
  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 px-4'>
      {/* Background overlay with mask */}
      <div className='pointer-events-none absolute inset-0 z-20 h-full w-full bg-slate-900 [mask-image:radial-gradient(transparent,white)]' />

      {/* Background boxes */}
      <Boxes />

      {/* Content */}
      <div className='relative z-30 mx-auto max-w-2xl text-center'>
        {/* 404 Number */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-4 text-8xl font-bold text-white md:text-9xl'
          style={{ color: 'var(--text-color-variable)' }}
        >
          404
        </motion.h1>

        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='mb-4 text-2xl font-bold text-white md:text-4xl'
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='mb-8 text-lg leading-relaxed text-neutral-300 md:text-xl'
        >
          Oops! It looks like you&apos;ve ventured into uncharted territory. The
          page you&apos;re looking for doesn&apos;t exist in this digital
          universe.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='flex flex-col items-center justify-center gap-4 sm:flex-row'
        >
          <Link href='/'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='rounded-lg bg-white px-8 py-3 font-semibold text-slate-900 shadow-lg transition-colors duration-200 hover:bg-gray-100'
            >
              Return Home
            </motion.button>
          </Link>

          <Link href='/blog'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-white hover:text-slate-900'
            >
              Explore Blog
            </motion.button>
          </Link>
        </motion.div>

        {/* Additional help text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='mt-8 text-sm text-neutral-400'
        >
          Need help? Feel free to{' '}
          <Link
            href='/contact'
            className='underline transition-colors duration-200 hover:text-white'
          >
            contact me
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
