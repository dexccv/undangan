import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Preload, ScrollControls, Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';

function CinematicExperience() {
  const scroll = useScroll();
  const { viewport } = useThree();

  // References to groups
  const portalRef = useRef();
  const tunnelRef = useRef();
  const floatingScreenRef = useRef();

  // Generate tunnel planes
  const tunnelPlanes = useMemo(() => {
    const planes = [];
    for (let i = 0; i < 20; i++) {
      planes.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          -i * 5 - 10 // Spread along Z axis
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          0
        ],
        scale: Math.random() * 2 + 1
      });
    }
    return planes;
  }, []);

  useFrame((state, delta) => {
    const offset = scroll.offset; // 0 to 1

    // 1. Portal Logic (Offset 0 to 0.3)
    if (portalRef.current) {
      portalRef.current.rotation.y += delta * 0.5;
      portalRef.current.rotation.x += delta * 0.2;
      
      // As offset increases, scale up the portal so the camera flies through it
      const portalScale = 1 + offset * 30;
      portalRef.current.scale.set(portalScale, portalScale, portalScale);
      
      // Fade out wireframe
      portalRef.current.children[0].material.opacity = Math.max(0, 1 - offset * 4);
      portalRef.current.visible = offset < 0.3;
    }

    // 2. Tunnel Logic (Offset 0.2 to 0.7)
    if (tunnelRef.current) {
      // Move tunnel towards camera
      // offset 0.2 -> z = 0, offset 0.7 -> z = 100
      let tunnelZ = 0;
      if (offset > 0.1) {
        tunnelZ = (offset - 0.1) * 150;
      }
      tunnelRef.current.position.z = tunnelZ;
      
      // Slowly rotate the whole tunnel
      tunnelRef.current.rotation.z = offset * Math.PI;
    }

    // 3. Floating Screen Logic (Offset 0.6 to 1.0)
    if (floatingScreenRef.current) {
      // Start far away and rotated, then land smoothly in center
      // At offset < 0.6, it's far below and rotated
      // At offset = 1.0, it's center and facing front
      
      let progress = 0;
      if (offset > 0.6) {
        progress = (offset - 0.6) * 2.5; // Scale 0 to 1
        progress = Math.min(progress, 1);
      }

      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      const targetZ = -5 + ease * 3;
      const targetY = -10 + ease * 10;
      const targetRotX = (Math.PI / 2) * (1 - ease); // starts flat, stands up

      floatingScreenRef.current.position.set(0, targetY, targetZ);
      floatingScreenRef.current.rotation.set(targetRotX, 0, 0);
    }
  });

  return (
    <>
      {/* Concept B: Portal / Morphing Sphere */}
      <group ref={portalRef} position={[0, 0, -2]}>
        <mesh>
          <icosahedronGeometry args={[1.5, 2]} />
          <meshStandardMaterial 
            color="#c49a6c" 
            wireframe 
            transparent 
            opacity={1} 
            emissive="#c49a6c" 
            emissiveIntensity={2} 
          />
        </mesh>
      </group>

      {/* Concept A: Tunnel of Floating Images/Glass */}
      <group ref={tunnelRef}>
        {tunnelPlanes.map((plane, i) => (
          <mesh key={i} position={plane.position} rotation={plane.rotation} scale={plane.scale}>
            <planeGeometry args={[2, 3]} />
            <meshStandardMaterial 
              color="#e8e0d5"
              transparent
              opacity={0.3}
              roughness={0.1}
              metalness={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Concept C: Floating Screen (Apple Style) */}
      <group ref={floatingScreenRef} position={[0, -10, -10]}>
        <mesh>
          <boxGeometry args={[viewport.width * 0.8, viewport.height * 0.8, 0.1]} />
          <meshStandardMaterial color="#fcfbfa" metalness={0.5} roughness={0.1} />
        </mesh>
        {/* Glow behind the screen */}
        <mesh position={[0, 0, -0.2]}>
          <planeGeometry args={[viewport.width * 0.85, viewport.height * 0.85]} />
          <meshBasicMaterial color="#c49a6c" transparent opacity={0.3} />
        </mesh>
      </group>
    </>
  );
}

export default function ThreeScene({ children }) {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#c49a6c" />
        
        <ScrollControls pages={5} damping={0.2}>
          <CinematicExperience />
          
          <Scroll html style={{ width: '100vw', pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}>
              {children}
            </div>
          </Scroll>
        </ScrollControls>

        <Environment preset="city" resolution={256} />
        <Preload all />
      </Canvas>
    </div>
  );
}
