'use client';

import {
  ContactShadows,
  Environment,
  OrbitControls,
  Preload,
  useGLTF,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useTheme } from 'next-themes';
import React, { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';

import CanvasLoader from '../Loader';

type Theme = 'obsidian' | 'cosmicVoyage' | 'glacierSapphire' | 'auroraJade';

interface ComputersProps {
  isMobile: boolean;
}

const Computers: React.FC<ComputersProps> = ({ isMobile }) => {
  const computer = useGLTF('/models/desktop-pc/scene.gltf');
  const { theme } = useTheme();

  // Default to obsidian theme if theme is not yet loaded
  const currentTheme: Theme = (theme as Theme) || 'obsidian';

  // Define theme-specific colors matching CSS theme variables
  const themeColors: Record<
    Theme,
    {
      ambient: string;
      key: string;
      fill: string;
      screenGlow: string;
      leftAccent: string;
      rightAccent: string;
      bottomBounce: string;
      backRim: string;
      topDown: string;
      screenEmissive: string;
      envPreset: string;
      deskColor: string;
      hardwareAccent: string;
      frameColor: string;
    }
  > = {
    obsidian: {
      ambient: '#1a1a1a',
      key: '#ffffff',
      fill: '#141414',
      screenGlow: '#ffffff',
      leftAccent: '#ff6b6b',
      rightAccent: '#ff8a8a',
      bottomBounce: '#1a1a1a',
      backRim: '#ff6b6b',
      topDown: '#ffffff',
      screenEmissive: '#ffffff', // Keep screen bright for readability
      envPreset: 'night',
      deskColor: '#1a1a1a', // tertiary-color
      hardwareAccent: '#ff6b6b', // text-color-variable
      frameColor: '#141414', // black-100
    },
    cosmicVoyage: {
      ambient: '#1a0f2e',
      key: '#f8f5ff',
      fill: '#140a23',
      screenGlow: '#f8f5ff',
      leftAccent: '#a855f7',
      rightAccent: '#c084fc',
      bottomBounce: '#1a0f2e',
      backRim: '#a855f7',
      topDown: '#f8f5ff',
      screenEmissive: '#ffffff', // Keep screen bright for readability
      envPreset: 'dawn',
      deskColor: '#1a0f2e', // tertiary-color
      hardwareAccent: '#a855f7', // text-color-variable
      frameColor: '#140a23', // black-100
    },
    glacierSapphire: {
      ambient: '#0b2740',
      key: '#ffffff',
      fill: '#0b1b2b',
      screenGlow: '#ffffff',
      leftAccent: '#60a5fa',
      rightAccent: '#93c5fd',
      bottomBounce: '#0b2740',
      backRim: '#60a5fa',
      topDown: '#ffffff',
      screenEmissive: '#ffffff', // Keep screen bright for readability
      envPreset: 'city',
      deskColor: '#0b2740', // tertiary-color
      hardwareAccent: '#60a5fa', // text-color-variable
      frameColor: '#0b1b2b', // black-100
    },
    auroraJade: {
      ambient: '#0f2c24',
      key: '#ffffff',
      fill: '#0b1f19',
      screenGlow: '#ffffff',
      leftAccent: '#2dd4bf',
      rightAccent: '#5eead4',
      bottomBounce: '#0f2c24',
      backRim: '#2dd4bf',
      topDown: '#ffffff',
      screenEmissive: '#ffffff', // Keep screen bright for readability
      envPreset: 'forest',
      deskColor: '#0f2c24', // tertiary-color
      hardwareAccent: '#2dd4bf', // text-color-variable
      frameColor: '#0b1f19', // black-100
    },
  };

  const colors = themeColors[currentTheme];

  // Enhanced material processing for optimal lighting response
  React.useEffect(() => {
    if (computer.scene) {
      computer.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material) {
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
              if (isDesk) {
                child.material.metalness = 0;
              } else if (isScreen) {
                child.material.metalness = 0.05;
              } else {
                child.material.metalness = 0.05;
              }
            }

            if (child.material.roughness !== undefined) {
              if (isDesk) {
                child.material.roughness = 0.95;
              } else if (isScreen) {
                child.material.roughness = 0.1;
              } else {
                child.material.roughness = 0.8;
              }
            }

            // Reduced envMapIntensity for darker themes
            if (
              (isDesk || !isScreen) &&
              child.material.envMapIntensity !== undefined
            ) {
              child.material.envMapIntensity = isDesk ? 0.05 : 0.1; // Further reduced for subtlety
            }

            // Theme-based hardware coloring
            if (child.material.color) {
              if (isDesk) {
                // Desk matches theme tertiary color
                child.material.color = new THREE.Color(colors.deskColor);
              } else if (isScreen) {
                // Keep screen bright for readability
                child.material.emissive = new THREE.Color(
                  colors.screenEmissive,
                );
                child.material.emissiveIntensity = 0.8;
              } else {
                // Other hardware (monitor frame, PC case, keyboard) with theme accent
                const isFrame =
                  name.includes('frame') ||
                  name.includes('monitor') ||
                  name.includes('bezel');
                const isPCCase =
                  name.includes('case') ||
                  name.includes('tower') ||
                  name.includes('computer');
                const isKeyboard =
                  name.includes('keyboard') || name.includes('key');

                if (isFrame || isPCCase || isKeyboard) {
                  // Apply theme frame color with subtle accent highlights
                  const baseColor = new THREE.Color(colors.frameColor);
                  const accentColor = new THREE.Color(colors.hardwareAccent);

                  // Mix base color with slight accent tint
                  child.material.color = baseColor.lerp(accentColor, 0.1);

                  // Add subtle emissive glow for accent parts
                  if (child.material.emissive) {
                    child.material.emissive = new THREE.Color(
                      colors.hardwareAccent,
                    );
                    child.material.emissiveIntensity = 0.05;
                  }
                } else {
                  // Default hardware color matching theme frame color
                  child.material.color = new THREE.Color(colors.frameColor);
                }
              }
            }

            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [
    computer.scene,
    currentTheme,
    colors.deskColor,
    colors.frameColor,
    colors.hardwareAccent,
    colors.screenEmissive,
  ]); // Re-run on theme change

  return (
    <mesh>
      {/* Reduced ambient intensity for dark themes */}
      <ambientLight intensity={0.4} color={colors.ambient} />
      {/* Main key light - toned down */}
      <spotLight
        position={[10, 15, 10]}
        target-position={[0, 0, 0]}
        intensity={2.5} // Reduced from 4.0
        angle={0.5}
        penumbra={0.3}
        distance={30}
        decay={1.5}
        castShadow
        shadow-mapSize-width={1024} // Reduced for perf; was 2048
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-bias={-0.0005}
        color={colors.key}
      />
      {/* Front fill light - consolidated intensity */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.0} // Reduced from 1.5
        color={colors.fill}
        castShadow={false}
      />
      {/* Screen glow - keep bright for readability */}
      <pointLight
        position={[0, 0, 3]}
        intensity={2.0} // Increased for screen visibility
        distance={12}
        decay={2}
        color={colors.screenGlow}
      />
      {/* Screen highlight for glare - maintain current reflections */}
      <spotLight
        position={[1, 1, 4]}
        target-position={[0, 0, 0]}
        intensity={1.0} // Increased to maintain screen reflections
        angle={0.15}
        penumbra={0.8}
        distance={8}
        decay={3}
        color='#ffffff'
      />
      {/* Consolidated side accents into one hemispheric light for perf */}
      <hemisphereLight
        color={colors.leftAccent}
        groundColor={colors.rightAccent}
        intensity={1.5} // Combined from two spots
      />
      {/* Bottom bounce light */}
      <pointLight
        position={[0, -4, 4]}
        intensity={0.6} // Reduced from 0.8
        distance={12}
        decay={2}
        color={colors.bottomBounce}
      />
      {/* Back rim light */}
      <directionalLight
        position={[-5, 5, -8]}
        intensity={0.8} // Reduced from 1.0
        color={colors.backRim}
      />
      {/* Top down light */}
      <spotLight
        position={[0, 12, 2]}
        target-position={[0, -2, 0]}
        intensity={1.2} // Reduced from 1.5
        angle={0.4}
        penumbra={0.3}
        distance={15}
        decay={2}
        color={colors.topDown}
      />
      {/* Theme-specific environment */}
      <Environment preset={colors.envPreset as any} />{' '}
      {/* Added intensity control for subtlety */}
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
      frameloop='demand' // Changed to demand for better perf; renders only when needed
      shadows={{ enabled: true, type: THREE.PCFSoftShadowMap }}
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{
        preserveDrawingBuffer: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1, // Slight reduction for darker feel
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
          enableDamping={true} // Added for smoother feel
          dampingFactor={0.05}
          autoRotate={true} // Subtle auto-rotate for engagement
          autoRotateSpeed={0.5}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
        />

        <Computers isMobile={isMobile} />

        {/* Contact shadows */}
        <ContactShadows
          position={[0, -2.8, 0]}
          opacity={0.5} // Slight reduction for subtlety
          scale={10}
          blur={2.0}
          far={4}
          color='#000000'
        />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default ComputersCanvas;
