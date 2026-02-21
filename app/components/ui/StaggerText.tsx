"use client";

import { motion } from "framer-motion";

interface StaggerTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function StaggerText({
  text,
  className = "",
  delay = 0,
  as: Component = "span",
}: StaggerTextProps) {
  const letters = text.split("");

  return (
    <Component className={className}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: [0.25, 0.4, 0.25, 1],
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </Component>
  );
}
