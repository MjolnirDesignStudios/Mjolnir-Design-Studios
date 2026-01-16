// src/components/three/Scene.tsx
"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera, Preload } from "@react-three/drei";
import { useGLTF, Loader } from "@react-three/drei";
import * as THREE from "three";

// Placeholder Mjolnir Hammer (unchanged from your original)
function MjolnirHammer() {
  return (
    <group position={[0, 0, 0]}>
      {/* Handle */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 2, 32]} />
        <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Lightning effect (glowing edges) */}
      <mesh position={[0, 0.5, 0]} scale={[1.05, 1.05, 1.05]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#7DF9FF" emissive="#7DF9FF" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Dynamic Model Loader Component
function DynamicModel({ url }: { url: string }) {
  const { scene } = useGLTF(url, true, false, (loader) => {
    loader.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      // Optional: You can track progress here if needed
    };
  });

  // Auto-center and scale the loaded model
  React.useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      scene.position.sub(center); // Center at origin
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim; // Fit nicely in view
      scene.scale.multiplyScalar(scale);

      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  // Error handling is done via Suspense fallback in parent
  return <primitive object={scene} />;
}

// Main Scene Component
interface SceneProps {
  modelUrl?: string | null;
}

export default function Scene({ modelUrl }: SceneProps) {
  return (
    <>
      <Canvas shadows camera={{ position: [3, 3, 5], fov: 50 }}>
        <PerspectiveCamera makeDefault position={[3, 3, 5]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <pointLight position={[-3, 2, -2]} intensity={0.8} color="#7DF9FF" />

        {/* Model - Suspense for async GLTF loading */}
        <Suspense fallback={<MjolnirHammer />}>
          {modelUrl ? <DynamicModel url={modelUrl} /> : <MjolnirHammer />}
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
        />

        {/* Environment */}
        <Environment preset="night" background blur={0.8} />

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#111111" />
        </mesh>

        <Preload all />
      </Canvas>
    </>
  );
}