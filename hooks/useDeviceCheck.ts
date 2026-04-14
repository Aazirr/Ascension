"use client";

import { useEffect, useState } from "react";

export interface DeviceCheckState {
  isReady: boolean;
  isMobile: boolean;
  supportsWebGL: boolean;
  reducedMotion: boolean;
  isFallback: boolean;
}

const initialState: DeviceCheckState = {
  isReady: false,
  isMobile: true,
  supportsWebGL: false,
  reducedMotion: false,
  isFallback: true,
};

export function useDeviceCheck(): DeviceCheckState {
  const [state, setState] = useState<DeviceCheckState>(initialState);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => {
      const isMobile = window.innerWidth <= 768;
      const reducedMotion = motionQuery.matches;
      const canvas = document.createElement("canvas");
      const supportsWebGL = Boolean(
        canvas.getContext("webgl2") || canvas.getContext("webgl"),
      );

      setState({
        isReady: true,
        isMobile,
        supportsWebGL,
        reducedMotion,
        isFallback: isMobile || !supportsWebGL || reducedMotion,
      });
    };

    evaluate();
    window.addEventListener("resize", evaluate);

    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", evaluate);
      return () => {
        window.removeEventListener("resize", evaluate);
        motionQuery.removeEventListener("change", evaluate);
      };
    }

    motionQuery.addListener(evaluate);
    return () => {
      window.removeEventListener("resize", evaluate);
      motionQuery.removeListener(evaluate);
    };
  }, []);

  return state;
}
