import React from 'react';

export default function BlogLoading() {
  return (
    <div className="min-h-screen relative overflow-hidden" 
         style={{ background: 'var(--primary-color)' }}>
      
      {/* Subtle animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-current to-transparent animate-pulse"
             style={{ color: 'var(--text-color-variable)', animationDuration: '4s' }}></div>
      </div>

      {/* Blog Navbar Skeleton */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-opacity-20" 
           style={{ 
             background: 'rgba(255, 255, 255, 0.02)',
             borderColor: 'var(--text-color-variable)' 
           }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-16">
          <div className="flex items-center justify-between h-20">
            <div className="h-8 w-32 rounded backdrop-blur-sm animate-pulse"
                 style={{ 
                   background: 'rgba(255, 255, 255, 0.08)',
                   boxShadow: `0 0 20px rgba(var(--gradient-start), 0.3)`
                 }}></div>
            <div className="flex space-x-6">
              {[...Array(3)].map((_, i) => (
                <div key={i}
                     className="h-6 w-16 rounded animate-pulse"
                     style={{ 
                       background: 'rgba(255, 255, 255, 0.08)',
                       animationDelay: `${i * 200}ms`,
                       boxShadow: `0 0 15px rgba(var(--text-color-variable), 0.2)`
                     }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-16 py-10 relative z-10">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-16">
          {/* Main Title Skeleton */}
          <div className="h-12 w-64 rounded mx-auto mb-4 backdrop-blur-xl animate-pulse"
               style={{ 
                 background: 'rgba(255, 255, 255, 0.1)',
                 boxShadow: `0 0 40px rgba(var(--text-color-variable), 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)`,
                 animationDuration: '3s'
               }}></div>
          
          {/* Subtitle Skeleton */}
          <div className="h-6 w-96 rounded mx-auto mb-8 backdrop-blur-sm animate-pulse"
               style={{ 
                 background: 'rgba(255, 255, 255, 0.06)',
                 boxShadow: `0 0 25px rgba(var(--gradient-start), 0.3)`,
                 animationDelay: '0.5s',
                 animationDuration: '2.5s'
               }}></div>

          {/* Search Bar Skeleton */}
          <div className="max-w-md mx-auto">
            <div className="h-12 w-full rounded-lg backdrop-blur-xl border border-opacity-30 animate-pulse"
                 style={{ 
                   background: 'rgba(255, 255, 255, 0.08)',
                   borderColor: 'var(--text-color-variable)',
                   boxShadow: `0 0 30px rgba(var(--text-color-variable), 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)`,
                   animationDelay: '1s',
                   animationDuration: '2s'
                 }}></div>
          </div>
        </div>

        {/* Categories Skeleton */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {[...Array(6)].map((_, i) => (
            <div key={i}
                 className="h-8 w-20 rounded-full backdrop-blur-sm border border-opacity-20 animate-pulse"
                 style={{ 
                   background: 'rgba(255, 255, 255, 0.06)',
                   borderColor: 'var(--gradient-start)',
                   boxShadow: `0 0 15px rgba(var(--text-color-variable), 0.2)`,
                   animationDelay: `${i * 150}ms`,
                   animationDuration: '2.2s'
                 }}></div>
          ))}
        </div>

        {/* Blog Posts Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i}
                 className="backdrop-blur-xl border border-opacity-20 rounded-xl p-6 animate-pulse"
                 style={{ 
                   background: 'rgba(255, 255, 255, 0.05)',
                   borderColor: 'var(--text-color-variable)',
                   boxShadow: `0 0 40px rgba(var(--gradient-start), 0.2), 0 0 80px rgba(var(--text-color-variable), 0.1), inset 0 0 30px rgba(255, 255, 255, 0.08)`,
                   animationDelay: `${i * 200}ms`,
                   animationDuration: '3s'
                 }}>
              
              {/* Image skeleton with shimmer effect */}
              <div className="h-48 w-full rounded-lg mb-4 relative overflow-hidden"
                   style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                <div className="absolute inset-0 animate-pulse"
                     style={{ 
                       background: `linear-gradient(90deg, transparent, var(--text-color-variable)20, transparent)`,
                       animationDuration: '2s',
                       animationDelay: `${i * 300}ms`
                     }}></div>
              </div>

              {/* Tag skeleton */}
              <div className="h-5 w-16 rounded-full mb-3 backdrop-blur-sm"
                   style={{ 
                     background: `linear-gradient(45deg, var(--gradient-start)40, var(--text-color-variable)40)`,
                     animationDelay: `${i * 250}ms`
                   }}></div>

              {/* Title skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-6 w-full rounded animate-pulse"
                     style={{ 
                       background: 'rgba(255, 255, 255, 0.12)',
                       boxShadow: `0 0 20px rgba(var(--text-color-variable), 0.2)`
                     }}></div>
                <div className="h-6 w-3/4 rounded animate-pulse"
                     style={{ 
                       background: 'rgba(255, 255, 255, 0.10)',
                       animationDelay: '0.2s'
                     }}></div>
              </div>

              {/* Excerpt skeleton */}
              <div className="space-y-2 mb-4">
                {[...Array(3)].map((_, lineIndex) => (
                  <div key={lineIndex}
                       className={`h-4 rounded animate-pulse ${lineIndex === 2 ? 'w-2/3' : 'w-full'}`}
                       style={{ 
                         background: 'rgba(255, 255, 255, 0.08)',
                         animationDelay: `${lineIndex * 100}ms`
                       }}></div>
                ))}
              </div>

              {/* Date and read time skeleton */}
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 rounded animate-pulse"
                     style={{ background: 'rgba(255, 255, 255, 0.06)' }}></div>
                <div className="h-4 w-16 rounded animate-pulse"
                     style={{ 
                       background: 'rgba(255, 255, 255, 0.06)',
                       animationDelay: '0.3s'
                     }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center space-x-4 mt-12">
          <div className="h-10 w-20 rounded backdrop-blur-sm animate-pulse"
               style={{ 
                 background: 'rgba(255, 255, 255, 0.08)',
                 boxShadow: `0 0 20px rgba(var(--text-color-variable), 0.3)`
               }}></div>
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i}
                   className="h-10 w-10 rounded animate-pulse"
                   style={{ 
                     background: 'rgba(255, 255, 255, 0.08)',
                     boxShadow: `0 0 15px rgba(var(--gradient-start), 0.2)`,
                     animationDelay: `${i * 100}ms`
                   }}></div>
            ))}
          </div>
          <div className="h-10 w-20 rounded backdrop-blur-sm animate-pulse"
               style={{ 
                 background: 'rgba(255, 255, 255, 0.08)',
                 boxShadow: `0 0 20px rgba(var(--text-color-variable), 0.3)`,
                 animationDelay: '0.5s'
               }}></div>
        </div>
      </div>
    </div>
  );
}
