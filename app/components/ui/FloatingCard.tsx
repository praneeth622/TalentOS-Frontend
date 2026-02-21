"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FloatingCard({
  children,
  className = "",
  delay = 0,
}: FloatingCardProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{
        y: -8,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.3 },
      }}
    >
      {children}
    </motion.div>
  );
}
