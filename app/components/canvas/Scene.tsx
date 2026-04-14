"use client";

import { CameraControls as DreiCameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import CameraControlsImpl from "camera-controls";
import { Box3, Vector3 } from "three";
import { useCallback, useEffect, useMemo, useRef } from "react";
import BranchNode from "./BranchNode";
import CentralNode from "./CentralNode";
import ConnectionLine from "./ConnectionLine";
import ParticleField from "./ParticleField";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { NodeGraphState } from "@/hooks/useNodeGraph";

export type CosmicBackgroundPreset = "cinematic" | "clean" | "bright";

interface SceneProps {
  graph: NodeGraphState;
  backgroundPreset: CosmicBackgroundPreset;
  onBackgroundClick?: () => void;
  onCentralPitchRequest: () => void;
}

const CENTRAL_NODE_SFX_PATH = "/sfx/node-central.wav";
const DEFAULT_NODE_SFX_PATH = "/sfx/node-default.wav";

export default function Scene({
  graph,
  backgroundPreset,
  onBackgroundClick,
  onCentralPitchRequest,
}: SceneProps) {
  const reducedMotion = useReducedMotion();
  const controlsRef = useRef<CameraControlsImpl | null>(null);
  const previousActiveNodeIdRef = useRef<string | null>(graph.activeNodeId);
  const centralNodeSfxRef = useRef<HTMLAudioElement | null>(null);
  const defaultNodeSfxRef = useRef<HTMLAudioElement | null>(null);
  const cameraBoundary = useMemo(
    () => new Box3(new Vector3(-11, -9, -1), new Vector3(11, 9, 1)),
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    centralNodeSfxRef.current = new Audio(CENTRAL_NODE_SFX_PATH);
    centralNodeSfxRef.current.preload = "auto";
    centralNodeSfxRef.current.volume = 0.21;

    defaultNodeSfxRef.current = new Audio(DEFAULT_NODE_SFX_PATH);
    defaultNodeSfxRef.current.preload = "auto";
    defaultNodeSfxRef.current.volume = 0.15;

    return () => {
      if (centralNodeSfxRef.current) {
        centralNodeSfxRef.current.pause();
      }

      if (defaultNodeSfxRef.current) {
        defaultNodeSfxRef.current.pause();
      }

      centralNodeSfxRef.current = null;
      defaultNodeSfxRef.current = null;
    };
  }, []);

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

  const focusNodeWithContext = useCallback(
    (nodeId: string | null, previousNodeId: string | null, animate = true) => {
      if (!nodeId || !controlsRef.current) {
        return;
      }

      const node = nodeMap.get(nodeId);
      if (!node) {
        return;
      }

      const previousNode = previousNodeId ? nodeMap.get(previousNodeId) : null;
      const parentNode = node.parentId ? nodeMap.get(node.parentId) : null;

      let targetX = node.position[0];
      let targetY = node.position[1];
      const targetZ = node.position[2];

      let distance =
        node.kind === "central" ? 14 : node.kind === "category" ? 10.8 : 8.8;

      // For leaf nodes, blend toward their tier-2 parent for smoother, contextual travel.
      if (node.kind === "leaf" && parentNode) {
        const hasParentContext = previousNode?.id === parentNode.id;
        const leafWeight = hasParentContext ? 0.82 : 0.68;
        const parentWeight = 1 - leafWeight;

        targetX = parentNode.position[0] * parentWeight + node.position[0] * leafWeight;
        targetY = parentNode.position[1] * parentWeight + node.position[1] * leafWeight;
        distance = hasParentContext ? 8.2 : 8.9;
      }

      if (node.kind === "category") {
        distance = previousNode?.kind === "leaf" ? 10.2 : 11.2;
      }

      distance = Math.max(7, Math.min(18, distance));

      controlsRef.current.setLookAt(
        targetX,
        targetY,
        targetZ + distance,
        targetX,
        targetY,
        targetZ,
        animate,
      );

      return;
    },
    [nodeMap],
  );

  useEffect(() => {
    focusNodeWithContext(graph.activeNodeId, previousActiveNodeIdRef.current, true);
    previousActiveNodeIdRef.current = graph.activeNodeId;
  }, [graph.activeNodeId, focusNodeWithContext]);

  const playNodeClickSfx = useCallback((nodeId: string) => {
    const node = nodeMap.get(nodeId);
    if (!node) {
      return;
    }

    const sound = node.kind === "central" ? centralNodeSfxRef.current : defaultNodeSfxRef.current;
    if (!sound) {
      return;
    }

    try {
      if (centralNodeSfxRef.current) {
        centralNodeSfxRef.current.pause();
        centralNodeSfxRef.current.currentTime = 0;
      }

      if (defaultNodeSfxRef.current) {
        defaultNodeSfxRef.current.pause();
        defaultNodeSfxRef.current.currentTime = 0;
      }

      sound.currentTime = 0;
      void sound.play();
    } catch {
      // Ignore playback failures (missing file or browser autoplay restrictions).
    }
  }, [nodeMap]);

  const handleSelectNode = useCallback((nodeId: string) => {
    playNodeClickSfx(nodeId);
    graph.selectNode(nodeId);
  }, [graph, playNodeClickSfx]);

  const particleConfig = useMemo(() => {
    if (backgroundPreset === "clean") {
      return {
        far: { count: 160, spread: 28, opacity: 0.18 },
        near: { count: 16, spread: 24, opacity: 0.44 },
      };
    }

    if (backgroundPreset === "bright") {
      return {
        far: { count: 270, spread: 24, opacity: 0.3 },
        near: { count: 36, spread: 20, opacity: 0.64 },
      };
    }

    return {
      far: { count: 240, spread: 26, opacity: 0.26 },
      near: { count: 28, spread: 22, opacity: 0.56 },
    };
  }, [backgroundPreset]);

  return (
    <div
      className={`cosmic-backdrop cosmic-backdrop--${backgroundPreset} h-screen w-screen overflow-hidden`}
    >
      <Canvas
        camera={{ position: [0, 0, 14], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 0);
        }}
        onPointerMissed={() => {
          onBackgroundClick?.();
        }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[6, 8, 10]} intensity={1.1} color="#d8d6ff" />
        <pointLight position={[-8, -4, -8]} intensity={0.45} color="#7f77dd" />

        <ParticleField
          key={`particles-far-${backgroundPreset}-${particleConfig.far.count}-${particleConfig.far.spread}`}
          count={particleConfig.far.count}
          size={0.02}
          color="#ffffff"
          spread={particleConfig.far.spread}
          opacity={particleConfig.far.opacity}
          reducedMotion={reducedMotion}
        />
        <ParticleField
          key={`particles-near-${backgroundPreset}-${particleConfig.near.count}-${particleConfig.near.spread}`}
          count={particleConfig.near.count}
          size={0.05}
          color="#ffffff"
          spread={particleConfig.near.spread}
          opacity={particleConfig.near.opacity}
          reducedMotion={reducedMotion}
        />
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
          truckSpeed={1.26}
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
              reducedMotion={reducedMotion}
            />
          );
        })}

        <EffectComposer>
          <Bloom
            mipmapBlur
            intensity={backgroundPreset === "bright" ? 0.95 : 0.72}
            luminanceThreshold={1}
            luminanceSmoothing={0.08}
          />
        </EffectComposer>

        {graph.nodes.map((node) => {
          const isActive = graph.activeNodeId === node.id;
          const isHovered = graph.hoveredNodeId === node.id;

          if (node.kind === "central") {
            return (
              <CentralNode
                key={node.id}
                node={node}
                isActive={isActive}
                reducedMotion={reducedMotion}
                onSelect={handleSelectNode}
                onPitchRequest={onCentralPitchRequest}
              />
            );
          }

          return (
            <BranchNode
              key={node.id}
              node={node}
              isActive={isActive}
              isHovered={isHovered}
              activeNodeId={graph.activeNodeId}
              onSelect={handleSelectNode}
              onHover={graph.setHoveredNodeId}
            />
          );
        })}
      </Canvas>
    </div>
  );
}
