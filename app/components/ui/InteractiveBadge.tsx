"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface InteractiveBadgeProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function InteractiveBadge({
  children,
  className = "",
  icon,
}: InteractiveBadgeProps) {
  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {icon && (
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          {icon}
        </motion.div>
      )}
      {children}
    </motion.div>
  );
}
