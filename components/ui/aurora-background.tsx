/* eslint-disable react/no-unknown-property */
"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/* ──────────────────────────────────────────────────────────────
   Minimal blue cloud-ish plasma (domain-warped FBM, blue-only)
   ────────────────────────────────────────────────────────────── */

type Direction = "forward" | "reverse";

interface PlasmaProps {
  speed?: number;          // motion speed
  direction?: Direction;   // forward or reverse
  scale?: number;          // zoom of shapes
  opacity?: number;        // layer opacity
}

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
/* ... (fragment shader code remains unchanged) ... */
precision highp float;

uniform vec2  iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;

out vec4 fragColor;

/* noise / fbm */
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0,0.0));
  float c = hash(i + vec2(0.0,1.0));
  float d = hash(i + vec2(1.0,1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i=0;i<5;i++){
    v += a * noise(p);
    p = p * 2.02 + vec2(13.1, 7.7);
    a *= 0.5;
  }
  return v;
}

/* 9-stop palette (dark → light) */
vec3 bluePalette(float t){
  vec3 c0 = vec3(0.082, 0.498, 0.714); // #157FB6
  vec3 c1 = vec3(0.165, 0.565, 0.776); // #2A90C6
  vec3 c2 = vec3(0.255, 0.655, 0.839); // #41A7D6
  vec3 c3 = vec3(0.345, 0.737, 0.878); // #58BCE0
  vec3 c4 = vec3(0.502, 0.788, 0.890); // #80C9E3
  vec3 c5 = vec3(0.659, 0.863, 0.937); // #A8DCEF
  vec3 c6 = vec3(0.800, 0.922, 0.965); // #CCEBF6
  vec3 c7 = vec3(0.878, 0.949, 0.969); // #E0F2F7
  vec3 c8 = vec3(0.941, 0.972, 1.000); // #F0F8FF

  t = clamp(t, 0.0, 1.0);
  float seg = t * 8.0;   // 8 segments across 9 stops
  float i   = floor(seg);
  float f   = fract(seg);
  f = f*f*(3.0-2.0*f);
  if (i < 1.0) return mix(c0, c1, f);
  if (i < 2.0) return mix(c1, c2, f);
  if (i < 3.0) return mix(c2, c3, f);
  if (i < 4.0) return mix(c3, c4, f);
  if (i < 5.0) return mix(c4, c5, f);
  if (i < 6.0) return mix(c5, c6, f);
  if (i < 7.0) return mix(c6, c7, f);
  return mix(c7, c8, f);
}

void main(){
  vec2 R = iResolution.xy;
  vec2 uv = gl_FragCoord.xy / R;

  // aspect-corrected coordinates
  vec2 p = (gl_FragCoord.xy - 0.5*R) / R.y;

  float t = iTime * 0.035 * uSpeed * uDirection;

  // domain warp → soft, layered structures
  float w1 = fbm(p * (1.25 / max(uScale, 0.0001)) + vec2(t*0.8, t*0.6));
  float w2 = fbm(p * (2.10 / max(uScale, 0.0001)) + vec2(w1*2.0) + vec2(t, t*0.5));
  float base = fbm(p * (3.10 / max(uScale, 0.0001)) + vec2(w2*1.6) + vec2(t*0.6, -t*0.7));

  // add a gentle sweep for premium motion
  float sweep = 0.06 * sin(uv.x * 9.0 + t * 2.0);
  float v = clamp(base * 0.85 + w1 * 0.15 + sweep, 0.0, 1.0);

  vec3 col = bluePalette(v);

  // subtle edge lift (still blue)
  float rim = smoothstep(0.55, 0.9, base);
  col += vec3(0.03, 0.04, 0.07) * pow(rim, 5.0) * 0.18;

  fragColor = vec4(col, uOpacity);
}
`;

const Plasma: React.FC<PlasmaProps> = ({
  speed = 2.0,
  direction = "forward",
  scale = 2.0,
  opacity = 1.0,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /* ... (useEffect logic remains unchanged) ... */
    const host = ref.current;
    if (!host) return;

    const baseDpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      dpr: baseDpr,
      powerPreference: "high-performance",
    });
    const gl = renderer.gl;

    gl.clearColor(0, 0, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.STENCIL_TEST);
    gl.disable(gl.CULL_FACE);

    const canvas = gl.canvas as HTMLCanvasElement;
    Object.assign(canvas.style, {
      position: "absolute",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      background: "transparent",
      display: "block",
      willChange: "transform, opacity",
      transform: "translateZ(0)",
    } as CSSStyleDeclaration);
    host.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime:        { value: 0 },
        iResolution:  { value: [1, 1] },
        uSpeed:       { value: speed },
        uDirection:   { value: direction === "reverse" ? -1.0 : 1.0 },
        uScale:       { value: Math.max(0.0001, scale) },
        uOpacity:     { value: opacity },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const rect = host.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      program.uniforms.iResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
      ];
    };
    resize();

    const ro = new ResizeObserver(() => queueMicrotask(resize));
    ro.observe(host);

    let raf = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      program.uniforms.iTime.value = (t - t0) * 0.001;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      try { host.removeChild(canvas); } catch {}
    };
  }, [speed, direction, scale, opacity]);
  
  // CHANGED: Make this component's div a simple, flexible container
  // that will fill its parent. This makes the component more reusable.
  return <div ref={ref} className="w-full h-full" aria-hidden />;
};

/* ──────────────────────────────────────────────────────────────
   BackgroundGradientAnimation (full-page, drop-in)
   ────────────────────────────────────────────────────────────── */

export const BackgroundGradientAnimation = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`relative w-full min-h-[100svh] ${className ?? ""}`}>
      <style>
        {`
          @keyframes blueGradientShift {
            0%   { background-position: 0% 50%, 100% 50%, 50% 0%; }
            50%  { background-position: 100% 50%, 0% 50%, 50% 100%; }
            100% { background-position: 0% 50%, 100% 50%, 50% 0%; }
          }
        `}
      </style>

      {/* CHANGED: Use the .plasma-container class for robust full-page sizing */}
      <motion.div
        initial={{ opacity: 0, y: -24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="plasma-container"
      >
        {/* Base vertical gradient with darker shades near the bottom */}
        <div
          // CHANGED: Use w-full and h-full to fill the parent container
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(180deg," +
              " #F0F8FF 0%,  #E0F2F7 12%, #CCEBF6 24%, #A8DCEF 45%," +
              " #80C9E3 65%, #58BCE0 78%, #41A7D6 88%, #2A90C6 95%, #157FB6 100%)",
          }}
        />

        {/* Moving blue caustics layers */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0, // CHANGED
            width: "100%", // CHANGED
            height: "100%", // CHANGED
            backgroundImage: [
              "radial-gradient(42% 34% at 18% 22%, rgba(128,201,227,0.42), transparent 65%)", // #80C9E3
              "radial-gradient(40% 35% at 82% 68%, rgba(88,188,224,0.35), transparent 65%)",   // #58BCE0
              "radial-gradient(28% 24% at 50% 10%, rgba(42,144,198,0.28), transparent 70%)",   // #2A90C6
            ].join(", "),
            backgroundSize: "170% 170%, 170% 170%, 200% 200%",
            backgroundPosition: "0% 50%, 100% 50%, 50% 0%",
            animation: "blueGradientShift 55s linear infinite",
            mixBlendMode: "soft-light",
            opacity: 0.9,
          }}
        />

        {/* Shader layer (also exact viewport span) */}
        {/* CHANGED: This wrapper div now correctly fills the parent */}
        <div className="absolute inset-0 w-full h-full">
          <Plasma speed={2.0} direction="forward" scale={2.0} opacity={1} />
        </div>
      </motion.div>

      {/* Foreground content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundGradientAnimation;