"use client";

import DesktopShell from "./ui/DesktopShell";
import MobileLayout from "./ui/MobileLayout";
import { useDeviceCheck } from "@/hooks/useDeviceCheck";

export default function ResponsiveHome() {
  const { isFallback, isReady } = useDeviceCheck();

  if (!isReady || isFallback) {
    return <MobileLayout />;
  }

  return <DesktopShell />;
}
