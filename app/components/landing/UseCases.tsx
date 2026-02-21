"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal } from "../ui/ScrollReveal";
import { HoverCard } from "../ui/HoverCard";
import { useRef } from "react";
import {
  Building2,
  Rocket,
  Users,
  Code,
  Briefcase,
  GraduationCap,
} from "lucide-react";

const useCases = [
  {
    icon: Rocket,
    title: "Startups",
    description:
      "Move fast without losing sight of who's doing what. Scale your team with confidence.",
    metrics: "2-10 people",
    color: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Building2,
    title: "Growing Companies",
    description:
      "Structure your workforce as you scale. Maintain culture and productivity through rapid growth.",
    metrics: "10-100 people",
    color: "from-purple-500 to-pink-500",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Briefcase,
    title: "Enterprises",
    description:
      "Gain visibility across departments. Make data-driven decisions about your most valuable asset.",
    metrics: "100+ people",
    color: "from-emerald-500 to-teal-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Code,
    title: "Tech Teams",
    description:
      "Track sprint velocity, code contributions, and developer productivity with AI-powered insights.",
    metrics: "Engineering focused",
    color: "from-orange-500 to-red-500",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: Users,
    title: "Remote Teams",
    description:
      "Manage distributed workforces with ease. Stay connected and aligned no matter where your team works.",
    metrics: "Global workforce",
    color: "from-indigo-500 to-violet-500",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    icon: GraduationCap,
    title: "Agencies",
    description:
      "Track billable hours, client projects, and team utilization. Keep multiple clients organized.",
    metrics: "Client-based work",
    color: "from-pink-500 to-rose-500",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
];

export function UseCases() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={containerRef}
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Animated background */}
      <motion.div
        style={{ y }}
        className="absolute top-40 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100/30 to-purple-100/30 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-3 block">
            Use Cases
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Built for Teams of
            <br />
            <span className="text-blue-600">All Sizes</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Whether you're a startup founder or an enterprise CHRO, TalentOS
            adapts to your unique workforce management needs.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, i) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
            >
              <HoverCard
                className="bg-white rounded-2xl p-7 border border-slate-100 hover:border-slate-200 transition-all duration-300 h-full group relative overflow-hidden"
                intensity={8}
              >
                {/* Gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`w-14 h-14 rounded-2xl ${useCase.iconBg} flex items-center justify-center mb-5`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <useCase.icon size={26} className={useCase.iconColor} />
                  </motion.div>

                  {/* Title and metrics */}
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {useCase.title}
                    </h3>
                    <span className="text-xs text-blue-600 font-medium">
                      {useCase.metrics}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </HoverCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
