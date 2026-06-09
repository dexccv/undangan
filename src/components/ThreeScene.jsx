import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Preload, ScrollControls, useScroll } from '@react-three/drei';
import * as THREE from 'three';

// Procedurally generate floating gold rings
function Rings() {
  const group = useRef();
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (group.current && scroll) {
      // Rotate the group based on scroll offset
      group.current.rotation.y = scroll.offset * Math.PI * 2;
      group.current.position.y = -scroll.offset * 10;
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
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (group.current && scroll) {
      group.current.position.y = -scroll.offset * 5;
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
          {/* Simple petal shape using a sphere that is scaled */}
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.8} roughness={0.5} />
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
        
        <ScrollControls pages={3} damping={0.1}>
          <Rings />
          <Petals />
        </ScrollControls>

        <Environment preset="city" />
        <Preload all />
      </Canvas>
    </div>
  );
}
