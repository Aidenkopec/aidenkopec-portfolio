import { useMusicContext } from '../context';

export const useMusicPlayer = () => {
  const context = useMusicContext();

  if (!context) {
    throw new Error('useMusicPlayer must be used within MusicProvider');
  }

  const {
    isPlaying,
    volume,
    setVolume,
    currentTrack,
    hasError,
    isFloatingBarVisible,
    floatingBarMode,
    setFloatingBarMode,
    isHydrated,
    playlist,
    togglePlay,
    nextTrack,
    previousTrack,
    selectTrack,
    toggleFloatingBar,
  } = context;

  const currentSong = playlist[currentTrack];

  const handleVolumeChange = (newVolume: number): void => {
    setVolume(newVolume);
  };

  // Helper to get formatted track info
  const getTrackInfo = () => ({
    title: currentSong?.title || 'No Track',
    artist: currentSong?.artist || 'Unknown Artist',
    index: currentTrack + 1,
    total: playlist.length,
  });

  return {
    // State
    isPlaying,
    volume,
    currentTrack,
    hasError,
    isFloatingBarVisible,
    floatingBarMode,
    isHydrated,
    playlist,
    currentSong,

    // Actions
    togglePlay,
    nextTrack,
    previousTrack,
    selectTrack,
    handleVolumeChange,
    toggleFloatingBar,
    setFloatingBarMode,

    // Helpers
    getTrackInfo,
  };
};
