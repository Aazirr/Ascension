"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { GraphNode } from "@/types";

interface BranchNodeProps {
  node: GraphNode;
  isActive: boolean;
  isHovered: boolean;
  activeNodeId: string | null;
  onSelect: (nodeId: string) => void;
  onHover: (nodeId: string | null) => void;
}

export default function BranchNode({
  node,
  isActive,
  isHovered,
  activeNodeId,
  onSelect,
  onHover,
}: BranchNodeProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  // Determine label visibility for tier 3 (leaf) nodes
  // Hover always shows label, otherwise use context-based visibility
  const leafLabelOpacity = isHovered
    ? 1 // Show on hover
    : node.kind !== "leaf"
      ? 1 // Always show tier 2 labels
      : activeNodeId === null ||
          activeNodeId === "central-you" ||
          activeNodeId === "branch-projects" ||
          activeNodeId === "branch-skills" ||
          activeNodeId === "branch-experience" ||
          activeNodeId === "branch-certifications" ||
          activeNodeId === "branch-about"
        ? 0 // Hide tier 3 labels by default
        : activeNodeId === node.id
          ? 1 // Show full opacity if self is active
          : activeNodeId === node.parentId
            ? 0.08 // Almost vanished when parent tier 2 is active
            : 0.08; // Fade to almost-vanished for other tier 3 items

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
    material.emissiveIntensity = isActive ? 1.1 : isHovered ? 0.72 : 0.42;

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
          emissiveIntensity={0.42}
          roughness={0.3}
          metalness={0.35}
          opacity={0.72}
          toneMapped={false}
        />
      </mesh>
      <Html
        position={[0, node.kind === "category" ? 1.35 : 1.0, 0]}
        center
        transform
        distanceFactor={11}
        zIndexRange={[4, 0]}
        pointerEvents="none"
      >
        <div
          className={`max-w-[180px] rounded-full border px-3 py-1 text-center text-xs font-medium backdrop-blur-md transition-opacity duration-200 ${
            isActive || isHovered
              ? "border-white/20 bg-black/55 text-white"
              : "border-white/10 bg-black/35 text-slate-200/85"
          }`}
          style={{ opacity: leafLabelOpacity }}
        >
          {node.label}
        </div>
      </Html>
      <pointLight color={node.color} intensity={isActive ? 1.1 : isHovered ? 0.8 : 0.45} distance={6} />
    </group>
  );
}
