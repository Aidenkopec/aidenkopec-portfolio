'use client';
import React, { useState, useEffect } from 'react';

import { useMusicPlayer } from '../hooks/useMusicPlayer';

interface MusicPlayerProps {
  mobile?: boolean;
  externalOpen?: boolean;
  onExternalOpenChange?: ((isOpen: boolean) => void) | null;
}

interface Track {
  title: string;
  artist: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  mobile = false,
  externalOpen = false,
  onExternalOpenChange = null,
}) => {
  const [showControls, setShowControls] = useState<boolean>(false);

  const {
    isPlaying,
    volume,
    currentTrack,
    hasError,
    playlist,
    togglePlay,
    nextTrack,
    previousTrack,
    selectTrack,
    handleVolumeChange,
  } = useMusicPlayer();

  // Handle external control
  useEffect(() => {
    if (externalOpen !== null && externalOpen !== undefined) {
      setShowControls(externalOpen);
    }
  }, [externalOpen]);

  // Update parent when controls state changes
  useEffect(() => {
    if (onExternalOpenChange) {
      onExternalOpenChange(showControls);
    }
  }, [showControls, onExternalOpenChange]);

  const handleVolumeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    handleVolumeChange(parseFloat(e.target.value));
  };

  const handleTrackSelect = (index: number): void => {
    selectTrack(index);
  };

  return (
    <div className='relative'>
      {/* Music toggle button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className={`text-secondary hover:text-secondary ${
          mobile ? 'text-[16px]' : 'text-[18px]'
        } cursor-pointer font-medium transition-colors`}
        title='Music'
      >
        Songs
      </button>

      {/* Expanded controls */}
      {showControls && (
        <div
          className={`bg-opacity-90 absolute rounded-lg border border-gray-800 bg-black p-4 shadow-2xl backdrop-blur-sm ${
            mobile
              ? 'top-10 right-0 min-w-[260px]'
              : 'top-12 right-0 min-w-[280px]'
          }`}
        >
          {/* Track info */}
          <div className='mb-3 text-center'>
            {hasError ? (
              <div className='text-xs text-yellow-400'>
                <p>🎵 Music files not found</p>
                <p className='mt-1 text-gray-400'>
                  Add MP3 files to /public/music/
                </p>
              </div>
            ) : (
              <>
                <h4 className='text-secondary truncate text-sm font-medium'>
                  {playlist[currentTrack]?.title || 'No Track'}
                </h4>
                <p className='text-xs text-gray-400'>
                  {playlist[currentTrack]?.artist || 'Unknown Artist'}
                </p>
              </>
            )}
          </div>

          {/* Control buttons */}
          <div className='mb-3 flex items-center justify-center space-x-4'>
            <button
              onClick={previousTrack}
              className='text-secondary transition-colors hover:text-purple-400'
              title='Previous Track'
            >
              <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              className='text-secondary rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-2 transition-all duration-300 hover:from-purple-600 hover:to-pink-600'
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg
                  className='h-4 w-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              ) : (
                <svg
                  className='h-4 w-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                    clipRule='evenodd'
                  />
                </svg>
              )}
            </button>

            <button
              onClick={nextTrack}
              className='text-secondary transition-colors hover:text-purple-400'
              title='Next Track'
            >
              <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414zm6 0a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>

          {/* Volume control */}
          <div className='flex items-center space-x-2'>
            <svg
              className='h-4 w-4 text-gray-400'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
            <input
              type='range'
              min='0'
              max='1'
              step='0.1'
              value={volume}
              onChange={handleVolumeInputChange}
              className='slider h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-600'
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
                  volume * 100
                }%, #4b5563 ${volume * 100}%, #4b5563 100%)`,
              }}
            />
          </div>

          {/* Track selector */}
          <div className='mt-3 border-t border-gray-700 pt-3'>
            <p className='mb-2 text-xs text-gray-400'>Playlist</p>
            <div className='max-h-32 space-y-1 overflow-y-auto'>
              {playlist.map((track: Track, index: number) => (
                <button
                  key={index}
                  onClick={() => handleTrackSelect(index)}
                  className={`w-full rounded px-2 py-1 text-left text-xs transition-colors ${
                    currentTrack === index
                      ? 'text-secondary bg-purple-600'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className='truncate'>{track.title}</div>
                  <div className='truncate text-gray-400'>{track.artist}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom slider styles */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
        }

        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;
