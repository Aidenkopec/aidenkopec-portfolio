import React from 'react';

/**
 * Fills the box a WebGL canvas would occupy, so the layout is identical whether
 * or not the canvas mounts.
 *
 * This file must never import from `components/canvas/` or `@react-three/*`.
 * `components/canvas/CanvasLoader.tsx` cannot serve this role because it pulls in drei, which
 * would drag three.js back into the initial bundle and defeat the lazy loading
 * it exists to cover.
 */
const CanvasPlaceholder: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div
    aria-hidden='true'
    className={`h-full w-full rounded-2xl bg-[radial-gradient(ellipse_at_center,var(--black-100)_0%,transparent_70%)] ${className}`}
  />
);

export default CanvasPlaceholder;
