"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles,
  Send,
  RotateCcw,
  Loader2,
  Lightbulb,
  Trophy,
  Target,
  Users,
  Check,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { api } from "@/lib/api";

/* ── Types ───────────────────────────────────────────────────────────── */

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  time: Date;
}

interface SkillGapEmployee {
  employeeName: string;
  role: string;
  missingSkills: string[];
}

interface SkillGapData {
  gaps: SkillGapEmployee[];
  orgRecommendation: string;
}

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  assignedTasks: number;
  completedTasks: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  role: string;
  productivityScore: number;
}

/* ── Animation helpers ───────────────────────────────────────────────── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.4, delay, ease: [0.25, 0.4, 0.25, 1] as const },
});

/* ── Shared UI ───────────────────────────────────────────────────────── */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] ${className}`}>
      {children}
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />;
}

/* ── Suggested questions ─────────────────────────────────────────────── */

const SUGGESTED_QUESTIONS = [
  "Who has the highest workload?",
  "Which skills are missing in my team?",
  "Who should I assign a React task to?",
  "Which employee needs attention this week?",
];

/* ── Typing indicator ────────────────────────────────────────────────── */

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 mb-3">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-sm">
        G
      </div>
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 bg-indigo-400 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Coverage bar helper ─────────────────────────────────────────────── */

function coverageColor(pct: number) {
  if (pct > 70) return "bg-green-500";
  if (pct >= 40) return "bg-amber-400";
  return "bg-red-500";
}

function coverageTextColor(pct: number) {
  if (pct > 70) return "text-green-600";
  if (pct >= 40) return "text-amber-600";
  return "text-red-500";
}

/* ── Time formatter ──────────────────────────────────────────────────── */

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function AiInsightsPage() {
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Skill gap state
  const [skillGap, setSkillGap] = useState<SkillGapData | null>(null);
  const [skillGapLoading, setSkillGapLoading] = useState(true);
  const [skillGapError, setSkillGapError] = useState(false);

  // Quick intelligence state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topPerformer, setTopPerformer] = useState<LeaderboardEntry | null>(null);
  const [quickLoading, setQuickLoading] = useState(true);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Refreshing state (for the master refresh button)
  const [refreshing, setRefreshing] = useState(false);

  /* ── Fetch skill gap ───────────────────────────────────────────────── */

  const fetchSkillGap = useCallback((refresh = false) => {
    setSkillGapLoading(true);
    setSkillGapError(false);
    api
      .get<{ success: boolean; data: SkillGapData }>(
        `/api/ai/skill-gap${refresh ? "?refresh=true" : ""}`,
      )
      .then((r) => setSkillGap(r.data.data))
      .catch(() => {
        setSkillGapError(true);
        toast.error("Failed to analyze skills");
      })
      .finally(() => setSkillGapLoading(false));
  }, []);

  /* ── Fetch quick intelligence ──────────────────────────────────────── */

  const fetchQuickIntel = useCallback(() => {
    setQuickLoading(true);
    Promise.all([
      api.get<{ success: boolean; data: DashboardStats }>("/api/dashboard/stats"),
      api.get<{ success: boolean; data: LeaderboardEntry[] }>("/api/dashboard/leaderboard"),
    ])
      .then(([statsRes, leaderboardRes]) => {
        setStats(statsRes.data.data);
        const top = leaderboardRes.data.data[0] ?? null;
        setTopPerformer(top);
      })
      .catch(() => toast.error("Failed to load intelligence data"))
      .finally(() => setQuickLoading(false));
  }, []);

  useEffect(() => {
    fetchSkillGap();      // serves cached data on page load
    fetchQuickIntel();    // no Gemini, just DB stats
  }, [fetchSkillGap, fetchQuickIntel]);

  /* ── Master refresh (calls Gemini fresh) ────────────────────────── */

  async function handleRefreshAll() {
    setRefreshing(true);
    toast("Refreshing AI data…");
    try {
      fetchSkillGap(true);         // force-refresh skill gap from Gemini
      fetchQuickIntel();           // re-fetch DB stats (no Gemini)
    } finally {
      // Give a small delay so the spinner feels intentional
      setTimeout(() => setRefreshing(false), 1500);
    }
  }

  /* ── Chat send ─────────────────────────────────────────────────────── */

  async function handleSend(question?: string) {
    const q = (question ?? input).trim();
    if (!q || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: q, time: new Date() }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await api.post<{ success: boolean; data: { answer: string } }>(
        "/api/ai/chat",
        { question: q },
      );
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: res.data.data.answer, time: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, I couldn't process that. Please try again.",
          time: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  /* ── Computed ───────────────────────────────────────────────────────── */

  const completionRate = stats
    ? ((stats.completedTasks / (stats.assignedTasks || 1)) * 100).toFixed(0)
    : "0";

  /* ── Skill gap coverage calc ───────────────────────────────────────── */

  // Role skill requirements for coverage calculation
  const ROLE_SKILLS: Record<string, string[]> = {
    Engineer: ["JavaScript", "React", "Node.js", "Git", "SQL"],
    Designer: ["Figma", "CSS", "UI/UX", "Prototyping"],
    Manager: ["Communication", "Planning", "Leadership", "Reporting"],
  };

  function getCoverage(emp: SkillGapEmployee): number {
    const roleKey = Object.keys(ROLE_SKILLS).find((k) =>
      emp.role.toLowerCase().includes(k.toLowerCase()),
    );
    const required = roleKey ? ROLE_SKILLS[roleKey] : ["Communication", "Documentation"];
    const covered = required.length - emp.missingSkills.length;
    return Math.max(0, Math.round((covered / required.length) * 100));
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <motion.div
        {...fadeUp(0)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">AI Insights</h1>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Gemini-powered workforce intelligence.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <motion.button
            onClick={handleRefreshAll}
            disabled={refreshing}
            className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <RefreshCw
              size={13}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing…" : "Refresh AI Data"}
          </motion.button>
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 text-xs font-semibold px-4 py-2 rounded-full shadow-sm border border-purple-200/50">
            <Sparkles size={13} className="text-purple-500" />
            Powered by Gemini
          </span>
        </div>
      </motion.div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── LEFT: Workforce Copilot Chat ──────────────────────────── */}
        <motion.div {...fadeUp(0.08)} className="lg:row-span-2">
          <Card className="flex flex-col h-[calc(100vh-180px)] min-h-[500px] max-h-[900px]">
            {/* Chat header */}
            <div className="px-5 py-4 border-b border-gray-50 bg-gradient-to-r from-indigo-50/60 to-purple-50/40 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">
                    Workforce Copilot
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Ask anything about your team
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-medium text-green-600">Online</span>
                </div>
              </div>
            </div>

            {/* Messages area — scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
              {/* Welcome message (always shown) */}
              <div className="mb-4">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5 shadow-sm">
                    G
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[88%]">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Hi! I&apos;m your TalentOS Workforce Copilot. Ask me
                      anything about your team&apos;s performance, workload, or
                      skill gaps.
                    </p>
                  </div>
                </div>
              </div>

              {/* Suggested questions (only when no messages) */}
              {messages.length === 0 && (
                <div className="mb-4 pl-9">
                  <p className="text-[11px] font-medium text-slate-400 mb-2.5">Suggested questions</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="border border-slate-200 bg-white rounded-full px-3.5 py-1.5 text-xs text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all shadow-sm hover:shadow"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {messages.map((msg, i) =>
                msg.role === "user" ? (
                  <div key={i} className="flex flex-col items-end mb-3">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] shadow-sm">
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 mr-1">
                      {formatTime(msg.time)}
                    </p>
                  </div>
                ) : (
                  <div key={i} className="flex items-start gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5 shadow-sm">
                      G
                    </div>
                    <div className="flex-1 max-w-[80%]">
                      <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5">
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 ml-1">
                        {formatTime(msg.time)}
                      </p>
                    </div>
                  </div>
                ),
              )}

              {/* Typing indicator */}
              {isLoading && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Input row */}
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              <div className="flex items-center gap-2.5">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isLoading}
                  placeholder="Ask about your team..."
                  className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center hover:from-indigo-500 hover:to-indigo-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ── RIGHT TOP: Skill Gap Analysis ─────────────────────────── */}
        <motion.div {...fadeUp(0.14)}>
          <Card className="overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 border border-red-100/50 flex items-center justify-center">
                  <Target size={14} className="text-red-500" />
                </div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Skill Gap Analysis
                </h2>
              </div>
              <button
                onClick={() => fetchSkillGap(true)}
                disabled={skillGapLoading}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40"
                title="Refresh from Gemini"
              >
                <RotateCcw
                  size={14}
                  className={skillGapLoading ? "animate-spin" : ""}
                />
              </button>
            </div>

            <div className="p-5">
              {skillGapLoading ? (
                /* Skeleton loading */
                <div className="space-y-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                  <p className="text-xs text-slate-400 text-center pt-2">
                    Analyzing team skills with Gemini AI...
                  </p>
                </div>
              ) : skillGapError ? (
                /* Error */
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle size={18} className="text-red-500" />
                  </div>
                  <p className="text-sm text-slate-600">
                    Failed to analyze skills
                  </p>
                  <button
                    onClick={() => fetchSkillGap()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <RefreshCw size={12} />
                    Retry
                  </button>
                </div>
              ) : skillGap && skillGap.gaps.length === 0 ? (
                /* Empty — all covered */
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check size={22} className="text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    Your team has great skill coverage! 🎉
                  </p>
                </div>
              ) : skillGap ? (
                /* Table */
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="text-left pb-3">Employee</th>
                          <th className="text-left pb-3">Missing Skills</th>
                          <th className="text-left pb-3 w-24">Coverage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {skillGap.gaps.map((emp) => {
                          const pct = getCoverage(emp);
                          const initials = emp.employeeName
                            .split(" ")
                            .slice(0, 2)
                            .map((w) => w[0]?.toUpperCase() ?? "")
                            .join("");
                          return (
                            <tr key={emp.employeeName} className="group hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 pr-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-50 border border-blue-200/50 flex items-center justify-center text-[9px] font-bold text-blue-700 shrink-0">
                                    {initials}
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-slate-700 leading-tight">
                                      {emp.employeeName}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                      {emp.role}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 pr-3">
                                {emp.missingSkills.length === 0 ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                                    <Check size={10} />
                                    All covered
                                  </span>
                                ) : (
                                  <div className="flex flex-wrap gap-1">
                                    {emp.missingSkills.slice(0, 3).map((s) => (
                                      <span
                                        key={s}
                                        className="text-[10px] font-medium bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full"
                                      >
                                        {s}
                                      </span>
                                    ))}
                                    {emp.missingSkills.length > 3 && (
                                      <span className="text-[10px] text-slate-400 font-medium">
                                        +{emp.missingSkills.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${coverageColor(pct)} transition-all duration-500`}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <span
                                    className={`text-[11px] font-bold w-8 text-right ${coverageTextColor(pct)}`}
                                  >
                                    {pct}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* AI Recommendation */}
                  {skillGap.orgRecommendation && (
                    <div className="mt-5 border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-purple-50/40 rounded-xl p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-100/40 to-transparent rounded-bl-3xl" />
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <Lightbulb size={12} className="text-indigo-600" />
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                          AI Recommendation
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {skillGap.orgRecommendation}
                      </p>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </Card>
        </motion.div>

        {/* ── RIGHT BOTTOM: Quick Intelligence Cards ────────────────── */}
        <motion.div {...fadeUp(0.2)}>
          <div className="grid grid-cols-3 gap-3">
            {/* Top Performer */}
            <Card className="p-4 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-50 to-transparent rounded-bl-3xl" />
              {quickLoading ? (
                <div className="space-y-2">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-50 border border-amber-200/50 flex items-center justify-center mb-3">
                    <Trophy size={18} className="text-amber-600" />
                  </div>
                  <p className="text-base font-bold text-slate-900 leading-tight">
                    {topPerformer?.name ?? "No data yet"}
                  </p>
                  {topPerformer && (
                    <span className="inline-flex text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full mt-1.5">
                      Score: {topPerformer.productivityScore}/100
                    </span>
                  )}
                  <p className="text-[11px] text-slate-400 font-medium mt-1.5">
                    Top Performer
                  </p>
                </>
              )}
            </Card>

            {/* Completion Rate */}
            <Card className="p-4 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-50 to-transparent rounded-bl-3xl" />
              {quickLoading ? (
                <div className="space-y-2">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-200/50 flex items-center justify-center mb-3">
                    <Target size={18} className="text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {completionRate}%
                  </p>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2 w-full">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-1.5">
                    Completion Rate
                  </p>
                </>
              )}
            </Card>

            {/* Active Members */}
            <Card className="p-4 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-3xl" />
              {quickLoading ? (
                <div className="space-y-2">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-50 border border-blue-200/50 flex items-center justify-center mb-3">
                    <Users size={18} className="text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats?.activeEmployees ?? 0}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">
                    Active Members
                  </p>
                  <p className="text-[10px] text-slate-300">
                    currently working
                  </p>
                </>
              )}
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
