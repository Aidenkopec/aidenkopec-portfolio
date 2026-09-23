import { CLICK_SHOCK, type Shock, type Well } from './simulation';

/** A shock waiting for its start time; the frame loop adds that. */
export type ShockShape = Omit<Shock, 'time'>;

// How long a hold takes to reach about two thirds of its full mass.
const HOLD_GROWTH = 1.2;

/** From 0 on press toward 1 the longer a hold lasts, easing out. */
export const holdMass = (heldFor: number) =>
  1 - Math.exp(-heldFor / HOLD_GROWTH);

/**
 * The well under a press and hold. It starts as a small eddy around the
 * pointer and grows in reach, pull and spin until it can swallow the name.
 */
export function holdWell(x: number, y: number, heldFor: number): Well {
  const mass = holdMass(heldFor);
  return {
    x,
    y,
    pull: 0.5 + 2.5 * mass,
    spin: 180 + 520 * mass,
    reach: 140 + 900 * mass,
    horizon: 3 + 12 * mass,
    release: 1,
    response: 3 + 5 * mass,
  };
}

/**
 * The bang when a hold ends, stronger the longer it was held. A soft release
 * (the browser took the gesture) lets the particles go with a small puff.
 */
export function releaseShock(
  x: number,
  y: number,
  heldFor: number,
  soft: boolean,
): ShockShape {
  if (soft) return { ...CLICK_SHOCK, x, y, kick: 3000, reach: 300 };
  const mass = holdMass(heldFor);
  return {
    x,
    y,
    kick: CLICK_SHOCK.kick * (0.8 + 1.7 * mass),
    speed: CLICK_SHOCK.speed + 800 * mass,
    reach: CLICK_SHOCK.reach + 700 * mass,
    hold: CLICK_SHOCK.hold + 0.4 * mass,
  };
}

/**
 * The opening. Every particle spirals into a singularity over the name
 * (gather), falls through its horizon (collapse), then bursts back out and
 * forms the name. Times are seconds of simulation time, which only advances
 * with rendered frames, so a slow device never bangs before it has collapsed.
 */
export const INTRO = {
  // Frames skipped before the clock starts, to absorb the shader compile.
  warmupFrames: 2,
  gather: 1.4,
  collapse: 0.4,
  // Longest the singularity waits for the name's shape after collapsing.
  maxWait: 1,
  // Gap between the bang and the name starting to pull together.
  formDelay: 0.15,
};

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);

/** The well at intro time t: slow at first, then everything falls in. */
export function introWell(t: number, x: number, y: number): Well {
  const gather = clamp01(t / INTRO.gather);
  const collapse = introCollapse(t);
  return {
    x,
    y,
    // Pull stays low while the spin builds, so the dust winds into arms
    // before the collapse drags everything in.
    pull: 0.05 + gather * gather + 12 * collapse,
    spin: 900 + 2600 * gather + 800 * collapse,
    // Far past any screen, so every particle takes part.
    reach: 4000,
    horizon: 3 + 4 * gather + 22 * collapse,
    release: 1,
    response: 2 + 4 * gather + 4 * collapse,
  };
}

/** How far into the collapse the intro is at time t, from 0 to 1. */
export const introCollapse = (t: number) =>
  clamp01((t - INTRO.gather) / INTRO.collapse);

/** The bang: a short hold so the burst reads before the name gathers. */
export function bangShock(
  x: number,
  y: number,
  width: number,
  height: number,
): ShockShape {
  return {
    x,
    y,
    kick: CLICK_SHOCK.kick * 1.8,
    speed: 2200,
    reach: Math.max(width, height) * 0.6,
    hold: 0.25,
  };
}

/**
 * Scrolling away. Progress runs from 0 with the name centred on screen to 1
 * with its centre at the top edge. Past start a black hole opens on the name
 * and grows with progress; at full it evaporates, puffing everything back out
 * as dust. It stays spent until the name is scrolled back near the centre.
 */
export const EXIT = { start: 0.15, full: 0.6, reset: 0.1 };

/** The well while scrolling away, at exit progress p. */
export function exitWell(p: number, x: number, y: number): Well {
  const e = clamp01((p - EXIT.start) / (EXIT.full - EXIT.start));
  return {
    x,
    y,
    pull: 0.3 + 2.5 * e,
    spin: 300 + 900 * e,
    reach: 150 + 900 * e,
    horizon: 2 + 14 * e,
    release: e,
    response: 2 + 6 * e,
  };
}

/** The soft puff when the scroll exit's black hole evaporates. */
export function evaporateShock(x: number, y: number): ShockShape {
  return { x, y, kick: 7000, speed: 1400, reach: 700, hold: 1.5 };
}

/**
 * Sending the contact form. The galaxy spirals into its own core (collapse),
 * then bangs back out and re-forms after formDelay. Seconds of simulation time.
 */
export const SEND = { collapse: 1.1, formDelay: 0.7 };

/** The well at send time t, sized to a galaxy of this radius. */
export function sendWell(
  t: number,
  x: number,
  y: number,
  radius: number,
): Well {
  const c = clamp01(t / SEND.collapse);
  return {
    x,
    y,
    pull: 0.3 + 7 * c * c,
    spin: 600 + 2200 * c,
    // Only the galaxy and the dust right around it fall in.
    reach: radius * 1.6,
    horizon: 2 + 16 * c,
    release: 1,
    response: 3 + 6 * c,
  };
}

/** The bang that ends a send, scaled to the galaxy. */
export function sendBang(x: number, y: number, radius: number): ShockShape {
  return {
    x,
    y,
    kick: CLICK_SHOCK.kick * 1.5,
    speed: 1800,
    reach: radius * 2.5,
    hold: 0.3,
  };
}

/** A failed send only shakes the galaxy; nothing falls in. */
export function wobbleShock(x: number, y: number, radius: number): ShockShape {
  return { x, y, kick: 2500, speed: 1200, reach: radius, hold: 0.15 };
}
