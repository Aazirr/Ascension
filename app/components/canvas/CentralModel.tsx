"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface CentralModelProps {
  modelPath: string;
  reducedMotion: boolean;
  isActive: boolean;
}

export default function CentralModel({
  modelPath,
  reducedMotion,
  isActive,
}: CentralModelProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const { scene } = useGLTF(modelPath);

  const modelScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
      }
    });

    return clone;
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) {
      return;
    }

    const t = state.clock.getElapsedTime();
    const targetY = isActive ? 0.02 : 0;
    const bob = Math.sin(t * 1.2) * (isActive ? 0.06 : 0.035);

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      t * (isActive ? 0.24 : 0.16),
      0.1,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      Math.sin(t * 0.7) * 0.06,
      0.08,
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY + bob,
      0.08,
    );
  });

  return (
    <group ref={groupRef} scale={0.55} position={[0, 0, 0.12]}>
      <primitive object={modelScene} />
    </group>
  );
}
