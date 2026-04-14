"use client";

import { Text } from "@react-three/drei";
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
      <Text
        position={[0, 1.9, 0]}
        fontSize={0.3}
        color="#f8f7ff"
        anchorX="center"
        anchorY="middle"
      >
        {node.label}
      </Text>
      <Text
        position={[0, -1.9, 0]}
        fontSize={0.13}
        color="#cbc8e6"
        anchorX="center"
        anchorY="middle"
      >
        {node.description}
      </Text>
      <pointLight color={node.color} intensity={1.8} distance={10} />
    </group>
  );
}
