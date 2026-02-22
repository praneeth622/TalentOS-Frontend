"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScrollStack, ScrollStackItem } from "@/app/components/ui/ScrollStack";
import { ScrollReveal } from "../ui/ScrollReveal";
import {
  Brain,
  BarChart3,
  Shield,
  Zap,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    id: "ai",
    icon: Brain,
    title: "AI-Powered Analytics",
    description:
      "Get deep insights into team performance, productivity patterns, and skill development with our advanced AI engine.",
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-200",
    bgTint: "bg-blue-50/60",
    mockup: AiMockup,
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Real-Time Dashboard",
    description:
      "Monitor everything that matters in one place. Live updates, customizable views, and instant notifications.",
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-200",
    bgTint: "bg-purple-50/60",
    mockup: AnalyticsMockup,
  },
  {
    id: "blockchain",
    icon: Shield,
    title: "Blockchain Verification",
    description:
      "Every achievement is cryptographically signed and stored on-chain. Immutable proof of work that matters.",
    color: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-200",
    bgTint: "bg-emerald-50/60",
    mockup: BlockchainMockup,
  },
  {
    id: "automation",
    icon: Zap,
    title: "Smart Automation",
    description:
      "Automate repetitive tasks, notifications, and reports. Let AI handle the busywork while you focus on people.",
    color: "from-amber-500 to-orange-500",
    borderColor: "border-amber-200",
    bgTint: "bg-amber-50/60",
    mockup: AutomationMockup,
  },
];

export function FeatureShowcase() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Section Header */}
      <div className="pt-24 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center">
            <span className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-3 block">
              Platform Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Experience the Power of
              <br />
              <span className="text-blue-600">Modern Workforce Intelligence</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Each feature is designed to give your team an unfair advantage
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Scroll-stacking feature cards */}
      <ScrollStack useWindowScroll itemDistance={120} itemStackDistance={24}>
        {features.map((feature) => (
          <ScrollStackItem key={feature.id}>
            <FeatureCard feature={feature} />
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}

/* ── Feature Card ─────────────────────────────────────────────────── */

function FeatureCard({
  feature,
}: {
  feature: (typeof features)[number];
}) {
  const Mockup = feature.mockup;

  return (
    <div
      className={`rounded-3xl border-2 ${feature.borderColor} ${feature.bgTint} shadow-2xl overflow-hidden`}
    >
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Left: info */}
        <div className="p-10 lg:p-14 flex flex-col justify-center">
          <motion.div
            className={`w-14 h-14 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <feature.icon size={28} />
          </motion.div>

          <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
            {feature.title}
          </h3>
          <p className="text-slate-600 leading-relaxed text-lg mb-6">
            {feature.description}
          </p>

          <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
            <CheckCircle2 size={18} />
            <span>Enterprise-ready &amp; Secure</span>
          </div>
        </div>

        {/* Right: mockup */}
        <div className="bg-white/50 p-6 lg:p-10 flex items-center justify-center">
          <Mockup />
        </div>
      </div>
    </div>
  );
}

/* ── Mockups ──────────────────────────────────────────────────────── */

function AiMockup() {
  const items = [
    { label: "Team Productivity", value: "87%", trend: "+12%" },
    { label: "AI Recommendations", value: "24", trend: "Active" },
    { label: "Skill Gaps Identified", value: "8", trend: "Critical" },
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg w-full max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-red-400" />
        <div className="w-2 h-2 rounded-full bg-yellow-400" />
        <div className="w-2 h-2 rounded-full bg-green-400" />
        <div className="ml-3 text-xs text-slate-400 font-medium">
          AI Analytics Dashboard
        </div>
      </div>

      <div className="space-y-3 mb-5">
        {items.map((item, idx) => (
          <motion.div
            key={item.label}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 + 0.2 }}
          >
            <div>
              <div className="text-xs text-slate-500 mb-1">{item.label}</div>
              <div className="text-xl font-bold text-slate-900">
                {item.value}
              </div>
            </div>
            <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              {item.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex items-center justify-center"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Brain className="text-blue-500" size={44} />
      </motion.div>
    </motion.div>
  );
}

function AnalyticsMockup() {
  const bars = [
    { label: "Week 1", value: 65, color: "bg-blue-500" },
    { label: "Week 2", value: 78, color: "bg-purple-500" },
    { label: "Week 3", value: 85, color: "bg-emerald-500" },
    { label: "Week 4", value: 92, color: "bg-amber-500" },
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg w-full max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm font-medium text-slate-900">Live Dashboard</div>
        <div className="flex items-center gap-1">
          <motion.div
            className="w-2 h-2 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-slate-500">Live</span>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        {bars.map((bar, idx) => (
          <motion.div
            key={bar.label}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 + 0.2 }}
          >
            <div className="text-xs text-slate-500 w-12">{bar.label}</div>
            <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
              <motion.div
                className={`h-full ${bar.color} rounded-lg`}
                initial={{ width: 0 }}
                whileInView={{ width: `${bar.value}%` }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 + 0.4, duration: 0.8 }}
              />
            </div>
            <div className="text-sm font-bold text-slate-900 w-8">
              {bar.value}
            </div>
          </motion.div>
        ))}
      </div>

      <BarChart3 className="text-emerald-500 mx-auto" size={44} />
    </motion.div>
  );
}

function BlockchainMockup() {
  return (
    <motion.div
      className="bg-linear-to-br from-purple-900 to-slate-900 rounded-2xl p-6 border border-purple-500/20 shadow-lg text-white w-full max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-sm font-medium mb-5 flex items-center gap-2">
        <Shield className="text-purple-400" size={20} />
        <span>On-Chain Verification</span>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-purple-300">Transaction Hash</div>
          <div className="text-xs text-green-400 font-medium">Verified ✓</div>
        </div>
        <div className="text-sm font-mono text-purple-200 mb-4 break-all">
          0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-purple-300">Block: 47293847</span>
          <span className="text-purple-300">Polygon</span>
        </div>
      </div>

      <motion.div
        className="bg-white/5 rounded-xl p-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-sm font-medium mb-2">Task Completed</div>
        <div className="text-xs text-purple-300">
          &quot;Implement user authentication system&quot;
        </div>
        <div className="flex items-center gap-2 mt-3">
          <motion.div
            className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div className="text-xs text-purple-200">
            Cryptographically signed by employee wallet
          </div>
        </div>
      </motion.div>

      <motion.div
        className="mt-5 flex justify-center"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-purple-400 font-bold">⬡ Polygon</div>
      </motion.div>
    </motion.div>
  );
}

function AutomationMockup() {
  const rules = [
    { trigger: "Task overdue", action: "Send reminder", status: "Active" },
    {
      trigger: "Milestone reached",
      action: "Create celebration",
      status: "Active",
    },
    {
      trigger: "Low productivity",
      action: "AI intervention",
      status: "Active",
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg w-full max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Zap className="text-amber-500" size={20} />
        <div className="text-sm font-medium text-slate-900">
          Automation Rules
        </div>
      </div>

      <div className="space-y-4">
        {rules.map((rule, idx) => (
          <motion.div
            key={rule.trigger}
            className="bg-slate-50 rounded-xl p-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 + 0.2 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-lg bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: idx * 0.5,
                }}
              >
                <Zap size={18} />
              </motion.div>
              <div className="flex-1">
                <div className="text-xs text-slate-900 font-medium mb-1">
                  {rule.trigger} → {rule.action}
                </div>
                <div className="text-xs text-green-600 font-medium">
                  {rule.status}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-5 flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-amber-500"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
