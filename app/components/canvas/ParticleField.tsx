"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface ParticleFieldProps {
  count: number;
  size: number;
  color: string;
  spread: number;
  opacity: number;
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
}: ParticleFieldProps) {
  const positions = useMemo(() => createPositions(count, spread), [count, spread]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
      />
    </points>
  );
}
