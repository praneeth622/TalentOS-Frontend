"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, Shield, Users } from "lucide-react";

const bullets = [
  {
    icon: Brain,
    text: "AI productivity scoring",
    sub: "Gemini-powered insights for every team member",
  },
  {
    icon: Shield,
    text: "On-chain task verification",
    sub: "Immutable proof of work on Polygon",
  },
  {
    icon: Users,
    text: "Team skill intelligence",
    sub: "Identify gaps and grow your workforce",
  },
];

/**
 * Shared left-panel for auth pages — gradient mesh background with
 * TalentOS branding and feature bullet list.
 */
export function AuthLeft() {
  return (
    <div className="relative flex flex-col justify-center px-12 py-16 overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-indigo-700 to-purple-800" />

      {/* Animated mesh orbs */}
      <motion.div
        className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/5 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-purple-400/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-blue-300/10 blur-2xl"
        animate={{ y: [0, -30, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            Talent<span className="text-blue-200">OS</span>
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-[1.15] mb-3">
            AI-native workforce
            <br />
            <span className="text-blue-200">intelligence platform</span>
          </h2>
          <p className="text-blue-100/80 text-base leading-relaxed">
            The modern platform where AI meets human potential.
          </p>
        </motion.div>

        {/* Bullets */}
        <div className="space-y-5">
          {bullets.map((b, i) => (
            <motion.div
              key={b.text}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shrink-0 mt-0.5">
                <b.icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{b.text}</p>
                <p className="text-blue-100/70 text-xs mt-0.5 leading-relaxed">{b.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom badge */}
        <motion.div
          className="mt-14 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/80 text-xs font-medium">
            Trusted by 500+ organisations worldwide
          </span>
        </motion.div>
      </div>
    </div>
  );
}
