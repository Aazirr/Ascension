"use client";

import { Line } from "@react-three/drei";

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  isHighlighted: boolean;
}

export default function ConnectionLine({
  start,
  end,
  color,
  isHighlighted,
}: ConnectionLineProps) {
  return (
    <Line
      points={[start, end]}
      color={color}
      dashed
      dashSize={0.36}
      gapSize={0.24}
      lineWidth={1}
      transparent
      opacity={isHighlighted ? 0.85 : 0.28}
    />
  );
}
