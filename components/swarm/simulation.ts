import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';

import { positionShader, velocityShader } from './shaders';

// Pixels are CSS pixels. Particles wrap this far past the viewport edge so
// they never pop in or out on screen.
const EDGE_MARGIN = 40;

// Drift tuning. Units are CSS pixels and seconds.
const DRIFT = {
  noiseScale: 0.0016,
  noiseSpeed: 0.035,
  driftSpeed: 9,
  response: 1.2,
};

// Formation tuning. omega sets the spring: a critically damped spring at 5
// rad/s crosses a laptop screen in about a second and never overshoots.
const FORM = {
  omega: 5,
  maxDelay: 0.8,
  ramp: 0.6,
};

// Cursor wind tuning. Radius in CSS pixels; push in px/s² at full wind; drag
// is how much of the pointer's own velocity particles pick up per second.
const WIND = {
  radius: 110,
  push: 2600,
  drag: 3.5,
};

/**
 * A shockwave. The ring leaves (x, y) in world space and travels at speed px/s,
 * reach is the distance in px over which its effect falls off, kick is the
 * outward push in px/s², and hold is how long a shape stays blown apart before
 * pulling back together. time is seconds since it started.
 */
export type Shock = {
  x: number;
  y: number;
  time: number;
  kick: number;
  speed: number;
  reach: number;
  hold: number;
};

/** Shape of a click's shock; callers add where and when. */
export const CLICK_SHOCK = {
  speed: 1800,
  reach: 420,
  kick: 9000,
  hold: 0.9,
};

/** A shock time this old has long finished everywhere on screen. */
export const NO_SHOCK = 1e4;

/**
 * A gravity well at (x, y) in world space. pull is inflow per second (inward
 * speed is pull times radius), spin is tangential speed in px/s at 100px,
 * reach in px is where its influence falls off, and particles inside horizon
 * px are captured until it drops to 0. release (0 to 1) is how much it frees
 * bound particles from their shape, and response how fast they obey it.
 */
export type Well = {
  x: number;
  y: number;
  pull: number;
  spin: number;
  reach: number;
  horizon: number;
  release: number;
  response: number;
};

/** A reach of 0 switches the well off. */
export const NO_WELL: Well = {
  x: 0,
  y: 0,
  pull: 0,
  spin: 0,
  reach: 0,
  horizon: 0,
  release: 0,
  response: 0,
};

export type StepInput = {
  time: number;
  delta: number;
  /** Canvas size in CSS pixels. */
  width: number;
  height: number;
  /** Top left of the active shape's slot, in world space. */
  slotX: number;
  slotY: number;
  /** 1 while the shape is forming or formed, 0 to release every particle. */
  form: number;
  /** Seconds since the current formation started. */
  formTime: number;
  /** Pointer position and smoothed velocity, in world space. */
  pointerX: number;
  pointerY: number;
  pointerVX: number;
  pointerVY: number;
  /** Wind strength from 0 (still or absent pointer) to 1. */
  wind: number;
  shock: Shock;
  well: Well;
};

export type Simulation = {
  step: (input: StepInput) => void;
  positions: () => THREE.Texture;
  velocities: () => THREE.Texture;
  /** Target data, four floats per particle: local x, local y, z, bound. */
  targets: Float32Array;
  /** Uploads `targets` after it has been written. */
  commitTargets: () => void;
  dispose: () => void;
};

/**
 * Position and velocity live in float textures, one texel per particle, and
 * both passes run on the GPU. Returns null when the device cannot render to
 * float textures, which callers treat the same as having no WebGL.
 */
export function createSimulation(
  renderer: THREE.WebGLRenderer,
  texWidth: number,
  texHeight: number,
  viewWidth: number,
  viewHeight: number,
): Simulation | null {
  if (!renderer.extensions.has('EXT_color_buffer_float')) return null;

  const gpu = new GPUComputationRenderer(texWidth, texHeight, renderer);

  const data = new Float32Array(texWidth * texHeight * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = (Math.random() - 0.5) * viewWidth;
    data[i + 1] = (Math.random() - 0.5) * viewHeight;
    data[i + 2] = 0;
    // w carries a stable per particle seed in [0, 1).
    data[i + 3] = Math.random();
  }
  const position0 = new THREE.DataTexture(
    data,
    texWidth,
    texHeight,
    THREE.RGBAFormat,
    THREE.FloatType,
  );
  position0.needsUpdate = true;
  const velocity0 = gpu.createTexture();

  // Starts with every particle spare (w = 0), so nothing forms until a shape
  // has been written.
  const targets = new Float32Array(texWidth * texHeight * 4);
  const targetTexture = new THREE.DataTexture(
    targets,
    texWidth,
    texHeight,
    THREE.RGBAFormat,
    THREE.FloatType,
  );
  targetTexture.needsUpdate = true;

  const position = gpu.addVariable(
    'texturePosition',
    positionShader,
    position0,
  );
  const velocity = gpu.addVariable(
    'textureVelocity',
    velocityShader,
    velocity0,
  );
  gpu.setVariableDependencies(position, [position, velocity]);
  gpu.setVariableDependencies(velocity, [position, velocity]);

  // Held directly so step() can write them without indexing the maps.
  const delta = { value: 0 };
  const time = { value: 0 };
  const halfBounds = { value: new THREE.Vector2() };
  position.material.uniforms.uDelta = delta;
  position.material.uniforms.uHalfBounds = halfBounds;
  velocity.material.uniforms.uDelta = delta;
  velocity.material.uniforms.uTime = time;
  velocity.material.uniforms.uNoiseScale = { value: DRIFT.noiseScale };
  velocity.material.uniforms.uNoiseSpeed = { value: DRIFT.noiseSpeed };
  velocity.material.uniforms.uDriftSpeed = { value: DRIFT.driftSpeed };
  velocity.material.uniforms.uResponse = { value: DRIFT.response };

  const slot = { value: new THREE.Vector2() };
  const form = { value: 0 };
  const formTime = { value: 0 };
  velocity.material.uniforms.uTargets = { value: targetTexture };
  velocity.material.uniforms.uSlot = slot;
  velocity.material.uniforms.uForm = form;
  velocity.material.uniforms.uFormTime = formTime;
  velocity.material.uniforms.uOmega = { value: FORM.omega };
  velocity.material.uniforms.uMaxDelay = { value: FORM.maxDelay };
  velocity.material.uniforms.uRamp = { value: FORM.ramp };

  const pointer = { value: new THREE.Vector2() };
  const pointerVelocity = { value: new THREE.Vector2() };
  const wind = { value: 0 };
  velocity.material.uniforms.uPointer = pointer;
  velocity.material.uniforms.uPointerVelocity = pointerVelocity;
  velocity.material.uniforms.uWind = wind;
  velocity.material.uniforms.uWindRadius = { value: WIND.radius };
  velocity.material.uniforms.uWindPush = { value: WIND.push };
  velocity.material.uniforms.uWindDrag = { value: WIND.drag };

  const shock = { value: new THREE.Vector4(0, 0, NO_SHOCK, 0) };
  const shockShape = { value: new THREE.Vector3(1, 1, 0) };
  velocity.material.uniforms.uShock = shock;
  velocity.material.uniforms.uShockShape = shockShape;

  // Both passes share these: velocity steers into the well, position captures.
  const wellA = { value: new THREE.Vector4() };
  const wellB = { value: new THREE.Vector4() };
  velocity.material.uniforms.uWellA = wellA;
  velocity.material.uniforms.uWellB = wellB;
  position.material.uniforms.uWellA = wellA;
  position.material.uniforms.uWellB = wellB;

  const error = gpu.init();
  if (error) {
    if (process.env.NODE_ENV !== 'production') console.warn('[swarm]', error);
    gpu.dispose();
    targetTexture.dispose();
    return null;
  }

  return {
    step(input) {
      halfBounds.value.set(
        input.width / 2 + EDGE_MARGIN,
        input.height / 2 + EDGE_MARGIN,
      );
      delta.value = input.delta;
      time.value = input.time;
      slot.value.set(input.slotX, input.slotY);
      form.value = input.form;
      formTime.value = input.formTime;
      pointer.value.set(input.pointerX, input.pointerY);
      pointerVelocity.value.set(input.pointerVX, input.pointerVY);
      wind.value = input.wind;
      const { shock: s, well: w } = input;
      shock.value.set(s.x, s.y, s.time, s.kick);
      shockShape.value.set(s.speed, s.reach, s.hold);
      wellA.value.set(w.x, w.y, w.pull, w.spin);
      wellB.value.set(w.reach, w.horizon, w.release, w.response);
      gpu.compute();
    },
    positions: () => gpu.getCurrentRenderTarget(position).texture,
    velocities: () => gpu.getCurrentRenderTarget(velocity).texture,
    targets,
    commitTargets: () => {
      targetTexture.needsUpdate = true;
    },
    dispose: () => {
      gpu.dispose();
      targetTexture.dispose();
    },
  };
}
