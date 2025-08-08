import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FlowMaterial({ speed = 1 }) {
  const materialRef = useRef();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColor1: { value: new THREE.Color('#0f1020') },
      uColor2: { value: new THREE.Color('#3b82f6') },
      uColor3: { value: new THREE.Color('#a78bfa') },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime() * speed;
    const { width, height } = state.size;
    uniforms.uResolution.value.set(width, height);
  });

  const vertex = /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragment = /* glsl */`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;

    // Simplex noise (2D)
    vec3 mod289(vec3 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec2 mod289(vec2 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);} 
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                          0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                         -0.577350269189626,  // -1.0 + 2.0 * C.x
                          0.024390243902439); // 1.0 / 41.0
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Normalize UV to -1..1 and keep aspect
      vec2 uv = vUv * 2.0 - 1.0;
      uv.x *= uResolution.x / uResolution.y;

      float t = uTime * 0.1;
      float n1 = snoise(uv * 1.2 + vec2(t, -t));
      float n2 = snoise(uv * 2.3 - vec2(-t * 0.7, t * 0.5));
      float n = smoothstep(-0.6, 0.8, n1 * 0.7 + n2 * 0.3);

      // Color blend
      vec3 col = mix(uColor1, uColor2, n);
      col = mix(col, uColor3, smoothstep(0.4, 1.0, n));

      // Subtle vignette in shader
      float r = length(uv);
      col *= smoothstep(1.2, 0.2, r);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  return (
    <shaderMaterial ref={materialRef} args={[{ uniforms, vertexShader: vertex, fragmentShader: fragment }]} />
  );
}

function FullscreenQuad() {
  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <FlowMaterial speed={1} />
    </mesh>
  );
}

export default function BackgroundCanvas() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const speed = reducedMotion ? 0.2 : 1;
  return (
    <div className="bg-canvas-container">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <mesh scale={[2, 2, 1]}>
          <planeGeometry args={[1, 1, 1, 1]} />
          <FlowMaterial speed={speed} />
        </mesh>
      </Canvas>
    </div>
  );
}
