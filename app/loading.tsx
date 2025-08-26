import React from 'react';

export default function Loading() {
  return (
    <div
      className='relative flex min-h-screen items-center justify-center overflow-hidden'
      style={{ background: 'var(--primary-color)' }}
    >
      {/* Subtle animated background gradient */}
      <div className='absolute inset-0 opacity-20'>
        <div
          className='absolute inset-0 animate-pulse bg-gradient-to-br from-transparent via-current to-transparent'
          style={{ color: 'var(--text-color-variable)' }}
        ></div>
      </div>

      <div className='relative z-10 flex flex-col items-center space-y-12'>
        {/* Sophisticated glassmorphism spinner */}
        <div className='relative'>
          {/* Main glassmorphism container */}
          <div
            className='border-opacity-20 relative h-32 w-32 rounded-full border shadow-2xl backdrop-blur-xl'
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'var(--text-color-variable)',
              boxShadow: `0 0 60px rgba(var(--gradient-start), 0.3), 0 0 120px rgba(var(--gradient-start), 0.1), inset 0 0 40px rgba(255, 255, 255, 0.1)`,
            }}
          >
            {/* Rotating outer ring */}
            <div
              className='absolute inset-2 animate-spin rounded-full border-2 border-transparent'
              style={{
                background: `conic-gradient(from 0deg, transparent, var(--text-color-variable), transparent)`,
                animationDuration: '3s',
                maskImage: 'linear-gradient(0deg, transparent 40%, black 60%)',
              }}
            ></div>

            {/* Counter-rotating inner ring */}
            <div
              className='absolute inset-6 animate-spin rounded-full border border-transparent opacity-80'
              style={{
                background: `conic-gradient(from 180deg, transparent, var(--gradient-start), transparent)`,
                animationDuration: '2s',
                animationDirection: 'reverse',
                maskImage:
                  'linear-gradient(180deg, transparent 30%, black 70%)',
              }}
            ></div>

            {/* Central pulsing core */}
            <div
              className='absolute inset-12 animate-pulse rounded-full backdrop-blur-sm'
              style={{
                background: `radial-gradient(circle, var(--text-color-variable) 0%, transparent 70%)`,
                animationDuration: '2.5s',
              }}
            ></div>
          </div>

          {/* Orbital particles */}
          <div
            className='absolute inset-0 animate-spin'
            style={{ animationDuration: '8s' }}
          >
            <div
              className='absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 transform rounded-full'
              style={{
                background: 'var(--text-color-variable)',
                boxShadow: `0 0 10px var(--text-color-variable)`,
              }}
            ></div>
            <div
              className='absolute right-1/4 bottom-0 h-1.5 w-1.5 translate-y-1 transform rounded-full opacity-70'
              style={{
                background: 'var(--gradient-start)',
                boxShadow: `0 0 8px var(--gradient-start)`,
              }}
            ></div>
          </div>
        </div>

        {/* Elegant typography */}
        <div className='space-y-4 px-8 text-center'>
          <h2
            className='animate-pulse text-3xl font-bold tracking-wider'
            style={{
              color: 'var(--white-100)',
              textShadow: `0 0 20px var(--text-color-variable)`,
            }}
          >
            Loading
          </h2>

          <p
            className='text-lg font-light tracking-wide opacity-80'
            style={{ color: 'var(--secondary-color)' }}
          >
            Preparing your experience
          </p>

          {/* Sophisticated animated progress indicator */}
          <div className='flex justify-center space-x-2 pt-4'>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className='h-2 w-2 animate-pulse rounded-full'
                style={{
                  background: 'var(--text-color-variable)',
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '1.5s',
                  boxShadow: `0 0 8px var(--text-color-variable)`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle vignette effect */}
      <div
        className='absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent opacity-30'
        style={{
          background: `radial-gradient(circle at center, transparent 60%, var(--primary-color) 100%)`,
        }}
      ></div>
    </div>
  );
}
