"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      {/* Wrapper grows with content; snapping can be applied via className */}
      <div
        className={cn(
          "relative min-h-screen w-full bg-white text-slate-950",
          className
        )}
        {...props}
      >
        {/* FIXED aurora covering viewport across scroll */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none fixed inset-0 z-0",
            "opacity-75 blur-[12px]"
          )}
          style={
            {
              animation: "aurora 60s linear infinite",
              backgroundImage:
                "repeating-linear-gradient(100deg,#fff 0%,#fff 7%,transparent 10%,transparent 12%,#fff 16%)," +
                "repeating-linear-gradient(100deg,#F0F8FF 10%,#89CFF0 20%,#73C2FB 30%,#0070BB 40%,#00BFFF 50%,#0E3386 60%,transparent 80%)",
              backgroundSize: "300%, 200%",
              backgroundPosition: "50% 50%, 50% 50%",
              willChange: "transform, background-position",
              ...(showRadialGradient
                ? {
                    maskImage:
                      "radial-gradient(120% 80% at 50% 20%, black 45%, transparent 90%)",
                    WebkitMaskImage:
                      "radial-gradient(120% 80% at 50% 20%, black 45%, transparent 90%)",
                  }
                : {}),
            } as React.CSSProperties
          }
        />

        {/* Foreground content is above the fixed background */}
        <div className="relative z-10">{children}</div>
      </div>
    </main>
  );
};
