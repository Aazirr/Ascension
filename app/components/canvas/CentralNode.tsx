"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { GraphNode } from "@/types";

interface CentralNodeProps {
  node: GraphNode;
  isActive: boolean;
  reducedMotion: boolean;
  onSelect: (nodeId: string) => void;
}

export default function CentralNode({
  node,
  isActive,
  reducedMotion,
  onSelect,
}: CentralNodeProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const introPlayedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion || introPlayedRef.current || !meshRef.current) {
      return;
    }

    const mesh = meshRef.current;
    introPlayedRef.current = true;

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline
      .fromTo(
        mesh.scale,
        { x: 0.24, y: 0.24, z: 0.24 },
        { x: 1.08, y: 1.08, z: 1.08, duration: 0.9 },
      )
      .fromTo(
        mesh.rotation,
        { y: -0.36 },
        { y: 0.14, duration: 0.85 },
        "<",
      );

    return () => {
      timeline.kill();
    };
  }, [reducedMotion]);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) {
      return;
    }

    const elapsed = state.clock.getElapsedTime();
    const pulse = reducedMotion ? 0 : Math.sin(elapsed * 1.4) * 0.025;
    const targetScale = (isActive ? 1.18 : 1.08) + pulse;
    const targetY = isActive ? 0.1 : 0;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      reducedMotion ? 0 : isActive ? elapsed * 0.07 : 0,
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

    if (isActive && !reducedMotion) {
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
          emissiveIntensity={reducedMotion ? (isActive ? 0.75 : 0.5) : isActive ? 1.45 : 1.0}
          roughness={0.25}
          metalness={0.7}
          toneMapped={false}
        />
      </mesh>
      <Html
        position={[0, 2.0, 0]}
        center
        transform
        distanceFactor={9}
        zIndexRange={[4, 0]}
        pointerEvents="none"
      >
        <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-center text-sm font-semibold tracking-[0.18em] text-white shadow-lg backdrop-blur-md">
          {node.label}
        </div>
      </Html>
      <Html
        position={[0, -2.0, 0]}
        center
        transform
        distanceFactor={11}
        zIndexRange={[4, 0]}
        pointerEvents="none"
      >
        <div className="max-w-[220px] text-center text-xs leading-5 text-slate-300/90">
          {node.description}
        </div>
      </Html>
      <pointLight color={node.color} intensity={1.8} distance={10} />
    </group>
  );
}
