"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function MouseFollower() {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const hideCursor = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseleave", hideCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseleave", hideCursor);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed w-3 h-3 rounded-full bg-blue-600 pointer-events-none z-50 mix-blend-difference"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: -6,
          y: -6,
        }}
        animate={{
          scale: isVisible ? 1 : 0,
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed w-8 h-8 rounded-full border-2 border-blue-400/50 pointer-events-none z-50"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: -16,
          y: -16,
        }}
        animate={{
          scale: isVisible ? 1 : 0,
          opacity: isVisible ? 0.5 : 0,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      />
    </>
  );
}
