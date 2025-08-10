import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls, Float, Environment, shaderMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';

// Custom Fluid Shader Material
const FluidMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uResolution: new THREE.Vector2(1, 1),
    uColor1: new THREE.Color('#667eea'),
    uColor2: new THREE.Color('#764ba2'),
    uColor3: new THREE.Color('#4facfe'),
    uIntensity: 1.0,
    uSpeed: 1.0,
    uComplexity: 1.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uIntensity;

    // Noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;

      // Create fluid displacement
      float noise1 = snoise(position * 2.0 + uTime * 0.5);
      float noise2 = snoise(position * 4.0 + uTime * 0.3);
      float noise3 = snoise(position * 8.0 + uTime * 0.1);

      vec3 displacement = normal * (noise1 * 0.3 + noise2 * 0.15 + noise3 * 0.05) * uIntensity;

      // Mouse interaction
      float mouseInfluence = length(uMouse) * 0.5;
      displacement += normal * mouseInfluence * 0.2;

      vec3 newPosition = position + displacement;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uIntensity;
    uniform float uComplexity;

    void main() {
      vec2 uv = vUv;

      // Create flowing patterns
      float time = uTime * 0.5;
      float wave1 = sin(uv.x * 10.0 + time) * 0.5 + 0.5;
      float wave2 = sin(uv.y * 8.0 + time * 1.2) * 0.5 + 0.5;
      float wave3 = sin((uv.x + uv.y) * 6.0 + time * 0.8) * 0.5 + 0.5;

      // Combine waves
      float pattern = (wave1 + wave2 + wave3) / 3.0;
      pattern = pow(pattern, uComplexity);

      // Color mixing
      vec3 color1 = mix(uColor1, uColor2, pattern);
      vec3 color2 = mix(uColor2, uColor3, sin(time + pattern * 3.14159) * 0.5 + 0.5);
      vec3 finalColor = mix(color1, color2, pattern);

      // Add fresnel effect
      float fresnel = pow(1.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 2.0);
      finalColor += fresnel * 0.3;

      // Mouse interaction glow
      float mouseGlow = 1.0 - length(uMouse - vUv) * 2.0;
      mouseGlow = max(mouseGlow, 0.0);
      finalColor += mouseGlow * 0.2;

      gl_FragColor = vec4(finalColor, 0.9);
    }
  `
);

extend({ FluidMaterial });

// Fluid Sphere Component
function FluidSphere({ position = [0, 0, 0], scale = 1 }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const { pointer, viewport } = useThree();

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.getElapsedTime();

    // Update shader uniforms
    materialRef.current.uTime = time;
    materialRef.current.uMouse.set(
      pointer.x * 0.5,
      pointer.y * 0.5
    );
    materialRef.current.uIntensity = 0.2 + Math.sin(time * 0.4) * 0.08;
    materialRef.current.uComplexity = 0.8 + Math.sin(time * 0.25) * 0.15;

    // Gentle rotation
    meshRef.current.rotation.x = Math.sin(time * 0.15) * 0.08;
    meshRef.current.rotation.y = time * 0.08;
    meshRef.current.rotation.z = Math.cos(time * 0.12) * 0.04;

    // Subtle scale pulsing
    const pulseScale = 1 + Math.sin(time * 0.6) * 0.03;
    meshRef.current.scale.setScalar(scale * pulseScale);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[1, 3]} />
      <fluidMaterial
        ref={materialRef}
        transparent
        side={THREE.DoubleSide}
        opacity={0.9}
      />
    </mesh>
  );
}

// Interactive Particle Field
function InteractiveParticles({ count = 1000 }) {
  const pointsRef = useRef();
  const { pointer, viewport } = useThree();

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Create a more organic distribution
      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      // Gradient colors matching theme
      const colorIntensity = Math.random();
      colors[i * 3] = 0.4 + colorIntensity * 0.4; // R
      colors[i * 3 + 1] = 0.5 + colorIntensity * 0.3; // G
      colors[i * 3 + 2] = 0.9 + colorIntensity * 0.1; // B
    }

    return [positions, colors];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array;

    // Mouse interaction
    const mouseX = (pointer.x * viewport.width) * 0.5;
    const mouseY = (pointer.y * viewport.height) * 0.5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Original position
      const originalX = positions[i3];
      const originalY = positions[i3 + 1];
      // const originalZ = positions[i3 + 2]; // Not used currently

      // Distance from mouse
      const dx = originalX - mouseX;
      const dy = originalY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Mouse repulsion effect
      if (distance < 2) {
        const force = (2 - distance) * 0.1;
        positions[i3] += (dx / distance) * force;
        positions[i3 + 1] += (dy / distance) * force;
      }

      // Gentle floating animation
      positions[i3 + 1] += Math.sin(time * 0.5 + i * 0.01) * 0.002;
      positions[i3] += Math.cos(time * 0.3 + i * 0.015) * 0.001;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Rotate the entire particle field
    pointsRef.current.rotation.y = time * 0.02;
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
        size={0.012}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ParallaxGroup({ children }) {
  const ref = useRef();
  const { pointer, viewport } = useThree();
  useFrame(() => {
    if (!ref.current) return;
    // Map pointer (-1..1) to small offsets
    const targetX = (pointer.x * viewport.width) * 0.02;
    const targetY = (pointer.y * viewport.height) * -0.02;
    // Smoothly interpolate position and rotation
    const px = THREE.MathUtils.lerp(ref.current.position.x, targetX, 0.08);
    const py = THREE.MathUtils.lerp(ref.current.position.y, targetY, 0.08);
    ref.current.position.set(px, py, 0);
    // subtle head-turn rotation
    const rx = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.2, 0.08);
    const ry = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.3, 0.08);
    ref.current.rotation.set(rx, ry, 0);
  });
  return <group ref={ref}>{children}</group>;
}



const ThreeHero = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Detect prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const listener = (e) => setReducedMotion(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', listener);
    else mq.addListener(listener);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', listener);
      else mq.removeListener(listener);
    };
  }, []);

  const dirLightRef = useRef();
  const spotLightRef = useRef();

  return (
    <Canvas
      className="three-hero-canvas"
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4], fov: 60 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
    >
      {/* Interactive particle field */}
      <InteractiveParticles count={reducedMotion ? 300 : 600} />

      {/* Optimized lighting setup */}
      <ambientLight intensity={0.3} />
      <directionalLight
        ref={dirLightRef}
        position={[5, 5, 5]}
        intensity={0.6}
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <spotLight
        ref={spotLightRef}
        position={[0, 4, 2]}
        angle={0.4}
        penumbra={0.6}
        intensity={0.4}
        color="#667eea"
      />
      <pointLight position={[-2, -2, 2]} intensity={0.2} color="#4facfe" />
      <pointLight position={[2, 2, -2]} intensity={0.2} color="#764ba2" />

      <ParallaxGroup>
        <Float
          speed={reducedMotion ? 0 : 1.5}
          rotationIntensity={reducedMotion ? 0 : 0.5}
          floatIntensity={reducedMotion ? 0 : 1}
        >
          {/* Main fluid sphere */}
          <FluidSphere position={[0, 0, 0]} scale={1.0} />

          {/* Additional smaller spheres for depth */}
          <FluidSphere position={[1.5, 0.8, -0.8]} scale={0.25} />
          <FluidSphere position={[-1.2, -0.8, 0.8]} scale={0.3} />
          <FluidSphere position={[0, 1.5, -1.5]} scale={0.2} />
        </Float>
      </ParallaxGroup>

      {/* Environment for reflections */}
      <Environment preset="studio" />

      {/* Subtle orbit controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />

      <ScrollController reducedMotion={reducedMotion} dirLightRef={dirLightRef} spotLightRef={spotLightRef} />

      {/* Optimized post-processing */}
      <EffectComposer multisampling={2}>
        <Bloom
          intensity={reducedMotion ? 0.3 : 0.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.7}
          height={200}
        />
        <ChromaticAberration offset={[0.0005, 0.0005]} />
        <Vignette eskil={false} offset={0.15} darkness={0.4} />
        <Noise opacity={0.015} />
      </EffectComposer>
    </Canvas>
  );
};



function ScrollController({ reducedMotion, dirLightRef, spotLightRef }) {
  const { camera } = useThree();
  const target = useRef({
    camera: { x: 0, y: 0, z: 4 },
    dirLight: { x: 5, y: 5, z: 5, i: 0.8 },
    spotLight: { x: 0, y: 5, z: 0, i: 0.5 }
  });

  useEffect(() => {
    const onScroll = () => {
      const h = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const p = Math.min(Math.max(window.scrollY / h, 0), 1); // 0..1

      // Smooth easing function
      const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      const easedProgress = easeInOutCubic(p);

      // Camera movement - more cinematic
      const cameraRadius = 4 + easedProgress * 2;
      const cameraAngle = easedProgress * Math.PI * 0.5;

      const cx = Math.sin(cameraAngle) * cameraRadius * 0.3;
      const cy = easedProgress * 1.5 - 0.5;
      const cz = Math.cos(cameraAngle) * cameraRadius;

      // Dynamic lighting
      const dirLightAngle = easedProgress * Math.PI;
      const dlx = Math.sin(dirLightAngle) * 6;
      const dly = 5 + Math.cos(easedProgress * Math.PI) * 2;
      const dlz = Math.cos(dirLightAngle) * 6;
      const dli = 0.8 + Math.sin(easedProgress * Math.PI) * 0.3;

      // Spotlight movement
      const slx = Math.sin(easedProgress * Math.PI * 2) * 2;
      const sly = 5 + Math.cos(easedProgress * Math.PI) * 1;
      const slz = Math.cos(easedProgress * Math.PI * 2) * 2;
      const sli = 0.5 + Math.sin(easedProgress * Math.PI * 3) * 0.2;

      target.current = {
        camera: { x: cx, y: cy, z: cz },
        dirLight: { x: dlx, y: dly, z: dlz, i: dli },
        spotLight: { x: slx, y: sly, z: slz, i: sli }
      };
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame(() => {
    const lerpFactor = reducedMotion ? 0.05 : 0.08;
    const lerp = (a, b, t) => a + (b - a) * t;

    // Smooth camera movement
    camera.position.x = lerp(camera.position.x, target.current.camera.x, lerpFactor);
    camera.position.y = lerp(camera.position.y, target.current.camera.y, lerpFactor);
    camera.position.z = lerp(camera.position.z, target.current.camera.z, lerpFactor);
    camera.lookAt(0, 0, 0);

    // Dynamic directional light
    if (dirLightRef?.current) {
      const dl = dirLightRef.current;
      dl.position.x = lerp(dl.position.x, target.current.dirLight.x, lerpFactor);
      dl.position.y = lerp(dl.position.y, target.current.dirLight.y, lerpFactor);
      dl.position.z = lerp(dl.position.z, target.current.dirLight.z, lerpFactor);
      dl.intensity = lerp(dl.intensity, target.current.dirLight.i, lerpFactor);
    }

    // Dynamic spotlight
    if (spotLightRef?.current) {
      const sl = spotLightRef.current;
      sl.position.x = lerp(sl.position.x, target.current.spotLight.x, lerpFactor);
      sl.position.y = lerp(sl.position.y, target.current.spotLight.y, lerpFactor);
      sl.position.z = lerp(sl.position.z, target.current.spotLight.z, lerpFactor);
      sl.intensity = lerp(sl.intensity, target.current.spotLight.i, lerpFactor);
    }
  });

  return null;
}

export default ThreeHero;
