'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload } from '@react-three/drei';
import type * as THREE from 'three';
import { memoize, random } from 'lodash';

type DreiPointsProps = React.ComponentProps<typeof Points>;

type StarsProps = {
  count?: number;
  radius?: number;
  colorHex?: string;
  size?: number;
  /** Rotation speed in radians/sec (lower = slower) */
  rotationSpeed?: { x: number; y: number };
} & Omit<DreiPointsProps, 'positions' | 'stride' | 'ref'>;

const generateSpherePositions = memoize(
  (count: number, radius: number): Float32Array => {
    const positions = new Float32Array(count * 3);
    let i = 0;
    while (i < count) {
      const x = random(-1, 1, true);
      const y = random(-1, 1, true);
      const z = random(-1, 1, true);
      const len = Math.hypot(x, y, z);
      if (len === 0 || len > 1) continue;

      const r = radius * Math.cbrt(random(0, 1, true));
      const idx = i * 3;
      positions[idx] = (x / len) * r;
      positions[idx + 1] = (y / len) * r;
      positions[idx + 2] = (z / len) * r;
      i += 1;
    }
    return positions;
  },
  (count: number, radius: number) => `${count}|${radius}`,
);

function Stars({
  count = 2000,
  radius = 1.2,
  colorHex = '#f272c8',
  size = 0.002,
  rotationSpeed = { x: 0.04, y: 0.025 }, // was ~0.10 and ~0.0667 rad/s; now slower
  ...props
}: StarsProps) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(
    () => generateSpherePositions(count, radius),
    [count, radius],
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= rotationSpeed.x * delta;
    ref.current.rotation.y -= rotationSpeed.y * delta;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={positions}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color={colorHex}
          size={size}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function StarsCanvas() {
  return (
    <div className='absolute inset-0 -z-10 h-auto w-full'>
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <Stars rotationSpeed={{ x: 0.035, y: 0.02 }} />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
}
