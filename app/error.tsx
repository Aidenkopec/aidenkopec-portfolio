'use client';
import React from 'react';
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
    <div className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center px-4">
      {/* Background overlay */}
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-30 text-center max-w-2xl mx-auto">
        {/* Error Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-white mb-4"
        >
          Something went wrong!
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-neutral-300 mb-8 leading-relaxed"
        >
          An unexpected error occurred while loading this page. Don't worry, 
          this happens sometimes and we're working to fix it.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
          >
            Try Again
          </motion.button>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-200"
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
            className="mt-8 text-left"
          >
            <summary className="text-sm text-neutral-400 cursor-pointer hover:text-white">
              Error Details (Development Only)
            </summary>
            <pre className="mt-4 p-4 bg-slate-800 rounded-lg text-sm text-red-300 overflow-auto max-h-48">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </motion.details>
        )}
      </div>
    </div>
  );
}