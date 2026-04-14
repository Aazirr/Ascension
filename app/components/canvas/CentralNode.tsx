"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { GraphNode } from "@/types";

interface CentralNodeProps {
  node: GraphNode;
  isActive: boolean;
  onSelect: (nodeId: string) => void;
}

export default function CentralNode({ node, isActive, onSelect }: CentralNodeProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) {
      return;
    }

    const targetScale = isActive ? 1.18 : 1.08;
    const targetY = isActive ? 0.1 : 0;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      0,
      0.04,
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      node.position[1] + targetY,
      0.08,
    );

    const currentScale = meshRef.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
    meshRef.current.scale.setScalar(nextScale);

    if (isActive) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={node.position}>
      <mesh
        ref={meshRef}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(node.id);
        }}
      >
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={isActive ? 0.65 : 0.35}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>
      <Html position={[0, 2.0, 0]} center transform distanceFactor={9} pointerEvents="none">
        <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-center text-sm font-semibold tracking-[0.18em] text-white shadow-lg backdrop-blur-md">
          {node.label}
        </div>
      </Html>
      <Html position={[0, -2.0, 0]} center transform distanceFactor={11} pointerEvents="none">
        <div className="max-w-[220px] text-center text-xs leading-5 text-slate-300/90">
          {node.description}
        </div>
      </Html>
      <pointLight color={node.color} intensity={1.8} distance={10} />
    </group>
  );
}
