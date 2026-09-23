'use client';

import { StatsGl } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import BlackHole, {
  createBlackHoleState,
  type BlackHoleState,
} from './BlackHole';
import { trackPointer, type PointerState } from './pointer';
import { pointsFragmentShader, pointsVertexShader } from './shaders';
import { sampleText, writeTargets } from './shapes';
import {
  CLICK_SHOCK,
  createSimulation,
  NO_SHOCK,
  NO_WELL,
  type Simulation,
} from './simulation';
import { trackSlot, type Slot } from './slot';
import { tint, watchAccent } from './theme';
import {
  bangShock,
  evaporateShock,
  EXIT,
  exitWell,
  holdMass,
  holdWell,
  INTRO,
  introCollapse,
  introWell,
  releaseShock,
  type ShockShape,
} from './timeline';

// Particle budgets as simulation texture sizes: 32,768, 16,384 and 8,192.
// Phones and low memory devices start one tier down; a device that still
// cannot keep up drops one more, once.
const TIERS = [
  { width: 256, height: 128 },
  { width: 128, height: 128 },
  { width: 128, height: 64 },
];
// Frame time is sampled this long once the page is calm (name formed, no
// intro or hold), and a median above the budget drops a tier.
const SAMPLE_FOR = 2;
const FRAME_BUDGET = 1 / 50;

// Warm ivory: dust in a late sunbeam. Fast particles shift to a hot blue
// white. Both lean a little toward the theme's accent.
const BASE_COLOR = new THREE.Color('#EDE3D1');
const HOT_COLOR = new THREE.Color('#CFE3FF');
const BASE_TINT = 0.18;
const HOT_TINT = 0.35;

// A long frame (tab switch, GC pause) must never launch particles.
const MAX_DELTA = 1 / 30;

// Without the intro, dust drifts this long before the name starts to gather.
const FORM_AFTER = 1;
// Once most particles have landed, the real heading text fades out.
const TEXT_FADE_AFTER = 1.8;
// Particles per sampled text point, capped at this share of the budget. Scaling
// by points keeps letter density the same at phone and desktop sizes.
const NAME_DENSITY = 1;
const NAME_MAX_SHARE = 0.6;

// Pointer speed in px/s where wind starts and where it reaches full strength.
// Below the first, a resting or barely moving cursor leaves particles alone.
const WIND_START_SPEED = 40;
const WIND_FULL_SPEED = 700;
// How fast the smoothed pointer velocity follows the real one, per second.
const POINTER_SMOOTHING = 10;
// Drag scales with pointer velocity, so a flick or a pointer that jumps
// (touch, a click after the cursor was elsewhere) is capped at this speed.
const MAX_POINTER_SPEED = 1400;
// Nearest and farthest dust shift by up to this many pixels as the pointer
// crosses the screen, and the shift follows the pointer at this rate.
const PARALLAX = 18;
const PARALLAX_SMOOTHING = 3;
// The drawn core is this many times the capture horizon, and dust bends
// around it out to this many core radii.
const CORE_SCALE = 2.2;
const LENS_SCALE = 1.4;
// How fast the core grows in, and how fast a flash fades, per second.
const CORE_GROWTH = 8;
const FLASH_DECAY = 5;
// The press and hold hint shows this long after the name forms, until the
// visitor first holds; that is remembered across visits.
const HINT_AFTER = 1.5;
const HELD_KEY = 'swarm-held';

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
};

function buildAttributes(width: number, height: number) {
  const count = width * height;
  // Points need a position attribute to set the draw count. The real position
  // comes from the simulation texture, so these stay zero.
  const positions = new Float32Array(count * 3);
  const refs = new Float32Array(count * 2);
  const sizes = new Float32Array(count);
  const brightness = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Texel centres, so each point samples exactly its own particle.
    refs[i * 2] = ((i % width) + 0.5) / width;
    refs[i * 2 + 1] = (Math.floor(i / width) + 0.5) / height;

    // About 3% of motes are larger and brighter so they catch the light.
    const mote = Math.random() < 0.03;
    sizes[i] = mote ? 3.5 + Math.random() : 1.5 + Math.random() * 1.5;
    brightness[i] = mote ? 0.5 : 0.14 + Math.random() * 0.14;
  }

  return { positions, refs, sizes, brightness };
}

function createUniforms() {
  return {
    uPositions: { value: null as THREE.Texture | null },
    uVelocities: { value: null as THREE.Texture | null },
    uPixelRatio: { value: 1 },
    uColor: { value: BASE_COLOR.clone() },
    uHotColor: { value: HOT_COLOR.clone() },
    uParallax: { value: new THREE.Vector2() },
    // Gravitational lens: centre x, y and Einstein radius.
    uLens: { value: new THREE.Vector3() },
  };
}

type DustMaterial = THREE.ShaderMaterial & {
  uniforms: ReturnType<typeof createUniforms>;
};

function Dust({
  width: texWidth,
  height: texHeight,
  calm,
  onSlow,
  blackHoleRef,
}: {
  /** Simulation texture size; one particle per texel. */
  width: number;
  height: number;
  /** Reduced motion: no intro, hold, scroll exit, wind, shocks or parallax. */
  calm: boolean;
  /** Called once if frames run over budget; absent on the lowest tier. */
  onSlow?: () => void;
  blackHoleRef: React.RefObject<BlackHoleState>;
}) {
  const gl = useThree((state) => state.gl);
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<DustMaterial>(null);
  // Refs, not state: all of this is only read inside the frame loop.
  const simulationRef = useRef<Simulation | null>(null);
  const nameRef = useRef<{ slot: Slot; ready: boolean } | null>(null);
  const formStartRef = useRef<number | null>(null);
  // The opening sequence: its clock, warm up frames counted, and when it
  // banged in clock time.
  const introRef = useRef({
    stage: 'off' as 'off' | 'gathering' | 'banged',
    t: 0,
    frames: 0,
    bangAt: 0,
  });
  const pointerRef = useRef<PointerState | null>(null);
  // Smoothed pointer velocity in client pixels per second, and the position
  // it was measured from last frame.
  const pointerMotionRef = useRef({
    lastX: 0,
    lastY: 0,
    vx: 0,
    vy: 0,
    wasActive: false,
  });
  // The latest shock of any kind (click, hold release, bang) and when it
  // started, plus the click counter last seen.
  const shockRef = useRef({
    seenClicks: 0,
    shape: { ...CLICK_SHOCK, x: 0, y: 0 } as ShockShape,
    start: null as number | null,
  });
  // Set once the scroll exit's black hole has evaporated, until the name is
  // scrolled back.
  const exitRef = useRef({ evaporated: false });
  // Which well was open last frame, so a handover between two can free what
  // the first one captured.
  const wellSourceRef = useRef<'intro' | 'hold' | 'exit' | null>(null);
  // Whether the hint has shown and whether this visitor has ever held.
  const hintRef = useRef({ shown: false, held: false });
  // Frame times sampled for the tier check, until it has run.
  const frameTimesRef = useRef<number[] | null>(onSlow ? [] : null);
  // Read in the frame loop, so a change mid session applies without a remount.
  const calmRef = useRef(calm);
  // The press and hold in progress, in world space, and the release counter
  // last seen.
  const holdRef = useRef({
    active: false,
    x: 0,
    y: 0,
    heldFor: 0,
    seenReleases: 0,
  });

  const { positions, refs, sizes, brightness } = useMemo(
    () => buildAttributes(texWidth, texHeight),
    [texWidth, texHeight],
  );
  const uniforms = useMemo(() => createUniforms(), []);

  useEffect(() => {
    calmRef.current = calm;
  }, [calm]);

  useEffect(() => {
    // Read once for the initial scatter; later resizes only move the wrap edge.
    const { width, height } = gl.domElement.getBoundingClientRect();
    const sim = createSimulation(gl, texWidth, texHeight, width, height);
    simulationRef.current = sim;
    const root = document.documentElement;
    // Without a simulation there is no intro, so the name must show now.
    if (!sim) {
      delete root.dataset.swarmIntro;
      return;
    }

    let cancelled = false;
    const resample = (element: HTMLElement) => {
      // Sampling before the web font loads would trace the fallback font.
      void document.fonts.ready.then(() => {
        if (cancelled) return;
        const points = sampleText(element);
        const count = Math.min(
          Math.round((points.length / 2) * NAME_DENSITY),
          Math.round(texWidth * texHeight * NAME_MAX_SHARE),
        );
        writeTargets(sim.targets, points, count);
        sim.commitTargets();
        if (nameRef.current) nameRef.current.ready = true;
      });
    };
    // Slots are looked up inside this page only, never a hidden copy of it.
    const page =
      gl.domElement.closest('[data-swarm-stage]')?.parentElement ?? document;
    const slot = trackSlot(page, 'name', resample);
    nameRef.current = slot ? { slot, ready: false } : null;
    const pointer = trackPointer();
    pointerRef.current = pointer.state;
    const stopAccent = watchAccent((accent) => {
      const material = materialRef.current;
      if (!material) return;
      tint(material.uniforms.uColor.value, BASE_COLOR, accent, BASE_TINT);
      tint(material.uniforms.uHotColor.value, HOT_COLOR, accent, HOT_TINT);
    });
    if (wantsIntro()) introRef.current.stage = 'gathering';
    hintRef.current.held = readFlag(HELD_KEY);

    return () => {
      cancelled = true;
      delete root.dataset.swarmIntro;
      delete root.dataset.swarmHint;
      stopAccent();
      pointer.stop();
      pointerRef.current = null;
      slot?.stop();
      if (slot) delete slot.element.dataset.swarmFormed;
      nameRef.current = null;
      sim.dispose();
      simulationRef.current = null;
    };
  }, [gl, texWidth, texHeight]);

  useFrame(({ size, viewport, clock }, delta) => {
    const points = pointsRef.current;
    const material = materialRef.current;
    const simulation = simulationRef.current;
    if (!points || !material) return;
    // Hidden until the simulation exists, and for good if the device cannot
    // run it, which leaves the page looking like the no WebGL fallback.
    points.visible = simulation !== null;
    if (!simulation) return;

    const time = clock.elapsedTime;
    const dt = Math.min(delta, MAX_DELTA);
    const calm = calmRef.current;
    const name = nameRef.current;
    const rect = name?.slot.rect;
    // The name only holds while its heading is on screen. Scrolled away, the
    // particles are released back to dust.
    const onScreen = !!rect && rect.bottom > 0 && rect.top < size.height;
    // Centre of the name in world space, where the intro's singularity sits.
    const centerX = rect ? rect.left + rect.width / 2 - size.width / 2 : 0;
    const centerY = rect ? size.height / 2 - (rect.top + rect.height / 2) : 0;

    const intro = introRef.current;
    let bangNow = false;
    if (intro.stage === 'gathering') {
      if (intro.frames < INTRO.warmupFrames) intro.frames += 1;
      else intro.t += dt;
      const collapsed = INTRO.gather + INTRO.collapse;
      // Bangs once collapsed and the name's shape is known, or when waiting
      // for that shape has taken too long.
      if (
        intro.t >= collapsed &&
        (!name || name.ready || intro.t >= collapsed + INTRO.maxWait)
      ) {
        intro.stage = 'banged';
        intro.bangAt = time;
        bangNow = true;
      }
    }
    const introHolding =
      intro.stage === 'gathering' ||
      (intro.stage === 'banged' && time - intro.bangAt < INTRO.formDelay);
    // How far the name has scrolled from where it rests at the top of the page
    // (0) to its centre reaching the top edge of the screen (1).
    const scrolled = window.scrollY;
    const restCenter = rect ? rect.top + rect.height / 2 + scrolled : 0;
    const exitProgress =
      restCenter > 0 ? Math.min(Math.max(scrolled / restCenter, 0), 1) : 0;
    const exit = exitRef.current;
    if (exit.evaporated && exitProgress < EXIT.reset) exit.evaporated = false;
    let evaporateNow = false;
    if (
      !calm &&
      !exit.evaporated &&
      intro.stage !== 'gathering' &&
      exitProgress >= EXIT.full
    ) {
      exit.evaporated = true;
      evaporateNow = true;
    }
    const exiting =
      !calm &&
      !exit.evaporated &&
      intro.stage !== 'gathering' &&
      exitProgress > EXIT.start;

    const shouldForm =
      !!name?.ready &&
      onScreen &&
      !introHolding &&
      // Spent, the exit keeps the name apart only past where it evaporated;
      // scrolled back above that, the name rebuilds.
      !(exit.evaporated && exitProgress >= EXIT.full) &&
      (intro.stage === 'banged' || time > FORM_AFTER);

    if (shouldForm && formStartRef.current === null) {
      formStartRef.current = time;
    } else if (!shouldForm) {
      formStartRef.current = null;
    }
    const formTime =
      formStartRef.current === null ? 0 : time - formStartRef.current;

    // Once the particles have formed the name, the real text stays hidden:
    // the swarm rebuilds the name whenever it is on screen, and a hold or the
    // scroll exit taking it apart is the point, not a reason to show the text.
    if (name && formTime > TEXT_FADE_AFTER) {
      if (!('swarmFormed' in name.slot.element.dataset)) {
        name.slot.element.dataset.swarmFormed = '';
      }
      // Formed first, then the intro's hiding comes off, so the real text
      // never flashes in between.
      if (intro.stage === 'banged') {
        delete document.documentElement.dataset.swarmIntro;
      }
    }
    const hint = hintRef.current;
    if (
      !hint.shown &&
      !hint.held &&
      !calm &&
      formTime > TEXT_FADE_AFTER + HINT_AFTER
    ) {
      hint.shown = true;
      document.documentElement.dataset.swarmHint = '';
    }

    const pointer = pointerRef.current;
    const motion = pointerMotionRef.current;
    const active = !!pointer?.active;
    // Measuring only across two active frames means a cursor entering the
    // window never registers as a jump from wherever it last left.
    const measurable = active && motion.wasActive && dt > 0;
    const rawVX = measurable ? (pointer.x - motion.lastX) / dt : 0;
    const rawVY = measurable ? (pointer.y - motion.lastY) / dt : 0;
    const follow = 1 - Math.exp(-dt * POINTER_SMOOTHING);
    motion.vx += (rawVX - motion.vx) * follow;
    motion.vy += (rawVY - motion.vy) * follow;
    if (pointer) {
      motion.lastX = pointer.x;
      motion.lastY = pointer.y;
    }
    motion.wasActive = active;
    const speed = Math.hypot(motion.vx, motion.vy);
    const cap = speed > MAX_POINTER_SPEED ? MAX_POINTER_SPEED / speed : 1;
    const wind =
      active && !calm
        ? smoothstep(WIND_START_SPEED, WIND_FULL_SPEED, speed)
        : 0;

    const shock = shockRef.current;
    const startShock = (shape: ShockShape) => {
      shock.shape = shape;
      shock.start = time;
    };
    if (pointer && pointer.clicks !== shock.seenClicks) {
      shock.seenClicks = pointer.clicks;
      // A click while the dust gathers hurries it into the collapse.
      if (intro.stage === 'gathering') {
        intro.t = Math.max(intro.t, INTRO.gather);
      } else if (!calm)
        startShock({
          ...CLICK_SHOCK,
          x: pointer.clickX - size.width / 2,
          y: size.height / 2 - pointer.clickY,
        });
    }

    // Press and hold grows a black hole where the press began; letting go
    // closes it and bangs everything it swallowed back out.
    const hold = holdRef.current;
    const blackHole = blackHoleRef.current;
    // Holds only start with the name at rest, before any scroll away.
    if (
      pointer?.holding &&
      !hold.active &&
      !introHolding &&
      !calm &&
      exitProgress < 0.02
    ) {
      hold.active = true;
      hold.x = pointer.holdX - size.width / 2;
      hold.y = size.height / 2 - pointer.holdY;
      hold.heldFor = 0;
      if (!hintRef.current.held) {
        hintRef.current.held = true;
        writeFlag(HELD_KEY);
        delete document.documentElement.dataset.swarmHint;
      }
    }
    if (hold.active) hold.heldFor += dt;
    if (pointer && pointer.releases !== hold.seenReleases) {
      hold.seenReleases = pointer.releases;
      if (hold.active) {
        hold.active = false;
        startShock(
          releaseShock(hold.x, hold.y, hold.heldFor, pointer.softRelease),
        );
        blackHole.flash = pointer.softRelease
          ? 0.15
          : 0.3 + 0.4 * holdMass(hold.heldFor);
        blackHole.flashX = hold.x;
        blackHole.flashY = hold.y;
      }
    }
    if (bangNow) {
      startShock(bangShock(centerX, centerY, size.width, size.height));
      blackHole.flash = 1;
      blackHole.flashX = centerX;
      blackHole.flashY = centerY;
    }
    if (evaporateNow) {
      startShock(evaporateShock(centerX, centerY));
      blackHole.flash = 0.4;
      blackHole.flashX = centerX;
      blackHole.flashY = centerY;
    }
    const wellSource =
      intro.stage === 'gathering'
        ? 'intro'
        : hold.active
          ? 'hold'
          : exiting
            ? 'exit'
            : null;
    // Captured particles are freed only when the horizon closes, so a handover
    // from one open well to another closes it for one frame first. Otherwise
    // they stay parked, now at the new well.
    const handover =
      wellSource !== null &&
      wellSourceRef.current !== null &&
      wellSource !== wellSourceRef.current;
    wellSourceRef.current = handover ? null : wellSource;
    const well =
      handover || wellSource === null
        ? NO_WELL
        : wellSource === 'intro'
          ? introWell(intro.t, centerX, centerY)
          : wellSource === 'hold'
            ? holdWell(hold.x, hold.y, hold.heldFor)
            : exitWell(exitProgress, centerX, centerY);

    // The core eases in as the well opens and vanishes the moment it closes.
    const coreTarget = well.horizon * CORE_SCALE;
    blackHole.radius =
      coreTarget > 0
        ? blackHole.radius +
          (coreTarget - blackHole.radius) * (1 - Math.exp(-dt * CORE_GROWTH))
        : 0;
    blackHole.x = well.x;
    blackHole.y = well.y;
    blackHole.flash *= Math.exp(-dt * FLASH_DECAY);
    // The singularity glows brighter as everything falls into it.
    if (intro.stage === 'gathering') {
      blackHole.flash = 0.08 + 0.3 * introCollapse(intro.t);
      blackHole.flashX = centerX;
      blackHole.flashY = centerY;
    }
    material.uniforms.uLens.value.set(
      well.x,
      well.y,
      blackHole.radius * LENS_SCALE,
    );

    simulation.step({
      time,
      delta: dt,
      width: size.width,
      height: size.height,
      slotX: (rect?.left ?? 0) - size.width / 2,
      slotY: size.height / 2 - (rect?.top ?? 0),
      form: formStartRef.current === null ? 0 : 1,
      formTime,
      pointerX: (pointer?.x ?? 0) - size.width / 2,
      pointerY: size.height / 2 - (pointer?.y ?? 0),
      // Client y runs down, world y runs up.
      pointerVX: motion.vx * cap,
      pointerVY: -motion.vy * cap,
      // No wind while holding: the well owns the space around the pointer.
      wind: hold.active ? 0 : wind,
      shock: {
        ...shock.shape,
        time: shock.start === null ? NO_SHOCK : time - shock.start,
      },
      well,
    });
    material.uniforms.uPositions.value = simulation.positions();
    material.uniforms.uVelocities.value = simulation.velocities();
    // Pointer offset from the centre, from -1 to 1 on each axis, eased so the
    // dust glides rather than jumps. A pointer that leaves recentres it.
    const aimX = active && !calm ? pointer.x / size.width - 0.5 : 0;
    const aimY = active && !calm ? 0.5 - pointer.y / size.height : 0;
    const parallax = material.uniforms.uParallax.value;
    const glide = 1 - Math.exp(-dt * PARALLAX_SMOOTHING);
    parallax.x += (aimX * 2 * PARALLAX - parallax.x) * glide;
    parallax.y += (aimY * 2 * PARALLAX - parallax.y) * glide;
    material.uniforms.uPixelRatio.value = viewport.dpr;

    // Tier check: only while nothing unusual is running, so the intro or a
    // hold never counts against the device.
    const frameTimes = frameTimesRef.current;
    const settled =
      formTime > TEXT_FADE_AFTER && !hold.active && well === NO_WELL;
    if (frameTimes && settled && delta > 0) {
      frameTimes.push(delta);
      if (frameTimes.reduce((sum, t) => sum + t, 0) >= SAMPLE_FOR) {
        frameTimesRef.current = null;
        frameTimes.sort((a, b) => a - b);
        const median = frameTimes[Math.floor(frameTimes.length / 2)]!;
        if (median > FRAME_BUDGET) onSlow?.();
      }
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach='attributes-position' args={[positions, 3]} />
        <bufferAttribute attach='attributes-aRef' args={[refs, 2]} />
        <bufferAttribute attach='attributes-aSize' args={[sizes, 1]} />
        <bufferAttribute
          attach='attributes-aBrightness'
          args={[brightness, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={pointsVertexShader}
        fragmentShader={pointsFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Storage can be missing or throw (private mode, blocked site data); a lost
// flag only means the hint shows again.
function readFlag(key: string) {
  try {
    return window.localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

function writeFlag(key: string) {
  try {
    window.localStorage.setItem(key, '1');
  } catch {
    // Not remembered; see readFlag.
  }
}

/**
 * Whether to open with the intro: the inline head script asked for it and
 * this claims it, before its failsafe shows the name. In development,
 * ?swarm=intro forces it on every load, with the name left visible.
 */
function wantsIntro() {
  const root = document.documentElement;
  if (root.dataset.swarmIntro === 'pending') {
    root.dataset.swarmIntro = 'running';
    return true;
  }
  return (
    process.env.NODE_ENV === 'development' &&
    new URLSearchParams(window.location.search).get('swarm') === 'intro'
  );
}

// Dev only frame rate readout, opt in with ?swarm=fps.
function showStats() {
  return (
    process.env.NODE_ENV === 'development' &&
    new URLSearchParams(window.location.search).get('swarm') === 'fps'
  );
}

// The tier to start on: one down for small screens, 4GB or less of memory, or
// 4 or fewer cores.
function startTier() {
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const cores = navigator.hardwareConcurrency;
  const constrained =
    window.matchMedia('(max-width: 640px)').matches ||
    (memory !== undefined && memory <= 4) ||
    (cores !== undefined && cores <= 4);
  return constrained ? 1 : 0;
}

// Orthographic with zoom 1 makes one world unit one CSS pixel, which is what
// later steps rely on to place shapes over DOM slots. Browsers stop
// requestAnimationFrame in hidden tabs, so the loop needs no visibility gate.
export default function SwarmCanvas({ calm }: { calm: boolean }) {
  const [stats] = useState(showStats);
  const [tier, setTier] = useState(startTier);
  // A downgrade remounts the dust at the new size; the heading text covers
  // the swap while the name re-forms. Only one step, never a loop.
  const [downgraded, setDowngraded] = useState(false);
  const canDowngrade = !downgraded && tier < TIERS.length - 1;
  // Written by the dust's frame loop, read by the black hole's.
  const blackHoleRef = useRef(createBlackHoleState());

  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 100], zoom: 1 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
    >
      <Dust
        key={tier}
        {...TIERS[tier]!}
        calm={calm}
        onSlow={
          canDowngrade
            ? () => {
                setDowngraded(true);
                setTier(tier + 1);
              }
            : undefined
        }
        blackHoleRef={blackHoleRef}
      />
      <BlackHole stateRef={blackHoleRef} />
      {stats && <StatsGl className='fixed top-20 left-4 z-[100]' />}
    </Canvas>
  );
}
