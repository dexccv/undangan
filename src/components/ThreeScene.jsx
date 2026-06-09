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

    // Floating Screen Logic removed
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

    </>
  );
}

export default function ThreeScene({ children }) {
  const [pages, setPages] = React.useState(5);
  const containerRef = useRef();

  React.useEffect(() => {
    if (!containerRef.current) return;

    const updatePages = () => {
      const height = containerRef.current.scrollHeight;
      const windowHeight = window.innerHeight;
      // Calculate exact number of pages needed
      // Add a small buffer (0.2 pages) to ensure bottom padding/margins aren't cut off
      const calculatedPages = (height / windowHeight) + 0.2;
      setPages(calculatedPages);
    };

    const observer = new ResizeObserver(() => {
      updatePages();
    });

    observer.observe(containerRef.current);
    // Also observe window resize as a fallback
    window.addEventListener('resize', updatePages);
    
    // Initial calculation
    setTimeout(updatePages, 100);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePages);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100dvh', overflow: 'hidden', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#c49a6c" />
        
        <ScrollControls pages={Math.max(1, pages)} damping={0.2}>
          <CinematicExperience />
          
          <Scroll html style={{ width: '100%', pointerEvents: 'none' }}>
            <div ref={containerRef} style={{ pointerEvents: 'auto' }}>
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
