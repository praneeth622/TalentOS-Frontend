"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  Brain,
  BarChart3,
  Shield,
  Zap,
  Users,
  TrendingUp,
} from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "../ui/AnimatedSection";
import { HoverCard } from "../ui/HoverCard";
import { useRef } from "react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Get intelligent productivity analysis and actionable recommendations for every team member powered by Gemini AI. Understand patterns, predict bottlenecks, and make data-driven decisions.",
    color: "bg-blue-50 text-blue-600",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Track task completion rates, deadline adherence, and priority scores with a live dashboard that updates in real time. See trends as they happen, not days later.",
    color: "bg-emerald-50 text-emerald-600",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Shield,
    title: "Web3 Verification",
    description:
      "Cryptographically verify task completions on Polygon with wallet signatures — transparent and tamper-proof. Build immutable proof of work that travels with your team.",
    color: "bg-purple-50 text-purple-600",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Smart Task Management",
    description:
      "Assign, track, and manage tasks with intelligent priority scoring that adapts to your team's workflow patterns. AI automatically surfaces what matters most.",
    color: "bg-amber-50 text-amber-600",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Manage your entire workforce from a single dashboard with role-based access and organization-scoped data. Everyone sees exactly what they need to succeed.",
    color: "bg-rose-50 text-rose-600",
    gradient: "from-rose-500 to-red-500",
  },
  {
    icon: TrendingUp,
    title: "Skill Gap Analysis",
    description:
      "Identify skill gaps across your organization and get AI-generated recommendations for training and development. Turn weaknesses into opportunities.",
    color: "bg-indigo-50 text-indigo-600",
    gradient: "from-indigo-500 to-violet-500",
  },
];

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section id="features" className="py-24 bg-slate-50/50 relative overflow-hidden">
      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          y,
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 rounded-full bg-blue-200/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-purple-200/20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div ref={containerRef} className="max-w-7xl mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <span className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-3 block">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Everything You Need to
            <br />
            <span className="text-blue-600">Manage Talent</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            A comprehensive suite of tools designed to help you understand,
            manage, and grow your workforce with AI intelligence.
          </p>
        </AnimatedSection>

        <StaggerContainer
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          staggerDelay={0.08}
        >
          {features.map((feature, i) => (
            <StaggerItem key={feature.title}>
              <HoverCard
                className="group bg-white rounded-2xl p-7 border border-slate-100 hover:border-slate-200 transition-all duration-300 h-full relative overflow-hidden"
                intensity={8}
              >
                {/* Gradient glow on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                <motion.div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5 relative z-10`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <feature.icon size={22} />
                </motion.div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed relative z-10">
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                />
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

