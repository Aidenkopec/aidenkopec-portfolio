'use client';

import { useSyncExternalStore } from 'react';

import { usePrefersReducedMotion } from './usePrefersReducedMotion';

// Probing costs a real WebGL context, so the answer is cached for the document
// rather than recomputed on every render.
let probed: boolean | null = null;

function supportsWebGL(): boolean {
  if (probed !== null) return probed;

  try {
    const canvas = document.createElement('canvas');
    const context =
      canvas.getContext('webgl2') ||
      (canvas.getContext('webgl') as WebGLRenderingContext | null);
    if (!context) {
      probed = false;
      return probed;
    }
    // Release the probe context immediately. The homepage already runs close to
    // the browser's active-context ceiling.
    context.getExtension('WEBGL_lose_context')?.loseContext();
    probed = true;
  } catch {
    probed = false;
  }

  return probed;
}

const subscribe = () => () => {};

const getSnapshot = () => supportsWebGL();

/**
 * Whether this client should mount a WebGL canvas at all. False on the server
 * and on the first client render, so no three.js chunk is requested under
 * reduced motion or without WebGL. Phones DO get the canvas: the 3D is the
 * hero, and gating it on width took the whole visual away on mobile.
 */
export function useCanRender3D(): boolean {
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasWebGL = useSyncExternalStore(subscribe, getSnapshot, () => false);
  return !prefersReducedMotion && hasWebGL;
}
