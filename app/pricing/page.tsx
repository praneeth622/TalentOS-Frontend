"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Zap,
  TrendingUp,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { ScrollProgress } from "../components/ui/ScrollProgress";
import { ScrollReveal } from "../components/ui/ScrollReveal";
import { GradientText } from "../components/ui/GradientText";
import { AnimatedSection, StaggerContainer, StaggerItem } from "../components/ui/AnimatedSection";

/* ── Data ────────────────────────────────────────────────────────────── */

interface PlanFeature {
  label: string;
  included: boolean;
}

interface Plan {
  name: string;
  subtitle: string;
  monthlyPrice: string;
  annualPrice: string;
  priceNote: string;
  annualNote: string;
  icon: typeof Zap;
  iconGradient: string;
  features: PlanFeature[];
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: "outline" | "solid" | "outline-dark";
  highlighted: boolean;
  badge?: string;
}

const plans: Plan[] = [
  {
    name: "Starter",
    subtitle: "Perfect for small teams",
    monthlyPrice: "₹0",
    annualPrice: "₹0",
    priceNote: "/month",
    annualNote: "Always free",
    icon: Zap,
    iconGradient: "from-slate-500 to-slate-700",
    ctaLabel: "Get Started Free",
    ctaHref: "/register",
    ctaVariant: "outline",
    highlighted: false,
    features: [
      { label: "Up to 10 employees", included: true },
      { label: "Basic task management", included: true },
      { label: "Dashboard analytics", included: true },
      { label: "Email support", included: true },
      { label: "AI insights", included: false },
      { label: "Web3 verification", included: false },
    ],
  },
  {
    name: "Growth",
    subtitle: "For growing teams that need AI",
    monthlyPrice: "₹499",
    annualPrice: "₹399",
    priceNote: "/employee/month",
    annualNote: "billed annually",
    icon: TrendingUp,
    iconGradient: "from-indigo-500 to-purple-600",
    ctaLabel: "Start Free Trial",
    ctaHref: "/register",
    ctaVariant: "solid",
    highlighted: true,
    badge: "Most Popular",
    features: [
      { label: "Unlimited employees", included: true },
      { label: "AI productivity scoring", included: true },
      { label: "Workforce Copilot", included: true },
      { label: "Skill gap analysis", included: true },
      { label: "Smart task assignment", included: true },
      { label: "Priority support", included: true },
      { label: "Web3 verification", included: false },
    ],
  },
  {
    name: "Enterprise",
    subtitle: "For orgs that need everything",
    monthlyPrice: "Let's talk",
    annualPrice: "Let's talk",
    priceNote: "",
    annualNote: "Custom contract",
    icon: Crown,
    iconGradient: "from-amber-500 to-orange-600",
    ctaLabel: "Contact Us",
    ctaHref: "/#contact",
    ctaVariant: "outline-dark",
    highlighted: false,
    features: [
      { label: "Everything in Growth", included: true },
      { label: "Web3 payroll verification", included: true },
      { label: "API access", included: true },
      { label: "Custom integrations", included: true },
      { label: "Dedicated success manager", included: true },
      { label: "SLA guarantee", included: true },
    ],
  },
];

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes, the Starter plan is free forever for up to 10 employees. Growth and Enterprise plans also include a 14-day free trial — no credit card required.",
  },
  {
    q: "How does AI scoring work?",
    a: "We use a weighted formula: task completion (40%), deadline adherence (35%), priority handling (25%). The formula is fully transparent and every score comes with an AI-generated explanation.",
  },
  {
    q: "What is Web3 verification?",
    a: "Task completions are cryptographically signed on Polygon testnet, creating a tamper-proof, on-chain proof of work that belongs to the employee — forever.",
  },
  {
    q: "Can I export my data?",
    a: "Yes. All your data is exportable as CSV at any time from the dashboard settings — no need to contact support.",
  },
  {
    q: "How is this different from Jira or Asana?",
    a: "TalentOS is workforce intelligence, not just task management. AI scoring, skill gap analysis, and on-chain verification are built in from day one — not added as bolt-ons.",
  },
];

/* ── Components ──────────────────────────────────────────────────────── */

/**
 * Renders an individual FAQ accordion item with animated expand/collapse.
 */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="border border-slate-200 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-slate-50 transition-colors"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-base font-semibold text-slate-900">{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown size={18} className="text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-white">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Renders one pricing card with feature list and CTA.
 */
function PricingCard({
  plan,
  isAnnual,
  index,
}: {
  plan: Plan;
  isAnnual: boolean;
  index: number;
}) {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const note = isAnnual ? plan.annualNote : plan.priceNote;
  const Icon = plan.icon;

  return (
    <motion.div
      className={`relative flex flex-col ${plan.highlighted ? "md:-translate-y-5 z-10" : ""}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.55 }}
    >
      {/* Most Popular badge */}
      {plan.badge && (
        <div className="absolute -top-4 inset-x-0 flex justify-center z-20">
          <motion.span
            className="bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg shadow-indigo-500/30"
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12 + 0.2, type: "spring", stiffness: 280 }}
          >
            {plan.badge}
          </motion.span>
        </div>
      )}

      <div
        className={`flex flex-col flex-1 rounded-3xl p-8 border-2 relative overflow-hidden transition-all duration-300 ${
          plan.highlighted
            ? "border-indigo-300 bg-white shadow-2xl shadow-indigo-100/60"
            : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg"
        }`}
      >
        {/* Gradient blob */}
        <div
          className={`absolute top-0 right-0 w-40 h-40 bg-linear-to-br ${plan.iconGradient} opacity-[0.08] rounded-full `}
        />

        {/* Indigo glow for highlighted card */}
        {plan.highlighted && (
          <div className="absolute inset-0 rounded-3xl ring-2 ring-indigo-400/30 pointer-events-none" />
        )}

        <div className="relative z-10 flex flex-col flex-1">
          {/* Icon + name */}
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              className={`w-12 h-12 rounded-2xl bg-linear-to-br ${plan.iconGradient} flex items-center justify-center shadow-md`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon className="text-white" size={22} />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="text-xs text-slate-500">{plan.subtitle}</p>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-1 flex-wrap">
              <span
                className={`font-bold text-slate-900 leading-none ${
                  plan.priceNote ? "text-4xl" : "text-3xl"
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={price}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    {price}
                  </motion.span>
                </AnimatePresence>
              </span>
              {plan.priceNote && (
                <span className="text-sm text-slate-500 font-medium">
                  {plan.priceNote}
                </span>
              )}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={note}
                className="text-xs text-slate-400 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isAnnual && plan.highlighted && (
                  <span className="text-green-600 font-semibold mr-1">Save 20% ·</span>
                )}
                {note}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* CTA */}
          <Link href={plan.ctaHref} className="block mb-7">
            <motion.span
              className={`block w-full py-3.5 rounded-full font-semibold text-sm text-center transition-all ${
                plan.ctaVariant === "solid"
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
                  : plan.ctaVariant === "outline-dark"
                  ? "border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
                  : "border-2 border-slate-200 text-slate-700 hover:border-slate-900 hover:text-slate-900"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {plan.ctaLabel}
            </motion.span>
          </Link>

          {/* Features */}
          <ul className="space-y-3 flex-1">
            {plan.features.map((feat, i) => (
              <motion.li
                key={feat.label}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 + 0.2 }}
              >
                {feat.included ? (
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-indigo-600" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                    <X size={12} className="text-slate-300" />
                  </div>
                )}
                <span
                  className={`text-sm ${
                    feat.included ? "text-slate-700" : "text-slate-400"
                  }`}
                >
                  {feat.label}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <>
      <ScrollProgress />
      <main className="min-h-screen bg-white">
        <Navbar />

        {/* ── Section 1: Header ──────────────────────────────────────────── */}
        <section className="relative pt-36 pb-16 overflow-hidden">
          {/* Ambient orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full bg-linear-to-br from-indigo-100/60 to-purple-100/40 "
              animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-linear-to-tr from-blue-100/40 to-pink-100/30 "
              animate={{ scale: [1, 1.15, 1], y: [0, -30, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            {/* Chip */}
            <motion.div
              className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Sparkles size={14} className="text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">Simple Pricing</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.08] tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Start free.{" "}
              <GradientText gradient="from-indigo-600 via-purple-600 to-blue-600">
                Scale as you grow.
              </GradientText>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              No credit card required. Cancel anytime. 14-day free trial on paid plans.
            </motion.p>

            {/* Monthly / Annual toggle */}
            <motion.div
              className="inline-flex items-center gap-4 bg-slate-100 rounded-full p-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <button
                onClick={() => setIsAnnual(false)}
                className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  !isAnnual ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {!isAnnual && (
                  <motion.div
                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                    layoutId="toggle-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}
                <span className="relative z-10">Monthly</span>
              </button>

              <button
                onClick={() => setIsAnnual(true)}
                className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
                  isAnnual ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {isAnnual && (
                  <motion.div
                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                    layoutId="toggle-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}
                <span className="relative z-10">Annual</span>
                <AnimatePresence>
                  {isAnnual && (
                    <motion.span
                      key="badge"
                      className="relative z-10 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                    >
                      Save 20%
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── Section 2: Pricing Cards ──────────────────────────────────── */}
        <section className="pb-28 relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {plans.map((plan, i) => (
                <PricingCard key={plan.name} plan={plan} isAnnual={isAnnual} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: FAQ Accordion ──────────────────────────────────── */}
        <section className="py-24 bg-slate-50/50 relative overflow-hidden">
          <div className="max-w-3xl mx-auto px-6">
            <AnimatedSection className="text-center mb-14">
              <span className="text-sm font-medium text-indigo-600 tracking-wide uppercase mb-3 block">
                FAQ
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Common questions
              </h2>
              <p className="text-slate-500 text-lg">
                Everything you need to know before getting started.
              </p>
            </AnimatedSection>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 4: Bottom CTA ─────────────────────────────────────── */}
        <section className="py-24 bg-white relative overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-linear-to-br from-indigo-200/30 to-purple-200/30 "
            animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], rotate: [0, 90, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-linear-to-tr from-blue-200/30 to-pink-200/30 "
            animate={{ scale: [1, 1.15, 1], y: [0, -30, 0], rotate: [0, -90, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <ScrollReveal>
              <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
                {/* Animated dots */}
                <motion.div
                  className="absolute inset-0 opacity-[0.04]"
                  animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{
                    backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Top glow */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-linear-to-b from-indigo-600/15 to-transparent rounded-full "
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="relative z-10">
                  <motion.div
                    className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={14} className="text-indigo-400" />
                    </motion.div>
                    <span className="text-sm text-slate-300 font-medium">
                      No credit card required
                    </span>
                  </motion.div>

                  <motion.h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    Ready to transform how you
                    <br />
                    <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                      manage talent?
                    </span>
                  </motion.h2>

                  <motion.p
                    className="text-slate-400 max-w-xl mx-auto mb-10 text-lg leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    Join 500+ organisations already using AI to unlock their team's full
                    potential. Start free, upgrade when ready.
                  </motion.p>

                  <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.a
                      href="/register"
                      className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-sm flex items-center gap-2 shadow-xl shadow-indigo-600/30 hover:shadow-2xl hover:shadow-indigo-600/40 transition-all"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Get Started Free
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight size={16} />
                      </motion.span>
                    </motion.a>

                    <motion.a
                      href="/about"
                      className="border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-white/10 transition-all"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Learn More
                    </motion.a>
                  </motion.div>
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
