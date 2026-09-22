'use client';

import { StatsGl } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { trackPointer, type PointerState } from './pointer';
import { pointsFragmentShader, pointsVertexShader } from './shaders';
import { sampleText, writeTargets } from './shapes';
import { createSimulation, NO_SHOCK, type Simulation } from './simulation';
import { trackSlot, type Slot } from './slot';

// Mid tier, 32,768 particles. Tiers replace this in the tier step.
const TEX_WIDTH = 256;
const TEX_HEIGHT = 128;

// Warm ivory: dust in a late sunbeam. Theme tinting comes later.
const BASE_COLOR = new THREE.Color('#EDE3D1');

// A long frame (tab switch, GC pause) must never launch particles.
const MAX_DELTA = 1 / 30;

// Dust drifts this long before the name starts to gather.
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
    uPixelRatio: { value: 1 },
    uColor: { value: BASE_COLOR },
  };
}

type DustMaterial = THREE.ShaderMaterial & {
  uniforms: ReturnType<typeof createUniforms>;
};

function Dust() {
  const gl = useThree((state) => state.gl);
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<DustMaterial>(null);
  // Refs, not state: all of this is only read inside the frame loop.
  const simulationRef = useRef<Simulation | null>(null);
  const nameRef = useRef<{ slot: Slot; ready: boolean } | null>(null);
  const formStartRef = useRef<number | null>(null);
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
  // The click counter last seen, and where and when that shock started.
  const shockRef = useRef({
    seen: 0,
    x: 0,
    y: 0,
    start: null as number | null,
  });

  const { positions, refs, sizes, brightness } = useMemo(
    () => buildAttributes(TEX_WIDTH, TEX_HEIGHT),
    [],
  );
  const uniforms = useMemo(() => createUniforms(), []);

  useEffect(() => {
    // Read once for the initial scatter; later resizes only move the wrap edge.
    const { width, height } = gl.domElement.getBoundingClientRect();
    const sim = createSimulation(gl, TEX_WIDTH, TEX_HEIGHT, width, height);
    simulationRef.current = sim;
    if (!sim) return;

    let cancelled = false;
    const resample = (element: HTMLElement) => {
      // Sampling before the web font loads would trace the fallback font.
      void document.fonts.ready.then(() => {
        if (cancelled) return;
        const points = sampleText(element);
        const count = Math.min(
          Math.round((points.length / 2) * NAME_DENSITY),
          Math.round(TEX_WIDTH * TEX_HEIGHT * NAME_MAX_SHARE),
        );
        writeTargets(sim.targets, points, count);
        sim.commitTargets();
        if (nameRef.current) nameRef.current.ready = true;
      });
    };
    const slot = trackSlot('name', resample);
    nameRef.current = slot ? { slot, ready: false } : null;
    const pointer = trackPointer();
    pointerRef.current = pointer.state;

    return () => {
      cancelled = true;
      pointer.stop();
      pointerRef.current = null;
      slot?.stop();
      if (slot) delete slot.element.dataset.swarmFormed;
      nameRef.current = null;
      sim.dispose();
      simulationRef.current = null;
    };
  }, [gl]);

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
    const name = nameRef.current;
    const rect = name?.slot.rect;
    // The name only holds while its heading is on screen. Scrolled away, the
    // particles are released back to dust.
    const onScreen = !!rect && rect.bottom > 0 && rect.top < size.height;
    const shouldForm = !!name?.ready && onScreen && time > FORM_AFTER;

    if (shouldForm && formStartRef.current === null) {
      formStartRef.current = time;
    } else if (!shouldForm) {
      formStartRef.current = null;
    }
    const formTime =
      formStartRef.current === null ? 0 : time - formStartRef.current;

    if (name) {
      const formed = formTime > TEXT_FADE_AFTER;
      if (formed !== 'swarmFormed' in name.slot.element.dataset) {
        if (formed) name.slot.element.dataset.swarmFormed = '';
        else delete name.slot.element.dataset.swarmFormed;
      }
    }

    const dt = Math.min(delta, MAX_DELTA);
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
    const wind = active
      ? smoothstep(WIND_START_SPEED, WIND_FULL_SPEED, speed)
      : 0;

    const shock = shockRef.current;
    if (pointer && pointer.clicks !== shock.seen) {
      shock.seen = pointer.clicks;
      shock.x = pointer.clickX - size.width / 2;
      shock.y = size.height / 2 - pointer.clickY;
      shock.start = time;
    }

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
      wind,
      shockX: shock.x,
      shockY: shock.y,
      shockTime: shock.start === null ? NO_SHOCK : time - shock.start,
    });
    material.uniforms.uPositions.value = simulation.positions();
    material.uniforms.uPixelRatio.value = viewport.dpr;
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

// Dev only frame rate readout, opt in with ?swarm=fps.
function showStats() {
  return (
    process.env.NODE_ENV === 'development' &&
    new URLSearchParams(window.location.search).get('swarm') === 'fps'
  );
}

// Orthographic with zoom 1 makes one world unit one CSS pixel, which is what
// later steps rely on to place shapes over DOM slots. Browsers stop
// requestAnimationFrame in hidden tabs, so the loop needs no visibility gate.
export default function SwarmCanvas() {
  const [stats] = useState(showStats);

  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 100], zoom: 1 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
    >
      <Dust />
      {stats && <StatsGl className='fixed top-20 left-4 z-[100]' />}
    </Canvas>
  );
}
