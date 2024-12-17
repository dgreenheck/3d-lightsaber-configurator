"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Palette, Power } from "lucide-react";
import Scene from "./components/Scene";
import { Canvas } from "@react-three/fiber";

const hiltStyles = [
  {
    name: "Anakin",
    style: "lightsaber1",
    url: `${process.env.NEXT_PUBLIC_BASE_PATH}/models/lightsaber1.glb`,
  },
  {
    name: "Luke",
    style: "lightsaber2",
    url: `${process.env.NEXT_PUBLIC_BASE_PATH}/models/lightsaber2.glb`,
  },
  {
    name: "Yoda",
    style: "lightsaber3",
    url: `${process.env.NEXT_PUBLIC_BASE_PATH}/models/lightsaber3.glb`,
  },
];

const bladeColors = ["#c08080", "#60b060", "#45B7D1", "#c080d0", "#a0a040"];

//https://www.dafont.com/star-jedi.font

export default function App() {
  const [bladeColor, setBladeColor] = useState(bladeColors[0]);
  const [hiltStyle, setHiltStyle] = useState(hiltStyles[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const toggleButton = (button) => {
    setActiveButton(activeButton === button ? null : button);
  };

  return (
    <main className="h-screen relative">
      {/* React Three Fiber scene */}
      <div className="w-full md:h-full bg-black">
        <Canvas
          camera={{ position: [0, 2, 7], fov: 50, near: 0.1, far: 1000 }}
          shadows
        >
          <Scene
            bladeColor={bladeColor}
            hiltStyle={hiltStyle}
            isOpen={isOpen}
          />
        </Canvas>
      </div>

      {/* Buttons at the bottom */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-4">
        <div className="relative">
          <Button
            onClick={() => toggleButton("color")}
            className="bg-blue-900/50 hover:bg-blue-800/50 text-yellow-400 border border-yellow-400 rounded-full transition-all duration-300"
          >
            <Palette className="mr-2" />
            Kyber Crystal
          </Button>
          <AnimatePresence>
            {activeButton === "color" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2"
              >
                <div className="flex flex-col-reverse space-y-2 space-y-reverse">
                  {bladeColors.map((color, index) => (
                    <motion.button
                      key={color}
                      className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100"
                      style={{ backgroundColor: color }}
                      initial={{ scale: 0, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0, y: 20 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.05,
                      }}
                      onClick={() => setBladeColor(color)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <Button
            onClick={() => toggleButton("hiltStyle")}
            className="bg-blue-900/50 hover:bg-blue-800/50 text-yellow-400 border border-yellow-400 rounded-full transition-all duration-300"
          >
            <Palette className="mr-2" />
            Hilt Style
          </Button>
          <AnimatePresence>
            {activeButton === "hiltStyle" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2"
              >
                <div className="flex flex-col-reverse space-y-2 space-y-reverse">
                  {hiltStyles.map((hiltStyle, index) => (
                    <motion.button
                      key={hiltStyle.name}
                      initial={{ scale: 0, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0, y: 20 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.05,
                      }}
                      onClick={() => setHiltStyle(hiltStyle)}
                    >
                      {hiltStyle.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-blue-900/50 hover:bg-blue-800/50 text-yellow-400 border border-yellow-400 rounded-full transition-all duration-300 ${
            isOpen ? "animate-pulse" : ""
          }`}
        >
          <Power className="mr-2" />
          {isOpen ? "Deactivate" : "Activate"}
        </Button>
      </div>
    </main>
  );
}
