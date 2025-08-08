import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Environment, Points, PointMaterial, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

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

function SpinningKnot(props) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.3;
      ref.current.rotation.y += delta * 0.2;
    }
  });
  return (
    <mesh ref={ref} {...props} castShadow receiveShadow>
      <torusKnotGeometry args={[1, 0.35, 256, 32]} />
      <meshStandardMaterial color="#6C63FF" metalness={0.6} roughness={0.2} />
    </mesh>
  );
}

function Particles({ count = 800, radius = 6 }) {
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // distribute on a sphere shell with slight randomness
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = radius * (0.6 + Math.random() * 0.4);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      pos.set([x, y, z], i * 3);
    }
    return pos;
  }, [count, radius]);

  const pointsRef = useRef();
  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.02;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#86a8ff"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

const ThreeHero = () => {
  const [modelUrl, setModelUrl] = useState(null);
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

  useEffect(() => {
    // Prefer earth.glb, then fallback to b33.glb, else null
    const probe = async (path) => {
      try {
        const res = await fetch(path, { method: 'HEAD' });
        return res.ok ? path : null;
      } catch {
        return null;
      }
    };
    (async () => {
      const earth = await probe('/assets/earth.glb');
      if (earth) return setModelUrl(earth);
      const b33 = await probe('/assets/b33.glb');
      if (b33) return setModelUrl(b33);
      setModelUrl(null);
    })();
  }, []);

  const dirLightRef = useRef();
  return (
    <Canvas
      className="three-hero-canvas"
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      {/* Atmospheric particles behind the hero object */}
      <Particles count={reducedMotion ? 300 : 800} />
      <ambientLight intensity={0.6} />
      <directionalLight ref={dirLightRef} position={[5, 5, 5]} intensity={1} castShadow />
      <ParallaxGroup>
        <Float speed={reducedMotion ? 0 : 2} rotationIntensity={reducedMotion ? 0 : 1} floatIntensity={reducedMotion ? 0 : 1.5}>
          {modelUrl ? (
            <Suspense fallback={<SpinningKnot position={[0, 0, 0]} />}> 
              <GLTFModel url={modelUrl} />
            </Suspense>
          ) : (
            <SpinningKnot position={[0, 0, 0]} />
          )}
        </Float>
      </ParallaxGroup>
      <Environment preset="city" />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate={!reducedMotion} autoRotateSpeed={0.6} />

      <ScrollController reducedMotion={reducedMotion} dirLightRef={dirLightRef} />

      {/* Cinematic postprocessing */}
      <EffectComposer multisampling={0}> 
        <Bloom intensity={reducedMotion ? 0.3 : 0.5} luminanceThreshold={0.2} luminanceSmoothing={0.025} />
        <Vignette eskil={false} offset={0.2} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
};

function GLTFModel({ url }) {
  const { scene } = useGLTF(url);
  // Center/scale model roughly; adjust after seeing the asset
  return (
    <primitive object={scene} position={[0, -0.3, 0]} rotation={[0, Math.PI * 0.25, 0]} scale={1.3} />
  );
}

function ScrollController({ reducedMotion, dirLightRef }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0, z: 5, light: { x: 5, y: 5, z: 5, i: 1 } });

  useEffect(() => {
    const onScroll = () => {
      const h = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const p = Math.min(Math.max(window.scrollY / h, 0), 1); // 0..1
      // Define keyframes
      const p1 = Math.min(p * 3, 1); // focus to slight right
      const p2 = Math.max(Math.min((p - 0.33) * 3, 1), 0); // mid transition
      const p3 = Math.max(Math.min((p - 0.66) * 3, 1), 0); // final approach

      // Base
      let cx = 0, cy = 0, cz = 5;
      let lx = 5, ly = 5, lz = 5, li = 1;

      // Stage 1: slight pan right
      cx += p1 * 0.9; // move right
      cz += -p1 * 0.6; // move closer
      lx += p1 * 1.0; ly += p1 * 0.5;

      // Stage 2: tilt up a bit
      cy += p2 * 0.25;
      lx += p2 * -1.2; ly += p2 * 0.8; lz += p2 * -0.6; li = 1 + p2 * 0.2;

      // Stage 3: final approach
      cx += p3 * -0.4; cy += p3 * 0.05; cz += p3 * -1.0;
      li = 1.2 - p3 * 0.2;

      target.current = { x: cx, y: cy, z: cz, light: { x: lx, y: ly, z: lz, i: li } };
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame(() => {
    const lerp = (a, b, t) => a + (b - a) * (reducedMotion ? 0.08 : 0.12);
    camera.position.x = lerp(camera.position.x, target.current.x, 1);
    camera.position.y = lerp(camera.position.y, target.current.y, 1);
    camera.position.z = lerp(camera.position.z, target.current.z, 1);
    camera.lookAt(0, 0, 0);

    if (dirLightRef?.current) {
      const dl = dirLightRef.current;
      dl.position.x = lerp(dl.position.x, target.current.light.x, 1);
      dl.position.y = lerp(dl.position.y, target.current.light.y, 1);
      dl.position.z = lerp(dl.position.z, target.current.light.z, 1);
      dl.intensity = lerp(dl.intensity, target.current.light.i, 1);
    }
  });
  return null;
}

export default ThreeHero;
