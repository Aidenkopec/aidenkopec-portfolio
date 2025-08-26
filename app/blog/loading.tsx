import React from 'react';

export default function BlogLoading() {
  return (
    <div
      className='relative min-h-screen overflow-hidden'
      style={{ background: 'var(--primary-color)' }}
    >
      {/* Subtle animated background */}
      <div className='absolute inset-0 opacity-10'>
        <div
          className='absolute inset-0 animate-pulse bg-gradient-to-br from-transparent via-current to-transparent'
          style={{
            color: 'var(--text-color-variable)',
            animationDuration: '4s',
          }}
        ></div>
      </div>

      {/* Blog Navbar Skeleton */}
      <div
        className='border-opacity-20 sticky top-0 z-50 border-b backdrop-blur-xl'
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderColor: 'var(--text-color-variable)',
        }}
      >
        <div className='mx-auto max-w-7xl px-6 sm:px-16'>
          <div className='flex h-20 items-center justify-between'>
            <div
              className='h-8 w-32 animate-pulse rounded backdrop-blur-sm'
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                boxShadow: `0 0 20px rgba(var(--gradient-start), 0.3)`,
              }}
            ></div>
            <div className='flex space-x-6'>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className='h-6 w-16 animate-pulse rounded'
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    animationDelay: `${i * 200}ms`,
                    boxShadow: `0 0 15px rgba(var(--text-color-variable), 0.2)`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='relative z-10 mx-auto max-w-7xl px-6 py-10 sm:px-16'>
        {/* Hero Section Skeleton */}
        <div className='mb-16 text-center'>
          {/* Main Title Skeleton */}
          <div
            className='mx-auto mb-4 h-12 w-64 animate-pulse rounded backdrop-blur-xl'
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: `0 0 40px rgba(var(--text-color-variable), 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)`,
              animationDuration: '3s',
            }}
          ></div>

          {/* Subtitle Skeleton */}
          <div
            className='mx-auto mb-8 h-6 w-96 animate-pulse rounded backdrop-blur-sm'
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              boxShadow: `0 0 25px rgba(var(--gradient-start), 0.3)`,
              animationDelay: '0.5s',
              animationDuration: '2.5s',
            }}
          ></div>

          {/* Search Bar Skeleton */}
          <div className='mx-auto max-w-md'>
            <div
              className='border-opacity-30 h-12 w-full animate-pulse rounded-lg border backdrop-blur-xl'
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'var(--text-color-variable)',
                boxShadow: `0 0 30px rgba(var(--text-color-variable), 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)`,
                animationDelay: '1s',
                animationDuration: '2s',
              }}
            ></div>
          </div>
        </div>

        {/* Categories Skeleton */}
        <div className='mb-12 flex flex-wrap justify-center gap-3'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='border-opacity-20 h-8 w-20 animate-pulse rounded-full border backdrop-blur-sm'
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                borderColor: 'var(--gradient-start)',
                boxShadow: `0 0 15px rgba(var(--text-color-variable), 0.2)`,
                animationDelay: `${i * 150}ms`,
                animationDuration: '2.2s',
              }}
            ></div>
          ))}
        </div>

        {/* Blog Posts Grid Skeleton */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='border-opacity-20 animate-pulse rounded-xl border p-6 backdrop-blur-xl'
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'var(--text-color-variable)',
                boxShadow: `0 0 40px rgba(var(--gradient-start), 0.2), 0 0 80px rgba(var(--text-color-variable), 0.1), inset 0 0 30px rgba(255, 255, 255, 0.08)`,
                animationDelay: `${i * 200}ms`,
                animationDuration: '3s',
              }}
            >
              {/* Image skeleton with shimmer effect */}
              <div
                className='relative mb-4 h-48 w-full overflow-hidden rounded-lg'
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <div
                  className='absolute inset-0 animate-pulse'
                  style={{
                    background: `linear-gradient(90deg, transparent, var(--text-color-variable)20, transparent)`,
                    animationDuration: '2s',
                    animationDelay: `${i * 300}ms`,
                  }}
                ></div>
              </div>

              {/* Tag skeleton */}
              <div
                className='mb-3 h-5 w-16 rounded-full backdrop-blur-sm'
                style={{
                  background: `linear-gradient(45deg, var(--gradient-start)40, var(--text-color-variable)40)`,
                  animationDelay: `${i * 250}ms`,
                }}
              ></div>

              {/* Title skeleton */}
              <div className='mb-4 space-y-2'>
                <div
                  className='h-6 w-full animate-pulse rounded'
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    boxShadow: `0 0 20px rgba(var(--text-color-variable), 0.2)`,
                  }}
                ></div>
                <div
                  className='h-6 w-3/4 animate-pulse rounded'
                  style={{
                    background: 'rgba(255, 255, 255, 0.10)',
                    animationDelay: '0.2s',
                  }}
                ></div>
              </div>

              {/* Excerpt skeleton */}
              <div className='mb-4 space-y-2'>
                {[...Array(3)].map((_, lineIndex) => (
                  <div
                    key={lineIndex}
                    className={`h-4 animate-pulse rounded ${lineIndex === 2 ? 'w-2/3' : 'w-full'}`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      animationDelay: `${lineIndex * 100}ms`,
                    }}
                  ></div>
                ))}
              </div>

              {/* Date and read time skeleton */}
              <div className='flex items-center justify-between'>
                <div
                  className='h-4 w-20 animate-pulse rounded'
                  style={{ background: 'rgba(255, 255, 255, 0.06)' }}
                ></div>
                <div
                  className='h-4 w-16 animate-pulse rounded'
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    animationDelay: '0.3s',
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className='mt-12 flex items-center justify-center space-x-4'>
          <div
            className='h-10 w-20 animate-pulse rounded backdrop-blur-sm'
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              boxShadow: `0 0 20px rgba(var(--text-color-variable), 0.3)`,
            }}
          ></div>
          <div className='flex space-x-2'>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='h-10 w-10 animate-pulse rounded'
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  boxShadow: `0 0 15px rgba(var(--gradient-start), 0.2)`,
                  animationDelay: `${i * 100}ms`,
                }}
              ></div>
            ))}
          </div>
          <div
            className='h-10 w-20 animate-pulse rounded backdrop-blur-sm'
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              boxShadow: `0 0 20px rgba(var(--text-color-variable), 0.3)`,
              animationDelay: '0.5s',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
