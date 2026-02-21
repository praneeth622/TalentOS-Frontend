"use client";

import { motion } from "framer-motion";

interface AnimatedGridProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function AnimatedGrid({
  rows = 10,
  cols = 10,
  className = "",
}: AnimatedGridProps) {
  const cells = Array.from({ length: rows * cols }, (_, i) => i);

  return (
    <div
      className={`grid gap-1 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {cells.map((i) => (
        <motion.div
          key={i}
          className="aspect-square bg-slate-100 rounded-sm"
          initial={{ opacity: 0.1 }}
          whileInView={{ opacity: [0.1, 0.6, 0.1] }}
          viewport={{ once: false }}
          transition={{
            duration: 2,
            delay: (i % cols) * 0.05 + Math.floor(i / cols) * 0.05,
            repeat: Infinity,
            repeatDelay: 3,
          }}
          whileHover={{
            backgroundColor: "#3b82f6",
            opacity: 1,
            scale: 1.2,
          }}
        />
      ))}
    </div>
  );
}
