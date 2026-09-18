'use client';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import { useMusicPlayer } from '../hooks/useMusicPlayer';

interface IconProps {
  className?: string;
}

// Icon components adapted for the portfolio theme
const Icons = {
  play: (props: IconProps) => (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' {...props}>
      <path d='M8 5v14l11-7z' />
    </svg>
  ),
  pause: (props: IconProps) => (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' {...props}>
      <path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' />
    </svg>
  ),
  skipPrevious: (props: IconProps) => (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' {...props}>
      <path d='M6 6h2v12H6zm3.5 6l8.5 6V6z' />
    </svg>
  ),
  skipNext: (props: IconProps) => (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' {...props}>
      <path d='M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z' />
    </svg>
  ),
  close: (props: IconProps) => (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' {...props}>
      <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
    </svg>
  ),
  music: (props: IconProps) => (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' {...props}>
      <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
    </svg>
  ),
};

interface TrackInfo {
  title: string;
}

const FloatingMusicBar: React.FC = () => {
  const {
    isPlaying,
    isFloatingBarVisible,
    floatingBarMode,
    setFloatingBarMode,
    getTrackInfo,
    isHydrated,
    togglePlay,
    nextTrack,
    previousTrack,
  } = useMusicPlayer();

  const [shouldScrollTitle, setShouldScrollTitle] = useState<boolean>(false);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const titleRef = useRef<HTMLSpanElement>(null);

  // Detect mobile device and set initial mode
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768; // Standard mobile breakpoint

      // Only auto-hide on mobile if user hasn't interacted yet
      if (
        isMobileDevice &&
        !hasUserInteracted &&
        floatingBarMode !== 'hidden'
      ) {
        setFloatingBarMode('hidden');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    return () => window.removeEventListener('resize', checkMobile);
  }, [floatingBarMode, setFloatingBarMode, hasUserInteracted]);

  // Track user interactions to prevent auto-hiding after they've used the music bar
  const handleShowMusicBar = () => {
    setHasUserInteracted(true);
    setFloatingBarMode('standard');
  };

  const handleHideMusicBar = () => {
    setFloatingBarMode('hidden');
  };

  // Get track info, but use defaults if not hydrated yet
  const trackInfo: TrackInfo = isHydrated
    ? getTrackInfo()
    : { title: 'Deep Space' };

  // Check if text overflows and needs scrolling
  useEffect(() => {
    if (!isHydrated) return; // Don't run until hydrated

    const checkOverflow = (): void => {
      if (titleRef.current) {
        const containerWidth = titleRef.current.parentElement?.clientWidth || 0;
        const isOverflowing = titleRef.current.scrollWidth > containerWidth;
        setShouldScrollTitle(isOverflowing);
      }
    };

    // Check on mount and when text changes
    checkOverflow();

    // Also check on resize
    window.addEventListener('resize', checkOverflow, { passive: true });
    return () => window.removeEventListener('resize', checkOverflow);
  }, [trackInfo.title, isHydrated]);

  const closeDock = (): void => handleHideMusicBar();

  // Hidden state - show small button
  if (!isFloatingBarVisible || floatingBarMode === 'hidden') {
    return (
      <div className='pointer-events-none fixed right-0 bottom-0 left-0 z-[9999]'>
        <div
          className='flex justify-end px-3 py-3'
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
        >
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={handleShowMusicBar}
            className='pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'
            title='Show music controls'
            aria-label='Show music controls'
          >
            <Icons.music className='h-5 w-5 text-secondary' />
          </motion.button>
        </div>
      </div>
    );
  }

  // Mini mode - just music icon and play button
  if (floatingBarMode === 'mini') {
    return (
      <div className='pointer-events-none fixed right-0 bottom-0 left-0 z-[9999]'>
        <div
          className='flex justify-center px-3 py-3'
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='pointer-events-auto'
          >
            <div className='flex items-center gap-1.5 rounded-full border border-gray-800/50 bg-black/80 px-2.5 py-1.5 shadow-lg backdrop-blur-md transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl'>
              <button
                type='button'
                className='flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 transition-all duration-300 ease-out hover:rotate-12 hover:shadow-lg hover:shadow-purple-500/30'
                onClick={handleShowMusicBar}
                title='Show full music controls'
                aria-label='Show full music controls'
              >
                <Icons.music className='h-3.5 w-3.5 text-secondary' />
              </button>

              <button
                onClick={togglePlay}
                className='rounded-full p-1.5 transition-all duration-200 hover:scale-110 hover:bg-white/10 hover:shadow-md active:scale-95'
                style={{ minWidth: '36px', minHeight: '36px' }}
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label='Play music'
                aria-pressed={isPlaying}
              >
                {isPlaying ? (
                  <Icons.pause className='h-3.5 w-3.5 text-secondary' />
                ) : (
                  <Icons.play className='h-3.5 w-3.5 text-secondary' />
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Standard dock mode
  return (
    <div className='pointer-events-none fixed right-0 bottom-0 left-0 z-[9999]'>
      <div
        className='flex justify-center px-2 py-3'
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      >
        <AnimatePresence>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='pointer-events-auto relative w-auto'
          >
            <div className='flex items-center gap-1.5 rounded-full border border-gray-800/50 bg-black/80 px-2.5 py-1.5 shadow-lg backdrop-blur-md transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl sm:gap-2 sm:px-3 sm:py-1.5'>
              <div className='flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 transition-all duration-300 ease-out hover:rotate-12 hover:shadow-lg hover:shadow-purple-500/30 sm:h-8 sm:w-8'>
                <Icons.music className='h-3.5 w-3.5 text-secondary sm:h-4 sm:w-4' />
              </div>

              <div className='group flex w-20 min-w-0 flex-col sm:w-24'>
                <div className='relative flex h-4 items-center overflow-hidden'>
                  <span
                    ref={titleRef}
                    className='invisible absolute text-xs font-medium whitespace-nowrap'
                  >
                    {trackInfo.title}
                  </span>
                  <div
                    className={`text-xs leading-none font-medium whitespace-nowrap text-secondary transition-colors duration-200 group-hover:text-purple-400 ${shouldScrollTitle ? 'animate-scroll inline-block' : 'block'}`}
                  >
                    {trackInfo.title}
                    {shouldScrollTitle && (
                      <span aria-hidden='true'>&nbsp;{trackInfo.title}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className='flex flex-shrink-0 items-center gap-0.5'>
                <button
                  onClick={previousTrack}
                  className='rounded-full p-1 transition-all duration-200 hover:scale-110 hover:bg-white/10 active:scale-95 sm:p-1.5'
                  style={{ minWidth: '28px', minHeight: '28px' }}
                  title='Previous Track'
                  aria-label='Previous track'
                >
                  <Icons.skipPrevious className='h-3 w-3 text-secondary sm:h-3.5 sm:w-3.5' />
                </button>

                <button
                  onClick={togglePlay}
                  className='mx-0.5 rounded-full p-1 transition-all duration-200 hover:scale-110 hover:bg-white/10 hover:shadow-md active:scale-95 sm:p-1.5'
                  style={{ minWidth: '32px', minHeight: '32px' }}
                  title={isPlaying ? 'Pause' : 'Play'}
                  aria-label='Play music'
                  aria-pressed={isPlaying}
                >
                  {isPlaying ? (
                    <Icons.pause className='h-3.5 w-3.5 text-secondary sm:h-4 sm:w-4' />
                  ) : (
                    <Icons.play className='h-3.5 w-3.5 text-secondary sm:h-4 sm:w-4' />
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  className='rounded-full p-1 transition-all duration-200 hover:scale-110 hover:bg-white/10 active:scale-95 sm:p-1.5'
                  style={{ minWidth: '28px', minHeight: '28px' }}
                  title='Next Track'
                  aria-label='Next track'
                >
                  <Icons.skipNext className='h-3 w-3 text-secondary sm:h-3.5 sm:w-3.5' />
                </button>
              </div>

              <button
                onClick={closeDock}
                className='flex-shrink-0 p-0.5 opacity-60 transition-all duration-300 hover:rotate-90 hover:text-red-400 hover:opacity-100 sm:p-1'
                style={{ minWidth: '20px', minHeight: '20px' }}
                title='Hide music player'
                aria-label='Hide music player'
              >
                <Icons.close className='h-3 w-3 sm:h-3.5 sm:w-3.5' />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scrolling text animations */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatingMusicBar;
