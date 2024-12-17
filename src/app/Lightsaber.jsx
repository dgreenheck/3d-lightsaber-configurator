"use client";

import { useState, useRef, useEffect } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { Sparkles, useGLTF } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import { loadAudio, playAudio } from "../utils/audio";

extend({ UnrealBloomPass });

export default function Lightsaber({ bladeColor, isOpen }) {
  const bladeRef = useRef();
  const hiltRef = useRef();
  const bladeLightRef = useRef();

  const prevIsOpen = useRef(isOpen);
  const previousMousePos = useRef({ x: 0, y: 0 });
  const threshold = 20; // Movement threshold to trigger sound

  const [openSound, setOpenSound] = useState(null);
  const [closeSound, setCloseSound] = useState(null);
  const [hummingSound, setHummingSound] = useState(null);
  const [swingSound, setSwingSound] = useState(null);
  const isMouseDown = useRef(false);

  const currentAudioSource = useRef(null); // Reference to current playing sound
  const isSwinging = useRef(null);

  // Load the GLB file
  const { scene } = useGLTF(
    `${process.env.NEXT_PUBLIC_BASE_PATH}/models/lightsaber-hilt.glb`
  );

  useEffect(() => {
    const handleMouseDown = () => (isMouseDown.current = true);
    const handleMouseUp = () => (isMouseDown.current = false);

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (isOpen) {
      bladeRef.current.scale.y = Math.min(1, bladeRef.current.scale.y + 0.01);
      bladeRef.current.position.y = Math.min(1.5, bladeRef.current.position.y);
    } else {
      bladeRef.current.scale.y = Math.max(0, bladeRef.current.scale.y - 0.01);
      bladeRef.current.position.y =
        Math.max(1, bladeRef.current.position.y) - 0.01;
    }
  });

  // Load audio
  useEffect(() => {
    loadAudio(
      `${process.env.NEXT_PUBLIC_BASE_PATH}/audio/lightsaber-open.mp3`
    ).then(setOpenSound);

    loadAudio(
      `${process.env.NEXT_PUBLIC_BASE_PATH}/audio/lightsaber-close.mp3`
    ).then(setCloseSound);

    loadAudio(
      `${process.env.NEXT_PUBLIC_BASE_PATH}/audio/lightsaber-humming.mp3`
    ).then(setHummingSound);

    loadAudio(
      `${process.env.NEXT_PUBLIC_BASE_PATH}/audio/lightsaber-swing.mp3`
    ).then(setSwingSound);
  }, []);

  useEffect(() => {
    if (!openSound || !hummingSound || !closeSound) return;

    if (!prevIsOpen.current && isOpen) {
      playAudio(openSound);
      currentAudioSource.current = playAudio(hummingSound, 0.2, true);
    } else if (prevIsOpen.current && !isOpen) {
      if (currentAudioSource.current) {
        currentAudioSource.current.stop();
      }
      currentAudioSource.current = playAudio(closeSound, 1.0, false, () => {
        currentAudioSource.current = null;
      });
    }

    prevIsOpen.current = isOpen;
  }, [isOpen]);

  // Track mouse movement and play sound if threshold is exceeded
  useFrame((state) => {
    if (!swingSound) return;

    const { pointer } = state; // Normalized mouse position (-1 to 1)

    const currentMousePos = {
      x: pointer.x * window.innerWidth,
      y: pointer.y * window.innerHeight,
    };

    // Calculate movement delta
    const deltaX = Math.abs(currentMousePos.x - previousMousePos.current.x);
    const deltaY = Math.abs(currentMousePos.y - previousMousePos.current.y);

    if (deltaX > threshold && !isSwinging.current && isMouseDown.current) {
      isSwinging.current = true;
      playAudio(swingSound, 0.3);
      setTimeout(() => {
        isSwinging.current = false;
      }, 300);
    }

    // Update the previous mouse position
    previousMousePos.current = currentMousePos;
  });

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
        intensity={50.0}
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
