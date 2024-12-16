"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Palette, Wrench, Power } from "lucide-react";
import Scene from "./Scene";

const hiltMaterials = [
  { name: "Durasteel", value: "metal", color: "#8c8c8c" },
  { name: "Plastoid", value: "plastic", color: "#2c2c2c" },
  { name: "Brylark", value: "wood", color: "#8B4513" },
];

const bladeColors = ["#c08080", "#60b060", "#45B7D1", "#c080d0", "#a0a040"];

//https://www.dafont.com/star-jedi.font

export default function LightsaberConfigurator() {
  const [bladeColor, setBladeColor] = useState(bladeColors[0]);
  const [hiltMaterial, setHiltMaterial] = useState("metal");
  const [isOpen, setIsOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const toggleButton = (button) => {
    setActiveButton(activeButton === button ? null : button);
  };

  return (
    <main className="h-screen relative">
      {/* React Three Fiber scene */}
      <Scene
        bladeColor={bladeColor}
        hiltMaterial={hiltMaterial}
        isOpen={isOpen}
      />

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
            onClick={() => toggleButton("hilt")}
            className="bg-blue-900/50 hover:bg-blue-800/50 text-yellow-400 border border-yellow-400 rounded-full transition-all duration-300"
          >
            <Wrench className="mr-2" />
            Hilt Material
          </Button>
          <AnimatePresence>
            {activeButton === "hilt" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: -60 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute left-1/2 transform -translate-x-1/2 flex space-x-2"
              >
                {hiltMaterials.map((material) => (
                  <motion.button
                    key={material.value}
                    onClick={() => setHiltMaterial(material.value)}
                    className="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    style={{ backgroundColor: material.color }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
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
