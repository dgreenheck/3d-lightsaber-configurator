"use client";

import { useRef, Suspense } from "react";
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

export default function Scene({ bladeColor, hiltMaterial, isOpen }) {
  const spotlightRef = useRef();
  const bloomRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    bloomRef.current.intensity =
      1.5 +
      0.1 * (Math.sin(49.0 * t) + Math.sin(60.0 * t) + Math.sin(100.0 * t));
  });

  return (
    <>
      <Suspense fallback={null}>
        <Environment
          background={true} // can be true, false or "only" (which only sets the background) (default: false)
          backgroundIntensity={0.2} // optional intensity factor (default: 1, only works with three 0.163 and up)
          environmentIntensity={1} // optional intensity factor (default: 1, only works with three 0.163 and up)
          files={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/environment.jpg`}
          // Ensure the environment is on the default layer
          onLoad={(env) => env.scene.layers.set(0)}
        />
      </Suspense>

      <ambientLight intensity={0.2} />

      <spotLight
        ref={spotlightRef}
        intensity={30.0}
        position={[0, 5, 0]}
        distance={10}
        angle={1.5}
        decay={2.1}
        penumbra={1.0}
        castShadow
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
        shadow-camera-near={0.1}
        shadow-camera-far={15}
      />

      <Lightsaber
        bladeColor={bladeColor}
        hiltMaterial={hiltMaterial}
        isOpen={isOpen}
      />

      <OrbitControls
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        target={[0, 1.5, 0]}
      />

      <mesh
        rotation={[Math.PI / -2, 0, 0]}
        position={[0, -0.5, 0]}
        scale={[1000, 1000, 1000]}
      >
        <planeGeometry />
        <MeshReflectorMaterial resolution={1024} mirror={1} />
      </mesh>

      <EffectComposer>
        {/* Controls the bloom for the center part of the blade */}
        <Bloom
          intensity={2} // The bloom intensity.
          luminanceThreshold={0.5} // luminance threshold. Raise this value to mask out darker elements in the scene.
          mipmapBlur={true} // Enables or disables mipmap blur.
          resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
          resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
        />
        {/* Controls the bloom for "aura" or "glow" around the blade */}
        <Bloom
          ref={bloomRef}
          intensity={1.5} // The bloom intensity.
          luminanceThreshold={0.5} // luminance threshold. Raise this value to mask out darker elements in the scene.
          mipmapBlur={true} // Enables or disables mipmap blur.
          resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
          resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
        />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={0.9} />
      </EffectComposer>
    </>
  );
}
