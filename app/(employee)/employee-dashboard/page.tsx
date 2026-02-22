"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Link from "next/link";
import {
  ClipboardList,
  Activity,
  CheckCircle2,
  TrendingUp,
  Clock,
  Link2,
  Info,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { api, getStoredEmployee } from "@/lib/api";
import type {
  EmployeePersonalStats,
  MyScore,
  MyTask,
} from "@/types/dashboard";

/* ── Animation helper ───────────────────────────────────────────────── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.25, 0.4, 0.25, 1] as const },
});

/* ── Card shell ─────────────────────────────────────────────────────── */

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Skeleton ───────────────────────────────────────────────────────── */

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
  );
}

/* ── Stat Card ──────────────────────────────────────────────────────── */

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
 * Teal-tinted stat card matching the employee portal colour scheme.
 */
function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  delay,
  loading,
}: StatCardProps) {
  return (
    <motion.div {...fadeUp(delay)}>
      <Card className="p-5">
        <div className="flex items-start justify-between mb-5">
          <div
            className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center shrink-0`}
          >
            <Icon size={20} className={iconColor} strokeWidth={1.8} />
          </div>
          <button className="text-slate-300 hover:text-slate-400 transition-colors">
            <Info size={15} />
          </button>
        </div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        {loading ? (
          <Skeleton className="h-9 w-24 mb-3" />
        ) : (
          <p className="text-3xl font-bold text-slate-900 mb-3 leading-none">
            <CountUp end={value} duration={1.6} separator="," />
          </p>
        )}
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
            <TrendingUp size={10} strokeWidth={2.5} />
            Live
          </span>
          <span className="text-xs text-slate-400">this cycle</span>
        </div>
      </Card>
    </motion.div>
  );
}

/* ── Score helpers ──────────────────────────────────────────────────── */

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
    <span
      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
        STATUS_STYLE[status] ?? STATUS_STYLE.TODO
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

/* ── Priority badge ─────────────────────────────────────────────────── */

const PRIORITY_STYLE: Record<string, string> = {
  HIGH: "bg-red-50 text-red-600",
  MEDIUM: "bg-amber-50 text-amber-600",
  LOW: "bg-slate-100 text-slate-500",
};

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
        PRIORITY_STYLE[priority] ?? PRIORITY_STYLE.LOW
      }`}
    >
      {priority}
    </span>
  );
}

/* ── Time helpers ───────────────────────────────────────────────────── */

function timeAgo(dateStr: string | Date): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function isOverdue(deadline: string | null): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/* ── Score bar ──────────────────────────────────────────────────────── */

interface ScoreBarProps {
  label: string;
  value: number;
  barColor: string;
  delay: number;
}

function ScoreBar({ label, value, barColor, delay }: ScoreBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className="text-xs font-bold text-slate-700">{value}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, value)}%` }}
          transition={{ duration: 0.8, delay }}
        />
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default function EmployeeDashboardPage() {
  const employee = getStoredEmployee();

  const [stats, setStats] = useState<EmployeePersonalStats | null>(null);
  const [score, setScore] = useState<MyScore | null>(null);
  const [tasks, setTasks] = useState<MyTask[]>([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingScore, setLoadingScore] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [statsResult, scoreResult, tasksResult] = await Promise.allSettled([
        api.get<{ success: true; data: EmployeePersonalStats }>(
          "/api/dashboard/stats"
        ),
        api.get<{ success: true; data: MyScore }>("/api/employees/me/score"),
        api.get<{ success: true; data: MyTask[] }>("/api/tasks/my-tasks"),
      ]);

      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value.data.data);
      } else {
        toast.error("Failed to load dashboard stats");
      }
      setLoadingStats(false);

      if (scoreResult.status === "fulfilled") {
        setScore(scoreResult.value.data.data);
      } else {
        toast.error("Failed to load productivity score");
      }
      setLoadingScore(false);

      if (tasksResult.status === "fulfilled") {
        setTasks(tasksResult.value.data.data);
      } else {
        toast.error("Failed to load tasks");
      }
      setLoadingTasks(false);
    };

    fetchAll();
  }, []);

  /* Greeting */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  /* Stat cards */
  const statCards: StatCardProps[] = [
    {
      label: "Total Tasks",
      value: stats?.totalTasks ?? 0,
      icon: ClipboardList,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      delay: 0,
      loading: loadingStats,
    },
    {
      label: "In Progress",
      value: stats?.inProgressTasks ?? 0,
      icon: Activity,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      delay: 0.07,
      loading: loadingStats,
    },
    {
      label: "Completed",
      value: stats?.completedTasks ?? 0,
      icon: CheckCircle2,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      delay: 0.14,
      loading: loadingStats,
    },
    {
      label: "My Score",
      value: score?.finalScore ?? 0,
      icon: TrendingUp,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      delay: 0.21,
      loading: loadingScore,
    },
  ];

  /* Recent 5 tasks sorted by updatedAt desc */
  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* ── Page header ─────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)}>
        <h1 className="text-2xl font-bold text-slate-800">
          Good {greeting}, {employee?.name ?? "there"} 👋
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {employee?.role} · {employee?.department}
        </p>
      </motion.div>

      {/* ── Stat cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Row 2: Score breakdown + Recent activity ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Score breakdown — 3/5 */}
        <motion.div className="lg:col-span-3" {...fadeUp(0.15)}>
          <Card className="p-6 h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-slate-800 text-[15px]">
                  My Productivity Score
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Based on task completion, deadlines & priorities
                </p>
              </div>
              <span className="text-[11px] font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                This cycle
              </span>
            </div>

            {loadingScore ? (
              <div className="space-y-5">
                <Skeleton className="h-16 w-24 mx-auto rounded-2xl" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : score ? (
              <>
                {/* Big score number */}
                <div className="flex justify-center mb-6">
                  <div className="text-center">
                    <p
                      className={`text-5xl font-bold leading-none ${scoreTextColor(score.finalScore)}`}
                    >
                      <CountUp end={score.finalScore} duration={1.4} />
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5 font-medium">
                      out of 100
                    </p>
                  </div>
                </div>

                {/* Score bars */}
                <div className="space-y-4 mb-6">
                  <ScoreBar
                    label="Completion Rate"
                    value={score.completionRate}
                    barColor="bg-teal-500"
                    delay={0.1}
                  />
                  <ScoreBar
                    label="Deadline Score"
                    value={score.deadlineScore}
                    barColor="bg-amber-400"
                    delay={0.2}
                  />
                  <ScoreBar
                    label="Priority Score"
                    value={score.priorityScore}
                    barColor="bg-blue-500"
                    delay={0.3}
                  />
                </div>

                {/* Breakdown mini-grid */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-50">
                  {[
                    {
                      label: "Total Tasks",
                      value: score.breakdown.totalTasks,
                    },
                    {
                      label: "Completed",
                      value: score.breakdown.completedTasks,
                    },
                    { label: "On Time", value: score.breakdown.onTimeTasks },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-lg font-bold text-slate-800">
                        {item.value}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <TrendingUp size={32} className="text-slate-200" />
                <p className="text-sm text-slate-400">No score yet</p>
                <p className="text-xs text-slate-400">
                  Complete tasks to build your score
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent activity — 2/5 */}
        <motion.div className="lg:col-span-2" {...fadeUp(0.2)}>
          <Card className="overflow-hidden h-full">
            <div className="px-6 pt-5 pb-4 flex items-center gap-2 border-b border-slate-50">
              <Clock size={15} className="text-slate-400" strokeWidth={1.8} />
              <h2 className="font-semibold text-slate-800 text-[15px]">
                Recent Activity
              </h2>
              <span className="ml-auto text-[11px] text-slate-400">
                Latest updates
              </span>
            </div>

            {loadingStats ? (
              <div className="p-6 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                ))}
              </div>
            ) : !stats?.recentActivity || stats.recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-2">
                <Clock size={28} className="text-slate-200" />
                <p className="text-sm text-slate-400">No recent activity yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {stats.recentActivity.slice(0, 8).map((item, i) => (
                  <motion.div
                    key={`${item.title}-${i}`}
                    className="flex items-start gap-3 px-6 py-3.5 hover:bg-slate-50/60 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 + i * 0.04 }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 font-medium truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {timeAgo(item.updatedAt)}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* ── Row 3: My Tasks preview ──────────────────────────────── */}
      <motion.div {...fadeUp(0.28)}>
        <Card className="overflow-hidden">
          {/* Card header */}
          <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-slate-50">
            <div>
              <h2 className="font-semibold text-slate-800 text-[15px]">
                Recent Tasks
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Your latest assigned tasks
              </p>
            </div>
            <Link
              href="/my-tasks"
              className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              View all
              <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
          </div>

          {loadingTasks ? (
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="flex-1 h-4" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : recentTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-2">
              <ClipboardList size={36} className="text-slate-200" />
              <p className="text-sm text-slate-400 font-medium">
                No tasks assigned yet
              </p>
              <p className="text-xs text-slate-400">
                Your admin will assign tasks to you
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentTasks.map((task, i) => {
                const overdue =
                  task.status !== "COMPLETED" && isOverdue(task.deadline);
                return (
                  <motion.div
                    key={task.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.055 }}
                  >
                    {/* Priority */}
                    <PriorityBadge priority={task.priority} />

                    {/* Title */}
                    <p className="flex-1 min-w-0 text-sm font-medium text-slate-800 truncate">
                      {task.title}
                    </p>

                    {/* Status */}
                    <StatusBadge status={task.status} />

                    {/* Deadline */}
                    {task.deadline && (
                      <span
                        className={`text-xs shrink-0 ${
                          overdue
                            ? "text-red-500 font-semibold"
                            : "text-slate-400"
                        }`}
                      >
                        {overdue ? "Overdue" : formatDate(task.deadline)}
                      </span>
                    )}

                    {/* Web3 verified badge */}
                    {task.txHash && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full shrink-0">
                        <Link2 size={10} strokeWidth={2.5} />
                        Verified
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
