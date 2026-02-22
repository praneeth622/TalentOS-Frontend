"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface GlowButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export function GlowButton({
  children,
  className = "",
  onClick,
  variant = "primary",
}: GlowButtonProps) {
  const variants = {
    primary: {
      bg: "bg-gradient-to-r from-blue-600 to-purple-600",
      glow: "shadow-blue-600/50",
      hover: "shadow-blue-600/70",
    },
    secondary: {
      bg: "bg-slate-900",
      glow: "shadow-slate-900/30",
      hover: "shadow-slate-900/50",
    },
  };

  const style = variants[variant];

  return (
    <motion.button
      className={`relative ${style.bg} text-white px-6 py-3 rounded-full font-medium overflow-hidden group ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05, boxShadow: `0 20px 60px ${style.hover}` }}
      whileTap={{ scale: 0.95 }}
      initial={{ boxShadow: `0 10px 40px ${style.glow}` }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
        style={{ transform: "skewX(-20deg)" }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>

      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
