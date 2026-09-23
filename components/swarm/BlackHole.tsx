'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { tint, watchAccent } from './theme';

// Warm gold, like a lit accretion disk, leaning toward the theme's accent.
const RING_COLOR = new THREE.Color('#FFE2B8');
const RING_TINT = 0.3;

/**
 * What the black hole looks like this frame, in world space. Written by the
 * dust's frame loop and read here, so nothing goes through React state.
 */
export type BlackHoleState = {
  x: number;
  y: number;
  /** Radius of the dark core in px; 0 hides the core and its ring. */
  radius: number;
  /** A white glow from (flashX, flashY), from 0 (none) to 1. */
  flash: number;
  flashX: number;
  flashY: number;
};

export const createBlackHoleState = (): BlackHoleState => ({
  x: 0,
  y: 0,
  radius: 0,
  flash: 0,
  flashX: 0,
  flashY: 0,
});

const vertexShader = /* glsl */ `
  varying vec2 vWorld;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xy;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

// Premultiplied output over normal blending: the core darkens what is behind
// it, the ring and the flash add light.
const fragmentShader = /* glsl */ `
  uniform vec2 uCenter;
  uniform float uRadius;
  uniform vec3 uRingColor;
  uniform vec3 uFlash;
  varying vec2 vWorld;

  void main() {
    float r = length(vWorld - uCenter);
    float on = step(0.5, uRadius);
    float core = on * (1.0 - smoothstep(uRadius * 0.8, uRadius, r));
    // Photon ring just outside the core, and a faint halo past it.
    float ringWidth = uRadius * 0.12 + 0.75;
    float ring = on * exp(-pow((r - uRadius * 1.12) / ringWidth, 2.0));
    float halo = on * 0.22 * exp(-max(r - uRadius, 0.0) / (uRadius * 1.4 + 1.0))
      * smoothstep(uRadius * 0.9, uRadius * 1.1, r);
    float flash = uFlash.z * exp(-length(vWorld - uFlash.xy)
      / (90.0 + 220.0 * uFlash.z));

    float light = clamp(ring + halo + flash, 0.0, 1.0);
    vec3 color = uRingColor * (ring + halo) + vec3(flash);
    gl_FragColor = vec4(color, max(core, light));
  }
`;

function createUniforms() {
  return {
    uCenter: { value: new THREE.Vector2() },
    uRadius: { value: 0 },
    uRingColor: { value: RING_COLOR.clone() },
    uFlash: { value: new THREE.Vector3() },
  };
}

type HoleMaterial = THREE.ShaderMaterial & {
  uniforms: ReturnType<typeof createUniforms>;
};

/**
 * The dark core, photon ring and bang flash, drawn over the dust. One quad
 * the size of the viewport, hidden whenever there is nothing to show.
 */
export default function BlackHole({
  stateRef,
}: {
  stateRef: React.RefObject<BlackHoleState>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<HoleMaterial>(null);
  const uniforms = useMemo(() => createUniforms(), []);

  useEffect(
    () =>
      watchAccent((accent) => {
        const material = materialRef.current;
        if (material) {
          tint(
            material.uniforms.uRingColor.value,
            RING_COLOR,
            accent,
            RING_TINT,
          );
        }
      }),
    [],
  );

  useFrame(({ size }) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    const state = stateRef.current;
    if (!mesh || !material) return;
    mesh.visible = state.radius > 0.5 || state.flash > 0.001;
    if (!mesh.visible) return;
    mesh.scale.set(size.width, size.height, 1);
    const { uCenter, uRadius, uFlash } = material.uniforms;
    uCenter.value.set(state.x, state.y);
    uRadius.value = state.radius;
    uFlash.value.set(state.flashX, state.flashY, state.flash);
  });

  return (
    <mesh ref={meshRef} renderOrder={1} frustumCulled={false} visible={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        premultipliedAlpha
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
