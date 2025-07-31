import React from "react";
import { motion } from "framer-motion";

const images = [
  "./character-pics/CaseoH.png",
  "./character-pics/morty.png",
  "./character-pics/Peter.png",
  "./character-pics/rick.png",
  "./character-pics/Ronaldo.png",
  "./character-pics/speed.png",
  "./character-pics/Spongebob.png",
  "./character-pics/stewie.png"
];

const AnimatedCarousel = () => {
  const radiusX = 400; // Horizontal orbit radius
  const radiusY = 200; // Vertical orbit radius

  return (
    <div className="w-full h-[600px] relative flex items-center justify-center overflow-hidden">
      {/* Central Title (the "Sun") */}
      <motion.h1
        className="text-white text-7xl md:text-9xl font-extrabold z-30"
        initial={{ scale: 0.95 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        StudyBuddy
      </motion.h1>

      {/* Orbiting Characters */}
      {images.map((src, index) => {
        const total = images.length;
        const angle = (360 / total) * index;
        const rad = (angle * Math.PI) / 180;

        return (
          <motion.img
            key={index}
            src={src}
            alt={`orbiting-character-${index}`}
            className="absolute w-24 h-24 md:w-32 md:h-32 object-contain z-20 pointer-events-none"
            style={{
              top: `calc(50% + ${radiusY * Math.sin(rad)}px - 64px)`,
              left: `calc(50% + ${radiusX * Math.cos(rad)}px - 64px)`
            }}
            animate={{
              rotate: 360
            }}
            transition={{
              repeat: Infinity,
              duration: 30, // slower = more majestic
              ease: "linear"
            }}
          />
        );
      })}
    </div>
  );
};

export default AnimatedCarousel;
