'use client';
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';

const MusicContext = createContext();

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Initialize with default values to prevent hydration mismatch
  const [volume, setVolume] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isFloatingBarVisible, setIsFloatingBarVisible] = useState(true);
  const [floatingBarMode, setFloatingBarMode] = useState('standard');
  
  const audioRef = useRef(null);

  // Load localStorage values after hydration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load saved values from localStorage
      const savedVolume = localStorage.getItem('musicVolume');
      if (savedVolume) {
        setVolume(parseFloat(savedVolume));
      }
      
      const savedTrack = localStorage.getItem('currentTrack');
      if (savedTrack) {
        setCurrentTrack(parseInt(savedTrack));
      }
      
      const savedFloatingBarVisible = localStorage.getItem('floatingBarVisible');
      if (savedFloatingBarVisible !== null) {
        setIsFloatingBarVisible(JSON.parse(savedFloatingBarVisible));
      }
      
      const savedFloatingBarMode = localStorage.getItem('floatingBarMode');
      if (savedFloatingBarMode) {
        setFloatingBarMode(savedFloatingBarMode);
      }
      
      // Mark as hydrated
      setIsHydrated(true);
    }
  }, []);

  const playlist = [
    {
      title: 'Deep Space',
      artist: 'Ambient Artist',
      src: '/music/deep-space.mp3',
    },
    {
      title: 'Synthwave Nights',
      artist: 'Synth Artist',
      src: '/music/synthwave-nights.mp3',
    },
    {
      title: 'Digital Dreams',
      artist: 'Electronic Artist',
      src: '/music/digital-dreams.mp3',
    },
  ];

  // Persist volume changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('musicVolume', volume.toString());
    }
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, isHydrated]);

  // Persist current track changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('currentTrack', currentTrack.toString());
    }
  }, [currentTrack, isHydrated]);

  // Persist floating bar visibility and mode (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(
        'floatingBarVisible',
        JSON.stringify(isFloatingBarVisible)
      );
    }
  }, [isFloatingBarVisible, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('floatingBarMode', floatingBarMode);
    }
  }, [floatingBarMode, isHydrated]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.warn('Audio playback failed:', error);
        setHasError(true);
        setIsPlaying(false);
      });
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrack + 1) % playlist.length;
    setCurrentTrack(nextIndex);
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().catch((error) => {
          console.warn('Audio playback failed:', error);
          setIsPlaying(false);
          setHasError(true);
        });
      }, 100);
    }
  };

  const previousTrack = () => {
    const prevIndex =
      currentTrack === 0 ? playlist.length - 1 : currentTrack - 1;
    setCurrentTrack(prevIndex);
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().catch((error) => {
          console.warn('Audio playback failed:', error);
          setIsPlaying(false);
          setHasError(true);
        });
      }, 100);
    }
  };

  const selectTrack = (index) => {
    setCurrentTrack(index);
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().catch((error) => {
          console.warn('Audio playback failed:', error);
          setIsPlaying(false);
          setHasError(true);
        });
      }, 100);
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const toggleFloatingBar = () => {
    setIsFloatingBarVisible(!isFloatingBarVisible);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return; // Don't trigger shortcuts when typing
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            nextTrack();
          }
          break;
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            previousTrack();
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, currentTrack]);

  const value = {
    // State
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    currentTrack,
    setCurrentTrack,
    hasError,
    setHasError,
    isFloatingBarVisible,
    setIsFloatingBarVisible,
    floatingBarMode,
    setFloatingBarMode,
    isHydrated,
    audioRef,
    playlist,

    // Actions
    togglePlay,
    nextTrack,
    previousTrack,
    selectTrack,
    handleTrackEnd,
    toggleFloatingBar,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      {/* Global audio element */}
      <audio
        ref={audioRef}
        src={playlist[currentTrack]?.src}
        onEnded={handleTrackEnd}
        onPlay={() => {
          setIsPlaying(true);
          setHasError(false);
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
        }}
        preload="metadata"
      />
    </MusicContext.Provider>
  );
};
