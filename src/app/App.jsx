"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Palette, Power, WandSparkles } from "lucide-react";
import Scene from "./components/Scene";
import { Canvas } from "@react-three/fiber";

const hiltStyles = [
  {
    name: "Type A",
    url: `${process.env.NEXT_PUBLIC_BASE_PATH}/models/lightsaber1.glb`,
  },
  {
    name: "Type B",
    url: `${process.env.NEXT_PUBLIC_BASE_PATH}/models/lightsaber2.glb`,
  },
  {
    name: "Type C",
    url: `${process.env.NEXT_PUBLIC_BASE_PATH}/models/lightsaber3.glb`,
  },
];

const bladeColors = ["#c08080", "#60b060", "#45B7D1", "#c080d0", "#a0a040"];

//https://www.dafont.com/star-jedi.font

export default function App() {
  const [bladeColor, setBladeColor] = useState(bladeColors[0]);
  const [hiltStyle, setHiltStyle] = useState(hiltStyles[0]);
  const [isOn, setIsOn] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const toggleButton = (button) => {
    setActiveButton(activeButton === button ? null : button);
  };

  return (
    <main className="h-screen relative">
      {/* React Three Fiber scene */}
      <div className="w-full md:h-full bg-black">
        <Canvas camera={{ position: [0, 2, 5] }}>
          <color attach="background" args={["#003050"]} />
          <Scene bladeColor={bladeColor} hiltStyle={hiltStyle} isOn={isOn} />
        </Canvas>
      </div>

      {/* Buttons at the bottom */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-6 z-30">
        {/* Power button */}
        <Button
          onClick={() => setIsOn(!isOn)}
          className={`bg-blue-900/30 hover:bg-blue-800/30 text-cyan-300 border border-cyan-400 rounded-full transition-all duration-300 backdrop-blur-md w-16 h-16 ${
            isOn ? "animate-pulse" : ""
          }`}
        >
          <Power />
        </Button>

        {/* Blade Color */}
        <div className="relative group">
          <Button
            onClick={() => toggleButton("color")}
            className="bg-blue-900/30 hover:bg-blue-800/30 text-cyan-300 border border-cyan-400 rounded-full transition-all duration-300 backdrop-blur-md w-16 h-16"
          >
            <Palette className="w-12 h-12" />
          </Button>

          <AnimatePresence>
            {activeButton === "color" && (
              <motion.div
                initial={{ opacity: 0, x: -140, y: 20 }}
                animate={{ opacity: 1, x: -140, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2"
              >
                <div className="flex flex-row space-x-4 p-2 rounded-lg">
                  {bladeColors.map((color, index) => (
                    <motion.button
                      key={color}
                      className="w-10 h-10 rounded-full border-cyan-400 hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-100"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}`,
                      }}
                      initial={{ scale: 0, y: 30 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0, y: 30 }}
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

        {/* Hilt Style */}
        <div className="relative group">
          <Button
            onClick={() => toggleButton("hiltStyle")}
            className="bg-blue-900/30 hover:bg-blue-800/30 text-cyan-300 border border-cyan-400 rounded-full transition-all duration-300 backdrop-blur-md w-16 h-16"
          >
            <WandSparkles className="w-12 h-12" />
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
                <div className="flex flex-row space-x-4 rounded-lg">
                  {hiltStyles.map((style, index) => (
                    <motion.button
                      key={style.name}
                      className="w-32 px-4 py-2 rounded-full bg-blue-800/50 text-cyan-300 border-cyan-400 border hover:bg-blue-700/50 transition-colors duration-200"
                      initial={{ scale: 0, x: -295, y: 30 }}
                      animate={{ scale: 1, x: -295, y: 0 }}
                      exit={{ scale: 0, y: 30 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.05,
                      }}
                      onClick={() => setHiltStyle(style)}
                    >
                      {style.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
