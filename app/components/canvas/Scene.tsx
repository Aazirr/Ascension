"use client";

import { CameraControls as DreiCameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import CameraControlsImpl from "camera-controls";
import { Suspense, useMemo, useRef } from "react";
import type { GraphNode } from "@/types";
import BranchNode from "./BranchNode";
import CentralNode from "./CentralNode";
import ConnectionLine from "./ConnectionLine";
import ParticleField from "./ParticleField";
import type { NodeGraphState } from "@/hooks/useNodeGraph";

interface SceneProps {
  graph: NodeGraphState;
  onBackgroundClick?: () => void;
}

function getFocusPosition(node: GraphNode): [number, number, number] {
  return [node.position[0] + 4.2, node.position[1] + 2.4, node.position[2] + 6.2];
}

export default function Scene({ graph, onBackgroundClick }: SceneProps) {
  const controlsRef = useRef<CameraControlsImpl | null>(null);

  const nodeMap = useMemo(
    () => new Map(graph.nodes.map((node) => [node.id, node])),
    [graph.nodes],
  );

  const handleSelectNode = (nodeId: string) => {
    graph.setActiveNodeId(nodeId);

    const selectedNode = nodeMap.get(nodeId);
    if (!selectedNode) {
      return;
    }

    const [cameraX, cameraY, cameraZ] = getFocusPosition(selectedNode);
    controlsRef.current?.setLookAt(
      cameraX,
      cameraY,
      cameraZ,
      selectedNode.position[0],
      selectedNode.position[1],
      selectedNode.position[2],
      true,
    );
  };

  return (
    <div className="h-full min-h-[680px] w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(127,119,221,0.09),transparent_45%),linear-gradient(180deg,rgba(8,8,24,0.92),rgba(5,5,16,0.96))]">
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
            enabled={false}
            smoothTime={0.18}
            minPolarAngle={0.35}
            maxPolarAngle={1.4}
            minAzimuthAngle={-1.9}
            maxAzimuthAngle={1.9}
            minDistance={7}
            maxDistance={16}
            dollySpeed={0}
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
