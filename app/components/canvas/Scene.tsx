"use client";

import { CameraControls as DreiCameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import CameraControlsImpl from "camera-controls";
import { Box3, Vector3 } from "three";
import { Suspense, useEffect, useMemo, useRef } from "react";
import BranchNode from "./BranchNode";
import CentralNode from "./CentralNode";
import ConnectionLine from "./ConnectionLine";
import ParticleField from "./ParticleField";
import type { NodeGraphState } from "@/hooks/useNodeGraph";

interface SceneProps {
  graph: NodeGraphState;
  onBackgroundClick?: () => void;
}

export default function Scene({ graph, onBackgroundClick }: SceneProps) {
  const controlsRef = useRef<CameraControlsImpl | null>(null);
  const cameraBoundary = useMemo(
    () => new Box3(new Vector3(-11, -9, -1), new Vector3(11, 9, 1)),
    [],
  );

  useEffect(() => {
    if (!controlsRef.current) {
      return;
    }

    controlsRef.current.setBoundary(cameraBoundary);
  }, [cameraBoundary]);

  const nodeMap = useMemo(
    () => new Map(graph.nodes.map((node) => [node.id, node])),
    [graph.nodes],
  );

  const handleSelectNode = (nodeId: string) => {
    graph.selectNode(nodeId);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_center,rgba(127,119,221,0.09),transparent_45%),linear-gradient(180deg,rgba(8,8,24,0.92),rgba(5,5,16,0.98))]">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 48 }}
        dpr={[1, 1.5]}
        onPointerMissed={() => {
          onBackgroundClick?.();
        }}
      >
        <color attach="background" args={["#050510"]} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[6, 8, 10]} intensity={1.1} color="#d8d6ff" />
        <pointLight position={[-8, -4, -8]} intensity={0.45} color="#7f77dd" />

        <Suspense fallback={null}>
          <ParticleField count={320} size={0.02} color="#ffffff" spread={24} opacity={0.32} />
          <ParticleField count={42} size={0.05} color="#ffffff" spread={20} opacity={0.7} />
          <DreiCameraControls
            ref={controlsRef}
            makeDefault
            enabled
            smoothTime={0.2}
            azimuthRotateSpeed={0}
            polarRotateSpeed={0}
            minDistance={7}
            maxDistance={18}
            dollySpeed={0.75}
            truckSpeed={0.95}
            boundaryEnclosesCamera
            mouseButtons={{
              left: CameraControlsImpl.ACTION.TRUCK,
              middle: CameraControlsImpl.ACTION.DOLLY,
              right: CameraControlsImpl.ACTION.NONE,
              wheel: CameraControlsImpl.ACTION.DOLLY,
            }}
            touches={{
              one: CameraControlsImpl.ACTION.TOUCH_TRUCK,
              two: CameraControlsImpl.ACTION.TOUCH_DOLLY_TRUCK,
              three: CameraControlsImpl.ACTION.NONE,
            }}
          />

          {graph.edges.map((edge) => {
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);

            if (!fromNode || !toNode) {
              return null;
            }

            const isHighlighted =
              graph.activeNodeId === edge.from ||
              graph.activeNodeId === edge.to ||
              graph.hoveredNodeId === edge.from ||
              graph.hoveredNodeId === edge.to;

            return (
              <ConnectionLine
                key={edge.id}
                start={fromNode.position}
                end={toNode.position}
                color={edge.color}
                isHighlighted={isHighlighted}
              />
            );
          })}

          {graph.nodes.map((node) => {
            const isActive = graph.activeNodeId === node.id;
            const isHovered = graph.hoveredNodeId === node.id;

            if (node.kind === "central") {
              return (
                <CentralNode
                  key={node.id}
                  node={node}
                  isActive={isActive}
                  onSelect={handleSelectNode}
                />
              );
            }

            return (
              <BranchNode
                key={node.id}
                node={node}
                isActive={isActive}
                isHovered={isHovered}
                onSelect={handleSelectNode}
                onHover={graph.setHoveredNodeId}
              />
            );
          })}
        </Suspense>
      </Canvas>
    </div>
  );
}
