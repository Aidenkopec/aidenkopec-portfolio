/**
 * A slot is an element whose box a shape is drawn over. Its rect is re-read
 * only on scroll, resize and the element's own resize, never every frame.
 */
export type Slot = {
  element: HTMLElement;
  rect: DOMRect;
  stop: () => void;
};

/**
 * Searches only inside `root`, and skips hidden matches. Next keeps pages you
 * navigate away from mounted under `display: none`, so a second copy of the
 * slot can sit elsewhere in the document.
 */
export function trackSlot(
  root: ParentNode,
  name: string,
  onResize: (element: HTMLElement) => void,
): Slot | null {
  const element = Array.from(
    root.querySelectorAll<HTMLElement>(`[data-swarm-slot="${name}"]`),
  ).find((candidate) =>
    // Safari before 17.4 has no checkVisibility; a display: none subtree has
    // no client rects either.
    typeof candidate.checkVisibility === 'function'
      ? candidate.checkVisibility()
      : candidate.getClientRects().length > 0,
  );
  if (!element) return null;

  const slot: Slot = {
    element,
    rect: element.getBoundingClientRect(),
    stop: () => {},
  };

  const measure = () => {
    slot.rect = element.getBoundingClientRect();
  };
  // Fires once on observe, which covers the first sample.
  const observer = new ResizeObserver(() => {
    measure();
    onResize(element);
  });

  window.addEventListener('scroll', measure, { passive: true });
  window.addEventListener('resize', measure);
  observer.observe(element);

  slot.stop = () => {
    window.removeEventListener('scroll', measure);
    window.removeEventListener('resize', measure);
    observer.disconnect();
  };

  return slot;
}
