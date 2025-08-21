'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Preload,
  useGLTF,
  Environment,
} from '@react-three/drei';
import * as THREE from 'three';

import CanvasLoader from '../Loader';

interface ComputersProps {
  isMobile: boolean;
}

const Computers: React.FC<ComputersProps> = ({ isMobile }) => {
  const computer = useGLTF('/models/desktop-pc/scene.gltf');

  // Enable shadows on all meshes in the GLTF model and debug materials
  React.useEffect(() => {
    if (computer.scene) {
      computer.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Debug and refine material properties
          if (child.material) {
            // Reduce metalness and adjust roughness for less shine
            if (child.material.metalness !== undefined) {
              child.material.metalness = Math.min(
                child.material.metalness * 0.3,
                0.2
              );
            }
            if (child.material.roughness !== undefined) {
              child.material.roughness = Math.max(
                child.material.roughness,
                0.6
              );
            }

            // Force material update to ensure lighting changes take effect
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [computer.scene]);

  return (
    <mesh>
      {/* Subtle ambient light for dark theme */}
      <ambientLight intensity={0.4} />
      {/* Focused spotlight hitting the monitor */}
      <spotLight
        position={[2, 8, 4]}
        target-position={[0, 0, 0]}
        intensity={3.0}
        angle={0.3}
        penumbra={0.4}
        distance={15}
        decay={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color="#e6f3ff"
      />
      {/* Subtle rim lighting from behind */}
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.8}
        color="#4a90e2"
      />
      {/* Dark environment for moody atmosphere */}
      <Environment preset="night" />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.7 : 0.75}
        position={isMobile ? [0, -2.5, -2.2] : [0, -2.8, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

const ComputersCanvas: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia('(max-width: 500px)');

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop="always"
      shadows={{ enabled: true, type: THREE.PCFSoftShadowMap }}
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{
        preserveDrawingBuffer: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.6,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      style={{ touchAction: 'pan-y' }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          enablePan={false}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
        />
        <Computers isMobile={isMobile} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default ComputersCanvas;
