/**
 * A slot is an element whose box a shape is drawn over. Its rect is re-read
 * only on scroll, resize and the element's own resize, never every frame.
 */
export type Slot = {
  element: HTMLElement;
  rect: DOMRect;
  stop: () => void;
};

export function trackSlot(
  name: string,
  onResize: (element: HTMLElement) => void,
): Slot | null {
  const element = document.querySelector<HTMLElement>(
    `[data-swarm-slot="${name}"]`,
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
