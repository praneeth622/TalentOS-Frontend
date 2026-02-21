"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "../ui/AnimatedSection";

const dots = [
  { x: 18, y: 30, label: "San Francisco", delay: 0 },
  { x: 25, y: 25, label: "New York", delay: 0.2 },
  { x: 47, y: 28, label: "London", delay: 0.4 },
  { x: 52, y: 25, label: "Berlin", delay: 0.6 },
  { x: 57, y: 32, label: "Dubai", delay: 0.8 },
  { x: 68, y: 30, label: "Mumbai", delay: 1.0 },
  { x: 78, y: 28, label: "Singapore", delay: 1.2 },
  { x: 85, y: 38, label: "Sydney", delay: 1.4 },
  { x: 35, y: 45, label: "São Paulo", delay: 0.5 },
  { x: 50, y: 42, label: "Lagos", delay: 0.7 },
  { x: 72, y: 24, label: "Tokyo", delay: 1.1 },
  { x: 45, y: 22, label: "Paris", delay: 0.3 },
];

export function GlobalReach() {
  return (
    <section className="py-24 bg-slate-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-3 block">
            Global Presence
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Trusted by Teams
            <br />
            <span className="text-blue-600">Around the World</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            From startups to enterprises, organizations across the globe rely
            on TalentOS for smarter workforce management.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="relative max-w-4xl mx-auto">
            {/* Map container */}
            <div className="relative aspect-[2/1] bg-white rounded-3xl border border-slate-100 overflow-hidden p-8">
              {/* Simplified world map using SVG */}
              <svg
                viewBox="0 0 100 50"
                className="w-full h-full"
                fill="none"
              >
                {/* Simplified continent outlines */}
                {/* North America */}
                <path
                  d="M10,15 Q15,10 22,12 Q28,14 30,18 Q28,22 25,28 Q22,32 18,30 Q12,28 10,22 Z"
                  fill="currentColor"
                  className="text-slate-100"
                />
                {/* South America */}
                <path
                  d="M25,32 Q30,30 33,35 Q36,42 34,48 Q30,50 27,47 Q24,42 25,37 Z"
                  fill="currentColor"
                  className="text-slate-100"
                />
                {/* Europe */}
                <path
                  d="M44,12 Q48,10 52,12 Q55,15 54,20 Q50,22 46,20 Q43,17 44,14 Z"
                  fill="currentColor"
                  className="text-slate-100"
                />
                {/* Africa */}
                <path
                  d="M46,22 Q50,20 54,22 Q56,28 55,35 Q52,42 48,40 Q44,36 45,28 Z"
                  fill="currentColor"
                  className="text-slate-100"
                />
                {/* Asia */}
                <path
                  d="M55,10 Q65,8 75,12 Q82,16 80,22 Q75,28 68,30 Q60,28 56,22 Q54,16 55,12 Z"
                  fill="currentColor"
                  className="text-slate-100"
                />
                {/* Australia */}
                <path
                  d="M78,34 Q84,32 88,35 Q90,38 88,42 Q84,44 80,42 Q77,39 78,36 Z"
                  fill="currentColor"
                  className="text-slate-100"
                />
              </svg>

              {/* Animated location dots */}
              {dots.map((dot) => (
                <motion.div
                  key={dot.label}
                  className="absolute group cursor-pointer"
                  style={{
                    left: `${dot.x}%`,
                    top: `${dot.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: dot.delay + 0.5,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 w-4 h-4 -m-1 rounded-full bg-blue-400/20"
                    animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: dot.delay,
                    }}
                  />
                  {/* Dot */}
                  <div className="w-2 h-2 rounded-full bg-blue-600 relative z-10" />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {dot.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
