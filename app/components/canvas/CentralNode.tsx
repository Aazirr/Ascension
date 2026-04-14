"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import CentralModel from "./CentralModel";
import { getNodeDefaultIconPath, getNodeIconPath } from "@/app/lib/nodeIcons";
import type { GraphNode } from "@/types";

interface CentralNodeProps {
  node: GraphNode;
  isActive: boolean;
  reducedMotion: boolean;
  onSelect: (nodeId: string) => void;
  onPitchRequest: () => void;
}

const BUBBLE_ACCESSORY_COLOR = "#D9CA80";
const CENTRAL_MODEL_PATH = "/models/central-node.glb";
const USE_CENTRAL_MODEL = true;

function CentralModelLoader() {
  const loaderRef = useRef<THREE.Group | null>(null);

  useFrame((state) => {
    if (!loaderRef.current) {
      return;
    }

    const elapsed = state.clock.getElapsedTime();
    loaderRef.current.rotation.z = elapsed * 1.8;
    loaderRef.current.rotation.x = Math.sin(elapsed * 0.9) * 0.08;
    loaderRef.current.rotation.y = Math.cos(elapsed * 0.8) * 0.08;
  });

  return (
    <group ref={loaderRef} position={[0, 0, 0.14]} scale={0.58}>
      <mesh>
        <torusGeometry args={[0.92, 0.1, 18, 48]} />
        <meshBasicMaterial
          color={BUBBLE_ACCESSORY_COLOR}
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.68, 0.045, 14, 36]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function CentralNode({
  node,
  isActive,
  reducedMotion,
  onSelect,
  onPitchRequest,
}: CentralNodeProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const sheenRef = useRef<THREE.Mesh | null>(null);
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
    const baseScale = isActive ? 1.22 : 1.12;
    const pulseAmplitude = 0.08 + (isActive ? 0.04 : 0.02);
    const pulse1 = Math.sin(elapsed * 1.3) * pulseAmplitude;
    const pulse2 = Math.cos(elapsed * 0.8) * (pulseAmplitude * 0.5);
    const targetScale = reducedMotion ? baseScale : baseScale + pulse1 + pulse2;
    const targetY = isActive ? 0.1 : 0;
    const breathY = reducedMotion ? 0 : Math.sin(elapsed * 0.9) * (isActive ? 0.08 : 0.04);

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      reducedMotion ? 0 : isActive ? elapsed * 0.07 : 0,
      0.04,
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      node.position[1] + targetY + breathY,
      0.08,
    );

    const currentScale = meshRef.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.12);
    meshRef.current.scale.setScalar(nextScale);

    if (sheenRef.current) {
      sheenRef.current.scale.setScalar(nextScale * 0.857);
    }

    if (isActive && !reducedMotion) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }

    if (sheenRef.current) {
      const sheenMaterial = sheenRef.current.material as THREE.MeshBasicMaterial;
      const hue =
        (0.135 +
          Math.sin(elapsed * 0.33) * 0.018 +
          Math.cos(elapsed * 0.17 + node.position[0]) * 0.01 +
          1) %
        1;
      sheenMaterial.color.setHSL(hue, 0.52, 0.72);

      const targetOpacity = reducedMotion
        ? isActive
          ? 0.028
          : 0.016
        : isActive
          ? 0.038 + Math.sin(elapsed * 1.1) * 0.006
          : 0.024 + Math.sin(elapsed * 0.8) * 0.005;

      sheenMaterial.opacity = THREE.MathUtils.lerp(
        sheenMaterial.opacity,
        targetOpacity,
        0.08,
      );
    }
  });

  const handleCentralSelect = () => {
    if (isActive) {
      onPitchRequest();
      return;
    }

    onSelect(node.id);
  };

  return (
    <group ref={groupRef} position={node.position}>
      <mesh
        ref={meshRef}
        onClick={(event) => {
          event.stopPropagation();
          handleCentralSelect();
        }}
      >
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshPhysicalMaterial
          color="#f3ebc7"
          transparent
          opacity={isActive ? 0.018 : 0.01}
          transmission={1}
          thickness={0.24}
          ior={1.02}
          roughness={0.03}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.02}
          emissive={node.color}
          emissiveIntensity={reducedMotion ? (isActive ? 0.02 : 0.01) : isActive ? 0.03 : 0.015}
          reflectivity={0.88}
          depthWrite={false}
        />
      </mesh>
      <mesh
        ref={sheenRef}
        scale={1.028}
        onClick={(event) => {
          event.stopPropagation();
          handleCentralSelect();
        }}
      >
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color={BUBBLE_ACCESSORY_COLOR}
          transparent
          opacity={0.028}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {USE_CENTRAL_MODEL ? (
        <Suspense fallback={<CentralModelLoader />}>
          <CentralModel
            modelPath={CENTRAL_MODEL_PATH}
            reducedMotion={reducedMotion}
            isActive={isActive}
            onSelect={handleCentralSelect}
          />
        </Suspense>
      ) : (
        <Html center transform distanceFactor={8} zIndexRange={[4, 0]} pointerEvents="none">
          <div className="flex h-14 w-14 items-center justify-center rounded-full">
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
      )}
      <Html
        position={[0, 2.0, 0]}
        center
        transform
        distanceFactor={9}
        zIndexRange={[4, 0]}
        pointerEvents="none"
      >
        <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-center text-sm font-semibold tracking-[0.18em] text-white shadow-lg backdrop-blur-md">
          {node.displayLabel ?? node.label}
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
      <pointLight color={isActive ? BUBBLE_ACCESSORY_COLOR : node.color} intensity={isActive ? 1.05 : 0.6} distance={10} />
    </group>
  );
}
