'use client';

import { useEffect, useRef } from 'react';

/**
 * Sets `data-playing` on the element while any of it is on screen, so looping
 * CSS animations inside it can pause off screen. Browsers keep running them
 * there, and an SVG animation repaints on the main thread every frame.
 */
export function usePlayWhileVisible<T extends HTMLElement | SVGElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) element.dataset.playing = '';
      else delete element.dataset.playing;
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}
