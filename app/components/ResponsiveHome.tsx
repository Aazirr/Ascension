"use client";

import DesktopShell from "./ui/DesktopShell";
import MobileLayout from "./ui/MobileLayout";
import { useDeviceCheck } from "@/hooks/useDeviceCheck";

export default function ResponsiveHome() {
  const { isFallback, isReady, isMobile } = useDeviceCheck();

  if (!isReady) {
    return <main className="h-screen w-screen bg-[#050510]" />;
  }

  if (isFallback) {
    return <MobileLayout />;
  }

  return <DesktopShell isCompact={isMobile} />;
}
