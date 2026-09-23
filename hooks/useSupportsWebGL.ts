'use client';

import { useSyncExternalStore } from 'react';

// Probing costs a real WebGL context, so the answer is cached for the document
// rather than recomputed on every render.
let probed: boolean | null = null;

export function probeWebGL(): boolean {
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

const getSnapshot = () => probeWebGL();

/**
 * Whether this client can create a WebGL context, ignoring motion preferences.
 * False on the server and on the first client render. The particle swarm uses
 * this directly because it has its own calm mode under reduced motion.
 */
export function useSupportsWebGL(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
