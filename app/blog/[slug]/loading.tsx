import React from 'react';

export default function BlogPostLoading() {
  return (
    <div
      className='relative min-h-screen overflow-hidden'
      style={{ background: 'var(--primary-color)' }}
    >
      {/* Subtle animated background */}
      <div className='absolute inset-0 opacity-8'>
        <div
          className='absolute inset-0 animate-pulse bg-gradient-to-tr from-transparent via-current to-transparent'
          style={{
            color: 'var(--text-color-variable)',
            animationDuration: '5s',
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

      <div className='relative z-10 mx-auto max-w-4xl px-6 py-8 sm:px-8'>
        {/* Header Section Skeleton */}
        <div className='mb-12'>
          {/* Back Button Skeleton */}
          <div
            className='border-opacity-20 mb-8 h-10 w-24 animate-pulse rounded-lg border backdrop-blur-sm'
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              borderColor: 'var(--gradient-start)',
              boxShadow: `0 0 15px rgba(var(--text-color-variable), 0.2)`,
            }}
          ></div>

          {/* Tag Skeleton */}
          <div
            className='mb-4 h-6 w-20 animate-pulse rounded-full backdrop-blur-sm'
            style={{
              background: `linear-gradient(45deg, var(--gradient-start)60, var(--text-color-variable)60)`,
              animationDuration: '2.5s',
            }}
          ></div>

          {/* Title Skeleton */}
          <div className='mb-6 space-y-3'>
            <div
              className='h-10 w-full animate-pulse rounded backdrop-blur-xl'
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                boxShadow: `0 0 40px rgba(var(--text-color-variable), 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)`,
                animationDuration: '3s',
              }}
            ></div>
            <div
              className='h-10 w-3/4 animate-pulse rounded backdrop-blur-sm'
              style={{
                background: 'rgba(255, 255, 255, 0.10)',
                boxShadow: `0 0 30px rgba(var(--gradient-start), 0.2)`,
                animationDelay: '0.5s',
                animationDuration: '2.8s',
              }}
            ></div>
          </div>

          {/* Meta Info Skeleton */}
          <div className='mb-8 flex items-center space-x-4'>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='h-5 animate-pulse rounded'
                style={{
                  width: i === 0 ? '6rem' : i === 1 ? '5rem' : '4rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  animationDelay: `${i * 200}ms`,
                  boxShadow: `0 0 10px rgba(var(--text-color-variable), 0.1)`,
                }}
              ></div>
            ))}
          </div>

          {/* Featured Image Skeleton */}
          <div
            className='border-opacity-20 relative h-64 w-full animate-pulse overflow-hidden rounded-xl border backdrop-blur-xl md:h-96'
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'var(--text-color-variable)',
              boxShadow: `0 0 60px rgba(var(--gradient-start), 0.3), 0 0 120px rgba(var(--text-color-variable), 0.1), inset 0 0 40px rgba(255, 255, 255, 0.1)`,
              animationDuration: '4s',
            }}
          >
            {/* Shimmer effect */}
            <div
              className='absolute inset-0 animate-pulse'
              style={{
                background: `linear-gradient(45deg, transparent, var(--text-color-variable)20, transparent)`,
                animationDuration: '3s',
              }}
            ></div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
          {/* Main Content Area */}
          <div className='lg:col-span-3'>
            {/* Article Content Skeleton */}
            <div className='prose prose-lg prose-invert max-w-none'>
              {/* Paragraph skeletons */}
              {[...Array(8)].map((_, i) => (
                <div key={i} className='mb-6 space-y-3'>
                  {[...Array(i % 3 === 0 ? 4 : 3)].map((_, lineIndex) => (
                    <div
                      key={lineIndex}
                      className={`h-4 animate-pulse rounded ${
                        lineIndex === 2
                          ? 'w-5/6'
                          : lineIndex === 3
                            ? 'w-4/6'
                            : 'w-full'
                      }`}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        animationDelay: `${i * 300 + lineIndex * 100}ms`,
                        boxShadow: `0 0 8px rgba(var(--text-color-variable), 0.1)`,
                      }}
                    ></div>
                  ))}
                </div>
              ))}

              {/* Code block skeleton */}
              <div className='my-8'>
                <div
                  className='border-opacity-20 relative h-32 w-full animate-pulse overflow-hidden rounded-lg border backdrop-blur-xl'
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'var(--gradient-start)',
                    boxShadow: `0 0 40px rgba(var(--text-color-variable), 0.2), inset 0 0 30px rgba(255, 255, 255, 0.08)`,
                    animationDuration: '3.5s',
                  }}
                >
                  {/* Code lines */}
                  <div className='space-y-2 p-4'>
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-3 rounded ${i === 3 ? 'w-1/2' : 'w-full'} animate-pulse`}
                        style={{
                          background: 'rgba(255, 255, 255, 0.12)',
                          animationDelay: `${i * 200}ms`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* More paragraph skeletons */}
              {[...Array(6)].map((_, i) => (
                <div key={`second-${i}`} className='mb-6 space-y-3'>
                  {[...Array(3)].map((_, lineIndex) => (
                    <div
                      key={lineIndex}
                      className={`h-4 animate-pulse rounded ${lineIndex === 2 ? 'w-3/4' : 'w-full'}`}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        animationDelay: `${i * 250 + lineIndex * 80}ms`,
                      }}
                    ></div>
                  ))}
                </div>
              ))}
            </div>

            {/* Tags Section Skeleton */}
            <div
              className='border-opacity-20 mt-12 border-t pt-8'
              style={{ borderColor: 'var(--text-color-variable)' }}
            >
              <div
                className='mb-4 h-6 w-16 animate-pulse rounded backdrop-blur-sm'
                style={{
                  background: 'rgba(255, 255, 255, 0.10)',
                  boxShadow: `0 0 20px rgba(var(--gradient-start), 0.3)`,
                }}
              ></div>
              <div className='flex flex-wrap gap-2'>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className='border-opacity-30 h-8 w-16 animate-pulse rounded-full border backdrop-blur-sm'
                    style={{
                      background: `linear-gradient(45deg, var(--gradient-start)40, var(--text-color-variable)40)`,
                      borderColor: 'var(--text-color-variable)',
                      animationDelay: `${i * 150}ms`,
                      animationDuration: '2.5s',
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Share Section Skeleton */}
            <div
              className='border-opacity-20 mt-8 border-t pt-8'
              style={{ borderColor: 'var(--text-color-variable)' }}
            >
              <div
                className='mb-4 h-6 w-20 animate-pulse rounded backdrop-blur-sm'
                style={{
                  background: 'rgba(255, 255, 255, 0.10)',
                  boxShadow: `0 0 20px rgba(var(--gradient-start), 0.3)`,
                }}
              ></div>
              <div className='flex space-x-4'>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className='border-opacity-30 h-10 w-10 animate-pulse rounded-full border backdrop-blur-sm'
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderColor: 'var(--gradient-start)',
                      boxShadow: `0 0 15px rgba(var(--text-color-variable), 0.2)`,
                      animationDelay: `${i * 100}ms`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='sticky top-28'>
              {/* Table of Contents Skeleton */}
              <div
                className='border-opacity-20 mb-8 animate-pulse rounded-xl border p-6 backdrop-blur-xl'
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'var(--text-color-variable)',
                  boxShadow: `0 0 40px rgba(var(--gradient-start), 0.2), inset 0 0 30px rgba(255, 255, 255, 0.08)`,
                  animationDuration: '3.2s',
                }}
              >
                <div
                  className='mb-4 h-6 w-32 animate-pulse rounded backdrop-blur-sm'
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    boxShadow: `0 0 20px rgba(var(--text-color-variable), 0.3)`,
                  }}
                ></div>
                <div className='space-y-3'>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className='flex items-center space-x-2'>
                      <div
                        className='h-2 w-2 animate-pulse rounded-full'
                        style={{
                          background: 'var(--gradient-start)',
                          boxShadow: `0 0 8px var(--gradient-start)`,
                          animationDelay: `${i * 100}ms`,
                        }}
                      ></div>
                      <div
                        className='h-4 flex-1 animate-pulse rounded'
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          animationDelay: `${i * 120}ms`,
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Posts Skeleton */}
              <div
                className='border-opacity-20 animate-pulse rounded-xl border p-6 backdrop-blur-xl'
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'var(--text-color-variable)',
                  boxShadow: `0 0 40px rgba(var(--gradient-start), 0.2), inset 0 0 30px rgba(255, 255, 255, 0.08)`,
                  animationDuration: '3.8s',
                }}
              >
                <div
                  className='mb-4 h-6 w-28 animate-pulse rounded backdrop-blur-sm'
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    boxShadow: `0 0 20px rgba(var(--text-color-variable), 0.3)`,
                  }}
                ></div>
                <div className='space-y-4'>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className='border-opacity-10 border-b pb-4 last:border-b-0'
                      style={{ borderColor: 'var(--text-color-variable)' }}
                    >
                      <div
                        className='mb-2 h-4 w-full animate-pulse rounded'
                        style={{
                          background: 'rgba(255, 255, 255, 0.10)',
                          animationDelay: `${i * 200}ms`,
                        }}
                      ></div>
                      <div
                        className='mb-2 h-4 w-3/4 animate-pulse rounded'
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          animationDelay: `${i * 250}ms`,
                        }}
                      ></div>
                      <div
                        className='h-3 w-20 animate-pulse rounded'
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          animationDelay: `${i * 300}ms`,
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Skeleton */}
        <div
          className='border-opacity-20 mt-16 border-t pt-8'
          style={{ borderColor: 'var(--text-color-variable)' }}
        >
          <div className='flex items-center justify-between'>
            <div
              className='border-opacity-20 h-12 w-32 animate-pulse rounded-lg border backdrop-blur-xl'
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'var(--gradient-start)',
                boxShadow: `0 0 30px rgba(var(--text-color-variable), 0.2)`,
                animationDuration: '2.5s',
              }}
            ></div>
            <div
              className='border-opacity-20 h-12 w-32 animate-pulse rounded-lg border backdrop-blur-xl'
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'var(--gradient-start)',
                boxShadow: `0 0 30px rgba(var(--text-color-variable), 0.2)`,
                animationDelay: '0.3s',
                animationDuration: '2.5s',
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
