"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, Send } from "lucide-react";
import { AnimatedSection } from "../ui/AnimatedSection";
import { MagneticButton } from "../ui/MagneticButton";

export function CTA() {
  return (
    <section id="contact" className="py-24 bg-slate-50/50 relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-100/30"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-indigo-100/30"
        animate={{
          scale: [1, 1.15, 1],
          y: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <AnimatedSection>
          <div className="bg-slate-900 rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <motion.div
                className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Mail size={14} className="text-blue-400" />
                <span className="text-sm text-slate-300">Get In Touch</span>
              </motion.div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to Transform
                <br />
                Your Workforce?
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto mb-8 text-lg">
                Join hundreds of organizations already using AI to unlock
                their team's full potential.
              </p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative flex-1 w-full">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-white/10 border border-white/10 rounded-full px-5 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                  />
                </div>
                <MagneticButton className="bg-blue-600 text-white px-6 py-3.5 rounded-full text-sm font-medium hover:bg-blue-500 transition-colors flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center">
                  Get Started
                  <Send size={14} />
                </MagneticButton>
              </motion.div>

              <p className="text-xs text-slate-500 mt-4">
                Free 14-day trial. No credit card required.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
