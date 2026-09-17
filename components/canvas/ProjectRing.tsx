'use client';

import {
  Image as DreiImage,
  MeshReflectorMaterial,
  Preload,
  RoundedBox,
  useTexture,
} from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import type { Project } from '../../constants';

// Panel geometry matches the native 16:10 of every project screenshot.
const PANEL_W = 4;
const PANEL_H = 2.5;
const RING_RADIUS = 6.8;

// The lit frame sits slightly proud of the screenshot on every side. drei builds
// the rounded box by extruding `FRAME_D - FRAME_RADIUS * 2` and bevelling the rest,
// so the depth has to clear twice the radius or the extrusion runs backwards.
const FRAME_W = PANEL_W + 0.16;
const FRAME_H = PANEL_H + 0.16;
const FRAME_RADIUS = 0.07;
const FRAME_D = 0.16;

// Height of the ring's centre, and of the reflective floor just beneath it.
const RING_Y = 0.55;
const FLOOR_Y = -0.8;

// The vertical band the camera has to keep in view: the front panel plus a
// little headroom, down through enough floor to show its reflection.
const FRAME_TOP = RING_Y + FRAME_H / 2 + 0.12;
const FRAME_BOTTOM = FLOOR_Y - 0.5;
const FRAME_CENTER_Y = (FRAME_TOP + FRAME_BOTTOM) / 2;
const FRAME_HALF_H = (FRAME_TOP - FRAME_BOTTOM) / 2;

// A sliver of breathing room on the sides at narrow aspects.
const SIDE_MARGIN = 1.06;

// The stage is a short, very wide box whose aspect swings from about 1.4 on a
// small tablet to over 3.5 on a wide desktop. A fixed camera distance clips the
// panel tops at the short end, so derive the distance from the live canvas size
// and re-fit whenever it changes.
const FitCamera: React.FC = () => {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);

  useEffect(() => {
    const halfFov = (camera.fov * Math.PI) / 360;
    const aspect = size.width / size.height;

    const distanceForHeight = FRAME_HALF_H / Math.tan(halfFov);
    const distanceForWidth =
      ((FRAME_W / 2) * SIDE_MARGIN) / (Math.tan(halfFov) * aspect);

    camera.position.set(
      0,
      FRAME_CENTER_Y,
      Math.max(distanceForHeight, distanceForWidth),
    );
    camera.lookAt(0, FRAME_CENTER_Y, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
};

// Shortest signed distance between two positions on a ring of `count` slots,
// so spinning from the last project to the first never unwinds the long way.
const shortestDelta = (delta: number, count: number): number => {
  const half = count / 2;
  return ((((delta + half) % count) + count) % count) - half;
};

interface ThemeColors {
  accent: string;
  frame: string;
  floor: string;
}

const FALLBACK_COLORS: ThemeColors = {
  accent: '#60a5fa',
  frame: '#0b1b2b',
  floor: '#030a12',
};

// Themes swap CSS custom properties on <html>, so the scene reads them at
// runtime and re-reads them when the theme class changes. Same approach as
// components/canvas/WavyLines.tsx.
function readThemeColors(): ThemeColors {
  if (typeof window === 'undefined') return FALLBACK_COLORS;

  const style = getComputedStyle(document.documentElement);
  return {
    accent:
      style.getPropertyValue('--text-color-variable').trim() ||
      FALLBACK_COLORS.accent,
    frame:
      style.getPropertyValue('--black-100').trim() || FALLBACK_COLORS.frame,
    floor:
      style.getPropertyValue('--black-200').trim() || FALLBACK_COLORS.floor,
  };
}

function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(FALLBACK_COLORS);

  useEffect(() => {
    const update = () => setColors(readThemeColors());
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return colors;
}

interface PanelProps {
  texture: THREE.Texture;
  index: number;
  count: number;
  spin: React.RefObject<number>;
  accent: string;
  frame: string;
  onSelect: () => void;
  onOpen: () => void;
}

const Panel: React.FC<PanelProps> = ({
  texture,
  index,
  count,
  spin,
  accent,
  frame,
  onSelect,
  onOpen,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const imageRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  // How close this panel is to facing the camera, 0 to 1. Read on click so a
  // tap on the front panel opens detail while a tap on a side panel selects it.
  const focus = useRef(0);

  const step = (Math.PI * 2) / count;

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const offset = shortestDelta(index - spin.current, count);
    const theta = offset * step;

    group.position.x = Math.sin(theta) * RING_RADIUS;
    group.position.z = Math.cos(theta) * RING_RADIUS - RING_RADIUS;
    group.rotation.y = -theta;

    // Panels shrink as they recede, which keeps the front screenshot dominant.
    const near = Math.max(0, 1 - Math.abs(offset) / (count / 2));
    focus.current = Math.max(0, 1 - Math.abs(offset));

    const targetScale = 0.78 + 0.22 * near;
    const ease = 1 - Math.pow(0.001, delta);
    group.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      ease,
    );

    const image = imageRef.current;
    if (image) {
      // drei's image shader multiplies the sampled pixel by `color`, so lerping
      // it toward grey dims the off-centre panels without touching opacity,
      // which would drag the transparent planes into sorting trouble.
      const dim = 0.34 + 0.66 * focus.current;
      (
        image.material as THREE.Material & { color: THREE.Color }
      ).color.setScalar(dim);
    }

    const frameMesh = frameRef.current;
    if (frameMesh) {
      const material = frameMesh.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = THREE.MathUtils.lerp(
        material.emissiveIntensity,
        0.08 + 0.85 * focus.current,
        ease,
      );
    }
  });

  return (
    <group ref={groupRef}>
      <RoundedBox
        ref={frameRef}
        args={[FRAME_W, FRAME_H, FRAME_D]}
        radius={FRAME_RADIUS}
        smoothness={4}
        position={[0, 0, -FRAME_D / 2 - 0.02]}
        onClick={(event) => {
          event.stopPropagation();
          if (focus.current > 0.75) onOpen();
          else onSelect();
        }}
      >
        <meshStandardMaterial
          color={frame}
          emissive={accent}
          emissiveIntensity={0.1}
          metalness={0.35}
          roughness={0.45}
        />
      </RoundedBox>

      <DreiImage
        ref={imageRef}
        texture={texture}
        scale={[PANEL_W, PANEL_H]}
        radius={0.04}
        transparent
        toneMapped={false}
        raycast={() => null}
      />
    </group>
  );
};

interface RingProps {
  projects: Project[];
  cursorRef: React.RefObject<number>;
  dragOffset: React.RefObject<number>;
  colors: ThemeColors;
  onSelect: (index: number) => void;
  onOpenDetail: (index: number) => void;
}

const Ring: React.FC<RingProps> = ({
  projects,
  cursorRef,
  dragOffset,
  colors,
  onSelect,
  onOpenDetail,
}) => {
  const urls = useMemo(
    () => projects.map((project) => project.image.src),
    [projects],
  );
  const textures = useTexture(urls) as THREE.Texture[];

  // useTexture's onLoad argument only re-runs when its own identity changes, so
  // texture setup lives here, keyed on the textures themselves.
  useMemo(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
    });
  }, [textures]);

  // Seeded from the live cursor on the first frame rather than during render,
  // so the ring starts where the cursor already is instead of easing in from 0.
  const spin = useRef(0);
  const spinSeeded = useRef(false);

  useFrame((_, delta) => {
    const wanted = cursorRef.current + dragOffset.current;

    if (!spinSeeded.current) {
      spinSeeded.current = true;
      spin.current = wanted;
      return;
    }

    const ease = 1 - Math.pow(0.0015, delta);
    spin.current = THREE.MathUtils.lerp(spin.current, wanted, ease);
  });

  return (
    <group position={[0, RING_Y, 0]}>
      {projects.map((project, index) => (
        <Panel
          key={project.slug}
          texture={textures[index]}
          index={index}
          count={projects.length}
          spin={spin}
          accent={colors.accent}
          frame={colors.frame}
          onSelect={() => onSelect(index)}
          onOpen={() => onOpenDetail(index)}
        />
      ))}
    </group>
  );
};

interface ProjectRingCanvasProps {
  projects: Project[];
  /** Unbounded slot counter. Lets the ring spin past the ends without unwinding. */
  cursorRef: React.RefObject<number>;
  dragOffset: React.RefObject<number>;
  paused: boolean;
  onSelect: (index: number) => void;
  onOpenDetail: (index: number) => void;
}

const ProjectRingCanvas: React.FC<ProjectRingCanvasProps> = ({
  projects,
  cursorRef,
  dragOffset,
  paused,
  onSelect,
  onOpenDetail,
}) => {
  const colors = useThemeColors();

  return (
    <Canvas
      frameloop={paused ? 'never' : 'always'}
      dpr={[1, 1.75]}
      camera={{
        position: [0, FRAME_CENTER_Y, 6],
        fov: 42,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      style={{ touchAction: 'pan-y' }}
    >
      <FitCamera />

      <color attach='background' args={[colors.floor]} />
      <fog attach='fog' args={[colors.floor, 9, 22]} />

      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 6, 5]} intensity={0.9} />
      <pointLight
        position={[-6, 1.5, -1]}
        intensity={30}
        color={colors.accent}
      />
      <pointLight
        position={[6, 1.5, -1]}
        intensity={30}
        color={colors.accent}
      />

      <Suspense fallback={null}>
        <Ring
          projects={projects}
          cursorRef={cursorRef}
          dragOffset={dragOffset}
          colors={colors}
          onSelect={onSelect}
          onOpenDetail={onOpenDetail}
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]}>
          <planeGeometry args={[60, 60]} />
          <MeshReflectorMaterial
            mirror={0.78}
            resolution={512}
            blur={[220, 70]}
            mixBlur={0.8}
            mixStrength={1.6}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color={colors.floor}
            metalness={0.6}
            roughness={1}
          />
        </mesh>

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default ProjectRingCanvas;
