"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal } from "../ui/ScrollReveal";
import { FloatingCard } from "../ui/FloatingCard";
import { CountUpNumber } from "../ui/CountUpNumber";
import { useRef } from "react";
import { Clock, Target, DollarSign, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Save Time",
    description:
      "Automate reporting, tracking, and analysis. Let AI handle the busywork while you focus on strategic decisions.",
    value: 10,
    suffix: "+",
    unit: "hrs/week",
    color: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Target,
    title: "Improve Accuracy",
    description:
      "AI-powered insights reduce human bias and catch patterns humans miss. Make decisions based on data, not gut feeling.",
    value: 95,
    suffix: "%",
    unit: "accuracy",
    color: "from-purple-500 to-pink-500",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: DollarSign,
    title: "Reduce Turnover",
    description:
      "Identify disengagement early and take action. Our customers report lower turnover in their first year.",
    value: 35,
    suffix: "%",
    unit: "reduction",
    color: "from-emerald-500 to-teal-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Boost Productivity",
    description:
      "Teams using TalentOS complete more tasks on average. Smart prioritization and clear visibility drive results.",
    value: 28,
    suffix: "%",
    unit: "increase",
    color: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export function Benefits() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={containerRef}
      className="py-24 bg-slate-50/50 relative overflow-hidden"
    >
      {/* Animated background */}
      <motion.div
        style={{ y }}
        className="absolute top-20 left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100/30 to-purple-100/30 blur-3xl"
      />
      <motion.div
        className="absolute bottom-20 right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-100/30 to-pink-100/30 blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-3 block">
            The Impact
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Real Results That
            <br />
            <span className="text-blue-600">Matter to Your Business</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            TalentOS delivers measurable improvements to your bottom line with
            proven results across hundreds of organizations.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, i) => (
            <FloatingCard key={benefit.title} delay={i * 0.1}>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 transition-all h-full group relative overflow-hidden">
                {/* Gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`w-12 h-12 rounded-xl ${benefit.iconBg} flex items-center justify-center mb-4`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <benefit.icon size={22} className={benefit.iconColor} />
                  </motion.div>

                  {/* Stat with CountUp */}
                  <div className="mb-4">
                    <div className={`text-4xl font-bold bg-gradient-to-br ${benefit.color} bg-clip-text text-transparent`}>
                      <CountUpNumber value={benefit.value} suffix={benefit.suffix} duration={2.5} />
                    </div>
                    <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-1">
                      {benefit.unit}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </FloatingCard>
          ))}
        </div>

        {/* Value callout */}
        <ScrollReveal delay={0.4}>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-10 border border-blue-100/50 text-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{
                background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <motion.div
                className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 150 }}
              >
                $<CountUpNumber value={2.5} suffix="M+" duration={3} />
              </motion.div>
              <p className="text-slate-700 text-lg font-medium">
                Total value created for our customers in improved productivity and reduced costs
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
