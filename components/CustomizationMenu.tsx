'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { themes, getThemePreviewColors } from '../styles';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

interface CustomizationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

const CustomizationMenu: React.FC<CustomizationMenuProps> = ({
  isOpen,
  onClose,
  isMobile = false,
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'themes' | 'music'>('themes');
  const menuRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    volume,
    handleVolumeChange,
    isFloatingBarVisible,
    floatingBarMode,
    setFloatingBarMode,
    toggleFloatingBar,
    playlist,
    currentTrack,
    selectTrack,
    isPlaying,
  } = useMusicPlayer();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-detect if we need fullscreen mode on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsFullScreen(true);
    }
  }, [isMobile, isOpen]);

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
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);

      // Prevent body scroll when fullscreen menu is open
      if (isFullScreen) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, isFullScreen]);

  const handleThemeChange = (themeKey: string) => {
    setTheme(themeKey);
    // Small delay for visual feedback before closing
    setTimeout(() => {
      if (activeTab === 'themes' && !isFullScreen) {
        onClose();
      }
    }, 300);
  };

  if (!isOpen || !mounted) return null;

  // Mobile fullscreen overlay mode
  if (isFullScreen || isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-fadeIn"
          onClick={onClose}
        />

        {/* Fullscreen Menu Panel - Positioned Higher */}
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 sm:pt-24">
          <div
            ref={menuRef}
            className="bg-black-100 w-[90%] sm:w-[90%] max-w-md h-[500px]
                       rounded-2xl border border-tertiary shadow-2xl
                       animate-slideDown sm:animate-scaleIn overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-tertiary flex-shrink-0">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-secondary text-lg font-semibold">
                  Customizations
                </h3>
                <button
                  onClick={onClose}
                  className="text-secondary hover:text-secondary p-1 rounded-lg 
                           hover:bg-tertiary transition-all text-2xl leading-none"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-tertiary rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('themes')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'themes'
                      ? 'bg-[var(--text-color-variable)] text-secondary shadow-lg'
                      : 'text-secondary hover:text-secondary'
                  }`}
                >
                  Themes
                </button>
                <button
                  onClick={() => setActiveTab('music')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'music'
                      ? 'bg-[var(--text-color-variable)] text-secondary shadow-lg'
                      : 'text-secondary hover:text-secondary'
                  }`}
                >
                  Music
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {activeTab === 'themes' ? (
                /* Themes Tab */
                <div className="p-4 space-y-3">
                  {Object.entries(themes).map(([themeKey, themeData]) => {
                    const colors = getThemePreviewColors(themeKey);
                    const isSelected = theme === themeKey;

                    return (
                      <div
                        key={themeKey}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleThemeChange(themeKey);
                        }}
                        className={`
                          relative p-3 rounded-lg cursor-pointer transition-all duration-300 border
                          ${
                            isSelected
                              ? 'border-[var(--text-color-variable)] bg-[var(--tertiary-color)] shadow-lg'
                              : 'border-tertiary hover:border-[var(--text-color-variable)] bg-tertiary hover:bg-[var(--tertiary-color)]'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-secondary font-medium text-sm mb-2">
                              {themeData.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              {colors && (
                                <>
                                  <div
                                    className="w-4 h-4 rounded-full border border-gray-600"
                                    style={{ backgroundColor: colors.primary }}
                                    title="Primary Color"
                                  />
                                  <div
                                    className="w-4 h-4 rounded-full border border-gray-600"
                                    style={{ backgroundColor: colors.accent }}
                                    title="Accent Color"
                                  />
                                  <div
                                    className="w-4 h-4 rounded-full border border-gray-600"
                                    style={{
                                      backgroundColor: colors.secondary,
                                    }}
                                    title="Secondary Color"
                                  />
                                </>
                              )}
                            </div>
                          </div>

                          {isSelected && (
                            <div className="text-[var(--text-color-variable)] text-sm font-medium">
                              ✓ Active
                            </div>
                          )}
                        </div>

                        {colors && (
                          <div
                            className="absolute top-0 right-0 w-1 h-full rounded-r-lg"
                            style={{
                              background: `linear-gradient(to bottom, ${colors.accent}, ${colors.primary})`,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Music Tab */
                <div className="p-4 space-y-4">
                  {/* Music Dock Controls */}
                  <div className="p-3 bg-tertiary rounded-lg space-y-3">
                    <h4 className="text-secondary font-medium text-sm">
                      Music Dock
                    </h4>

                    {/* Visibility Toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 text-xs">Show music dock</p>
                      </div>
                      <button
                        onClick={toggleFloatingBar}
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
                        <p className="text-gray-300 text-xs mb-2">Dock style</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setFloatingBarMode('mini')}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${
                              floatingBarMode === 'mini'
                                ? 'bg-[var(--text-color-variable)] text-secondary'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            Compact
                          </button>
                          <button
                            onClick={() => setFloatingBarMode('standard')}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${
                              floatingBarMode === 'standard'
                                ? 'bg-[var(--text-color-variable)] text-secondary'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            Full
                          </button>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          {floatingBarMode === 'mini'
                            ? 'Shows play button only'
                            : 'Shows full dock with track info'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Volume Control */}
                  <div className="p-3 bg-tertiary rounded-lg">
                    <h4 className="text-secondary font-medium text-sm mb-3">
                      Volume
                    </h4>
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" />
                      </svg>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) =>
                          handleVolumeChange(parseFloat(e.target.value))
                        }
                        className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, var(--text-color-variable) 0%, var(--text-color-variable) ${
                            volume * 100
                          }%, #4b5563 ${volume * 100}%, #4b5563 100%)`,
                        }}
                      />
                      <span className="text-gray-400 text-xs w-8 text-right">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Playlist - Fixed Height with Scroll */}
                  <div className="p-3 bg-tertiary rounded-lg">
                    <h4 className="text-secondary font-medium text-sm mb-3">
                      Playlist
                    </h4>
                    <div className="space-y-2 h-32 overflow-y-auto">
                      {playlist.map((track: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => selectTrack(index)}
                          className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                            currentTrack === index
                              ? 'bg-[var(--text-color-variable)] text-secondary'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-secondary'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="truncate font-medium">
                                {track.title}
                              </div>
                              <div className="text-xs opacity-75 truncate">
                                {track.artist}
                              </div>
                            </div>
                            {currentTrack === index && isPlaying && (
                              <div className="ml-2 flex-shrink-0">
                                <svg
                                  className="w-4 h-4 text-secondary animate-pulse"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Music Controls Info */}
                  <div className="p-3 bg-tertiary rounded-lg">
                    <h4 className="text-secondary font-medium text-sm mb-2">
                      Controls
                    </h4>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Play/Pause</span>
                        <span className="text-gray-300">Spacebar or Click</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Track</span>
                        <span className="text-gray-300">
                          Ctrl + → or Swipe Left
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Previous Track</span>
                        <span className="text-gray-300">
                          Ctrl + ← or Swipe Right
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expand Dock</span>
                        <span className="text-gray-300">Click Music Icon</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-tertiary flex-shrink-0">
              <p className="text-secondary text-xs text-center">
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
      className="absolute top-full right-0 mt-2 w-96 bg-black-100 border border-tertiary 
                 rounded-xl shadow-2xl z-[9999] overflow-hidden"
    >
      {/* Original desktop menu content remains the same */}
      {/* Header with tabs */}
      <div className="p-4 border-b border-tertiary">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-secondary text-lg font-semibold">
            Customizations
          </h3>
          <button
            onClick={onClose}
            className="text-secondary hover:text-secondary transition-colors text-xl"
          >
            ×
          </button>
        </div>

        <div className="flex space-x-1 bg-tertiary rounded-lg p-1">
          <button
            onClick={() => setActiveTab('themes')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
              activeTab === 'themes'
                ? 'bg-[var(--text-color-variable)] text-secondary shadow-lg'
                : 'text-secondary hover:text-secondary'
            }`}
          >
            Themes
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
              activeTab === 'music'
                ? 'bg-[var(--text-color-variable)] text-secondary shadow-lg'
                : 'text-secondary hover:text-secondary'
            }`}
          >
            Music
          </button>
        </div>
      </div>

      {/* Content for desktop */}
      <div className="max-h-80 overflow-y-auto">
        {activeTab === 'themes' ? (
          <div className="p-4 space-y-3">
            {Object.entries(themes).map(([themeKey, themeData]) => {
              const colors = getThemePreviewColors(themeKey);
              const isSelected = theme === themeKey;

              return (
                <div
                  key={themeKey}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleThemeChange(themeKey);
                  }}
                  className={`
                    relative p-3 rounded-lg cursor-pointer transition-all duration-300 border
                    ${
                      isSelected
                        ? 'border-[var(--text-color-variable)] bg-[var(--tertiary-color)] shadow-lg'
                        : 'border-tertiary hover:border-[var(--text-color-variable)] bg-tertiary hover:bg-[var(--tertiary-color)]'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-secondary font-medium text-sm mb-2">
                        {themeData.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        {colors && (
                          <>
                            <div
                              className="w-4 h-4 rounded-full border border-gray-600"
                              style={{ backgroundColor: colors.primary }}
                              title="Primary Color"
                            />
                            <div
                              className="w-4 h-4 rounded-full border border-gray-600"
                              style={{ backgroundColor: colors.accent }}
                              title="Accent Color"
                            />
                            <div
                              className="w-4 h-4 rounded-full border border-gray-600"
                              style={{ backgroundColor: colors.secondary }}
                              title="Secondary Color"
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="text-[var(--text-color-variable)] text-sm font-medium">
                        ✓ Active
                      </div>
                    )}
                  </div>

                  {colors && (
                    <div
                      className="absolute top-0 right-0 w-1 h-full rounded-r-lg"
                      style={{
                        background: `linear-gradient(to bottom, ${colors.accent}, ${colors.primary})`,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Music Tab for Desktop */
          <div className="p-4 space-y-4">
            {/* Music Dock Controls */}
            <div className="p-3 bg-tertiary rounded-lg space-y-3">
              <h4 className="text-secondary font-medium text-sm">Music Dock</h4>

              {/* Visibility Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-xs">Show music dock</p>
                </div>
                <button
                  onClick={toggleFloatingBar}
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
                  <p className="text-gray-300 text-xs mb-2">Dock style</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFloatingBarMode('mini')}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        floatingBarMode === 'mini'
                          ? 'bg-[var(--text-color-variable)] text-secondary'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Compact
                    </button>
                    <button
                      onClick={() => setFloatingBarMode('standard')}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        floatingBarMode === 'standard'
                          ? 'bg-[var(--text-color-variable)] text-secondary'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Full
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    {floatingBarMode === 'mini'
                      ? 'Shows play button only'
                      : 'Shows full dock with track info'}
                  </p>
                </div>
              )}
            </div>

            {/* Volume Control */}
            <div className="p-3 bg-tertiary rounded-lg">
              <h4 className="text-secondary font-medium text-sm mb-3">
                Volume
              </h4>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) =>
                    handleVolumeChange(parseFloat(e.target.value))
                  }
                  className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, var(--text-color-variable) 0%, var(--text-color-variable) ${
                      volume * 100
                    }%, #4b5563 ${volume * 100}%, #4b5563 100%)`,
                  }}
                />
                <span className="text-gray-400 text-xs w-8 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>

            {/* Playlist */}
            <div className="p-3 bg-tertiary rounded-lg">
              <h4 className="text-secondary font-medium text-sm mb-3">
                Playlist
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {playlist.map((track: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => selectTrack(index)}
                    className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                      currentTrack === index
                        ? 'bg-[var(--text-color-variable)] text-secondary'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">
                          {track.title}
                        </div>
                        <div className="text-xs opacity-75 truncate">
                          {track.artist}
                        </div>
                      </div>
                      {currentTrack === index && isPlaying && (
                        <div className="ml-2 flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-secondary animate-pulse"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Music Controls Info */}
            <div className="p-3 bg-tertiary rounded-lg">
              <h4 className="text-secondary font-medium text-sm mb-2">
                Controls
              </h4>
              <div className="space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Play/Pause</span>
                  <span className="text-gray-300">Spacebar or Click</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Track</span>
                  <span className="text-gray-300">Ctrl + → or Swipe Left</span>
                </div>
                <div className="flex justify-between">
                  <span>Previous Track</span>
                  <span className="text-gray-300">Ctrl + ← or Swipe Right</span>
                </div>
                <div className="flex justify-between">
                  <span>Expand Dock</span>
                  <span className="text-gray-300">Click Music Icon</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-tertiary">
        <p className="text-secondary text-xs text-center">
          {activeTab === 'themes'
            ? 'Themes are automatically saved'
            : 'Music dock settings persist across sessions'}
        </p>
      </div>

      {/* Custom slider styles */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: var(--text-color-variable);
          cursor: pointer;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: var(--text-color-variable);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from { 
            transform: translateY(-20px);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from { 
            transform: scale(0.95);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CustomizationMenu;
