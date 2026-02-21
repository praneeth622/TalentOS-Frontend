"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl"
        animate={{
          scale: [1, 1.5, 1],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-200/20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 w-[600px] h-[600px] rounded-full bg-indigo-200/20 blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          x: [0, 50, 0],
          y: [0, -70, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
