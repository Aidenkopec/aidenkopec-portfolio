'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Tracks a container so a canvas can hold a WebGL context only while the
 * section is being looked at. `mounted` leads the viewport so the chunk and the
 * model are in flight before the section arrives; `paused` follows it exactly so
 * the render loop stops the moment it leaves.
 */
export function useInViewport<T extends Element>(enabled: boolean) {
  const ref = useRef<T>(null);
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const mountObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry) setMounted(entry.isIntersecting);
      },
      { rootMargin: '250px 0px' },
    );
    const renderObserver = new IntersectionObserver(([entry]) => {
      if (entry) setPaused(!entry.isIntersecting);
    });

    mountObserver.observe(element);
    renderObserver.observe(element);

    return () => {
      mountObserver.disconnect();
      renderObserver.disconnect();
    };
  }, [enabled]);

  return { ref, mounted, paused };
}
