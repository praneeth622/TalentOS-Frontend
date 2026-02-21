"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { MagneticButton } from "../ui/MagneticButton";
import { TextReveal } from "../ui/TextReveal";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-100/50"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-100/40"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 w-[300px] h-[300px] rounded-full bg-purple-100/30"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center pt-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8"
        >
          <Sparkles size={14} className="text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">AI-Powered Workforce Intelligence</span>
        </motion.div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
          <TextReveal text="Empower Your Team" />
          <br />
          <TextReveal text="With" delay={0.3} />
          <span className="inline-block">
            <TextReveal text=" Smart" delay={0.4} />
            <motion.span
              className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              {" "}
              AI Tools
            </motion.span>
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Track performance, get AI-driven insights, and verify achievements on-chain.
          The modern platform for workforce intelligence.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <MagneticButton className="group bg-slate-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/20">
            Start Free Trial
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </MagneticButton>

          <MagneticButton className="group flex items-center gap-2 px-6 py-4 text-base text-slate-600 hover:text-slate-900 transition-colors">
            <span className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <Play size={14} className="ml-0.5" />
            </span>
            Watch Demo
          </MagneticButton>
        </motion.div>

        {/* Floating dashboard preview */}
        <motion.div
          className="mt-16 relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-200/60 p-1 overflow-hidden">
            <div className="bg-slate-50 rounded-xl p-6 sm:p-8">
              {/* Mock dashboard */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-4 h-6 bg-slate-200 rounded-md w-60" />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Team Score", value: "87", color: "bg-blue-500" },
                  { label: "Tasks Done", value: "156", color: "bg-green-500" },
                  { label: "AI Insights", value: "24", color: "bg-purple-500" },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    className="bg-white rounded-lg p-4 border border-slate-100"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 + Math.random() * 0.3 }}
                  >
                    <div className="text-xs text-slate-400 mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className={`h-1.5 ${stat.color} rounded-full mt-2 w-3/4`} />
                  </motion.div>
                ))}
              </div>
              <div className="space-y-2">
                {[85, 65, 92, 70].map((width, i) => (
                  <motion.div
                    key={i}
                    className="h-3 bg-slate-200 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 + i * 0.1 }}
                  >
                    <motion.div
                      className="h-full bg-blue-400/60 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ delay: 2.2 + i * 0.1, duration: 0.8 }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-100/40 via-purple-100/40 to-indigo-100/40 rounded-3xl -z-10 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
