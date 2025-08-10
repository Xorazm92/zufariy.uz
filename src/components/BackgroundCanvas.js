import React, { useRef, useMemo, useEffect, useState, useContext } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ThemeContext } from '../context/ThemeContext';
import * as THREE from 'three';

// Advanced Background Shader Material
function AdvancedBackgroundMaterial({ speed = 1 }) {
  const materialRef = useRef();
  const { theme } = useContext(ThemeContext);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor1: { value: new THREE.Color(theme === 'dark' ? '#0f1419' : '#fafbfc') },
      uColor2: { value: new THREE.Color(theme === 'dark' ? '#667eea' : '#667eea') },
      uColor3: { value: new THREE.Color(theme === 'dark' ? '#764ba2' : '#4facfe') },
      uColor4: { value: new THREE.Color(theme === 'dark' ? '#4facfe' : '#f093fb') },
      uIntensity: { value: theme === 'dark' ? 0.8 : 0.4 },
      uComplexity: { value: 1.0 },
    }),
    [theme]
  );

  useFrame((state) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime() * speed;
    const { width, height } = state.size;
    materialRef.current.uniforms.uResolution.value.set(width, height);

    // Mouse interaction
    const mouse = state.mouse;
    materialRef.current.uniforms.uMouse.value.set(mouse.x, mouse.y);
  });

  const vertexShader = /* glsl */`
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = /* glsl */`
    precision highp float;

    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform float uIntensity;
    uniform float uComplexity;

    // Advanced noise functions
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,
                          0.366025403784439,
                         -0.577350269189626,
                          0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    // Fractal Brownian Motion
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;

      for(int i = 0; i < 4; i++) {
        value += amplitude * snoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      return value;
    }

    void main() {
      vec2 uv = vUv;
      vec2 centeredUv = (vUv - 0.5) * 2.0;
      centeredUv.x *= uResolution.x / uResolution.y;

      float time = uTime * 0.3;

      // Create flowing patterns
      vec2 flowUv = uv + vec2(
        fbm(uv * 2.0 + time * 0.1) * 0.1,
        fbm(uv * 2.0 + time * 0.15) * 0.1
      );

      // Multiple noise layers
      float noise1 = fbm(flowUv * 3.0 + time * 0.2);
      float noise2 = fbm(flowUv * 6.0 - time * 0.1);
      float noise3 = fbm(flowUv * 12.0 + time * 0.05);

      // Combine noises
      float pattern = (noise1 + noise2 * 0.5 + noise3 * 0.25) / 1.75;
      pattern = smoothstep(-0.3, 0.7, pattern);

      // Mouse interaction
      float mouseInfluence = length(uMouse - centeredUv) * 0.5;
      mouseInfluence = 1.0 - smoothstep(0.0, 1.0, mouseInfluence);
      pattern += mouseInfluence * 0.2;

      // Color mixing with 4 colors
      vec3 color1 = mix(uColor1, uColor2, pattern);
      vec3 color2 = mix(uColor3, uColor4, pattern);
      vec3 finalColor = mix(color1, color2, sin(time + pattern * 3.14159) * 0.5 + 0.5);

      // Add depth with distance-based darkening
      float depth = length(centeredUv) * 0.5;
      finalColor *= (1.0 - depth * 0.3);

      // Subtle vignette
      float vignette = 1.0 - smoothstep(0.7, 1.4, length(centeredUv));
      finalColor *= vignette;

      // Apply intensity
      finalColor *= uIntensity;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      transparent={false}
    />
  );
}

// Floating Particles Component
function FloatingParticles({ count = 50 }) {
  const pointsRef = useRef();
  const { theme } = useContext(ThemeContext);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random positions
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Theme-based colors
      const intensity = Math.random();
      if (theme === 'dark') {
        colors[i * 3] = 0.4 + intensity * 0.4; // R
        colors[i * 3 + 1] = 0.5 + intensity * 0.3; // G
        colors[i * 3 + 2] = 0.9 + intensity * 0.1; // B
      } else {
        colors[i * 3] = 0.6 + intensity * 0.2; // R
        colors[i * 3 + 1] = 0.7 + intensity * 0.2; // G
        colors[i * 3 + 2] = 0.9 + intensity * 0.1; // B
      }
    }

    return [positions, colors];
  }, [count, theme]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Gentle floating motion
      positions[i3 + 1] += Math.sin(time * 0.5 + i * 0.1) * 0.001;
      positions[i3] += Math.cos(time * 0.3 + i * 0.15) * 0.0005;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={theme === 'dark' ? 0.6 : 0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}



export default function BackgroundCanvas() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const { theme } = useContext(ThemeContext);

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

  const speed = reducedMotion ? 0.3 : 1;

  return (
    <div className="bg-canvas-container">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false
        }}
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        {/* Background plane */}
        <mesh scale={[20, 20, 1]} position={[0, 0, -5]}>
          <planeGeometry args={[1, 1, 32, 32]} />
          <AdvancedBackgroundMaterial speed={speed} />
        </mesh>

        {/* Floating particles */}
        <FloatingParticles count={reducedMotion ? 30 : 60} />

        {/* Ambient lighting */}
        <ambientLight intensity={theme === 'dark' ? 0.1 : 0.2} />
      </Canvas>
    </div>
  );
}
