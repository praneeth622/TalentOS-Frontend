"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Navbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { ScrollReveal } from "../components/ui/ScrollReveal";
import { GradientText } from "../components/ui/GradientText";
import { HoverCard } from "../components/ui/HoverCard";
import { ParallaxSection } from "../components/ui/ParallaxSection";
import { FloatingCard } from "../components/ui/FloatingCard";
import { ScrollProgress } from "../components/ui/ScrollProgress";
import {
  Target,
  Heart,
  Zap,
  Globe,
  Users,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "People First",
    description:
      "We believe in putting people at the center of everything we do. Our platform is designed to empower teams and individuals.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Zap,
    title: "Innovation Driven",
    description:
      "Leveraging cutting-edge AI and blockchain technology to create solutions that were previously impossible.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "Building trust through cryptographic verification and transparent processes. Every achievement is verifiable.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description:
      "Creating tools that work for organizations of all sizes, across all industries, anywhere in the world.",
    color: "bg-emerald-50 text-emerald-600",
  },
];

const stats = [
  { value: 2023, label: "Founded", suffix: "" },
  { value: 50, label: "Team Members", suffix: "+" },
  { value: 500, label: "Organizations", suffix: "+" },
  { value: 40, label: "Countries", suffix: "+" },
];

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    bio: "Former VP of Engineering at a Fortune 500 company. Passionate about using AI to unlock human potential.",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO & Co-Founder",
    bio: "Ex-Google AI researcher with 10+ years in machine learning and distributed systems.",
  },
  {
    name: "Emily Watson",
    role: "Head of Product",
    bio: "Product leader who has scaled platforms from 0 to millions of users at previous startups.",
  },
  {
    name: "David Kim",
    role: "Head of Engineering",
    bio: "Full-stack architect with expertise in building high-performance systems at scale.",
  },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <>
      <ScrollProgress />
      <main className="min-h-screen bg-white">
        <Navbar />

      {/* Hero Section */}
      <section
        ref={containerRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-blue-100/60 to-purple-100/40"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-100/50 to-pink-100/30"
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8"
          >
            <Sparkles size={14} className="text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">About TalentOS</span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Building the Future of
            <br />
            <GradientText gradient="from-blue-600 via-indigo-600 to-purple-600">
              Workforce Intelligence
            </GradientText>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            We're on a mission to transform how organizations understand, develop,
            and empower their people using artificial intelligence and blockchain
            technology.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-slate-50/50 relative overflow-hidden">
        <ParallaxSection speed={0.3}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal direction="left">
                <div>
                  <span className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-3 block">
                    Our Mission
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                    Empowering Organizations Through{" "}
                    <span className="text-blue-600">Intelligence</span>
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    Traditional workforce management tools only scratch the surface.
                    They track what happened, but they don't tell you why or what to
                    do next.
                  </p>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    TalentOS goes deeper. We combine artificial intelligence,
                    real-time analytics, and blockchain verification to give you
                    actionable insights that transform how you manage talent. We're
                    not just tracking productivity — we're unlocking potential.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.2}>
                <HoverCard className="relative bg-white rounded-3xl p-8 shadow-xl border border-slate-100" intensity={5}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                  <div className="relative space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Target className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          Our Vision
                        </h3>
                        <p className="text-slate-600">
                          A world where every organization has the tools to help
                          their people thrive, backed by transparent proof of
                          achievement.
                        </p>
                      </div>
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          Our Approach
                        </h3>
                        <p className="text-slate-600">
                          Combining cutting-edge AI with blockchain technology to
                          create verifiable, actionable workforce intelligence.
                        </p>
                      </div>
                    </div>
                  </div>
                </HoverCard>
              </ScrollReveal>
            </div>
          </div>
        </ParallaxSection>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <span className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-3 block">
              Our Values
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              What Drives Us Forward
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our core values shape every decision we make and every feature we
              build.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <FloatingCard
                key={value.title}
                delay={i * 0.1}
                className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 group cursor-pointer"
              >
                <motion.div
                  className={`w-14 h-14 rounded-2xl ${value.color} flex items-center justify-center mb-5`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <value.icon size={26} />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {value.description}
                </p>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-50/50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            style={{
              backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
            className="w-full h-full"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Our Journey in Numbers
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <motion.div
                  className="text-5xl sm:text-6xl font-bold text-slate-900 mb-2"
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.value}
                  {stat.suffix}
                </motion.div>
                <div className="text-sm text-slate-500 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <span className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-3 block">
              Our Team
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Meet the People Behind{" "}
              <GradientText>TalentOS</GradientText>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A diverse team of engineers, designers, and AI experts united by a
              common goal.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <FloatingCard
                key={member.name}
                delay={i * 0.1}
                className="group"
              >
                <div className="relative bg-slate-50 rounded-2xl overflow-hidden">
                  <motion.div
                    className="aspect-square bg-gradient-to-br from-blue-400 to-purple-600 relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="absolute inset-0 bg-slate-900/10" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/80 to-transparent">
                      <Users className="text-white/90" size={40} />
                    </div>
                  </motion.div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-[400px] h-[400px] rounded-full bg-blue-500/10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-[300px] h-[300px] rounded-full bg-purple-500/10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Our Story
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
              <p>
                TalentOS was born from a simple observation: despite having more
                data than ever before, most organizations still struggle to truly
                understand their workforce's potential.
              </p>
              <p>
                In 2023, our founders came together with a vision to change this.
                They combined their expertise in AI, blockchain, and enterprise
                software to create a platform that doesn't just track work — it
                understands it.
              </p>
              <p>
                Today, TalentOS serves hundreds of organizations worldwide, from
                innovative startups to established enterprises. We're helping them
                make better decisions, develop their people more effectively, and
                build cultures of transparency and growth.
              </p>
              <p>
                But we're just getting started. Our vision extends far beyond
                workforce management. We're building the infrastructure for a future
                where every professional achievement is verifiable, every skill is
                recognized, and every person has the tools to reach their full
                potential.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <motion.div
              className="mt-12 p-8 bg-white/5 rounded-2xl border border-white/10"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Join Our Mission
                  </h3>
                  <p className="text-slate-300 mb-4">
                    We're always looking for talented individuals who share our
                    vision. Check out our open positions.
                  </p>
                  <motion.a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    View Careers
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      </main>
    </>
  );
}
