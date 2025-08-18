import { Object3D, BufferGeometry, Material, Mesh } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Lights
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      spotLight: any;
      hemisphereLight: any;
      
      // Geometries
      boxGeometry: any;
      sphereGeometry: any;
      cylinderGeometry: any;
      planeGeometry: any;
      ringGeometry: any;
      torusGeometry: any;
      icosahedronGeometry: any;
      octahedronGeometry: any;
      tetrahedronGeometry: any;
      dodecahedronGeometry: any;
      bufferGeometry: any;
      
      // Materials
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      meshPhongMaterial: any;
      meshLambertMaterial: any;
      meshToonMaterial: any;
      meshPhysicalMaterial: any;
      lineBasicMaterial: any;
      lineDashedMaterial: any;
      pointsMaterial: any;
      spriteMaterial: any;
      rawShaderMaterial: any;
      shaderMaterial: any;
      
      // Meshes and Objects
      mesh: any;
      line: any;
      lineSegments: any;
      points: any;
      sprite: any;
      group: any;
      scene: any;
      camera: any;
      
      // Controls and Helpers
      orbitControls: any;
      transformControls: any;
      gridHelper: any;
      axesHelper: any;
      boxHelper: any;
      wireframe: any;
      
      // Primitives
      primitive: any;
      instance: any;
      instancedMesh: any;
      
      // Decals
      decal: any;
    }
  }
}

export {};
