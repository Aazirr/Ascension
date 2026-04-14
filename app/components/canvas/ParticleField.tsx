"use client";

import { useFrame } from "@react-three/fiber";
import { createNoise3D } from "simplex-noise";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface ParticleFieldProps {
  count: number;
  size: number;
  color: string;
  spread: number;
  opacity: number;
  reducedMotion: boolean;
}

function createPositions(count: number, spread: number): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const radius = spread * (0.4 + Math.random() * 0.6);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));

    positions[index * 3] = Math.sin(phi) * Math.cos(theta) * radius;
    positions[index * 3 + 1] = Math.cos(phi) * radius;
    positions[index * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
  }

  return positions;
}

export default function ParticleField({
  count,
  size,
  color,
  spread,
  opacity,
  reducedMotion,
}: ParticleFieldProps) {
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const noise3D = useMemo(() => createNoise3D(), []);
  const basePositions = useMemo(() => createPositions(count, spread), [count, spread]);
  const driftPhase = useMemo(
    () => new Float32Array(Array.from({ length: count }, () => Math.random() * Math.PI * 2)),
    [count],
  );

  useFrame((state) => {
    if (reducedMotion || !geometryRef.current) {
      return;
    }

    const attribute = geometryRef.current.attributes.position as THREE.BufferAttribute;
    const time = state.clock.getElapsedTime();
    const driftStrength = spread * 0.016;

    for (let index = 0; index < count; index += 1) {
      const i3 = index * 3;
      const baseX = basePositions[i3];
      const baseY = basePositions[i3 + 1];
      const baseZ = basePositions[i3 + 2];
      const phase = driftPhase[index];

      const nx = noise3D(baseX * 0.045, baseY * 0.045, time * 0.22 + phase);
      const ny = noise3D(baseY * 0.045, baseZ * 0.045, time * 0.2 + phase * 0.75);
      const nz = noise3D(baseZ * 0.045, baseX * 0.045, time * 0.24 + phase * 0.5);

      attribute.array[i3] = baseX + nx * driftStrength;
      attribute.array[i3 + 1] = baseY + ny * driftStrength;
      attribute.array[i3 + 2] = baseZ + nz * driftStrength;
    }

    attribute.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={basePositions.length / 3}
          array={basePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        toneMapped={false}
        depthWrite={false}
      />
    </points>
  );
}
