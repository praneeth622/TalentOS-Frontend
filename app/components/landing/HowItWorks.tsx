"use client";

import { motion } from "framer-motion";
import { UserPlus, ListTodo, Sparkles, CheckCircle2 } from "lucide-react";
import { AnimatedSection } from "../ui/AnimatedSection";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Onboard Your Team",
    description:
      "Add your organization and invite team members. Set up roles, skills, and connect wallets in minutes.",
  },
  {
    icon: ListTodo,
    step: "02",
    title: "Assign & Track Tasks",
    description:
      "Create tasks with priorities and deadlines. Track progress in real-time with automatic scoring.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Get AI Insights",
    description:
      "Receive AI-generated productivity insights, skill gap analysis, and actionable recommendations.",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "Verify On-Chain",
    description:
      "Completed tasks get cryptographically signed on Polygon — building a transparent proof of work.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-3 block">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Simple Steps to
            <br />
            <span className="text-blue-600">Transform</span> Your Workflow
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Get started in minutes. Our streamlined process makes it easy to
            bring AI-powered workforce intelligence to your organization.
          </p>
        </AnimatedSection>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-24 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-[2px]">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5 }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                className="relative text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <motion.div
                  className="w-12 h-12 mx-auto bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-5 relative z-10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <step.icon size={22} />
                </motion.div>

                <span className="text-xs font-bold text-blue-600/40 tracking-widest uppercase block mb-2">
                  Step {step.step}
                </span>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
