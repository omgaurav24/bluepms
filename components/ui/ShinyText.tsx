/* components/ui/ShinyText.tsx */
"use client";

import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  /** Animation speed in seconds (lower = faster) */
  speed?: number;
  className?: string;
}

const ShinyTextComponent: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  return (
    <>
      <div
        className={`shiny-text ${disabled ? "disabled" : ""} ${className}`}
        style={{ ["--shine-speed" as any]: `${speed}s` }}
      >
        {text}
      </div>

      <style jsx>{`
        .shiny-text {
          color: inherit; /* inherits base color from parent (e.g. very dark blue) */

          /* Repeating highlight = no gap, no perceptible stop */
          background:
            repeating-linear-gradient(
              120deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0) 42%,
              rgba(255, 255, 255, 0.28) 50%,
              rgba(255, 255, 255, 0) 58%,
              rgba(255, 255, 255, 0) 100%
            );

          /* Large travel distance for smooth, seamless wrap */
          background-size: 200% 100%;
          background-position: 100% 0;

          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;

          display: inline-block;
          will-change: background-position;

          animation: shine var(--shine-speed, 5s) linear infinite;
          animation-play-state: running !important;
        }

        .shiny-text.disabled {
          animation: none !important;
        }

        @keyframes shine {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
      `}</style>
    </>
  );
};

const ShinyText = React.memo(ShinyTextComponent);
ShinyText.displayName = "ShinyText";

export default ShinyText;