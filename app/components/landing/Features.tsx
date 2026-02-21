"use client";

import { motion } from "framer-motion";
import {
  Brain,
  BarChart3,
  Shield,
  Zap,
  Users,
  TrendingUp,
} from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "../ui/AnimatedSection";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Get intelligent productivity analysis and actionable recommendations for every team member powered by Gemini AI.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Track task completion rates, deadline adherence, and priority scores with a live dashboard that updates in real time.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Shield,
    title: "Web3 Verification",
    description:
      "Cryptographically verify task completions on Polygon with wallet signatures — transparent and tamper-proof.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Zap,
    title: "Smart Task Management",
    description:
      "Assign, track, and manage tasks with intelligent priority scoring that adapts to your team's workflow patterns.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Manage your entire workforce from a single dashboard with role-based access and organization-scoped data.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: TrendingUp,
    title: "Skill Gap Analysis",
    description:
      "Identify skill gaps across your organization and get AI-generated recommendations for training and development.",
    color: "bg-indigo-50 text-indigo-600",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-slate-50/50 relative">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
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
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                className="group bg-white rounded-2xl p-7 border border-slate-100 hover:border-slate-200 transition-all duration-300 h-full"
                whileHover={{
                  y: -4,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}
                >
                  <feature.icon size={22} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
