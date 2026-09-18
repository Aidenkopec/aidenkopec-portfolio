'use client';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

import CanvasLoader from '../Loader';

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

const Earth: React.FC = () => {
  const earth = useGLTF(
    '/models/planet/scene.glb',
    false,
    false,
  ) as unknown as GLTFResult;

  return (
    <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
  );
};

// `frameloop='demand'` would be a lie here: OrbitControls autoRotate invalidates
// every frame, so the loop never actually idles. An honest 'always' paired with a
// real 'never' when the section is offscreen is what stops the work.
const EarthCanvas: React.FC<{ paused?: boolean }> = ({ paused = false }) => {
  return (
    <Canvas
      shadows
      frameloop={paused ? 'never' : 'always'}
      dpr={[1, 2]}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;
