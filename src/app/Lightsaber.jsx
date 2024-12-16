"use client";

import { useRef, useEffect } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { Effects, Sparkles, useGLTF } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";

extend({ UnrealBloomPass });

export default function Lightsaber({ bladeColor, isOpen, onOpenSound }) {
  const bladeRef = useRef();
  const hiltRef = useRef();
  const bladeLightRef = useRef();
  //const hiltRef = useRef();
  const prevIsOpen = useRef(isOpen);

  // Load the GLB file
  const { scene } = useGLTF("/lightsaber-hilt.glb");

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (isOpen) {
      bladeRef.current.scale.y = Math.min(1, bladeRef.current.scale.y + 0.05);
      bladeRef.current.position.y = Math.min(1.5, bladeRef.current.position.y);
    } else {
      bladeRef.current.scale.y = Math.max(0, bladeRef.current.scale.y - 0.05);
      bladeRef.current.position.y =
        Math.max(1, bladeRef.current.position.y) - 0.05;
    }
  });

  useEffect(() => {
    if (!prevIsOpen.current && isOpen) {
      onOpenSound();
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, onOpenSound]);

  useEffect(() => {
    if (hiltRef) {
      hiltRef.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
    }
  }, [hiltRef]);

  return (
    <group position={[0, 0, 0]} rotation={[0.3, 0, 0]}>
      <pointLight
        ref={bladeLightRef}
        position={[0, 1.5, 0]}
        color={bladeColor}
        intensity={isOpen ? 50.0 : 0}
        decay={3}
        castShadows
      />

      <primitive ref={hiltRef} object={scene} scale={0.01} castShadow />

      {/* Blade */}
      <group ref={bladeRef}>
        <mesh position={[0, 1.5, 0]}>
          <capsuleGeometry args={[0.05, 3, 32, 32]} />
          <meshStandardMaterial
            emissive={bladeColor}
            emissiveIntensity={5.0}
            toneMapped={false}
          />
        </mesh>
      </group>

      <group position={[0, 2.5, 0]}>
        <Sparkles
          count={100}
          speed={1}
          opacity={isOpen ? 0.5 : 0}
          color={0xffffff}
          scale={[0.3, 3, 0.3]}
          noise={[10, 10, 10]}
        />
      </group>
    </group>
  );
}
