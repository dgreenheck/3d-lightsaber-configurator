"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { KernelSize, Resolution } from "postprocessing";
import {
  OrbitControls,
  Environment,
  MeshReflectorMaterial,
} from "@react-three/drei";
import Lightsaber from "./Lightsaber";
import { loadAudio, playAudio } from "../utils/audio";

export default function Scene({ bladeColor, hiltMaterial, isOpen }) {
  const spotlightRef = useRef();

  const [openSound, setOpenSound] = useState(null);

  useEffect(() => {
    loadAudio("/lightsaber-open.mp3").then(setOpenSound);
  }, []);

  const handleOpenSound = () => {
    if (openSound) {
      playAudio(openSound);
    }
  };

  return (
    <div className="w-full md:h-full bg-black">
      <Canvas
        camera={{ position: [0, 2, 7], fov: 50, near: 0.1, far: 1000 }}
        shadows
      >
        <color attach="background" args={["#030303"]} />

        <Suspense fallback={null}>
          <Environment
            background={true} // can be true, false or "only" (which only sets the background) (default: false)
            backgroundBlurriness={0} // optional blur factor between 0 and 1 (default: 0, only works with three 0.146 and up)
            backgroundIntensity={0.1} // optional intensity factor (default: 1, only works with three 0.163 and up)
            environmentIntensity={1} // optional intensity factor (default: 1, only works with three 0.163 and up)
            files={"environment.hdr"}
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
          onOpenSound={handleOpenSound}
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
          <MeshReflectorMaterial
            blur={[0, 0]} // Blur ground reflections (width, height), 0 skips blur
            mixBlur={0} // How much blur mixes with surface roughness (default = 1)
            mixStrength={1} // Strength of the reflections
            mixContrast={1} // Contrast of the reflections
            resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality, slower
            mirror={1} // Mirror environment, 0 = texture colors, 1 = pick up env colors
            depthScale={0} // Scale the depth factor (0 = no depth, default = 0)
            minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
            maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
            depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts
            reflectorOffset={0} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
          />
        </mesh>

        <EffectComposer>
          {/* Controls the bloom for the center part of the blade */}
          <Bloom
            intensity={1} // The bloom intensity.
            luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
            luminanceSmoothing={1} // smoothness of the luminance threshold. Range is [0, 1]
            mipmapBlur={true} // Enables or disables mipmap blur.
            resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
            resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
          />
          {/* Controls the bloom for "aura" or "glow" around the blade */}
          <Bloom
            intensity={1} // The bloom intensity.
            luminanceThreshold={0} // luminance threshold. Raise this value to mask out darker elements in the scene.
            luminanceSmoothing={1} // smoothness of the luminance threshold. Range is [0, 1]
            mipmapBlur={true} // Enables or disables mipmap blur.
            resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
            resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
          />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
