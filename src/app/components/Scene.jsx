"use client";

import { useRef, Suspense, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { Resolution } from "postprocessing";
import {
  OrbitControls,
  Environment,
  MeshReflectorMaterial,
} from "@react-three/drei";
import Lightsaber from "./Lightsaber";
import { loadAudio, playAudio } from "@/utils/audio";

export default function Scene({ bladeColor, hiltStyle, isOn }) {
  const bloomRef = useRef();

  useEffect(() => {
    loadAudio(
      `${process.env.NEXT_PUBLIC_BASE_PATH}/audio/spaceship-ambience.mp3`
    ).then((sound) => {
      //playAudio(sound, 0.5);
    });
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    bloomRef.current.intensity =
      2 +
      0.03 * (Math.sin(49.0 * t) + Math.sin(60.0 * t) + Math.sin(100.0 * t));
  });

  return (
    <>
      <Lightsaber bladeColor={bladeColor} hiltStyle={hiltStyle} isOn={isOn} />

      <Environment
        background={true} // can be true, false or "only" (which only sets the background) (default: false)
        backgroundIntensity={0.8} // optional intensity factor (default: 1, only works with three 0.163 and up)
        environmentIntensity={2} // optional intensity factor (default: 1, only works with three 0.163 and up)
        files={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/environment.jpg`}
      />

      {/* Lighting */}
      <ambientLight intensity={2.0} />

      {/* Camera controls */}
      <OrbitControls
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        target={[0, 1.5, 0]}
      />

      {/* Reflective floor */}
      <mesh rotation={[Math.PI / -2, 0, 0]} position={[0, -0.5, 0]}>
        <circleGeometry args={[1000]} />
        <MeshReflectorMaterial color={0x909090} resolution={1024} mirror={1} />
      </mesh>

      {/* Post-processing */}
      <EffectComposer>
        {/* Controls the bloom for the center part of the blade */}
        <Bloom
          ref={bloomRef}
          intensity={1} // The bloom intensity.
          mipmapBlur={true} // Enables or disables mipmap blur.
          resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
          resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
        />

        <Vignette offset={0.1} darkness={1.0} />

        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  );
}
