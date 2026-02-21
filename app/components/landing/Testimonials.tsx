"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { ScrollReveal } from "../ui/ScrollReveal";
import { FloatingCard } from "../ui/FloatingCard";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "VP of Operations",
    company: "TechFlow Inc",
    avatar: "SJ",
    rating: 5,
    text: "TalentOS transformed how we manage our remote team. The AI insights helped us identify productivity patterns we never knew existed. Absolute game-changer.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Michael Chen",
    role: "CEO",
    company: "InnovateLabs",
    avatar: "MC",
    rating: 5,
    text: "The blockchain verification feature is brilliant. Our clients love seeing cryptographic proof of completed milestones. It's added a whole new level of trust to our process.",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Emily Rodriguez",
    role: "HR Director",
    company: "GlobalTech Solutions",
    avatar: "ER",
    rating: 5,
    text: "Skill gap analysis is phenomenal. We've reduced training costs by 40% while improving team performance. The ROI was clear within the first month.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "David Park",
    role: "Product Manager",
    company: "StartupHub",
    avatar: "DP",
    rating: 5,
    text: "Finally, a workforce tool that doesn't feel like a chore. The UI is beautiful, the insights are actionable, and our team actually enjoys using it daily.",
    color: "from-amber-500 to-orange-500",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-slate-50/50 relative overflow-hidden">
      {/* Floating gradient orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full bg-blue-200/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-200/20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-3 block">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Loved by Teams
            <br />
            <span className="text-blue-600">Worldwide</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            See what leaders from innovative organizations are saying about TalentOS.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, i) => (
            <FloatingCard
              key={testimonial.name}
              delay={i * 0.1}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 border border-slate-100 relative overflow-hidden h-full">
                {/* Background gradient on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                {/* Quote icon */}
                <motion.div
                  className="absolute top-6 right-6 text-slate-100"
                  initial={{ rotate: 0, scale: 1 }}
                  whileHover={{ rotate: 180, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  <Quote size={40} />
                </motion.div>

                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: i * 0.1 + idx * 0.05,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        <Star
                          size={16}
                          className="fill-amber-400 text-amber-400"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <p className="text-slate-700 leading-relaxed mb-6 text-sm">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {testimonial.avatar}
                    </motion.div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FloatingCard>
          ))}
        </div>

        {/* Social proof */}
        <ScrollReveal delay={0.4}>
          <div className="mt-16">
            <p className="text-sm text-slate-500 mb-8 text-center font-medium">
              Trusted by innovative companies around the globe
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {[
                { name: "TechFlow", color: "from-blue-500 to-cyan-500" },
                { name: "InnovateLabs", color: "from-purple-500 to-pink-500" },
                { name: "GlobalTech", color: "from-emerald-500 to-teal-500" },
                { name: "StartupHub", color: "from-amber-500 to-orange-500" },
                { name: "CloudCorp", color: "from-indigo-500 to-violet-500" },
              ].map((company, i) => (
                <motion.div
                  key={company.name}
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <motion.div
                    className="group relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Logo-style card */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 transition-all shadow-sm hover:shadow-md">
                      <div className="flex flex-col items-center gap-2">
                        {/* Icon/Logo placeholder with gradient */}
                        <motion.div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${company.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                          whileHover={{ rotate: 5 }}
                        >
                          {company.name.charAt(0)}
                        </motion.div>
                        {/* Company name */}
                        <div className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                          {company.name}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
