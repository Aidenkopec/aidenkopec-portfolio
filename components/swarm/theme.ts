import * as THREE from 'three';

/**
 * Calls onChange with the theme's accent (--text-color-variable) now and
 * whenever next-themes swaps the theme class on <html>. Returns a stop
 * function.
 */
export function watchAccent(onChange: (accent: THREE.Color) => void) {
  const root = document.documentElement;
  const read = () => {
    const value = getComputedStyle(root)
      .getPropertyValue('--text-color-variable')
      .trim();
    if (value) onChange(new THREE.Color(value));
  };
  read();
  const observer = new MutationObserver(read);
  observer.observe(root, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

/**
 * Tints a colour toward the accent. Small amounts keep the swarm's own warm
 * and hot tones, so every theme reads as a shade of starlight, not neon.
 */
export const tint = (
  target: THREE.Color,
  base: THREE.Color,
  accent: THREE.Color,
  amount: number,
) => target.copy(base).lerp(accent, amount);
