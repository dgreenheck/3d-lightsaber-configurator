"use client";

import { useState, useRef, useEffect } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { Sparkles, useGLTF } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import { loadAudio, playAudio } from "../../utils/audio";

extend({ UnrealBloomPass });

export default function Lightsaber({ bladeColor, hiltStyle, isOpen }) {
  const hiltModel = useGLTF(hiltStyle.url);

  const bladeRef = useRef();
  const hiltRef = useRef();
  const bladeLightRef = useRef();

  const prevIsOpen = useRef(isOpen);
  const previousMousePos = useRef({ x: 0, y: 0 });
  const threshold = 30; // Movement threshold to trigger sound

  const [openSound, setOpenSound] = useState(null);
  const [closeSound, setCloseSound] = useState(null);
  const [humSound, setHumSound] = useState(null);
  const [swingSound, setSwingSound] = useState(null);
  const currentAudioSource = useRef(null); // Reference to current playing sound

  const isSwinging = useRef(null);
  const isMouseDown = useRef(false);

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
    const openSpeed = 0.05;
    const closeSpeed = 0.01;

    if (isOpen) {
      bladeRef.current.scale.y = Math.min(
        1,
        bladeRef.current.scale.y + openSpeed
      );
      bladeRef.current.position.y = Math.min(1.5, bladeRef.current.position.y);
    } else {
      bladeRef.current.scale.y = Math.max(
        0,
        bladeRef.current.scale.y - closeSpeed
      );
      bladeRef.current.position.y =
        Math.max(1, bladeRef.current.position.y) - closeSpeed;
    }

    bladeLightRef.current.visible = bladeRef.current.scale.y > 0;

    if (bladeRef.current) {
      bladeRef.current.children[0].material.emissiveIntensity =
        bladeRef.current.scale.y > 0 ? 5.0 : 0.0;
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
      `${process.env.NEXT_PUBLIC_BASE_PATH}/audio/lightsaber-hum.mp3`
    ).then(setHumSound);

    loadAudio(
      `${process.env.NEXT_PUBLIC_BASE_PATH}/audio/lightsaber-swing.mp3`
    ).then(setSwingSound);
  }, []);

  // Audio settings
  useEffect(() => {
    if (!openSound || !humSound || !closeSound) return;

    if (!prevIsOpen.current && isOpen) {
      playAudio(openSound);
      currentAudioSource.current = playAudio(humSound, 0.2, true);
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
    if (!swingSound || !isOpen) return;

    const { pointer } = state; // Normalized mouse position (-1 to 1)

    const currentMousePos = {
      x: pointer.x * window.innerWidth,
      y: pointer.y * window.innerHeight,
    };

    // Calculate movement delta
    const deltaX = Math.abs(currentMousePos.x - previousMousePos.current.x);

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

  return (
    <group position={[0, 0, 0]} rotation={[0.3, 0, 0]}>
      {/* Hilt */}
      <primitive ref={hiltRef} object={hiltModel.scene} />

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

      {/* Blade emissive light */}
      <pointLight
        ref={bladeLightRef}
        position={[0, 1.5, 0]}
        color={bladeColor}
        intensity={50.0}
        decay={3}
      />

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
