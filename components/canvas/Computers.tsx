'use client';

import React, { Suspense, useEffect, useState } from 'react';

import { Canvas } from '@react-three/fiber';

import {
  OrbitControls,
  Preload,
  useGLTF,
  Environment,
  ContactShadows,
} from '@react-three/drei';

import * as THREE from 'three';

import CanvasLoader from '../Loader';

interface ComputersProps {
  isMobile: boolean;
}

const Computers: React.FC<ComputersProps> = ({ isMobile }) => {
  const computer = useGLTF('/models/desktop-pc/scene.gltf');

  // Enhanced material processing for optimal lighting response

  React.useEffect(() => {
    if (computer.scene) {
      computer.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;

          child.receiveShadow = true;

          if (child.material) {
            // Fine-tune materials for realistic lighting

            const name = child.name?.toLowerCase() || '';

            const isScreen =
              name.includes('screen') ||
              name.includes('display') ||
              name.includes('monitor');

            const isDesk =
              name.includes('desk') ||
              name.includes('table') ||
              name.includes('surface') ||
              name.includes('plane') ||
              child.material.name?.toLowerCase().includes('wood') ||
              child.material.name?.toLowerCase().includes('desk');

            if (child.material.metalness !== undefined) {
              // Screen slightly reflective, desk completely matte, other parts minimal metal

              if (isDesk) {
                child.material.metalness = 0;
              } else if (isScreen) {
                child.material.metalness = 0.05;
              } else {
                child.material.metalness = 0.05; // Reduced from 0.15 for less shine
              }
            }

            if (child.material.roughness !== undefined) {
              // Desk very rough (matte), screen smooth for glare, other parts moderate

              if (isDesk) {
                child.material.roughness = 0.95; // Increased from 0.9 for even more matte
              } else if (isScreen) {
                child.material.roughness = 0.1;
              } else {
                child.material.roughness = 0.8; // Increased from 0.6 for less glossy plastic/metal
              }
            }

            // Reduce reflectivity on desk surfaces and computer body

            if (
              (isDesk || !isScreen) &&
              child.material.envMapIntensity !== undefined
            ) {
              child.material.envMapIntensity = isDesk ? 0.05 : 0.2; // Reduced environment reflections
            }

            // Adjust color/tone for more natural desk appearance

            if (isDesk && child.material.color) {
              // Slightly warm up the desk color if it's too gray

              const currentColor = child.material.color;

              child.material.color = new THREE.Color(
                currentColor.r * 1.1,

                currentColor.g * 1.05,

                currentColor.b * 0.95
              );
            }

            // Slight emissive for screen only

            if (isScreen && child.material.emissive) {
              child.material.emissiveIntensity = 0.3;

              child.material.emissive = new THREE.Color('#1a237e');
            }

            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [computer.scene]);

  return (
    <mesh>
      {/* Strong ambient light for visibility - warmer tone */}

      <ambientLight intensity={0.6} color="#fff5f0" />

      {/* Main key light - bright and focused with warmer tone */}

      <spotLight
        position={[10, 15, 10]}
        target-position={[0, 0, 0]}
        intensity={4.0}
        angle={0.5}
        penumbra={0.3}
        distance={30}
        decay={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-bias={-0.0005}
        color="#fffaf0"
      />

      {/* Strong front fill light - warmer */}

      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        color="#ffefd5"
        castShadow={false}
      />

      {/* Screen glow - simulates monitor light with enhanced glare */}

      <pointLight
        position={[0, 0, 3]}
        intensity={1.5}
        distance={10}
        decay={2}
        color="#88ccff"
      />

      {/* Additional screen highlight for glare effect */}

      <spotLight
        position={[1, 1, 4]}
        target-position={[0, 0, 0]}
        intensity={0.8}
        angle={0.15}
        penumbra={0.8}
        distance={8}
        decay={3}
        color="#ffffff"
      />

      {/* Left side accent light */}

      <spotLight
        position={[-8, 10, 0]}
        target-position={[0, 0, 0]}
        intensity={2.0}
        angle={0.6}
        penumbra={0.5}
        distance={20}
        decay={2}
        color="#b388ff"
      />

      {/* Right side accent light */}

      <spotLight
        position={[8, 10, 0]}
        target-position={[0, 0, 0]}
        intensity={2.0}
        angle={0.6}
        penumbra={0.5}
        distance={20}
        decay={2}
        color="#ff80ab"
      />

      {/* Bottom bounce light - desk reflection with warm tone */}

      <pointLight
        position={[0, -4, 4]}
        intensity={0.8}
        distance={12}
        decay={2}
        color="#ffe4d0"
      />

      {/* Back rim light for depth */}

      <directionalLight
        position={[-5, 5, -8]}
        intensity={1.0}
        color="#64b5f6"
      />

      {/* Top down light for keyboard visibility */}

      <spotLight
        position={[0, 12, 2]}
        target-position={[0, -2, 0]}
        intensity={1.5}
        angle={0.4}
        penumbra={0.3}
        distance={15}
        decay={2}
        color="#ffffff"
      />

      {/* Environment for reflections - reduced intensity with warmer preset */}

      <Environment preset="apartment" />

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
    const mediaQuery = window.matchMedia('(max-width: 500px)');

    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

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

        antialias: true,

        toneMapping: THREE.ACESFilmicToneMapping,

        toneMappingExposure: 1.2,

        outputColorSpace: THREE.SRGBColorSpace,

        powerPreference: 'high-performance',
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

            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
        />

        <Computers isMobile={isMobile} />

        {/* Contact shadows for grounding */}

        <ContactShadows
          position={[0, -2.8, 0]}
          opacity={0.6}
          scale={10}
          blur={2.0}
          far={4}
          color="#000000"
        />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default ComputersCanvas;
