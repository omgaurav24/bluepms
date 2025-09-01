/* eslint-disable react/no-unknown-property */
"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/* ──────────────────────────────────────────────────────────────
   Minimal blue cloud-ish plasma (domain-warped FBM) — 9-stop palette
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

/* === CHANGED: fragment uses your 9 gradient colors === */
const fragment = `#version 300 es
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

/* === 9-stop palette (light → dark)
   #D7EAF7, #A7C2E3, #82C3EC, #599FD8, #2E8ADD, #3074B3, #2077D1, #1659A2, #07519F  */
vec3 palette9(float t){
  vec3 c0 = vec3(0.843, 0.918, 0.969); // #D7EAF7
  vec3 c1 = vec3(0.655, 0.761, 0.890); // #A7C2E3
  vec3 c2 = vec3(0.510, 0.765, 0.925); // #82C3EC
  vec3 c3 = vec3(0.349, 0.624, 0.847); // #599FD8
  vec3 c4 = vec3(0.180, 0.541, 0.867); // #2E8ADD
  vec3 c5 = vec3(0.188, 0.455, 0.702); // #3074B3
  vec3 c6 = vec3(0.125, 0.467, 0.820); // #2077D1
  vec3 c7 = vec3(0.086, 0.349, 0.635); // #1659A2
  vec3 c8 = vec3(0.027, 0.318, 0.624); // #07519F

  t = clamp(t, 0.0, 1.0);
  float seg = t * 8.0;   // 8 segments across 9 stops
  float i   = floor(seg);
  float f   = fract(seg);
  f = f*f*(3.0-2.0*f);   // smoothstep
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

  // gentle sweep
  float sweep = 0.06 * sin(uv.x * 9.0 + t * 2.0);
  float v = clamp(base * 0.85 + w1 * 0.15 + sweep, 0.0, 1.0);

  vec3 col = palette9(v);

  // subtle edge lift
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

      <motion.div
        initial={{ opacity: 0, y: -24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="plasma-container"
      >
        {/* CHANGED: Base vertical gradient using your 9 stops (light→dark) */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(180deg," +
              " #D7EAF7 0%," +   // 1
              " #A7C2E3 12.5%,"+ // 2
              " #82C3EC 25%," +  // 3
              " #599FD8 37.5%,"+ // 4
              " #2E8ADD 50%," +  // 5
              " #3074B3 62.5%,"+ // 6
              " #2077D1 75%," +  // 7
              " #1659A2 87.5%,"+ // 8
              " #07519F 100%)",  // 9
          }}
        />

        {/* CHANGED: Moving blobs include darker tints too */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: [
              "radial-gradient(42% 34% at 18% 22%, rgba(215,234,247,0.55), transparent 65%)", // #D7EAF7
              "radial-gradient(40% 35% at 82% 68%, rgba(130,195,236,0.45), transparent 65%)", // #82C3EC
              "radial-gradient(30% 26% at 72% 30%, rgba(32,119,209,0.35),  transparent 70%)", // #2077D1
              "radial-gradient(28% 24% at 35% 78%, rgba(22,89,162,0.30),   transparent 72%)", // #1659A2
              "radial-gradient(36% 30% at 50% 10%, rgba(7,81,159,0.28),    transparent 70%)", // #07519F
            ].join(", "),
            backgroundSize: "170% 170%, 170% 170%, 200% 200%, 200% 200%, 220% 220%",
            backgroundPosition: "0% 50%, 100% 50%, 50% 0%, 50% 100%, 30% 70%",
            animation: "blueGradientShift 55s linear infinite",
            mixBlendMode: "soft-light",
            opacity: 0.8,
          }}
        />

        {/* Shader layer — uses the same 9-stop palette */}
        <div className="absolute inset-0 w-full h-full">
          <Plasma speed={2.0} direction="forward" scale={2.0} opacity={1} />
        </div>
      </motion.div>

      {/* Foreground content (e.g., your glass text) */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundGradientAnimation;