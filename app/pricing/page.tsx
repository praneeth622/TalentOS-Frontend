"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { ScrollReveal } from "../components/ui/ScrollReveal";
import { GradientText } from "../components/ui/GradientText";
import { FloatingCard } from "../components/ui/FloatingCard";
import { ScrollProgress } from "../components/ui/ScrollProgress";
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  Brain,
  BarChart3,
  GitBranch,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for small teams getting started",
    price: 49,
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Up to 10 team members",
      "Basic AI insights",
      "Task management",
      "Real-time dashboard",
      "Email support",
      "7-day data retention",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    description: "For growing teams that need more power",
    price: 149,
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
    features: [
      "Up to 50 team members",
      "Advanced AI insights",
      "Priority scoring",
      "Skill gap analysis",
      "Web3 verification",
      "Priority support",
      "30-day data retention",
      "Custom integrations",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For organizations with complex needs",
    price: null,
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    features: [
      "Unlimited team members",
      "Full AI capabilities",
      "Advanced analytics",
      "Custom workflows",
      "Dedicated support",
      "Unlimited data retention",
      "SSO & SAML",
      "Custom deployment",
      "SLA guarantee",
    ],
    highlighted: false,
  },
];

const allFeatures = [
  {
    category: "Core Features",
    icon: Users,
    items: [
      { name: "Employee Management", starter: true, pro: true, enterprise: true },
      { name: "Task Tracking", starter: true, pro: true, enterprise: true },
      { name: "Real-time Dashboard", starter: true, pro: true, enterprise: true },
      { name: "Mobile App Access", starter: false, pro: true, enterprise: true },
      { name: "Custom Roles", starter: false, pro: true, enterprise: true },
    ],
  },
  {
    category: "AI & Analytics",
    icon: Brain,
    items: [
      { name: "Basic AI Insights", starter: true, pro: true, enterprise: true },
      { name: "Advanced Analytics", starter: false, pro: true, enterprise: true },
      { name: "Skill Gap Analysis", starter: false, pro: true, enterprise: true },
      { name: "Predictive Analytics", starter: false, pro: false, enterprise: true },
      { name: "Custom AI Models", starter: false, pro: false, enterprise: true },
    ],
  },
  {
    category: "Web3 & Security",
    icon: Shield,
    items: [
      { name: "Web3 Verification", starter: false, pro: true, enterprise: true },
      { name: "2FA Authentication", starter: true, pro: true, enterprise: true },
      { name: "SSO Integration", starter: false, pro: false, enterprise: true },
      { name: "Advanced Encryption", starter: false, pro: true, enterprise: true },
      { name: "Compliance Reports", starter: false, pro: false, enterprise: true },
    ],
  },
  {
    category: "Support & Training",
    icon: GitBranch,
    items: [
      { name: "Email Support", starter: true, pro: true, enterprise: true },
      { name: "Priority Support", starter: false, pro: true, enterprise: true },
      { name: "Dedicated Account Manager", starter: false, pro: false, enterprise: true },
      { name: "Onboarding Training", starter: false, pro: true, enterprise: true },
      { name: "Custom Development", starter: false, pro: false, enterprise: true },
    ],
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  return (
    <>
      <ScrollProgress />
      <main className="min-h-screen bg-white">
        <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-100/60 to-purple-100/40"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-100/50 to-pink-100/30"
            animate={{
              scale: [1, 1.15, 1],
              y: [0, -30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8"
          >
            <Sparkles size={14} className="text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">
              Flexible Pricing Plans
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Choose the Perfect Plan for
            <br />
            <GradientText gradient="from-blue-600 via-purple-600 to-indigo-600">
              Your Team
            </GradientText>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Start free for 14 days. No credit card required. Cancel anytime.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span
              className={`text-sm font-medium transition-colors ${
                billingCycle === "monthly" ? "text-slate-900" : "text-slate-400"
              }`}
            >
              Monthly
            </span>
            <motion.button
              className="relative w-14 h-7 rounded-full bg-slate-200"
              onClick={() =>
                setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")
              }
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-blue-600 shadow-sm"
                animate={{
                  x: billingCycle === "annual" ? 28 : 0,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span
              className={`text-sm font-medium transition-colors ${
                billingCycle === "annual" ? "text-slate-900" : "text-slate-400"
              }`}
            >
              Annual{" "}
              <span className="text-green-600 text-xs font-bold">Save 20%</span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <FloatingCard
                key={plan.name}
                delay={i * 0.1}
                className={`relative ${
                  plan.highlighted
                    ? "md:-translate-y-4"
                    : ""
                }`}
              >
                {plan.highlighted && (
                  <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                      MOST POPULAR
                    </div>
                  </motion.div>
                )}

                <div
                  className={`bg-white rounded-3xl p-8 border-2 ${
                    plan.highlighted
                      ? "border-purple-200 shadow-2xl shadow-purple-100/50"
                      : "border-slate-100"
                  } relative overflow-hidden group`}
                >
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} opacity-10 rounded-full blur-2xl`}
                  />

                  <div className="relative">
                    <motion.div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <plan.icon className="text-white" size={28} />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                      {plan.description}
                    </p>

                    <div className="mb-8">
                      {plan.price ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-bold text-slate-900">
                            ${billingCycle === "annual" ? Math.round(plan.price * 0.8) : plan.price}
                          </span>
                          <span className="text-slate-500 text-sm font-medium">
                            /month
                          </span>
                        </div>
                      ) : (
                        <div className="text-4xl font-bold text-slate-900">
                          Custom
                        </div>
                      )}
                      {billingCycle === "annual" && plan.price && (
                        <p className="text-xs text-green-600 font-medium mt-1">
                          Billed ${Math.round(plan.price * 0.8 * 12)} annually
                        </p>
                      )}
                    </div>

                    <motion.button
                      className={`w-full py-3.5 rounded-full font-medium text-sm transition-all mb-8 ${
                        plan.highlighted
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {plan.price ? "Start Free Trial" : "Contact Sales"}
                    </motion.button>

                    <div className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <motion.div
                          key={feature}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 + 0.3 }}
                        >
                          <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={12} className="text-green-600" />
                          </div>
                          <span className="text-sm text-slate-600">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-24 bg-slate-50/50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Compare Plans in Detail
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to make an informed decision
            </p>
          </ScrollReveal>

          <div className="space-y-12">
            {allFeatures.map((category, catIdx) => (
              <ScrollReveal key={category.category} delay={catIdx * 0.1}>
                <div className="bg-white rounded-3xl p-8 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <category.icon className="text-blue-600" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {category.category}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {category.items.map((item, idx) => (
                      <motion.div
                        key={item.name}
                        className="grid grid-cols-4 gap-4 items-center py-3 border-b border-slate-50 last:border-0"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <div className="col-span-1 text-sm font-medium text-slate-900">
                          {item.name}
                        </div>
                        <div className="flex justify-center">
                          {item.starter ? (
                            <Check size={18} className="text-green-600" />
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </div>
                        <div className="flex justify-center">
                          {item.pro ? (
                            <Check size={18} className="text-green-600" />
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </div>
                        <div className="flex justify-center">
                          {item.enterprise ? (
                            <Check size={18} className="text-green-600" />
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about our pricing
            </p>
          </ScrollReveal>

          <div className="space-y-4">
            {[
              {
                q: "Can I change plans later?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate the difference.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and wire transfers for Enterprise plans. Cryptocurrency payments coming soon.",
              },
              {
                q: "Is there a free trial?",
                a: "Absolutely! All plans come with a 14-day free trial. No credit card required to start.",
              },
              {
                q: "What happens to my data if I cancel?",
                a: "You'll have 30 days to export all your data. After that, it's permanently deleted from our servers.",
              },
              {
                q: "Do you offer discounts for non-profits?",
                a: "Yes! We offer 50% discounts for registered non-profit organizations and educational institutions. Contact sales for details.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  backgroundColor: "rgba(248, 250, 252, 1)",
                  borderColor: "rgba(226, 232, 240, 1)",
                }}
              >
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-slate-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(59,130,246,0.3) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Our team is here to help you find the perfect plan for your
              organization.
            </p>
            <motion.button
              className="bg-white text-slate-900 px-8 py-4 rounded-full font-medium hover:shadow-2xl transition-all inline-flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(255,255,255,0.25)" }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Sales
              <ArrowRight size={18} />
            </motion.button>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      </main>
    </>
  );
}
