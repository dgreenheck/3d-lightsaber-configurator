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
  Box,
} from "@react-three/drei";
import Lightsaber from "./Lightsaber";
import { loadAudio, playAudio } from "@/utils/audio";

export default function Scene({ bladeColor, hiltStyle, isOn }) {
  const bloomRef = useRef();

  // useEffect(() => {
  //   loadAudio(
  //     `${process.env.NEXT_PUBLIC_BASE_PATH}/audio/spaceship-ambience.mp3`
  //   ).then((sound) => {
  //     //playAudio(sound, 0.5);
  //   });
  // });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    bloomRef.current.intensity =
      3 +
      0.05 * (Math.sin(49.0 * t) + Math.sin(60.0 * t) + Math.sin(100.0 * t));
  });

  return (
    <>
      {/* <Box position={[0, 1, 0]}>
        <meshStandardMaterial color="red" />
      </Box> */}

      <Lightsaber bladeColor={bladeColor} hiltStyle={hiltStyle} isOn={isOn} />

      <Environment
        background={true} // can be true, false or "only" (which only sets the background) (default: false)
        backgroundIntensity={0.8} // optional intensity factor (default: 1, only works with three 0.163 and up)
        environmentIntensity={2} // optional intensity factor (default: 1, only works with three 0.163 and up)
        files={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/environment.jpg`}
      />

      {/* Camera controls */}
      <OrbitControls
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        target={[0, 1.5, 0]}
      />

      {/* Reflective floor */}
      <mesh rotation={[Math.PI / -2, 0, 0]} position={[0, -0.5, 0]}>
        <circleGeometry args={[1000]} />
        <MeshReflectorMaterial color={0x505050} resolution={1024} mirror={1} />
      </mesh>

      {/* Post-processing */}
      <EffectComposer>
        {/* Controls the bloom for the center part of the blade */}
        <Bloom
          ref={bloomRef}
          // intensity={2} this is set dynamically in useFrame() above
          mipmapBlur={true}
          resolutionX={Resolution.AUTO_SIZE}
          resolutionY={Resolution.AUTO_SIZE}
        />

        <Vignette offset={0.05} darkness={0.7} />

        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  );
}
