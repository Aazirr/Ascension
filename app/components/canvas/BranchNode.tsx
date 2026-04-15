"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { getNodeDefaultIconPath, getNodeIconPath } from "@/app/lib/nodeIcons";
import type { GraphNode } from "@/types";

interface BranchNodeProps {
  node: GraphNode;
  isActive: boolean;
  isHovered: boolean;
  activeNodeId: string | null;
  onSelect: (nodeId: string) => void;
  onHover: (nodeId: string | null) => void;
}

const BUBBLE_ACCESSORY_COLOR = "#D9CA80";

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
  const sheenRef = useRef<THREE.Mesh | null>(null);
  const [iconPath, setIconPath] = useState(() => getNodeIconPath({ id: node.id, kind: node.kind }));
  const [triedDefaultIcon, setTriedDefaultIcon] = useState(false);
  const defaultIconPath = useMemo(() => getNodeDefaultIconPath(node.kind), [node.kind]);

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

  useEffect(() => {
    setIconPath(getNodeIconPath({ id: node.id, kind: node.kind }));
    setTriedDefaultIcon(false);
  }, [node.id, node.kind]);

  useFrame(() => {
    if (!groupRef.current || !meshRef.current) {
      return;
    }

    const targetScale = isActive ? 1.35 : isHovered ? 1.2 : 1;
    const targetOpacity = isActive ? 0.2 : isHovered ? 0.15 : 0.11;
    const currentScale = meshRef.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.12);
    meshRef.current.scale.setScalar(nextScale);

    const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
    material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.15);
    material.transparent = true;
    material.emissiveIntensity = isActive ? 0.08 : isHovered ? 0.05 : 0.03;

    if (sheenRef.current) {
      const time = performance.now() * 0.001;
      const sheenMaterial = sheenRef.current.material as THREE.MeshBasicMaterial;
      const hue =
        (0.135 +
          Math.sin(time * 0.42 + node.position[0] * 0.7) * 0.018 +
          Math.cos(time * 0.25 + node.position[1] * 0.6) * 0.01 +
          1) %
        1;
      sheenMaterial.color.setHSL(hue, 0.5, 0.72);

      const targetSheenOpacity = isActive
        ? 0.11 + Math.sin(time * 1.25) * 0.01
        : isHovered
          ? 0.08 + Math.sin(time * 1.05) * 0.008
          : 0.055 + Math.sin(time * 0.8) * 0.006;

      sheenMaterial.opacity = THREE.MathUtils.lerp(
        sheenMaterial.opacity,
        targetSheenOpacity,
        0.1,
      );
    }

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
        <meshPhysicalMaterial
          color="#f3ebc7"
          emissive={node.color}
          emissiveIntensity={0.03}
          roughness={0.03}
          metalness={0}
          opacity={0.11}
          transmission={1}
          thickness={0.2}
          ior={1.02}
          clearcoat={1}
          clearcoatRoughness={0.02}
          reflectivity={0.86}
          transparent
          depthWrite={false}
        />
      </mesh>
      <mesh
        ref={sheenRef}
        scale={1.03}
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
        <meshBasicMaterial
          color={BUBBLE_ACCESSORY_COLOR}
          transparent
          opacity={0.055}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <Html center transform distanceFactor={11} zIndexRange={[4, 0]} pointerEvents="none">
        <div
          className={`flex items-center justify-center rounded-full ${
            node.kind === "category" ? "h-10 w-10" : "h-8 w-8"
          }`}
        >
          <Image
            src={iconPath}
            alt={`${node.label} icon`}
            width={node.kind === "category" ? 20 : 16}
            height={node.kind === "category" ? 20 : 16}
            className={node.kind === "category" ? "h-5 w-5 object-contain" : "h-4 w-4 object-contain"}
            onError={() => {
              if (!triedDefaultIcon) {
                setIconPath(defaultIconPath);
                setTriedDefaultIcon(true);
              }
            }}
          />
        </div>
      </Html>
      <Html
        position={[0, node.kind === "category" ? 1.35 : 1.0, 0]}
        center
        transform
        distanceFactor={11}
        zIndexRange={[4, 0]}
        pointerEvents="none"
      >
        <div
          className={`isolate max-w-[180px] rounded-full border px-3 py-1 text-center text-xs font-medium shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-opacity duration-200 ${
            isActive || isHovered
              ? "border-white/22 bg-[rgba(8,10,24,0.92)] text-white"
              : "border-white/12 bg-[rgba(6,8,20,0.88)] text-slate-200/90"
          }`}
          style={{ opacity: leafLabelOpacity }}
        >
          {node.label}
        </div>
      </Html>
      <pointLight color={node.color} intensity={isActive ? 0.72 : isHovered ? 0.5 : 0.28} distance={6} />
      <pointLight
        color={isActive || isHovered ? BUBBLE_ACCESSORY_COLOR : node.color}
        intensity={isActive ? 0.78 : isHovered ? 0.56 : 0.28}
        distance={6}
      />
    </group>
  );
}
