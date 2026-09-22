'use client';
import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';

import { useIsHydrated } from '@/hooks/useIsHydrated';

interface Track {
  title: string;
  src: string;
}

const playlist: Track[] = [
  {
    title: 'Deep Space',
    src: '/music/deep-space.mp3',
  },
  {
    title: 'Synthwave Nights',
    src: '/music/synthwave-nights.mp3',
  },
  {
    title: 'Digital Dreams',
    src: '/music/digital-dreams.mp3',
  },
];

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

const DEFAULT_SETTINGS = {
  volume: 0.5,
  currentTrack: 0,
  isFloatingBarVisible: true,
  floatingBarMode: 'standard',
};

const FLOATING_BAR_MODES = ['hidden', 'mini', 'standard'];

// localStorage is user editable and can throw when blocked, and this provider
// wraps the whole app. Each value is validated and falls back to its default.
function readStoredSettings(): typeof DEFAULT_SETTINGS {
  const settings = { ...DEFAULT_SETTINGS };
  try {
    const volume = Number.parseFloat(localStorage.getItem('musicVolume') ?? '');
    if (volume >= 0 && volume <= 1) settings.volume = volume;

    const track = Number.parseInt(
      localStorage.getItem('currentTrack') ?? '',
      10,
    );
    if (track >= 0 && track < playlist.length) settings.currentTrack = track;

    const visible = localStorage.getItem('floatingBarVisible');
    if (visible === 'true' || visible === 'false') {
      settings.isFloatingBarVisible = visible === 'true';
    }

    const mode = localStorage.getItem('floatingBarMode');
    if (mode && FLOATING_BAR_MODES.includes(mode)) {
      settings.floatingBarMode = mode;
    }
  } catch {
    // Storage unavailable: keep the defaults.
  }
  return settings;
}

function writeStoredSetting(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable or full: the setting lasts for this session only.
  }
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Stored settings are read only after hydration, so the first client render
  // matches the server markup. A value the user sets overrides the stored one.
  const isHydrated = useIsHydrated();
  const stored = useMemo(
    () => (isHydrated ? readStoredSettings() : DEFAULT_SETTINGS),
    [isHydrated],
  );
  const [volumeOverride, setVolume] = useState<number | null>(null);
  const [trackOverride, setCurrentTrack] = useState<number | null>(null);
  const [visibleOverride, setIsFloatingBarVisible] = useState<boolean | null>(
    null,
  );
  const [modeOverride, setFloatingBarMode] = useState<string | null>(null);
  const volume = volumeOverride ?? stored.volume;
  const currentTrack = trackOverride ?? stored.currentTrack;
  const isFloatingBarVisible = visibleOverride ?? stored.isFloatingBarVisible;
  const floatingBarMode = modeOverride ?? stored.floatingBarMode;

  const audioRef = useRef<HTMLAudioElement>(null);

  // Persist volume changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      writeStoredSetting('musicVolume', volume.toString());
    }
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, isHydrated]);

  // Persist current track changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      writeStoredSetting('currentTrack', currentTrack.toString());
    }
  }, [currentTrack, isHydrated]);

  // Persist floating bar visibility and mode (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      writeStoredSetting(
        'floatingBarVisible',
        JSON.stringify(isFloatingBarVisible),
      );
    }
  }, [isFloatingBarVisible, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      writeStoredSetting('floatingBarMode', floatingBarMode);
    }
  }, [floatingBarMode, isHydrated]);

  const togglePlay = useCallback((): void => {
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
  }, [isPlaying]);

  const nextTrack = useCallback((): void => {
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
  }, [currentTrack, isPlaying]);

  const previousTrack = useCallback((): void => {
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
  }, [currentTrack, isPlaying]);

  const selectTrack = useCallback(
    (index: number): void => {
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
    },
    [isPlaying],
  );

  const handleTrackEnd = useCallback((): void => {
    nextTrack();
  }, [nextTrack]);

  const toggleFloatingBar = useCallback((): void => {
    setIsFloatingBarVisible((v) => !(v ?? stored.isFloatingBarVisible));
  }, [stored.isFloatingBarVisible]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // A document keydown can target the document itself, which has no
      // closest().
      const target = e.target instanceof HTMLElement ? e.target : null;
      // Only text entry is off limits, where Ctrl+Left and Ctrl+Right move by
      // word. Buttons and links are not excluded: the modifier below already
      // keeps bare Space working on a focused control, and the player's own
      // buttons hold focus after every click, which silenced the shortcuts.
      if (
        target?.isContentEditable ||
        target?.closest('input, textarea, select, [contenteditable]')
      ) {
        return;
      }

      switch (e.code) {
        // Modifier required, to match the track shortcuts below and so bare
        // Space keeps paging the document.
        case 'Space':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            togglePlay();
          }
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
  }, [togglePlay, nextTrack, previousTrack]);

  const value: MusicContextType = useMemo(
    () => ({
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
    }),
    [
      isPlaying,
      volume,
      currentTrack,
      hasError,
      isFloatingBarVisible,
      floatingBarMode,
      isHydrated,
      togglePlay,
      nextTrack,
      previousTrack,
      selectTrack,
      handleTrackEnd,
      toggleFloatingBar,
    ],
  );

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
        preload='metadata'
      />
    </MusicContext.Provider>
  );
};
