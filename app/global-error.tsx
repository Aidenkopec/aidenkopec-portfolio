'use client';
import React from 'react';
import { motion } from 'motion/react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang='en'>
      <body>
        <div className='relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 px-4'>
          {/* Background overlay */}
          <div className='pointer-events-none absolute inset-0 z-20 h-full w-full bg-slate-900' />

          {/* Content */}
          <div className='relative z-30 mx-auto max-w-2xl text-center'>
            {/* Critical Error Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className='mb-8'
            >
              <div className='mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-red-600/30'>
                <svg
                  className='h-16 w-16 text-red-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='mb-6 text-4xl font-bold text-white md:text-6xl'
            >
              Critical Error
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='mb-8 text-xl leading-relaxed text-neutral-300 md:text-2xl'
            >
              A critical error occurred that affected the entire application.
              This is likely a temporary issue.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='flex flex-col items-center justify-center gap-6 sm:flex-row'
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className='rounded-lg bg-white px-10 py-4 text-lg font-bold text-slate-900 shadow-xl transition-colors duration-200 hover:bg-gray-100'
              >
                Reload Application
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = '/')}
                className='rounded-lg border-2 border-white px-10 py-4 text-lg font-bold text-white transition-all duration-200 hover:bg-white hover:text-slate-900'
              >
                Fresh Start
              </motion.button>
            </motion.div>

            {/* Error ID for support */}
            {error.digest && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='mt-12 rounded-lg bg-slate-800/50 p-4'
              >
                <p className='mb-2 text-sm text-neutral-400'>
                  If this problem persists, please contact support with this
                  error ID:
                </p>
                <code className='rounded bg-slate-800 px-3 py-1 font-mono text-sm text-red-300'>
                  {error.digest}
                </code>
              </motion.div>
            )}

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && (
              <motion.details
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className='mt-8 text-left'
              >
                <summary className='mb-4 cursor-pointer text-sm text-neutral-400 hover:text-white'>
                  Global Error Details (Development Only)
                </summary>
                <pre className='max-h-64 overflow-auto rounded-lg bg-slate-800 p-4 text-sm text-red-300'>
                  {error.message}
                  {error.stack}
                </pre>
              </motion.details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
