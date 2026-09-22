'use client';

import { useSyncExternalStore } from 'react';

const SMALL_QUERY = '(max-width: 767px)';

const subscribe = (onChange: () => void) => {
  const small = window.matchMedia(SMALL_QUERY);
  small.addEventListener('change', onChange);
  return () => small.removeEventListener('change', onChange);
};

const getSnapshot = () => window.matchMedia(SMALL_QUERY).matches;

/**
 * Whether the viewport is phone sized. False on the server and on the first
 * client render, matching usePrefersReducedMotion, so using it to change
 * rendered output cannot cause a hydration mismatch.
 */
export function useIsSmallViewport(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
