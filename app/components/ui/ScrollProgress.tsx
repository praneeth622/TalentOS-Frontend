"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transform-origin-left z-50"
        style={{ scaleX }}
      />
      <motion.div
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xl z-50 cursor-pointer"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: scrollYProgress.get() > 0.1 ? 1 : 0,
          scale: scrollYProgress.get() > 0.1 ? 1 : 0,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <motion.span
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ↑
        </motion.span>
      </motion.div>
    </>
  );
}
