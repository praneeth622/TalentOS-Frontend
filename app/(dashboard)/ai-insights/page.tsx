"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, RefreshCw, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.25, 0.4, 0.25, 1] },
});

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] ${className}`}>
      {children}
    </div>
  );
}

interface InsightCardData {
  icon: React.ElementType;
  label: string;
  description: string;
  iconBg: string;
  iconColor: string;
  stat: string;
  statLabel: string;
}

/**
 * AI Insights page — surfaces Gemini-generated workforce intelligence.
 */
export default function AiInsightsPage() {
  const [dailyInsight, setDailyInsight] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetches the AI daily insight from the backend Gemini endpoint.
   */
  const fetchInsight = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      const res = await api.get<{ success: boolean; data: { insight: string } }>("/ai/daily-insight");
      setDailyInsight(res.data.data.insight);
    } catch {
      toast.error("Failed to load AI insight.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchInsight(); }, []);

  const insightCards: InsightCardData[] = [
    {
      icon: TrendingUp,
      label: "Top Performers",
      description: "Aryan Mehta and Sneha Nair consistently score above 90. Consider mentorship programmes to scale their impact.",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      stat: "2",
      statLabel: "High performers",
    },
    {
      icon: AlertTriangle,
      label: "Attention Needed",
      description: "Task completion in Analytics dropped 12% this week. Review workload distribution and upcoming deadlines.",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      stat: "−12%",
      statLabel: "Completion rate",
    },
    {
      icon: Lightbulb,
      label: "Skill Gap Detected",
      description: "3 engineers lack distributed systems exposure. A targeted workshop could unblock infra bottlenecks.",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      stat: "3",
      statLabel: "Engineers affected",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Insights</h1>
          <p className="text-sm text-slate-400 mt-0.5">Gemini-powered workforce intelligence, refreshed daily.</p>
        </div>
        <motion.button
          onClick={() => fetchInsight(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors bg-white disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} strokeWidth={1.8} />
          {refreshing ? "Refreshing…" : "Refresh"}
        </motion.button>
      </motion.div>

      {/* Daily insight — dark hero card (Image 4 style dark accent) */}
      <motion.div {...fadeUp(0.08)}>
        <div className="relative bg-slate-900 rounded-2xl p-7 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-blue-400/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6">
            {/* Icon + label */}
            <div className="shrink-0">
              <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-3">
                <Sparkles size={20} className="text-white" strokeWidth={1.8} />
              </div>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Daily Insight</p>
              <p className="text-[10px] text-white/30 mt-0.5">Powered by Gemini AI</p>
            </div>

            {/* Content */}
            <div className="flex-1">
              {loading ? (
                <div className="space-y-2.5 pt-1">
                  <div className="h-3.5 bg-white/10 rounded-full w-full animate-pulse" />
                  <div className="h-3.5 bg-white/10 rounded-full w-5/6 animate-pulse" />
                  <div className="h-3.5 bg-white/10 rounded-full w-4/6 animate-pulse" />
                </div>
              ) : (
                <p className="text-white/85 leading-relaxed text-[15px]">{dailyInsight}</p>
              )}

              <button className="mt-4 inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors">
                View full report <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Insight cards — 3 col */}
      <div className="grid md:grid-cols-3 gap-4">
        {insightCards.map((card, i) => (
          <motion.div key={card.label} {...fadeUp(0.15 + i * 0.08)}>
            <Card className="p-6 hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-shadow">
              {/* Top row */}
              <div className="flex items-start justify-between mb-5">
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <card.icon size={18} className={card.iconColor} strokeWidth={1.8} />
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${card.iconColor}`}>{card.stat}</p>
                  <p className="text-[10px] text-slate-400">{card.statLabel}</p>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-800 mb-1.5">{card.label}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">{card.description}</p>

              <button className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                View details <ArrowRight size={11} />
              </button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick action prompts (like Image 2 "How can I help you?") */}
      <motion.div {...fadeUp(0.4)}>
        <Card className="p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles size={16} className="text-white" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">How can Gemini help you?</h2>
              <p className="text-[11px] text-slate-400">Ask anything about your team&apos;s performance</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { icon: TrendingUp, label: "Optimize team performance", color: "text-green-600 bg-green-50" },
              { icon: Lightbulb, label: "Identify skill gaps", color: "text-blue-600 bg-blue-50" },
              { icon: AlertTriangle, label: "Spot bottlenecks", color: "text-amber-600 bg-amber-50" },
              { icon: Sparkles, label: "Smart task assignment", color: "text-slate-600 bg-slate-100" },
            ].map((a) => (
              <button
                key={a.label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-center"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${a.color}`}>
                  <a.icon size={16} strokeWidth={1.8} />
                </div>
                <span className="text-[11px] font-medium text-slate-600 leading-tight">{a.label}</span>
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Ask something about your team…"
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-100 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <motion.p {...fadeUp(0.5)} className="text-[11px] text-slate-400 text-center pb-2">
        AI insights are generated from your organisation&apos;s task and performance data. Always verify before acting.
      </motion.p>
    </div>
  );
}
