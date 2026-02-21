"use client";

import { motion } from "framer-motion";
import { Brain, Eye, Key, Sparkles } from "lucide-react";
import { Navbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { ScrollProgress } from "../components/ui/ScrollProgress";
import { AnimatedSection, StaggerContainer, StaggerItem } from "../components/ui/AnimatedSection";
import { ScrollReveal } from "../components/ui/ScrollReveal";
import { GradientText } from "../components/ui/GradientText";

const pillars = [
  {
    icon: Brain,
    title: "AI-First",
    description:
      "Every feature starts with intelligence. Not reports. Not dashboards. Answers.",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    icon: Eye,
    title: "Transparent",
    description:
      "Open scoring formulas. Explainable AI. Your team always knows how they're evaluated.",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    icon: Key,
    title: "Ownership",
    description:
      "Web3 verification means your work history belongs to you. On-chain. Forever.",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
];

const techStack = [
  { name: "Next.js", color: "border-slate-300 bg-slate-50 text-slate-800" },
  { name: "PostgreSQL", color: "border-blue-200 bg-blue-50 text-blue-800" },
  { name: "Gemini AI", color: "border-purple-200 bg-purple-50 text-purple-800" },
  { name: "Polygon", color: "border-violet-200 bg-violet-50 text-violet-800" },
  { name: "Prisma", color: "border-teal-200 bg-teal-50 text-teal-800" },
  { name: "Express", color: "border-green-200 bg-green-50 text-green-800" },
];

export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <main className="min-h-screen bg-white">
        <Navbar />

        {/* ── Section 1: Hero ─────────────────────────────────────────── */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
          {/* Ambient orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-linear-to-br from-indigo-100/60 to-purple-100/40 "
              animate={{ scale: [1, 1.15, 1], rotate: [0, 80, 0] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-linear-to-tr from-blue-100/50 to-pink-100/30 "
              animate={{ scale: [1, 1.1, 1], rotate: [0, -60, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            {/* Chip */}
            <motion.div
              className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Sparkles size={14} className="text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">Our Mission</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.08] tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Workforce intelligence
              <br />
              <GradientText gradient="from-indigo-600 via-purple-600 to-blue-600">
                for the modern era
              </GradientText>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              TalentOS is built at the intersection of AI, Web3, and human potential.
              We believe every team deserves tools that actually understand how work
              gets done.
            </motion.p>
          </div>
        </section>

        {/* ── Section 2: Three Pillars ─────────────────────────────────── */}
        <section className="py-24 bg-slate-50/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <AnimatedSection className="text-center mb-16">
              <span className="text-sm font-medium text-indigo-600 tracking-wide uppercase mb-3 block">
                What We Stand For
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Three principles that drive{" "}
                <span className="text-indigo-600">everything</span>
              </h2>
            </AnimatedSection>

            <StaggerContainer
              className="grid md:grid-cols-3 gap-8"
              staggerDelay={0.12}
            >
              {pillars.map((pillar) => (
                <StaggerItem key={pillar.title}>
                  <div className="group relative bg-white rounded-3xl p-8 border border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                    {/* Indigo top border accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-t-3xl" />

                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/60 group-hover:to-purple-50/30 transition-all duration-500 rounded-3xl" />

                    <div className="relative z-10">
                      <motion.div
                        className={`w-14 h-14 rounded-2xl ${pillar.iconBg} ${pillar.iconColor} flex items-center justify-center mb-6`}
                        whileHover={{ scale: 1.1, rotate: 6 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <pillar.icon size={26} />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        {pillar.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-base">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ── Section 3: Tech Stack Showcase ───────────────────────────── */}
        <section className="py-24 bg-white relative overflow-hidden">
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <ScrollReveal className="text-center mb-14">
              <span className="text-sm font-medium text-indigo-600 tracking-wide uppercase mb-3 block">
                Technology
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Built with the best
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-lg">
                A carefully chosen stack that prioritises performance,
                reliability, and developer experience.
              </p>
            </ScrollReveal>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.09 },
                },
              }}
            >
              {techStack.map((tech) => (
                <motion.div
                  key={tech.name}
                  className={`px-6 py-3 rounded-full border-2 font-semibold text-sm cursor-default select-none transition-all duration-300 ${tech.color}`}
                  variants={{
                    hidden: { opacity: 0, y: 24, scale: 0.9 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
                    },
                  }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.25)",
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  {tech.name}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Section 4: Vision Statement ───────────────────────────────── */}
        <section className="py-24 bg-slate-50/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal>
              <div className="relative bg-slate-900 rounded-3xl p-10 sm:p-16 overflow-hidden">
                {/* Background glows */}
                <motion.div
                  className="absolute top-0 right-0 w-[500px] h-[400px] bg-indigo-600/10 rounded-full "
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-purple-900/10 rounded-full "
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.9, 0.9] }}
                  transition={{ duration: 10, repeat: Infinity }}
                />

                <div className="relative z-10 flex gap-8 items-start">
                  {/* Indigo left border accent */}
                  <div className="hidden sm:block w-1.5 self-stretch rounded-full bg-linear-to-b from-indigo-500 to-purple-500 shrink-0" />

                  <div>
                    <motion.p
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] tracking-tight"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.1 }}
                    >
                      "We're not building another HR tool.
                      <br />
                      <span className="text-indigo-400">
                        We're building the operating system for human talent.
                      </span>
                      "
                    </motion.p>

                    <motion.p
                      className="mt-8 text-slate-400 text-lg"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                    >
                      — The TalentOS Team
                    </motion.p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
