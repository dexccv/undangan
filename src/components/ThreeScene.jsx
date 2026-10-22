import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function AmbientGeometricMesh() {
  const meshRef = useRef();
  const particlesRef = useRef();

  // Particle positions
  const particleCount = 45;
  const particles = useMemo(() => {
    const coords = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      coords[i] = (Math.random() - 0.5) * 16;
      coords[i + 1] = (Math.random() - 0.5) * 16;
      coords[i + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return coords;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.12;
      meshRef.current.rotation.x += delta * 0.08;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <>
      {/* Floating Gold Geometric Ring */}
      <group ref={meshRef} position={[2, 0, -2]}>
        <mesh>
          <torusGeometry args={[1.8, 0.04, 16, 64]} />
          <meshBasicMaterial color="#B8860B" transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.5, 0.03, 16, 64]} />
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.25} />
        </mesh>
      </group>

      {/* Subtle Dust / Bokeh Floating Points */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#B8860B"
          transparent
          opacity={0.4}
        />
      </points>
    </>
  );
}

export default function ThreeScene({ children }) {
  return (
    <div className="three-scene-layout" style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      {/* 3D Background - non-blocking, isolated, purely decorative */}
      <div 
        className="three-scene-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.55
        }}
        aria-hidden="true"
      >
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 60 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true }}
            style={{ pointerEvents: 'none' }}
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 8, 4]} intensity={1} color="#FAF8F3" />
            <AmbientGeometricMesh />
          </Canvas>
        </Suspense>
      </div>

      {/* Main Page HTML Layer - Directly in DOM, 100% accessible and responsive */}
      <div className="three-scene-content" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        {children}
      </div>
    </div>
  );
}
