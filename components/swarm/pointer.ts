/**
 * Last known pointer position and click in client pixels. The swarm canvas ignores
 * pointer events so the page stays clickable, which is why this listens on the
 * window instead.
 */
export type PointerState = {
  x: number;
  y: number;
  /** False before the first move and after the pointer leaves the window. */
  active: boolean;
  /** Last click that was not on a control, and a counter that bumps on each. */
  clickX: number;
  clickY: number;
  clicks: number;
};

// Clicks on these navigate or edit, so they should not also blow the name apart.
const CONTROLS =
  'a, button, input, textarea, select, label, summary, [role="button"]';

export function trackPointer(): { state: PointerState; stop: () => void } {
  const state: PointerState = {
    x: 0,
    y: 0,
    active: false,
    clickX: 0,
    clickY: 0,
    clicks: 0,
  };

  const move = (event: PointerEvent) => {
    state.x = event.clientX;
    state.y = event.clientY;
    state.active = true;
  };
  // relatedTarget is null only when the pointer leaves the document itself.
  const out = (event: PointerEvent) => {
    if (!event.relatedTarget) state.active = false;
  };
  const blur = () => {
    state.active = false;
  };
  const click = (event: MouseEvent) => {
    if (event.target instanceof Element && event.target.closest(CONTROLS)) {
      return;
    }
    state.clickX = event.clientX;
    state.clickY = event.clientY;
    state.clicks += 1;
  };

  window.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerout', out);
  window.addEventListener('blur', blur);
  window.addEventListener('click', click);

  return {
    state,
    stop: () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerout', out);
      window.removeEventListener('blur', blur);
      window.removeEventListener('click', click);
    },
  };
}
