"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  isHighlighted: boolean;
  reducedMotion: boolean;
}

export default function ConnectionLine({
  start,
  end,
  color,
  isHighlighted,
  reducedMotion,
}: ConnectionLineProps) {
  const materialRef = useRef<THREE.LineDashedMaterial | null>(null);

  useFrame((_, delta) => {
    if (!materialRef.current || reducedMotion) {
      return;
    }

    const speed = isHighlighted ? 0.58 : 0.28;
    const materialWithDash = materialRef.current as THREE.LineDashedMaterial & {
      dashOffset?: number;
    };

    materialWithDash.dashOffset = (materialWithDash.dashOffset ?? 0) - delta * speed;
  });

  return (
    <Line
      points={[start, end]}
      color={color}
      dashed
      dashSize={0.36}
      gapSize={isHighlighted ? 0.2 : 0.24}
      lineWidth={1}
      transparent
      opacity={isHighlighted ? 0.94 : 0.24}
      material-ref={materialRef}
    />
  );
}
