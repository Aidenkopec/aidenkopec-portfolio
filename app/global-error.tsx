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
    <html lang="en">
      <body>
        <div className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center px-4">
          {/* Background overlay */}
          <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 pointer-events-none" />

          {/* Content */}
          <div className="relative z-30 text-center max-w-2xl mx-auto">
            {/* Critical Error Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="w-32 h-32 mx-auto rounded-full bg-red-600/30 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Critical Error
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-neutral-300 mb-8 leading-relaxed"
            >
              A critical error occurred that affected the entire application. 
              This is likely a temporary issue.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="px-10 py-4 bg-white text-slate-900 font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-xl"
              >
                Reload Application
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className="px-10 py-4 border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-200"
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
                className="mt-12 p-4 bg-slate-800/50 rounded-lg"
              >
                <p className="text-sm text-neutral-400 mb-2">
                  If this problem persists, please contact support with this error ID:
                </p>
                <code className="text-sm font-mono text-red-300 bg-slate-800 px-3 py-1 rounded">
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
                className="mt-8 text-left"
              >
                <summary className="text-sm text-neutral-400 cursor-pointer hover:text-white mb-4">
                  Global Error Details (Development Only)
                </summary>
                <pre className="p-4 bg-slate-800 rounded-lg text-sm text-red-300 overflow-auto max-h-64">
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