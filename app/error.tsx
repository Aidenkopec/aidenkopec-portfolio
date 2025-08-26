'use client';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 px-4'>
      {/* Background overlay */}
      <div className='pointer-events-none absolute inset-0 z-20 h-full w-full bg-slate-900' />

      {/* Content */}
      <div className='relative z-30 mx-auto max-w-2xl text-center'>
        {/* Error Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='mb-8'
        >
          <div className='mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-500/20'>
            <svg
              className='h-12 w-12 text-red-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='mb-4 text-3xl font-bold text-white md:text-5xl'
        >
          Something went wrong!
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='mb-8 text-lg leading-relaxed text-neutral-300 md:text-xl'
        >
          An unexpected error occurred while loading this page. Don&apos;t
          worry, this happens sometimes and we&apos;re working to fix it.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='flex flex-col items-center justify-center gap-4 sm:flex-row'
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className='rounded-lg bg-white px-8 py-3 font-semibold text-slate-900 shadow-lg transition-colors duration-200 hover:bg-gray-100'
          >
            Try Again
          </motion.button>

          <Link href='/'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-white hover:text-slate-900'
            >
              Go Home
            </motion.button>
          </Link>
        </motion.div>

        {/* Error details for development */}
        {process.env.NODE_ENV === 'development' && (
          <motion.details
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='mt-8 text-left'
          >
            <summary className='cursor-pointer text-sm text-neutral-400 hover:text-white'>
              Error Details (Development Only)
            </summary>
            <pre className='mt-4 max-h-48 overflow-auto rounded-lg bg-slate-800 p-4 text-sm text-red-300'>
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </motion.details>
        )}
      </div>
    </div>
  );
}
