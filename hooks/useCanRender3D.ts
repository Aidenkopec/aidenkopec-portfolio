'use client';

import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { useSupportsWebGL } from './useSupportsWebGL';

/**
 * Whether this client should mount a WebGL canvas at all. False on the server
 * and on the first client render, so no three.js chunk is requested under
 * reduced motion or without WebGL. Phones DO get the canvas: the 3D is the
 * hero, and gating it on width took the whole visual away on mobile.
 */
export function useCanRender3D(): boolean {
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasWebGL = useSupportsWebGL();
  return !prefersReducedMotion && hasWebGL;
}
