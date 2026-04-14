"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { GraphNode } from "@/types";

interface BranchNodeProps {
  node: GraphNode;
  isActive: boolean;
  isHovered: boolean;
  onSelect: (nodeId: string) => void;
  onHover: (nodeId: string | null) => void;
}

export default function BranchNode({
  node,
  isActive,
  isHovered,
  onSelect,
  onHover,
}: BranchNodeProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.body.style.cursor = isHovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [isHovered]);

  useFrame(() => {
    if (!groupRef.current || !meshRef.current) {
      return;
    }

    const targetScale = isActive ? 1.35 : isHovered ? 1.2 : 1;
    const targetOpacity = isActive ? 0.95 : isHovered ? 0.85 : 0.72;
    const currentScale = meshRef.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.12);
    meshRef.current.scale.setScalar(nextScale);

    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.15);
    material.transparent = true;
    material.emissiveIntensity = isActive ? 0.55 : isHovered ? 0.35 : 0.18;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      node.position[0],
      0.08,
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      node.position[1],
      0.08,
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      node.position[2],
      0.08,
    );
  });

  return (
    <group ref={groupRef} position={node.position}>
      <mesh
        ref={meshRef}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(node.id);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(node.id);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHover(null);
        }}
      >
        <sphereGeometry args={[node.kind === "category" ? 0.72 : 0.42, 28, 28]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.35}
          opacity={0.72}
        />
      </mesh>
      <Text
        position={[0, node.kind === "category" ? 1.2 : 0.9, 0]}
        fontSize={node.kind === "category" ? 0.18 : 0.12}
        color={isActive || isHovered ? "#ffffff" : "#c7c3df"}
        anchorX="center"
        anchorY="middle"
      >
        {node.label}
      </Text>
      <pointLight color={node.color} intensity={isActive ? 1.1 : isHovered ? 0.8 : 0.45} distance={6} />
    </group>
  );
}
