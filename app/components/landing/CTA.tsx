"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Mail, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { AnimatedSection } from "../ui/AnimatedSection";
import { MagneticButton } from "../ui/MagneticButton";
import { useEffect, useRef, useState } from "react";

export function CTA() {
  const [email, setEmail] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="contact"
      className="py-24 bg-slate-50/50 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background decoration */}
      <motion.div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 40, 0],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          y: [0, -30, 0],
          rotate: [0, -90, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <AnimatedSection>
          <div
            ref={containerRef}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden group"
          >
            {/* Animated grid background */}
            <motion.div
              className="absolute inset-0 opacity-5"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Mouse-follow gradient */}
            <motion.div
              className="absolute w-96 h-96 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
                left: mousePosition.x - 192,
                top: mousePosition.y - 192,
              }}
            />

            {/* Top glow */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/15 to-transparent rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative z-10">
              <motion.div
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/10"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={14} className="text-blue-400" />
                </motion.div>
                <span className="text-sm text-slate-300 font-medium">
                  Start Your Free Trial
                </span>
              </motion.div>

              <motion.h2
                className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Ready to Transform
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Your Workforce?
                </span>
              </motion.h2>

              <motion.p
                className="text-slate-400 max-w-2xl mx-auto mb-8 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Join 500+ organizations already using AI to unlock their team's
                full potential. Get started in minutes, no credit card required.
              </motion.p>

              {/* Trust indicators */}
              <motion.div
                className="flex items-center justify-center gap-6 mb-10 flex-wrap"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                {[
                  "14-day free trial",
                  "No credit card",
                  "Cancel anytime",
                  "24/7 support",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <CheckCircle2 size={16} className="text-green-400" />
                    <span className="text-sm text-slate-400">{item}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="relative flex-1 w-full"
                  whileFocus={{ scale: 1.02 }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email"
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/30 transition-all text-sm"
                  />
                  <motion.div
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    animate={{ opacity: email.length > 0 ? 1 : 0 }}
                  >
                    <CheckCircle2 size={18} className="text-green-400" />
                  </motion.div>
                </motion.div>

                <MagneticButton className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-sm font-semibold hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 group">
                  Start Free Trial
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={16} />
                  </motion.div>
                </MagneticButton>
              </motion.div>

              <motion.p
                className="text-xs text-slate-500 mt-6 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <Sparkles size={12} className="text-blue-400" />
                14-day free trial • No credit card required • Cancel anytime
              </motion.p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
