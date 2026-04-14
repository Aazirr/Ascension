"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { getNodeDefaultIconPath, getNodeIconPath } from "@/app/lib/nodeIcons";
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
  const [iconPath, setIconPath] = useState(() => getNodeIconPath({ id: node.id, kind: node.kind }));
  const [triedDefaultIcon, setTriedDefaultIcon] = useState(false);
  const defaultIconPath = useMemo(() => getNodeDefaultIconPath(node.kind), [node.kind]);

  useEffect(() => {
    setIconPath(getNodeIconPath({ id: node.id, kind: node.kind }));
    setTriedDefaultIcon(false);
  }, [node.id, node.kind]);

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
        <meshPhysicalMaterial
          color="#d8ecff"
          transparent
          opacity={isActive ? 0.24 : 0.18}
          transmission={1}
          thickness={0.42}
          ior={1.07}
          roughness={0.08}
          metalness={0.03}
          clearcoat={1}
          clearcoatRoughness={0.04}
          emissive={node.color}
          emissiveIntensity={reducedMotion ? (isActive ? 0.14 : 0.08) : isActive ? 0.28 : 0.12}
          reflectivity={0.65}
          depthWrite={false}
        />
      </mesh>
      <mesh
        scale={isActive ? 1.035 : 1.02}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(node.id);
        }}
      >
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#e9f6ff"
          transparent
          opacity={isActive ? 0.22 : 0.14}
          wireframe
        />
      </mesh>
      <Html center transform distanceFactor={8} zIndexRange={[4, 0]} pointerEvents="none">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[0_0_28px_rgba(180,220,255,0.2)] backdrop-blur-md">
          <Image
            src={iconPath}
            alt={`${node.label} icon`}
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
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
      <pointLight color={node.color} intensity={isActive ? 1.0 : 0.6} distance={10} />
    </group>
  );
}
