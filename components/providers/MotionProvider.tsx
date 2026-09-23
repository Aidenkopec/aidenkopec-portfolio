'use client';

import { MotionConfig } from 'framer-motion';
import React from 'react';

/**
 * framer-motion defaults to `reducedMotion: 'never'`, so without this the
 * library ignores the OS preference entirely.
 *
 * `'user'` snaps every transform and layout animation straight to its final
 * value. Opacity, colour and filter still animate, which is the intended
 * outcome: fades are not what triggers motion sickness.
 *
 * Its own client file rather than an import into the server root layout, so the
 * framer-motion barrel stays out of the server module graph.
 *
 * Known limitation: the preference is read at mount, so toggling it mid session
 * needs a reload.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion='user'>{children}</MotionConfig>;
}
