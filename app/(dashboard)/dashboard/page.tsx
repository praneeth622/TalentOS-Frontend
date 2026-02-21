"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Users,
  Activity,
  ClipboardList,
  CheckCircle2,
  Sparkles,
  Clock,
  TrendingUp,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { DashboardStats, LeaderboardEmployee, ActivityLog } from "@/types/dashboard";

/* ── Types ─────────────────────────────────────────────────────────── */

interface TaskDonutData {
  name: string;
  value: number;
  color: string;
}

/* ── Animation helpers ──────────────────────────────────────────────── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.25, 0.4, 0.25, 1] as const },
});

/* ── Card shell ─────────────────────────────────────────────────────── */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] ${className}`}>
      {children}
    </div>
  );
}

/* ── Skeleton ───────────────────────────────────────────────────────── */

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />;
}

/* ── Stat Card (Image 1 style) ──────────────────────────────────────── */

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  delay: number;
  loading: boolean;
}

/**
 * Clean stat card with colored icon circle, large number, and trend chip.
 * Inspired by Image 1 dashboard reference.
 */
function StatCard({ label, value, icon: Icon, iconBg, iconColor, delay, loading }: StatCardProps) {
  return (
    <motion.div {...fadeUp(delay)}>
      <Card className="p-5">
        <div className="flex items-start justify-between mb-5">
          <div className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
            <Icon size={20} className={iconColor} strokeWidth={1.8} />
          </div>
          <button className="text-slate-300 hover:text-slate-400 transition-colors">
            <Info size={15} />
          </button>
        </div>

        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>

        {loading ? (
          <Skeleton className="h-9 w-24 mb-3" />
        ) : (
          <p className="text-3xl font-bold text-slate-900 mb-3 leading-none">
            <CountUp end={value} duration={1.6} separator="," />
          </p>
        )}

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            <TrendingUp size={10} strokeWidth={2.5} />
            Active
          </span>
          <span className="text-xs text-slate-400">this cycle</span>
        </div>
      </Card>
    </motion.div>
  );
}

/* ── Score helpers ──────────────────────────────────────────────────── */

function scoreBarColor(score: number): string {
  if (score >= 70) return "bg-green-500";
  if (score >= 40) return "bg-amber-400";
  return "bg-red-400";
}

function scoreTextColor(score: number): string {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-amber-600";
  return "text-red-500";
}

/* ── Status badge ───────────────────────────────────────────────────── */

const STATUS_STYLE: Record<string, string> = {
  TODO: "bg-slate-100 text-slate-500",
  IN_PROGRESS: "bg-amber-50 text-amber-600",
  COMPLETED: "bg-green-50 text-green-600",
  CANCELLED: "bg-red-50 text-red-500",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_STYLE[status] ?? STATUS_STYLE.TODO}`}>
      {status.replace("_", " ")}
    </span>
  );
}

/* ── Time-ago ───────────────────────────────────────────────────────── */

function timeAgo(dateStr: string | Date): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/* ── Avatar ─────────────────────────────────────────────────────────── */

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  const dim = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";
  return (
    <div className={`${dim} rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0`}>
      {initials}
    </div>
  );
}

/* ── Rank badge ─────────────────────────────────────────────────────── */

function RankBadge({ rank }: { rank: number }) {
  const styles: Record<number, string> = {
    1: "bg-amber-400 text-white",
    2: "bg-slate-300 text-white",
    3: "bg-amber-600/80 text-white",
  };
  const style = styles[rank] ?? "bg-slate-100 text-slate-500";
  return (
    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${style}`}>
      {rank}
    </span>
  );
}

/* ── Dashboard Page ─────────────────────────────────────────────────── */

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEmployee[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [insight, setInsight] = useState<string | null>(null);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [loadingInsight, setLoadingInsight] = useState(true);

  useEffect(() => {
    api
      .get<{ success: true; data: DashboardStats }>("/api/dashboard/stats")
      .then((r) => setStats(r.data.data))
      .catch(() => toast.error("Failed to load dashboard stats"))
      .finally(() => setLoadingStats(false));
  }, []);

  useEffect(() => {
    api
      .get<{ success: true; data: LeaderboardEmployee[] }>("/api/dashboard/leaderboard")
      .then((r) => setLeaderboard(r.data.data))
      .catch(() => toast.error("Failed to load leaderboard"))
      .finally(() => setLoadingLeaderboard(false));
  }, []);

  useEffect(() => {
    api
      .get<{ success: true; data: ActivityLog[] }>("/api/dashboard/activity")
      .then((r) => setActivity(r.data.data.slice(0, 8)))
      .catch(() => toast.error("Failed to load activity feed"))
      .finally(() => setLoadingActivity(false));
  }, []);

  useEffect(() => {
    api
      .get<{ success: true; data: { insight: string } }>("/api/ai/daily-insight")
      .then((r) => setInsight(r.data.data.insight))
      .catch(() => toast.error("Failed to load AI insight"))
      .finally(() => setLoadingInsight(false));
  }, []);

  const donutData: TaskDonutData[] = stats
    ? [
        { name: "Assigned", value: Math.max(0, stats.assignedTasks - stats.completedTasks), color: "#3b82f6" },
        { name: "In Progress", value: Math.max(0, stats.activeEmployees), color: "#f59e0b" },
        { name: "Completed", value: stats.completedTasks, color: "#22c55e" },
      ]
    : [];

  const statCards = [
    { label: "Total Employees", value: stats?.totalEmployees ?? 0, icon: Users, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Active Employees", value: stats?.activeEmployees ?? 0, icon: Activity, iconBg: "bg-green-100", iconColor: "text-green-600" },
    { label: "Tasks Assigned", value: stats?.assignedTasks ?? 0, icon: ClipboardList, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
    { label: "Tasks Completed", value: stats?.completedTasks ?? 0, icon: CheckCircle2, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* ── Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.07} loading={loadingStats} />
        ))}
      </div>

      {/* ── Row 2: Leaderboard + Task Status ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Leaderboard — 3/5 */}
        <motion.div className="lg:col-span-3" {...fadeUp(0.15)}>
          <Card className="overflow-hidden">
            {/* Card header */}
            <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-slate-50">
              <div>
                <h2 className="font-semibold text-slate-800 text-[15px]">Productivity Leaderboard</h2>
                <p className="text-xs text-slate-400 mt-0.5">Ranked by AI score</p>
              </div>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                This month
              </span>
            </div>

            {loadingLeaderboard ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-36" />
                      <Skeleton className="h-2.5 w-20" />
                    </div>
                    <Skeleton className="h-2 w-24 rounded-full" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-2">
                <Users size={32} className="text-slate-200" />
                <p className="text-sm text-slate-400">No employees yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {leaderboard.map((emp, i) => (
                  <motion.div
                    key={emp.id}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.055 }}
                  >
                    <RankBadge rank={i + 1} />
                    <Avatar name={emp.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{emp.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{emp.department} · {emp.role}</p>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${scoreBarColor(emp.productivityScore)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${emp.productivityScore}%` }}
                          transition={{ duration: 0.7, delay: 0.3 + i * 0.06 }}
                        />
                      </div>
                      <span className={`text-sm font-bold w-7 text-right ${scoreTextColor(emp.productivityScore)}`}>
                        {emp.productivityScore}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Task Status Donut — 2/5 */}
        <motion.div className="lg:col-span-2" {...fadeUp(0.2)}>
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-slate-800 text-[15px]">Task Status</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">Distribution across all tasks</p>

            {loadingStats ? (
              <div className="flex items-center justify-center h-52">
                <Skeleton className="w-40 h-40 rounded-full" />
              </div>
            ) : donutData.every((d) => d.value === 0) ? (
              <div className="flex flex-col items-center justify-center h-52 gap-2">
                <ClipboardList size={28} className="text-slate-200" />
                <p className="text-sm text-slate-400">No task data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={82}
                    paddingAngle={4}
                    dataKey="value"
                    animationBegin={300}
                    animationDuration={800}
                  >
                    {donutData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #f1f5f9",
                      borderRadius: "10px",
                      fontSize: "12px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-xs text-slate-500 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}

            {/* Inline stats below chart */}
            {!loadingStats && stats && (
              <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-slate-50">
                {[
                  { label: "Assigned", value: stats.assignedTasks, color: "text-blue-600" },
                  { label: "Active", value: stats.activeEmployees, color: "text-amber-500" },
                  { label: "Done", value: stats.completedTasks, color: "text-green-600" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* ── Row 3: Activity Feed + AI Insight ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Activity Feed — 3/5 */}
        <motion.div className="lg:col-span-3" {...fadeUp(0.25)}>
          <Card className="overflow-hidden">
            <div className="px-6 pt-5 pb-4 flex items-center gap-2 border-b border-slate-50">
              <Clock size={15} className="text-slate-400" strokeWidth={1.8} />
              <h2 className="font-semibold text-slate-800 text-[15px]">Recent Activity</h2>
              <span className="ml-auto text-[11px] text-slate-400">Last 10 updates</span>
            </div>

            {loadingActivity ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-3/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : activity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-2">
                <Clock size={28} className="text-slate-200" />
                <p className="text-sm text-slate-400">No recent activity</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {activity.map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="flex items-center gap-3.5 px-6 py-3.5 hover:bg-slate-50/60 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                  >
                    <Avatar name={item.employeeName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 truncate">
                        <span className="font-semibold text-slate-900">{item.employeeName}</span>
                        <span className="text-slate-400 mx-1.5">·</span>
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{timeAgo(item.updatedAt)}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* AI Daily Insight — 2/5 */}
        <motion.div className="lg:col-span-2" {...fadeUp(0.3)}>
          <Card className="p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                <Sparkles size={16} className="text-white" strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800">AI Daily Insight</h2>
                <p className="text-[11px] text-slate-400">Powered by Gemini</p>
              </div>
            </div>

            {/* Insight body */}
            <div className="flex-1 bg-slate-50 rounded-xl p-4 mb-4">
              {loadingInsight ? (
                <div className="space-y-2.5">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-5/6" />
                  <Skeleton className="h-3.5 w-4/6" />
                  <Skeleton className="h-3.5 w-full mt-2" />
                  <Skeleton className="h-3.5 w-3/5" />
                </div>
              ) : insight ? (
                <p className="text-sm text-slate-600 leading-relaxed">{insight}</p>
              ) : (
                <p className="text-sm text-slate-400 italic">No insight available today.</p>
              )}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Top Performers", icon: TrendingUp, color: "text-green-600 bg-green-50" },
                { label: "Skill Gaps", icon: Users, color: "text-blue-600 bg-blue-50" },
                { label: "Task Bottlenecks", icon: ClipboardList, color: "text-amber-600 bg-amber-50" },
                { label: "AI Suggestions", icon: Sparkles, color: "text-slate-600 bg-slate-100" },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${action.color}`}>
                    <action.icon size={13} strokeWidth={2} />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 leading-tight">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Footer badge */}
            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-100">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[11px] text-slate-400 font-medium">Powered by Gemini AI · Updated today</span>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
