"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  X,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

/* ── Types ──────────────────────────────────────────────────────────── */

interface SkillGap {
  missingSkills: string[];
  coveragePercent: number;
  learningPlan: string[];
}

/* ── Animation helpers ───────────────────────────────────────────────── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.4, delay, ease: [0.25, 0.4, 0.25, 1] as const },
});

/* ── Skeleton ───────────────────────────────────────────────────────── */

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
  );
}

/* ── Coverage color helpers ─────────────────────────────────────────── */

function coverageTextColor(pct: number) {
  if (pct >= 80) return "text-green-600";
  if (pct >= 50) return "text-amber-500";
  return "text-red-500";
}

function coverageBgColor(pct: number) {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 50) return "bg-amber-400";
  return "bg-red-400";
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════ */

export default function SkillGapPage() {
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /**
   * Fetches the employee-scoped skill gap analysis.
   * Pass refresh=true to bypass the 24-hour backend cache.
   */
  const fetchSkillGap = useCallback(async (refresh = false) => {
    setLoading(true);
    setError(false);
    try {
      const url = refresh
        ? "/api/ai/skill-gap/me?refresh=true"
        : "/api/ai/skill-gap/me";
      const res = await api.get<{ success: true; data: SkillGap }>(url);
      setSkillGap(res.data.data);
    } catch {
      setError(true);
      toast.error("Failed to load skill gap analysis");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkillGap();
  }, [fetchSkillGap]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Skill Gap Analysis
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              AI-powered analysis of your skills vs. your role requirements
            </p>
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase bg-teal-50 text-teal-600 border border-teal-200 px-2.5 py-1 rounded-full">
            Gemini AI
          </span>
        </div>
      </motion.div>

      {/* ── Content ────────────────────────────────────────────── */}
      {loading ? (
        <motion.div
          {...fadeUp(0.05)}
          className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6 space-y-6"
        >
          {/* Coverage meter skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-14 w-28" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-3 w-full" />
          </div>

          {/* Missing skills skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-7 w-24 rounded-full" />
              ))}
            </div>
          </div>

          {/* Learning plan skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-44" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </motion.div>
      ) : error ? (
        <motion.div {...fadeUp(0.05)}>
          <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">
              Failed to load analysis
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Check your connection and try again.
            </p>
            <button
              onClick={() => fetchSkillGap()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        </motion.div>
      ) : skillGap ? (
        <motion.div
          {...fadeUp(0.05)}
          className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6 space-y-8"
        >
          {/* ── Coverage meter ── */}
          <div>
            <div className="flex items-end gap-3 mb-1">
              <p
                className={`text-5xl font-bold leading-none ${coverageTextColor(skillGap.coveragePercent)}`}
              >
                {skillGap.coveragePercent}%
              </p>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Skill coverage for your role
            </p>
            <div className="w-full h-3 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${coverageBgColor(skillGap.coveragePercent)}`}
                initial={{ width: 0 }}
                animate={{ width: `${skillGap.coveragePercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* ── Missing skills ── */}
          <div>
            <div className="flex items-center mb-3">
              <h2 className="text-sm font-semibold text-slate-700">
                Missing Skills
              </h2>
              <span className="text-xs font-bold bg-red-50 text-red-500 border border-red-200 px-2 py-0.5 rounded-full ml-2">
                {skillGap.missingSkills.length}
              </span>
            </div>

            {skillGap.missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skillGap.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-xs font-semibold flex items-center gap-1"
                  >
                    <X size={10} />
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 size={16} />
                <span className="text-sm font-semibold">
                  All required skills covered
                </span>
              </div>
            )}
          </div>

          <div className="h-px bg-slate-100" />

          {/* ── 30-Day Learning Plan ── */}
          {skillGap.learningPlan.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles
                  size={15}
                  className="text-teal-600"
                  strokeWidth={1.8}
                />
                <h2 className="text-sm font-semibold text-slate-700">
                  30-Day Learning Plan
                </h2>
              </div>
              <div className="space-y-3">
                {skillGap.learningPlan.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex gap-3 p-4 bg-slate-50 rounded-xl"
                  >
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {step}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ── Refresh button ── */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Analysis is cached for 24 hours
            </p>
            <button
              onClick={() => fetchSkillGap(true)}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw
                size={12}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Analysis
            </button>
          </div>
        </motion.div>
      ) : null}

      {/* ── Tips card ──────────────────────────────────────────── */}
      {!loading && !error && (
        <motion.div {...fadeUp(0.15)}>
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 flex gap-3">
            <BookOpen
              size={18}
              className="text-teal-600 shrink-0 mt-0.5"
              strokeWidth={1.8}
            />
            <div>
              <p className="text-sm font-semibold text-teal-700 mb-1">
                Tip: Keep your skills updated
              </p>
              <p className="text-xs text-teal-600/80 leading-relaxed">
                Go to{" "}
                <a
                  href="/my-profile"
                  className="font-semibold underline underline-offset-2"
                >
                  My Profile
                </a>{" "}
                to add new skills. Each time you update your skills, refresh
                this analysis to get a fresh learning plan from Gemini AI.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
