'use client';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState } from 'react';

import { useIsHydrated } from '@/hooks/useIsHydrated';
import { useMusicContext } from '@/context';
import { themes } from '@/constants/themes';

interface CustomizationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

interface ThemeOptionProps {
  themeKey: string;
  themeName: string;
  isSelected: boolean;
  onSelect: (themeKey: string) => void;
}

// The swatches carry their theme's class, so var() resolves to that theme's
// colours rather than the active one.
const ThemeOption: React.FC<ThemeOptionProps> = ({
  themeKey,
  themeName,
  isSelected,
  onSelect,
}) => (
  <button
    type='button'
    aria-pressed={isSelected}
    onClick={() => onSelect(themeKey)}
    className={`relative w-full cursor-pointer rounded-lg border p-3 text-left transition-all duration-300 ${
      isSelected
        ? 'border-[var(--text-color-variable)] bg-[var(--tertiary-color)] shadow-lg'
        : 'border-tertiary bg-tertiary hover:border-[var(--text-color-variable)] hover:bg-[var(--tertiary-color)]'
    } `}
  >
    <span className='flex items-center justify-between'>
      <span className='block flex-1'>
        <span className='mb-2 block text-sm font-medium text-secondary'>
          {themeName}
        </span>
        <span className={`${themeKey} flex items-center gap-2`}>
          <span
            className='block h-4 w-4 rounded-full border border-gray-600 bg-[var(--primary-color)]'
            title='Primary Color'
          />
          <span
            className='block h-4 w-4 rounded-full border border-gray-600 bg-[var(--text-color-variable)]'
            title='Accent Color'
          />
          <span
            className='block h-4 w-4 rounded-full border border-gray-600 bg-[var(--tertiary-color)]'
            title='Tertiary Color'
          />
        </span>
      </span>

      {isSelected && (
        <span className='text-sm font-medium text-[var(--text-color-variable)]'>
          ✓ Active
        </span>
      )}
    </span>

    <span
      className={`${themeKey} absolute top-0 right-0 block h-full w-1 rounded-r-lg bg-linear-to-b from-[var(--text-color-variable)] to-[var(--primary-color)]`}
    />
  </button>
);

const CustomizationMenu: React.FC<CustomizationMenuProps> = ({
  isOpen,
  onClose,
  isMobile = false,
}) => {
  const { theme, setTheme } = useTheme();
  const mounted = useIsHydrated();
  const [activeTab, setActiveTab] = useState<'themes' | 'music'>('themes');
  const menuRef = useRef<HTMLDivElement>(null);
  const isFullScreen = isMobile && isOpen;

  const {
    volume,
    setVolume,
    isFloatingBarVisible,
    floatingBarMode,
    setFloatingBarMode,
    toggleFloatingBar,
    playlist,
    currentTrack,
    selectTrack,
    isPlaying,
  } = useMusicContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only handle click outside for desktop dropdown mode
      if (
        !isFullScreen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // Add a small delay before attaching click outside handler
      // This prevents immediate closing when the modal is first opened
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      document.addEventListener('keydown', handleEscape);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose, isFullScreen]);

  // Effect specifically for body scroll
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullScreen]);

  const handleThemeChange = (themeKey: string) => {
    setTheme(themeKey);
    // Small delay for visual feedback before closing
    setTimeout(() => {
      if (!isFullScreen) {
        onClose();
      }
    }, 300);
  };

  if (!isOpen || !mounted) return null;

  // Mobile fullscreen overlay mode
  if (isMobile) {
    return (
      <>
        {/* Backdrop. Escape already closes the menu, so this is a pointer
            convenience rather than the only dismissal path. */}
        <div
          aria-hidden='true'
          className='fixed inset-0 z-[9998] animate-fadeIn bg-black/60 backdrop-blur-sm'
          onClick={onClose}
        />

        {/* Fullscreen Menu Panel - Positioned Higher */}
        <div className='fixed inset-0 z-[9999] flex items-start justify-center pt-20 sm:pt-24'>
          <div
            ref={menuRef}
            className='flex h-[500px] w-[90%] max-w-md animate-slideDown flex-col overflow-hidden rounded-2xl border border-[var(--chart-line)] bg-black-100 shadow-2xl sm:w-[90%] sm:animate-scaleIn'
          >
            {/* Header */}
            <div className='flex-shrink-0 border-b border-tertiary p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <h3 className='font-display text-2xl text-white-100 italic'>
                  Customizations
                </h3>
                <button
                  onClick={onClose}
                  className='rounded-lg p-1 text-2xl leading-none text-secondary transition-all hover:bg-tertiary hover:text-secondary'
                  aria-label='Close menu'
                >
                  ×
                </button>
              </div>

              {/* Tab Navigation */}
              <div className='flex space-x-1 rounded-lg bg-tertiary p-1'>
                <button
                  onClick={() => setActiveTab('themes')}
                  aria-pressed={activeTab === 'themes'}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                    activeTab === 'themes'
                      ? 'bg-[var(--text-color-variable)] text-primary shadow-lg'
                      : 'text-secondary hover:text-secondary'
                  }`}
                >
                  Themes
                </button>
                <button
                  onClick={() => setActiveTab('music')}
                  aria-pressed={activeTab === 'music'}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                    activeTab === 'music'
                      ? 'bg-[var(--text-color-variable)] text-primary shadow-lg'
                      : 'text-secondary hover:text-secondary'
                  }`}
                >
                  Music
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className='flex-1 overflow-y-auto overscroll-contain'>
              {activeTab === 'themes' ? (
                /* Themes Tab */
                <div className='space-y-3 p-4'>
                  {Object.entries(themes).map(([themeKey, themeName]) => (
                    <ThemeOption
                      key={themeKey}
                      themeKey={themeKey}
                      themeName={themeName}
                      isSelected={theme === themeKey}
                      onSelect={handleThemeChange}
                    />
                  ))}
                </div>
              ) : (
                /* Music Tab */
                <div className='space-y-4 p-4'>
                  {/* Music Dock Controls */}
                  <div className='space-y-3 rounded-lg bg-tertiary p-3'>
                    <h4 className='text-sm font-medium text-secondary'>
                      Music Dock
                    </h4>

                    {/* Visibility Toggle */}
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-xs text-gray-300'>Show music dock</p>
                      </div>
                      <button
                        onClick={toggleFloatingBar}
                        role='switch'
                        aria-checked={isFloatingBarVisible}
                        aria-label='Show music dock'
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isFloatingBarVisible
                            ? 'bg-[var(--text-color-variable)]'
                            : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isFloatingBarVisible
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Dock Mode Selection */}
                    {isFloatingBarVisible && (
                      <div>
                        <p className='mb-2 text-xs text-gray-300'>Dock style</p>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => setFloatingBarMode('mini')}
                            aria-pressed={floatingBarMode === 'mini'}
                            className={`rounded-md px-3 py-1 text-xs transition-colors ${
                              floatingBarMode === 'mini'
                                ? 'bg-[var(--text-color-variable)] text-primary'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            Compact
                          </button>
                          <button
                            onClick={() => setFloatingBarMode('standard')}
                            aria-pressed={floatingBarMode === 'standard'}
                            className={`rounded-md px-3 py-1 text-xs transition-colors ${
                              floatingBarMode === 'standard'
                                ? 'bg-[var(--text-color-variable)] text-primary'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            Full
                          </button>
                        </div>
                        <p className='mt-1 text-xs text-gray-500'>
                          {floatingBarMode === 'mini'
                            ? 'Shows play button only'
                            : 'Shows full dock with track info'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Volume Control */}
                  <div className='rounded-lg bg-tertiary p-3'>
                    <h4 className='mb-3 text-sm font-medium text-secondary'>
                      Volume
                    </h4>
                    <div className='flex items-center space-x-3'>
                      <svg
                        aria-hidden='true'
                        className='h-4 w-4 text-gray-400'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z' />
                      </svg>
                      <input
                        type='range'
                        min='0'
                        max='1'
                        step='0.1'
                        value={volume}
                        aria-label='Volume'
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className='slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-600'
                        style={{
                          background: `linear-gradient(to right, var(--text-color-variable) 0%, var(--text-color-variable) ${
                            volume * 100
                          }%, #4b5563 ${volume * 100}%, #4b5563 100%)`,
                        }}
                      />
                      <span className='w-8 text-right text-xs text-gray-400'>
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Playlist - Fixed Height with Scroll */}
                  <div className='rounded-lg bg-tertiary p-3'>
                    <h4 className='mb-3 text-sm font-medium text-secondary'>
                      Playlist
                    </h4>
                    <div className='h-32 space-y-2 overflow-y-auto'>
                      {playlist.map((track, index) => (
                        <button
                          key={index}
                          onClick={() => selectTrack(index)}
                          className={`w-full rounded-md p-2 text-left text-sm transition-colors ${
                            currentTrack === index
                              ? 'bg-[var(--text-color-variable)] text-primary'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-secondary'
                          }`}
                        >
                          <div className='flex items-center justify-between'>
                            <div className='min-w-0 flex-1'>
                              <div className='truncate font-medium'>
                                {track.title}
                              </div>
                            </div>
                            {currentTrack === index && isPlaying && (
                              <div className='ml-2 flex-shrink-0'>
                                <span className='sr-only'>Now playing</span>
                                <svg
                                  aria-hidden='true'
                                  className='h-4 w-4 animate-pulse text-secondary'
                                  fill='currentColor'
                                  viewBox='0 0 20 20'
                                >
                                  <path d='M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z' />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className='flex-shrink-0 border-t border-tertiary p-3'>
              <p className='text-center text-xs text-secondary'>
                {activeTab === 'themes'
                  ? 'Themes are automatically saved'
                  : 'Music dock settings persist across sessions'}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop dropdown mode (original behavior for desktop)
  return (
    <div
      ref={menuRef}
      className='absolute top-full right-0 z-[9999] mt-2 w-96 overflow-hidden rounded-xl border border-[var(--chart-line)] bg-black-100 shadow-2xl'
    >
      {/* Original desktop menu content remains the same */}
      {/* Header with tabs */}
      <div className='border-b border-tertiary p-4'>
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='font-display text-2xl text-white-100 italic'>
            Customizations
          </h3>
          <button
            onClick={onClose}
            className='text-xl text-secondary transition-colors hover:text-secondary'
            aria-label='Close menu'
          >
            ×
          </button>
        </div>

        <div className='flex space-x-1 rounded-lg bg-tertiary p-1'>
          <button
            onClick={() => setActiveTab('themes')}
            aria-pressed={activeTab === 'themes'}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              activeTab === 'themes'
                ? 'bg-[var(--text-color-variable)] text-primary shadow-lg'
                : 'text-secondary hover:text-secondary'
            }`}
          >
            Themes
          </button>
          <button
            onClick={() => setActiveTab('music')}
            aria-pressed={activeTab === 'music'}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              activeTab === 'music'
                ? 'bg-[var(--text-color-variable)] text-primary shadow-lg'
                : 'text-secondary hover:text-secondary'
            }`}
          >
            Music
          </button>
        </div>
      </div>

      {/* Content for desktop */}
      <div className='max-h-80 overflow-y-auto'>
        {activeTab === 'themes' ? (
          <div className='space-y-3 p-4'>
            {Object.entries(themes).map(([themeKey, themeName]) => (
              <ThemeOption
                key={themeKey}
                themeKey={themeKey}
                themeName={themeName}
                isSelected={theme === themeKey}
                onSelect={handleThemeChange}
              />
            ))}
          </div>
        ) : (
          /* Music Tab for Desktop */
          <div className='space-y-4 p-4'>
            {/* Music Dock Controls */}
            <div className='space-y-3 rounded-lg bg-tertiary p-3'>
              <h4 className='text-sm font-medium text-secondary'>Music Dock</h4>

              {/* Visibility Toggle */}
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-gray-300'>Show music dock</p>
                </div>
                <button
                  onClick={toggleFloatingBar}
                  role='switch'
                  aria-checked={isFloatingBarVisible}
                  aria-label='Show music dock'
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isFloatingBarVisible
                      ? 'bg-[var(--text-color-variable)]'
                      : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isFloatingBarVisible ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Dock Mode Selection */}
              {isFloatingBarVisible && (
                <div>
                  <p className='mb-2 text-xs text-gray-300'>Dock style</p>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => setFloatingBarMode('mini')}
                      aria-pressed={floatingBarMode === 'mini'}
                      className={`rounded-md px-3 py-1 text-xs transition-colors ${
                        floatingBarMode === 'mini'
                          ? 'bg-[var(--text-color-variable)] text-primary'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Compact
                    </button>
                    <button
                      onClick={() => setFloatingBarMode('standard')}
                      aria-pressed={floatingBarMode === 'standard'}
                      className={`rounded-md px-3 py-1 text-xs transition-colors ${
                        floatingBarMode === 'standard'
                          ? 'bg-[var(--text-color-variable)] text-primary'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Full
                    </button>
                  </div>
                  <p className='mt-1 text-xs text-gray-500'>
                    {floatingBarMode === 'mini'
                      ? 'Shows play button only'
                      : 'Shows full dock with track info'}
                  </p>
                </div>
              )}
            </div>

            {/* Volume Control */}
            <div className='rounded-lg bg-tertiary p-3'>
              <h4 className='mb-3 text-sm font-medium text-secondary'>
                Volume
              </h4>
              <div className='flex items-center space-x-3'>
                <svg
                  aria-hidden='true'
                  className='h-4 w-4 text-gray-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z' />
                </svg>
                <input
                  type='range'
                  min='0'
                  max='1'
                  step='0.1'
                  value={volume}
                  aria-label='Volume'
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className='slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-600'
                  style={{
                    background: `linear-gradient(to right, var(--text-color-variable) 0%, var(--text-color-variable) ${
                      volume * 100
                    }%, #4b5563 ${volume * 100}%, #4b5563 100%)`,
                  }}
                />
                <span className='w-8 text-right text-xs text-gray-400'>
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>

            {/* Playlist */}
            <div className='rounded-lg bg-tertiary p-3'>
              <h4 className='mb-3 text-sm font-medium text-secondary'>
                Playlist
              </h4>
              <div className='max-h-32 space-y-2 overflow-y-auto'>
                {playlist.map((track, index) => (
                  <button
                    key={index}
                    onClick={() => selectTrack(index)}
                    className={`w-full rounded-md p-2 text-left text-sm transition-colors ${
                      currentTrack === index
                        ? 'bg-[var(--text-color-variable)] text-primary'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-secondary'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='min-w-0 flex-1'>
                        <div className='truncate font-medium'>
                          {track.title}
                        </div>
                      </div>
                      {currentTrack === index && isPlaying && (
                        <div className='ml-2 flex-shrink-0'>
                          <span className='sr-only'>Now playing</span>
                          <svg
                            aria-hidden='true'
                            className='h-4 w-4 animate-pulse text-secondary'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path d='M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z' />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className='border-t border-tertiary p-3'>
        <p className='text-center text-xs text-secondary'>
          {activeTab === 'themes'
            ? 'Themes are automatically saved'
            : 'Music dock settings persist across sessions'}
        </p>
      </div>
    </div>
  );
};

export default CustomizationMenu;
