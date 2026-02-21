"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ListTodo, Sparkles, UserPlus } from "lucide-react";
import { AnimatedSection } from "../ui/AnimatedSection";
import { ScrollStack, ScrollStackItem } from "../ui/ScrollStack";

const stages = [
  {
    icon: UserPlus,
    step: "01",
    title: "Onboard Your Team",
    description:
      "Create your workspace, invite teammates, and configure roles so everyone starts with the right access and context.",
    points: ["Invite members", "Set permissions", "Connect profiles"],
    gradient: "from-blue-500 to-cyan-500",
    tint: "bg-blue-50/70",
    accent: "text-blue-600",
  },
  {
    icon: ListTodo,
    step: "02",
    title: "Assign and Track Work",
    description:
      "Turn goals into tasks with priorities and due dates, then monitor progress with real-time visibility across teams.",
    points: ["Create task flows", "Prioritize work", "Track live progress"],
    gradient: "from-emerald-500 to-teal-500",
    tint: "bg-emerald-50/70",
    accent: "text-emerald-600",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Unlock AI Insights",
    description:
      "Get intelligent recommendations, productivity patterns, and skill-gap analysis to improve execution quality.",
    points: ["Detect bottlenecks", "Recommend next actions", "Surface team strengths"],
    gradient: "from-purple-500 to-pink-500",
    tint: "bg-purple-50/70",
    accent: "text-purple-600",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "Verify Outcomes",
    description:
      "Finalize completed work with trusted verification so achievements are transparent, auditable, and reusable.",
    points: ["Confirm completion", "Record trusted proofs", "Build performance history"],
    gradient: "from-amber-500 to-orange-500",
    tint: "bg-amber-50/70",
    accent: "text-amber-600",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-10 lg:mb-16">
          <span className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-3 block">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Follow Each Stage to
            <br />
            <span className="text-blue-600">Scale Team Performance</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Scroll through each stack card to understand the complete workflow
            from onboarding to verified outcomes.
          </p>
        </AnimatedSection>
      </div>

      <div className="hidden lg:block">
        <ScrollStack
          className="max-w-6xl mx-auto"
          useWindowScroll
          itemDistance={120}
          itemStackDistance={28}
          baseScale={0.88}
          itemScale={0.03}
          stackPosition="18%"
          scaleEndPosition="8%"
          blurAmount={0.3}
        >
          {stages.map((stage) => (
            <ScrollStackItem
              key={stage.step}
              itemClassName={`h-[72vh] rounded-[36px] border border-slate-200 ${stage.tint} backdrop-blur-sm`}
            >
              <StageCard stage={stage} />
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

      <div className="lg:hidden mt-10">
        <div className="max-w-7xl mx-auto px-6 space-y-7">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.step}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
            >
              <StageCard stage={stage} compact />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface StageCardProps {
  stage: (typeof stages)[number];
  compact?: boolean;
}

function StageCard({ stage, compact = false }: StageCardProps) {
  const Icon = stage.icon;

  return (
    <div className="h-full grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
      <div>
        <span className={`text-xs font-bold tracking-widest uppercase ${stage.accent}`}>
          Stage {stage.step}
        </span>

        <h3
          className={`font-bold text-slate-900 mt-2 ${
            compact ? "text-2xl" : "text-3xl lg:text-4xl"
          }`}
        >
          {stage.title}
        </h3>

        <p className="text-slate-600 text-base lg:text-lg leading-relaxed mt-4 max-w-xl">
          {stage.description}
        </p>

        <div className="mt-6 space-y-3">
          {stage.points.map((point) => (
            <div key={point} className="flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 rounded-full bg-linear-to-r ${stage.gradient}`}
              />
              <p className="text-slate-700 font-medium">{point}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center lg:justify-end">
        <motion.div
          className={`w-40 h-40 lg:w-56 lg:h-56 rounded-4xl bg-linear-to-br ${stage.gradient} text-white flex items-center justify-center shadow-2xl`}
          animate={
            compact
              ? undefined
              : {
                  y: [0, -10, 0],
                  rotate: [0, 3, 0],
                }
          }
          transition={
            compact
              ? undefined
              : {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          <Icon size={compact ? 46 : 70} />
        </motion.div>
      </div>
    </div>
  );
}
