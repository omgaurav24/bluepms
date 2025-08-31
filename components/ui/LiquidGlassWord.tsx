/* components/ui/LiquidGlassWord.tsx */
"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Text, MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/* ---------- flowing gradient backdrop (fills the view) ---------- */
function FlowBackdrop() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const { viewport } = useThree(); // width/height at z=0

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  const vertex = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Soft, flowing multi-stop blue gradient with subtle shimmer
  const fragment = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uA;   // #b6d7ff (light)
    uniform vec3 uB;   // #86b6ff (mid)
    uniform vec3 uC;   // #3b82f6 (deep)

    // simple hash & noise for shimmer
    float hash(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p+34.345); return fract(p.x*p.y); }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      float a = hash(i);
      float b = hash(i+vec2(1.0,0.0));
      float c = hash(i+vec2(0.0,1.0));
      float d = hash(i+vec2(1.0,1.0));
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
    }

    void main(){
      // Animate UVs so gradient “flows” upward and slightly sideways
      vec2 uv = vUv;
      uv.y += uTime * 0.06;
      uv.x += sin(uTime * 0.25) * 0.05;

      // Base vertical blend
      float g = smoothstep(0.0, 1.0, uv.y);

      // Add a slow horizontal banding sweep
      float band = 0.5 + 0.5 * sin(uv.x * 8.0 + uTime * 0.7);
      float m = smoothstep(0.0, 1.0, 0.35 + 0.35 * band); // 0..1

      // Mix three stops (A->B->C) with band modulation
      vec3 cAB = mix(uA, uB, g);
      vec3 base = mix(cAB, uC, m * 0.8);

      // Subtle shimmer
      float n = noise(uv * 8.0 + vec2(0.0, uTime * 0.5));
      base += 0.05 * vec3(n);

      gl_FragColor = vec4(base, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uA: { value: new THREE.Color("#b6d7ff") },
      uB: { value: new THREE.Color("#86b6ff") },
      uC: { value: new THREE.Color("#3b82f6") },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    depthWrite: false,
    depthTest: false,
  });

  return (
    <mesh position={[0, 0, -2]} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      {/* @ts-expect-error – ShaderMaterial typing */}
      <primitive object={material} ref={matRef} />
    </mesh>
  );
}

/* ---------- single glass letter (static, wide) ---------- */
function GlassLetter({
  char,
  x,
  fontSize,
}: {
  char: string;
  x: number;
  fontSize: number;
}) {
  return (
    <Text
      position={[x, 0, 0]}
      fontSize={fontSize}
      letterSpacing={0}
      anchorX="center"
      anchorY="middle"
      scale={[1.2, 1, 1]} // widen letters for a bold-ish feel
    >
      {char}
      <MeshTransmissionMaterial
        backside
        samples={12}
        resolution={768}
        thickness={1.7}
        roughness={0.07}
        anisotropy={0.25}
        chromaticAberration={0.016}
        distortion={0.055}
        distortionScale={0.32}
        temporalDistortion={0.1}
        ior={1.45}
        color="#b6d7ff"
        attenuationColor="#86b6ff"
        attenuationDistance={1.05}
        toneMapped={false}
      />
    </Text>
  );
}

/* ---------- word composed of individual glass letters ---------- */
export default function LiquidGlassWord({
  word = "BLUEPMS",
  height = 220,
}: {
  word?: string;
  height?: number;
}) {
  const chars = useMemo(() => word.split(""), [word]);

  // Scale with canvas height
  const fontSize = Math.max(1, height / 220) * 1.35;
  const spacing = fontSize * 1.0; // roomy spacing since each letter is widened via scaleX
  const totalW = (chars.length - 1) * spacing * 1.2; // compensate for scaleX
  const startX = -totalW / 2;

  return (
    <div className="w-full" style={{ height, pointerEvents: "none" }}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 8], fov: 45 }}
      >
        {/* Flowing gradient behind the word (what the glass refracts) */}
        <FlowBackdrop />

        {/* Balanced lights for crisp highlights */}
        <ambientLight intensity={0.65} />
        <directionalLight position={[3, 4, 6]} intensity={1.15} />
        <directionalLight position={[-4, -2, 2]} intensity={0.7} />

        {/* Environment for richer refraction */}
        <Environment preset="city" blur={0.5} />

        {/* Word */}
        <group position={[0, 0, 0]}>
          {chars.map((c, i) => (
            <GlassLetter
              key={`${c}-${i}`}
              char={c}
              x={startX + i * spacing}
              fontSize={fontSize}
            />
          ))}
        </group>

        {/* Bloom to sell the glass edges */}
        <EffectComposer multisampling={2}>
          <Bloom
            intensity={0.9}
            mipmapBlur
            luminanceThreshold={0.2}
            luminanceSmoothing={0.85}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
