/**
 * Last known pointer position, click and press and hold in client pixels. The
 * swarm canvas ignores pointer events so the page stays clickable, which is why
 * this listens on the window instead.
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
  /** True while a press and hold is armed. holdX, holdY is where it began. */
  holding: boolean;
  holdX: number;
  holdY: number;
  /** Bumps when a hold ends; soft when the browser took the gesture away. */
  releases: number;
  softRelease: boolean;
};

// Clicks on these navigate or edit, so they should not also blow the name apart.
const CONTROLS =
  'a, button, input, textarea, select, label, summary, [role="button"]';

// Holds only start inside this area (the hero), so selecting text further
// down the page never grows a black hole.
const HOLD_ZONE = '[data-swarm-hold-zone]';
// A press arms into a hold after this long, if it has not moved this far.
const HOLD_DELAY = 180;
const HOLD_SLOP = 8;

export function trackPointer(): { state: PointerState; stop: () => void } {
  const state: PointerState = {
    x: 0,
    y: 0,
    active: false,
    clickX: 0,
    clickY: 0,
    clicks: 0,
    holding: false,
    holdX: 0,
    holdY: 0,
    releases: 0,
    softRelease: false,
  };

  // The press waiting to arm, and whether the click that ends a hold should
  // be swallowed so it does not also fire a shockwave.
  let pending: { id: number; x: number; y: number; timer: number } | null =
    null;
  let swallowClick = false;

  const cancelPending = () => {
    if (!pending) return;
    window.clearTimeout(pending.timer);
    pending = null;
  };
  const endHold = (soft: boolean) => {
    cancelPending();
    if (!state.holding) return;
    state.holding = false;
    state.softRelease = soft;
    state.releases += 1;
  };

  const move = (event: PointerEvent) => {
    state.x = event.clientX;
    state.y = event.clientY;
    state.active = true;
    if (
      pending?.id === event.pointerId &&
      Math.hypot(event.clientX - pending.x, event.clientY - pending.y) >
        HOLD_SLOP
    ) {
      cancelPending();
    }
  };
  const down = (event: PointerEvent) => {
    // A long touch may never send the click a hold would swallow, so a new
    // press starts clean.
    swallowClick = false;
    if (!event.isPrimary || event.button !== 0 || state.holding) return;
    const target = event.target instanceof Element ? event.target : null;
    if (!target?.closest(HOLD_ZONE) || target.closest(CONTROLS)) return;
    cancelPending();
    const { pointerId: id, clientX: x, clientY: y } = event;
    const timer = window.setTimeout(() => {
      pending = null;
      state.holding = true;
      state.holdX = x;
      state.holdY = y;
    }, HOLD_DELAY);
    pending = { id, x, y, timer };
  };
  const up = () => {
    if (state.holding) swallowClick = true;
    endHold(false);
  };
  // The browser took the gesture, usually because a touch became a scroll.
  const cancel = () => endHold(true);
  const hidden = () => {
    if (document.hidden) endHold(true);
  };
  // A long press on touch opens the context menu; not while holding.
  const menu = (event: Event) => {
    if (state.holding || pending) event.preventDefault();
  };
  // relatedTarget is null only when the pointer leaves the document itself.
  const out = (event: PointerEvent) => {
    if (!event.relatedTarget) state.active = false;
  };
  const blur = () => {
    state.active = false;
    endHold(true);
  };
  const click = (event: MouseEvent) => {
    if (swallowClick) {
      swallowClick = false;
      return;
    }
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
  window.addEventListener('pointerdown', down);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', cancel);
  window.addEventListener('contextmenu', menu);
  document.addEventListener('visibilitychange', hidden);

  return {
    state,
    stop: () => {
      cancelPending();
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
      window.removeEventListener('contextmenu', menu);
      document.removeEventListener('visibilitychange', hidden);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerout', out);
      window.removeEventListener('blur', blur);
      window.removeEventListener('click', click);
    },
  };
}
