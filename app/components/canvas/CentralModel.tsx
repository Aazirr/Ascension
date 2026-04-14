"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface CentralModelProps {
  modelPath: string;
  reducedMotion: boolean;
  isActive: boolean;
  onSelect: () => void;
}

const MODEL_FIT_SIZE = 1.5;

export default function CentralModel({
  modelPath,
  reducedMotion,
  isActive,
  onSelect,
}: CentralModelProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const { scene } = useGLTF(modelPath);

  const modelScene = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const maxDimension = Math.max(size.x, size.y, size.z);
    const fitScale = maxDimension > 0 ? MODEL_FIT_SIZE / maxDimension : 1;

    clone.position.sub(center);
    clone.scale.setScalar(fitScale);

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
    <group
      ref={groupRef}
      position={[0, 0, 0.12]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      <primitive object={modelScene} />
    </group>
  );
}

useGLTF.preload("/models/central-node.glb");
