"use client";

import { useState, useRef, useEffect } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import { loadAudio, playAudio } from "../../utils/audio";

extend({ UnrealBloomPass });

export default function Lightsaber({ bladeColor, hiltStyle, isOn }) {
  const hiltModel = useGLTF(hiltStyle.url);

  const bladeRef = useRef();
  const hiltRef = useRef();
  const bladeLightRef = useRef();

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
    const openSpeed = 0.05;
    const closeSpeed = 0.01;

    const scale = bladeRef.current.scale;

    if (isOn) {
      scale.y = Math.min(1, scale.y + openSpeed);
    } else {
      scale.y = Math.max(0, scale.y - closeSpeed);
    }

    bladeLightRef.current.intensity = scale.y * 50;

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

    if (isOn) {
      playAudio(openSound);
      currentAudioSource.current = playAudio(humSound, 0.2, true);
    } else {
      currentAudioSource.current?.stop();
      currentAudioSource.current = null;
      playAudio(closeSound, 1.0, false);
    }
  }, [isOn]);

  // Play swing sound on fast mouse movement
  useFrame(({ pointer }) => {
    if (!swingSound || !isOn || !isMouseDown.current) return;

    const mouseX = pointer.x * window.innerWidth;
    const deltaX = Math.abs(mouseX - previousMousePos.current.x);

    console.log(deltaX);
    if (deltaX > threshold && !isSwinging.current) {
      isSwinging.current = true;
      playAudio(swingSound, 0.3);
      setTimeout(() => (isSwinging.current = false), 300);
    }

    previousMousePos.current.x = mouseX;
  });

  return (
    <group position={[0, 0, 0]} rotation={[0.3, 0, 0]}>
      {/* Hilt */}
      <primitive ref={hiltRef} object={hiltModel.scene} />

      {/* Blade */}
      <group ref={bladeRef} position={[0, 0.95, 0]} scale={[1, 0, 1]}>
        <mesh position={[0, 1.5, 0]}>
          <capsuleGeometry args={[0.05, 3, 32, 32]} />
          <meshStandardMaterial emissive={bladeColor} />
        </mesh>
      </group>

      <pointLight
        ref={bladeLightRef}
        position={[0, 1.2, 0]}
        color={bladeColor}
        intensity={5.0}
      />
    </group>
  );
}
