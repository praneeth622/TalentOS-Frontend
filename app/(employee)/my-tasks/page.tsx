"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { toast } from "sonner";
import {
  ListTodo,
  Clock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { api, getStoredEmployee } from "@/lib/api";
import KanbanBoard from "@/app/components/tasks/KanbanBoard";
import TaskDetailModal from "@/app/components/tasks/TaskDetailModal";
import type { Task, ColumnId, ColumnMap } from "@/types/tasks";
import type { MyTask } from "@/types/dashboard";

/* ── Animation helpers ───────────────────────────────────────────────── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.4, delay, ease: [0.25, 0.4, 0.25, 1] as const },
});

/* ── Shared UI ───────────────────────────────────────────────────────── */

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function buildColumns(tasks: Task[]): ColumnMap {
  return {
    ASSIGNED: tasks.filter(
      (t) => t.status === "TODO" || t.status === "ASSIGNED"
    ),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    COMPLETED: tasks.filter((t) => t.status === "COMPLETED"),
  };
}

/**
 * Converts MyTask (employee-scoped API shape) into the shared Task type
 * that KanbanBoard and KanbanCard expect. orgId is irrelevant client-side
 * so we leave it blank.
 */
function mapMyTaskToTask(
  myTask: MyTask,
  employeeId: string,
  employeeName: string,
  employeeRole: string
): Task {
  return {
    id: myTask.id,
    title: myTask.title,
    description: myTask.description,
    status: myTask.status as Task["status"],
    priority: myTask.priority as Task["priority"],
    deadline: myTask.deadline,
    completedAt: myTask.completedAt,
    txHash: myTask.txHash,
    skillRequired: myTask.skillRequired,
    employeeId,
    employee: { id: employeeId, name: employeeName, role: employeeRole },
    orgId: "",
    createdAt: myTask.createdAt,
    updatedAt: myTask.updatedAt,
  };
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function MyTasksPage() {
  // Read once on mount — employee data doesn't change during the session
  const storedEmployee = useMemo(() => getStoredEmployee(), []);

  const [columns, setColumns] = useState<ColumnMap>({
    ASSIGNED: [],
    IN_PROGRESS: [],
    COMPLETED: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Detail modal — employees can view task details (edit/delete rejected by backend)
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  /* ── Fetch ─────────────────────────────────────────────────────────── */

  const fetchTasks = useCallback(() => {
    setLoading(true);
    setError(false);
    api
      .get<{ success: boolean; data: MyTask[] }>("/api/tasks/my-tasks")
      .then((r) => {
        const mapped = r.data.data.map((t) =>
          mapMyTaskToTask(
            t,
            storedEmployee?.id ?? "",
            storedEmployee?.name ?? "Me",
            storedEmployee?.role ?? "Employee"
          )
        );
        setColumns(buildColumns(mapped));
      })
      .catch(() => {
        setError(true);
        toast.error("Failed to load your tasks");
      })
      .finally(() => setLoading(false));
  }, [storedEmployee?.id, storedEmployee?.name, storedEmployee?.role]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /* ── Stats ─────────────────────────────────────────────────────────── */

  const stats = useMemo(() => {
    const all = [
      ...columns.ASSIGNED,
      ...columns.IN_PROGRESS,
      ...columns.COMPLETED,
    ];
    return {
      total: all.length,
      assigned: columns.ASSIGNED.length,
      inProgress: columns.IN_PROGRESS.length,
      completed: columns.COMPLETED.length,
    };
  }, [columns]);

  const statCards = [
    {
      label: "Total Tasks",
      value: stats.total,
      icon: ListTodo,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      label: "To Do",
      value: stats.assigned,
      icon: Clock,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Loader2,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  /* ── Handlers ──────────────────────────────────────────────────────── */

  function handleOpenDetail(task: Task) {
    setDetailTask(task);
    setDetailOpen(true);
  }

  /** Employees cannot delete tasks — admins manage task lifecycle */
  function handleDeleteTask(_taskId: string) {
    toast.error("Only admins can delete tasks");
  }

  /* ── Render ────────────────────────────────────────────────────────── */

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <motion.div
        {...fadeUp(0)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
            {!loading && (
              <span className="text-xs font-semibold bg-teal-50 text-teal-600 px-2.5 py-1 rounded-full">
                {stats.total}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            {stats.completed} of {stats.total} completed · drag cards to update
            status
          </p>
        </div>
      </motion.div>

      {/* Stat mini-cards */}
      <motion.div
        {...fadeUp(0.08)}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {statCards.map((s, i) => (
          <motion.div key={s.label} {...fadeUp(0.1 + i * 0.05)}>
            <Card className="p-4 flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full ${s.iconBg} flex items-center justify-center shrink-0`}
              >
                <s.icon size={16} className={s.iconColor} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">
                  {loading ? (
                    "–"
                  ) : (
                    <CountUp end={s.value} duration={1.2} preserveValue />
                  )}
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  {s.label}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Board area */}
      {loading ? (
        <div className="flex gap-5">
          {[0, 1, 2].map((col) => (
            <div key={col} className="flex-1 min-w-[280px] space-y-3">
              <Skeleton className="h-7 w-32" />
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-3 min-h-[500px]">
                {Array.from({ length: col + 1 }).map((_, card) => (
                  <div
                    key={card}
                    className="bg-white rounded-xl border border-gray-200 p-4 space-y-3"
                  >
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-14 rounded-full" />
                      <Skeleton className="h-5 w-5" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <motion.div {...fadeUp(0.2)}>
          <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">
              Failed to load tasks
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Check your connection and try again.
            </p>
            <button
              onClick={fetchTasks}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div {...fadeUp(0.2)}>
          <KanbanBoard
            columns={columns}
            setColumns={setColumns}
            onOpenDetail={handleOpenDetail}
            onDeleteTask={handleDeleteTask}
            onRefetch={fetchTasks}
          />
        </motion.div>
      )}

      {/* Task Detail Modal — view-only for employees */}
      <TaskDetailModal
        open={detailOpen}
        task={detailTask}
        employees={[]}
        onClose={() => {
          setDetailOpen(false);
          setDetailTask(null);
        }}
        onDelete={handleDeleteTask}
        onRefetch={fetchTasks}
      />
    </div>
  );
}
