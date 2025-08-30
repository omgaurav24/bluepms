"use client";

import React from "react";
import Plasma from "@/components/ui/Plasma";

export const BackgroundGradientAnimation = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    // This is your scroll container; keep your page.tsx classes here
    <div className={`relative w-full h-screen ${className ?? ""}`}>
      {/* ✅ FIXED background layer so it persists across scroll */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-white" />
        <Plasma
          color="#3A8DFF"
          speed={1}
          direction="forward"
          scale={1.9}
          opacity={1}
          quality={0.5}
          paletteColors={[
            "#0B3C91",
            "#1D4ED8",
            "#2563EB",
            "#3B82F6",
            "#60A5FA",
            "#93C5FD",
            "#093074",
            "#07275E",
            "#061E48",
          ]}
          paletteStrength={1.5}
          minAlpha={0.5}
        />
      </div>

      {/* Content scrolls above the fixed background */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
