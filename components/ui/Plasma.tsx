/* eslint-disable react/no-unknown-property */
"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

interface PlasmaProps {
  color?: string;
  speed?: number;
  direction?: "forward" | "reverse" | "pingpong";
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
  quality?: number;
  paletteColors?: string[];
  paletteStrength?: number;
  minAlpha?: number;
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

/* ===== Fragment: lateral drift + enhanced gradient blending ===== */
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
uniform float uIter;
uniform int   uPCount;
uniform float uPalStrength;
uniform float uMinAlpha;

uniform vec3 uP0;
uniform vec3 uP1;
uniform vec3 uP2;
uniform vec3 uP3;
uniform vec3 uP4;
uniform vec3 uP5;

out vec4 fragColor;

vec3 samplePaletteLinear(float t) {
  vec3 P[6];
  P[0] = uP0; P[1] = uP1; P[2] = uP2; P[3] = uP3; P[4] = uP4; P[5] = uP5;

  int count = max(uPCount, 2);
  float segF = clamp(t, 0.0, 1.0) * float(count - 1);
  int idx = int(floor(segF));
  idx = clamp(idx, 0, count - 2);
  float f = fract(segF);
  float fe = f * f * (3.0 - 2.0 * f);
  return mix(P[idx], P[idx + 1], fe);
}

// 5-tap smoothing around t, width 'w' (center-weighted)
vec3 samplePaletteSmooth(float t, float w) {
  float t0 = clamp(t - 2.0 * w, 0.0, 1.0);
  float t1 = clamp(t - 1.0 * w, 0.0, 1.0);
  float t2 = clamp(t,              0.0, 1.0);
  float t3 = clamp(t + 1.0 * w, 0.0, 1.0);
  float t4 = clamp(t + 2.0 * w, 0.0, 1.0);

  vec3 c0 = samplePaletteLinear(t0);
  vec3 c1 = samplePaletteLinear(t1);
  vec3 c2 = samplePaletteLinear(t2);
  vec3 c3 = samplePaletteLinear(t3);
  vec3 c4 = samplePaletteLinear(t4);

  return (c0 + 2.0*c1 + 4.0*c2 + 2.0*c3 + c4) / 10.0;
}

void mainImage(out vec4 o, vec2 C) {
  vec2 r = iResolution.xy;

  float globalDrift = sin(iTime * 0.6) * (0.25 * r.x);
  float ripple      = sin((C.y / r.y) * 8.0 + iTime * 1.3) * (0.015 * r.x);
  C.x += globalDrift + ripple;
  
  vec2 center = r * 0.5 + vec2(sin(iTime * 0.7) * 0.30 * r.x, 0.0);
  C = (C - center) / uScale + center;

  float i = 0.0, d, z, T = iTime * uSpeed * uDirection;
  vec3 O = vec3(0.0), p, S;
  vec2 Q;
  for (; i < uIter; i += 1.0) {
    p = z * normalize(vec3(C - 0.5 * r, r.y));
    p.z -= 4.0;
    S = p;
    d = p.y - T;
    p.x += 0.4 * (1.0 + p.y) * sin(d + p.x * 0.2) * cos(0.45 * d + p.x * 0.08);
    Q = p.xz *= mat2(cos(p.y + vec4(0, 11, 33, 0) - T));
    // MODIFICATION: Made the plasma tendrils thinner to increase their apparent number
    z += d = abs(sqrt(dot(Q, Q)) - 0.15 * (5.0 + S.y)) / 3.0 + 0.0008;
    vec4 oStep = 1.0 + sin(S.y + p.z * 0.5 + S.z - length(S - p) + vec4(2,1,0,8));
    O += oStep.w / max(d, 1e-5) * oStep.xyz;
  }
  o.xyz = tanh(O / 1e4);
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);

  vec3 base = o.rgb;
  float intensity = clamp((base.r + base.g + base.b) / 3.0, 0.0, 1.0);

  // MODIFICATION: Emphasize darker colors more by increasing the exponent
  float tBase = pow(intensity, 1.5);

  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float darkWave =
      0.10 * sin(uv.x * 18.0 + iTime * 0.7) +
      0.06 * sin(uv.y * 12.0 - iTime * 0.9) +
      0.04 * sin((uv.x + uv.y) * 22.0 + iTime * 0.6);

  float tMod = clamp(tBase - (1.0 - tBase) * darkWave, 0.0, 1.0);

  float x = uv.x;
  float baseW  = clamp(fwidth(tMod) * 4.0, 0.0, 0.16);
  float peaks  = 0.5 + 0.5 * cos(4.0 * 3.141592653589793 * x);
  
  // MODIFICATION: Significantly widen the blend in darker color regions
  float darkBoost = 0.35 * (1.0 - tMod);
  // MODIFICATION: Raised the cap on the total blend width
  float wBoost = min(baseW + 0.08 * peaks + darkBoost, 0.40);

  vec3 palColor = samplePaletteSmooth(tMod, wBoost);
  vec3 customColor = intensity * uCustomColor;
  vec3 tinted = mix(base, customColor, step(0.5, uUseCustomColor));

  float s = clamp(uPalStrength, 0.0, 1.0);
  vec3 finalColor = mix(tinted, palColor, s);

  float a = mix(uMinAlpha, 1.0, smoothstep(0.08, 0.85, intensity));
  a *= uOpacity;

  fragColor = vec4(finalColor, a);
}
`;

export const Plasma: React.FC<PlasmaProps> = ({
  color = "#93C5FD",
  speed = 2,
  direction = "forward",
  // MODIFICATION: Increased scale to 'zoom out', making patterns smaller and more numerous
  scale = 1,
  opacity = 1.0,
  mouseInteractive = false,
  quality = 0.5,
  paletteColors = [
    "#0B3C91",
    "#1D4ED8",
    "#2563EB",
    "#3B82F6",
    "#60A5FA",
    "#93C5FD",
  ],
  paletteStrength = 1.0,
  // MODIFICATION: Increased minimum alpha to prevent areas from becoming too transparent
  minAlpha = 0.7,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const stops = (() => {
    const arr = paletteColors.slice(0, 6);
    while (arr.length < 6) arr.push(arr[arr.length - 1] ?? "#93C5FD");
    return arr;
  })();
  const [p0, p1, p2, p3, p4, p5] = stops.map(hexToRgb);
  const pCount = Math.max(2, Math.min(stops.length, 6));

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
      antialias: false,
      premultipliedAlpha: false,
      dpr,
      powerPreference: "high-performance",
    });
    const gl = renderer.gl;

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
        uUseCustomColor: { value: 0.0 },
        uSpeed: { value: speed },
        uDirection: { value: direction === "reverse" ? -1.0 : 1.0 },
        uScale: { value: Math.max(0.0001, scale) },
        uOpacity: { value: opacity },
        uIter: { value: quality >= 0.92 ? 60 : 48 },

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

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "#EAF3FF" }}
      aria-hidden
    />
  );
};

export default Plasma;
