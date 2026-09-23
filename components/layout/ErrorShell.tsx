'use client';
import { track } from '@vercel/analytics';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';

const MotionLink = motion.create(Link);

const secondaryClass =
  'rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-white hover:text-slate-900';

interface ErrorShellProps {
  error: Error & { digest?: string };
  reset: () => void;
  title: string;
  description: string;
  resetLabel: string;
  homeLabel: string;
  /** Leave with a full page load instead of a client navigation. */
  hardNavigateHome?: boolean;
}

/** The page and markup shared by app/error.tsx and app/global-error.tsx. */
export function ErrorShell({
  error,
  reset,
  title,
  description,
  resetLabel,
  homeLabel,
  hardNavigateHome = false,
}: ErrorShellProps) {
  // React redacts `message` in production and only `digest` survives, so
  // without this a live crash leaves no trace at all and the id the visitor is
  // holding maps to nothing.
  useEffect(() => {
    console.error(error);
    // Deferred by a tick on purpose. <Analytics /> assigns window.va in its own
    // effect, and track() silently no-ops if that has not happened yet, so a
    // crash during the first paint would report nothing. Every effect in the
    // commit flushes before this timeout runs.
    const timer = setTimeout(() => {
      track('client_error', {
        digest: error.digest ?? 'none',
        message: error.message,
        path: window.location.pathname,
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 px-4'>
      <div className='relative mx-auto max-w-2xl text-center'>
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
              aria-hidden='true'
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

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='mb-4 text-3xl font-bold text-white md:text-5xl'
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='mb-8 text-lg leading-relaxed text-neutral-300 md:text-xl'
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='flex flex-col items-center justify-center gap-4 sm:flex-row'
        >
          <motion.button
            type='button'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className='rounded-lg bg-white px-8 py-3 font-semibold text-slate-900 shadow-lg transition-colors duration-200 hover:bg-gray-100'
          >
            {resetLabel}
          </motion.button>

          {hardNavigateHome ? (
            <motion.button
              type='button'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              // Hard navigation, not a router push: the React tree is already
              // broken here, and replace keeps the crashed page out of history.
              onClick={() => window.location.replace('/')}
              className={secondaryClass}
            >
              {homeLabel}
            </motion.button>
          ) : (
            <MotionLink
              href='/'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={secondaryClass}
            >
              {homeLabel}
            </MotionLink>
          )}
        </motion.div>

        {/* Error ID for support. Shown in production too: the digest is the only
            thing that survives React's redaction, so it is all a visitor can
            quote and all that can be looked up. */}
        {error.digest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='mt-12 rounded-lg bg-slate-800/50 p-4'
          >
            <p className='mb-2 text-sm text-neutral-400'>
              If this problem persists, please contact support with this error
              ID:
            </p>
            <code className='rounded bg-slate-800 px-3 py-1 font-mono text-sm text-red-300'>
              {error.digest}
            </code>
          </motion.div>
        )}

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
            <pre className='mt-4 max-h-64 overflow-auto rounded-lg bg-slate-800 p-4 text-sm text-red-300'>
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </motion.details>
        )}
      </div>
    </div>
  );
}
