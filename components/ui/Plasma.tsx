/* eslint-disable react/no-unknown-property */
"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

interface PlasmaProps {
  color?: string; // still used: tint source (kept for compatibility)
  speed?: number;
  direction?: "forward" | "reverse" | "pingpong";
  scale?: number;
  opacity?: number; // overall strength
  mouseInteractive?: boolean; // unused
  quality?: number; // 0.6–1.0 DPR scaler (perf)
  paletteColors?: string[]; // 2..6 colors (hex) to blend
  paletteStrength?: number; // 0..1, how much to use the palette over original plasma
  minAlpha?: number; // 0..1, lift alpha in dark zones to “cover the page”
}

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [1, 0.5, 0.2];
  return [
    parseInt(m[1], 16) / 255,
    parseInt(m[2], 16) / 255,
    parseInt(m[3], 16) / 255,
  ];
};

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

// Plasma + multi-blue palette; alpha from brightness with a floor (minAlpha)
const fragment = `#version 300 es
precision highp float;
uniform vec2  iResolution;
uniform float iTime;
uniform vec3  uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform float uIter;         // 48–60
uniform int   uPCount;       // number of palette stops (2..6)
uniform float uPalStrength;  // 0..1
uniform float uMinAlpha;     // 0..1

// Up to 6 stops (we fill unused with last)
uniform vec3 uP0;
uniform vec3 uP1;
uniform vec3 uP2;
uniform vec3 uP3;
uniform vec3 uP4;
uniform vec3 uP5;

out vec4 fragColor;

vec3 samplePalette(float t) {
  // Build a local array from uniforms (GLSL ES 3.0 allows this)
  vec3 P[6];
  P[0] = uP0; P[1] = uP1; P[2] = uP2; P[3] = uP3; P[4] = uP4; P[5] = uP5;

  int count = max(uPCount, 2);
  float segF = clamp(t, 0.0, 1.0) * float(count - 1);
  int idx = int(floor(segF));
  idx = clamp(idx, 0, count - 2);
  float f = fract(segF);
  return mix(P[idx], P[idx + 1], f);
}

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  float i = 0.0, d, z, T = iTime * uSpeed * uDirection;
  vec3 O = vec3(0.0), p, S;
  vec2 r = iResolution.xy, Q;
  for (; i < uIter; i += 1.0) {
    p = z * normalize(vec3(C - 0.5 * r, r.y));
    p.z -= 4.0;
    S = p;
    d = p.y - T;
    p.x += 0.4 * (1.0 + p.y) * sin(d + p.x * 0.1) * cos(0.34 * d + p.x * 0.05);
    Q = p.xz *= mat2(cos(p.y + vec4(0, 11, 33, 0) - T));
    z += d = abs(sqrt(dot(Q, Q)) - 0.25 * (5.0 + S.y)) / 3.0 + 0.0008;
    vec4 oStep = 1.0 + sin(S.y + p.z * 0.5 + S.z - length(S - p) + vec4(2,1,0,8));
    O += oStep.w / max(d, 1e-5) * oStep.xyz;
  }
  o.xyz = tanh(O / 1e4);
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);

  vec3 base = o.rgb;

  // Generate a stable "t" from brightness (can bias with minor gamma)
  float intensity = clamp((base.r + base.g + base.b) / 3.0, 0.0, 1.0);
  float t = pow(intensity, 0.95); // small gamma lift for smoother bands

  // Optional original single-color tint (kept for compatibility)
  vec3 customColor = intensity * uCustomColor;
  vec3 tinted = mix(base, customColor, step(0.5, uUseCustomColor));

  // Multi-stop blue palette color
  vec3 palColor = samplePalette(t);

  // Blend palette over the base/tinted plasma
  vec3 finalColor = mix(tinted, palColor, clamp(uPalStrength, 0.0, 1.0));

  // Alpha follows brightness but with a floor so page is covered
  float a = mix(uMinAlpha, 1.0, smoothstep(0.08, 0.85, intensity));
  a *= uOpacity;

  fragColor = vec4(finalColor, a);
}
`;

export const Plasma: React.FC<PlasmaProps> = ({
  color = "#3A8DFF",
  speed = 0.8,
  direction = "forward",
  scale = 1.4,
  opacity = 1.0,
  mouseInteractive = false,
  quality = 0.5, // 0.8–0.9 is a sweet spot
  // default: 6 blues from deep → light
  paletteColors = [
    "#0B3C91",
    "#1D4ED8",
    "#2563EB",
    "#3B82F6",
    "#60A5FA",
    "#93C5FD",
    "#093074",
    "#07275E",
    "#061E48",
  ],
  paletteStrength = 1.0, // fully use palette by default
  minAlpha = 0.45, // ensure coverage in dark areas
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Normalize palette to 6 stops (repeat last if fewer)
  const stops = (() => {
    const arr = paletteColors.slice(0, 6);
    while (arr.length < 6) arr.push(arr[arr.length - 1] ?? "#93C5FD");
    return arr;
  })();
  const [p0, p1, p2, p3, p4, p5] = stops.map(hexToRgb);
  const pCount = Math.max(2, Math.min(stops.length, 6));

  // Single stable dependency
  const depsKey = [
    color,
    speed,
    direction,
    scale,
    opacity,
    quality,
    ...stops,
    paletteStrength,
    minAlpha,
  ].join("|");

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    const baseDpr = Math.min(window.devicePixelRatio || 1, 2);
    const dpr = Math.max(0.6, Math.min(1.0, quality)) * baseDpr;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false, // full-screen tri
      premultipliedAlpha: false, // straight alpha
      dpr,
      powerPreference: "high-performance",
    });
    const gl = renderer.gl;

    // Transparent clear — blends over host's bg (we set bg-white below)
    gl.clearColor(0, 0, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA,
      gl.ONE,
      gl.ONE_MINUS_SRC_ALPHA
    );
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.STENCIL_TEST);
    gl.disable(gl.CULL_FACE);

    const canvas = gl.canvas as HTMLCanvasElement;
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      background: "transparent",
      willChange: "transform, opacity",
      transform: "translateZ(0)",
    } as CSSStyleDeclaration);
    host.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        uCustomColor: { value: hexToRgb(color) },
        uUseCustomColor: { value: 0.0 }, // we're using the palette instead
        uSpeed: { value: speed },
        uDirection: { value: direction === "reverse" ? -1.0 : 1.0 },
        uScale: { value: Math.max(0.0001, scale) },
        uOpacity: { value: opacity },
        uIter: { value: quality >= 0.92 ? 60 : 48 },

        // palette uniforms
        uPCount: { value: pCount },
        uPalStrength: { value: paletteStrength },
        uMinAlpha: { value: Math.max(0.0, Math.min(1.0, minAlpha)) },
        uP0: { value: p0 },
        uP1: { value: p1 },
        uP2: { value: p2 },
        uP3: { value: p3 },
        uP4: { value: p4 },
        uP5: { value: p5 },
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
      try {
        host.removeChild(canvas);
      } catch {}
    };
  }, [depsKey]);

  // White base so blending has a consistent substrate (but minAlpha lifts coverage)
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-white"
      aria-hidden
    />
  );
};

export default Plasma;
