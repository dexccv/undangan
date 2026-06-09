import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Preload } from '@react-three/drei';
import * as THREE from 'three';

// Procedurally generate floating gold rings
function Rings() {
  const group = useRef();

  useFrame(() => {
    if (group.current) {
      const scrollY = window.scrollY || 0;
      // Convert scrollY to a reasonable offset (e.g., 0 to 1 based on page height)
      const offset = scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      
      group.current.rotation.y = offset * Math.PI * 2;
      group.current.position.y = -offset * 10;
    }
  });

  const rings = [];
  for (let i = 0; i < 15; i++) {
    const radius = Math.random() * 4 + 1;
    const position = [
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10 - 5
    ];
    rings.push(
      <Float key={i} speed={1} rotationIntensity={2} floatIntensity={2}>
        <mesh position={position} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
          <torusGeometry args={[radius, 0.05, 16, 100]} />
          <meshStandardMaterial color="#c49a6c" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
    );
  }

  return <group ref={group}>{rings}</group>;
}

// Procedurally generate floating petals
function Petals() {
  const group = useRef();

  useFrame(() => {
    if (group.current) {
      const scrollY = window.scrollY || 0;
      const offset = scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      group.current.position.y = -offset * 5;
    }
  });

  const petals = [];
  for (let i = 0; i < 50; i++) {
    const position = [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 30 + 5,
      (Math.random() - 0.5) * 10 - 5
    ];
    petals.push(
      <Float key={`petal-${i}`} speed={2} rotationIntensity={5} floatIntensity={3}>
        <mesh position={position}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#c49a6c" transparent opacity={0.6} roughness={0.5} />
        </mesh>
      </Float>
    );
  }

  return <group ref={group}>{petals}</group>;
}

export default function ThreeScene() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#c49a6c" />
        
        <Rings />
        <Petals />

        <Environment preset="city" />
        <Preload all />
      </Canvas>
    </div>
  );
}
