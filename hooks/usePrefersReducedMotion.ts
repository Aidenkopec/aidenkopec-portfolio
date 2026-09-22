'use client';

import { useSyncExternalStore } from 'react';

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange: () => void) => {
  const reduced = window.matchMedia(REDUCED_QUERY);
  reduced.addEventListener('change', onChange);
  return () => reduced.removeEventListener('change', onChange);
};

const getSnapshot = () => window.matchMedia(REDUCED_QUERY).matches;

/**
 * Whether the visitor asked for reduced motion. False on the server and on the
 * first client render, so using it to change rendered output cannot cause a
 * hydration mismatch. framer-motion's own `useReducedMotion()` can return true
 * on that first render, which is why it is not used for that purpose here.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
