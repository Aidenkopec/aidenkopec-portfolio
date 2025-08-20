'use client';
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from 'react';

interface Track {
  title: string;
  artist: string;
  src: string;
}

interface MusicContextType {
  // State
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  currentTrack: number;
  setCurrentTrack: (track: number) => void;
  hasError: boolean;
  setHasError: (error: boolean) => void;
  isFloatingBarVisible: boolean;
  setIsFloatingBarVisible: (visible: boolean) => void;
  floatingBarMode: string;
  setFloatingBarMode: (mode: string) => void;
  isHydrated: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playlist: Track[];

  // Actions
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  selectTrack: (index: number) => void;
  handleTrackEnd: () => void;
  toggleFloatingBar: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusicContext = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Initialize with default values to prevent hydration mismatch
  const [volume, setVolume] = useState<number>(0.5);
  const [currentTrack, setCurrentTrack] = useState<number>(0);
  const [isFloatingBarVisible, setIsFloatingBarVisible] =
    useState<boolean>(true);
  const [floatingBarMode, setFloatingBarMode] = useState<string>('standard');

  const audioRef = useRef<HTMLAudioElement>(null);

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

      const savedFloatingBarVisible =
        localStorage.getItem('floatingBarVisible');
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

  const playlist: Track[] = [
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

  const togglePlay = (): void => {
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

  const nextTrack = (): void => {
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

  const previousTrack = (): void => {
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

  const selectTrack = (index: number): void => {
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

  const handleTrackEnd = (): void => {
    nextTrack();
  };

  const toggleFloatingBar = (): void => {
    setIsFloatingBarVisible(!isFloatingBarVisible);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
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

  const value: MusicContextType = {
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
