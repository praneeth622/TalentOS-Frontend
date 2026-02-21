"use client";

import { motion, useInView, animate, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { AnimatedSection } from "../ui/AnimatedSection";
import { TrendingUp, Users, Zap, Star } from "lucide-react";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

const stats: StatItem[] = [
  {
    value: 500,
    suffix: "+",
    label: "Organizations Trust Us",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    value: 50,
    suffix: "K+",
    label: "Employees Managed",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
  },
  {
    value: 98,
    suffix: "%",
    label: "Uptime Guarantee",
    icon: Zap,
    color: "from-emerald-500 to-teal-500",
  },
  {
    value: 4.9,
    suffix: "",
    label: "Average Rating",
    icon: Star,
    color: "from-amber-500 to-orange-500",
  },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate: (v) => {
        if (value < 10) {
          setDisplay(Math.round(v * 10) / 10);
        } else {
          setDisplay(Math.round(v));
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <section ref={containerRef} className="py-20 bg-white relative overflow-hidden">
      {/* Floating gradient orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-purple-200/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -40, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <AnimatedSection>
          <motion.div
            style={{ scale }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 sm:p-14 relative overflow-hidden"
          >
            {/* Animated grid background */}
            <motion.div
              className="absolute inset-0 opacity-5"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
                backgroundSize: "30px 30px",
              }}
            />

            {/* Gradient overlay */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent rounded-full blur-3xl" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center group"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.15,
                    duration: 0.7,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{ y: -8 }}
                >
                  {/* Icon with gradient */}
                  <motion.div
                    className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                      <stat.icon size={24} className="text-white" />
                    </div>
                  </motion.div>

                  <motion.div
                    className="text-4xl sm:text-5xl font-bold text-white mb-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </motion.div>

                  <div className="text-sm text-slate-400 font-medium">
                    {stat.label}
                  </div>

                  {/* Gradient bar */}
                  <motion.div
                    className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.5, duration: 0.8 }}
                  >
                    <motion.div
                      className={`h-full bg-gradient-to-r ${stat.color}`}
                      initial={{ x: "-100%" }}
                      whileInView={{ x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.7, duration: 0.6 }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}
