"use client";

import { motion } from "framer-motion";
import { ClipboardList, Plus, Search, CheckCircle2, Clock, Circle, AlertCircle } from "lucide-react";

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

type TaskStatus = "Assigned" | "In Progress" | "Completed";
type Priority = "High" | "Medium" | "Low";

interface Task {
  id: number;
  title: string;
  assignee: string;
  priority: Priority;
  status: TaskStatus;
  due: string;
}

const mockTasks: Task[] = [
  { id: 1, title: "Implement auth middleware", assignee: "Aryan Mehta", priority: "High", status: "Completed", due: "Feb 18" },
  { id: 2, title: "Design onboarding flow", assignee: "Sneha Nair", priority: "High", status: "In Progress", due: "Feb 22" },
  { id: 3, title: "Migrate DB schema to v2", assignee: "Rahul Verma", priority: "Medium", status: "Assigned", due: "Feb 25" },
  { id: 4, title: "Write unit tests for scoring", assignee: "Divya Iyer", priority: "Medium", status: "In Progress", due: "Feb 23" },
  { id: 5, title: "Update API documentation", assignee: "Kiran Patel", priority: "Low", status: "Assigned", due: "Feb 28" },
  { id: 6, title: "Fix pagination bug", assignee: "Priya Sharma", priority: "High", status: "Completed", due: "Feb 19" },
];

const statusConfig: Record<TaskStatus, { icon: React.ElementType; label: string; badge: string; dot: string }> = {
  Assigned: { icon: Circle, label: "Assigned", badge: "bg-slate-100 text-slate-500", dot: "bg-slate-300" },
  "In Progress": { icon: Clock, label: "In Progress", badge: "bg-amber-50 text-amber-600", dot: "bg-amber-400" },
  Completed: { icon: CheckCircle2, label: "Completed", badge: "bg-green-50 text-green-600", dot: "bg-green-500" },
};

const priorityConfig: Record<Priority, { badge: string; dot: string }> = {
  High: { badge: "bg-red-50 text-red-500", dot: "bg-red-400" },
  Medium: { badge: "bg-amber-50 text-amber-600", dot: "bg-amber-400" },
  Low: { badge: "bg-blue-50 text-blue-500", dot: "bg-blue-400" },
};

/**
 * Tasks page — full task list with status, priority, and assignee columns.
 */
export default function TasksPage() {
  const counts = {
    total: mockTasks.length,
    assigned: mockTasks.filter(t => t.status === "Assigned").length,
    inProgress: mockTasks.filter(t => t.status === "In Progress").length,
    completed: mockTasks.filter(t => t.status === "Completed").length,
  };

  const completionPct = Math.round((counts.completed / counts.total) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-sm text-slate-400 mt-0.5">Track and assign work across your organisation.</p>
        </div>
        <motion.button
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={15} strokeWidth={2.5} />
          New Task
        </motion.button>
      </motion.div>

      {/* Completion rate card (Image 2 style) */}
      <motion.div {...fadeUp(0.08)}>
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Task Completion Rate</p>
              <p className="text-4xl font-bold text-slate-900">{completionPct}%</p>
            </div>
            <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              This month
            </span>
          </div>

          {/* Dot progress bar (inspired by Image 2) */}
          <div className="flex items-center gap-1.5 mb-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${
                  i < Math.round(completionPct / 5) ? "bg-green-500" : "bg-slate-100"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400">
            {counts.completed} of {counts.total} tasks completed
          </p>
        </Card>
      </motion.div>

      {/* Stat mini-cards */}
      <motion.div {...fadeUp(0.14)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: counts.total, icon: ClipboardList, iconBg: "bg-slate-100", iconColor: "text-slate-600" },
          { label: "Assigned", value: counts.assigned, icon: Circle, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
          { label: "In Progress", value: counts.inProgress, icon: Clock, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
          { label: "Completed", value: counts.completed, icon: CheckCircle2, iconBg: "bg-green-100", iconColor: "text-green-600" },
        ].map((s, i) => (
          <motion.div key={s.label} {...fadeUp(0.16 + i * 0.05)}>
            <Card className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${s.iconBg} flex items-center justify-center shrink-0`}>
                <s.icon size={16} className={s.iconColor} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-[11px] text-slate-400 font-medium">{s.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div {...fadeUp(0.26)} className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks…"
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        />
      </motion.div>

      {/* Task list */}
      <motion.div {...fadeUp(0.32)}>
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">All Tasks</h2>
            <span className="text-[11px] text-slate-400">{mockTasks.length} tasks</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                  <th className="text-left px-6 py-3">Task</th>
                  <th className="text-left px-6 py-3 hidden sm:table-cell">Assignee</th>
                  <th className="text-left px-6 py-3">Priority</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3 hidden md:table-cell">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockTasks.map((task, i) => {
                  const sc = statusConfig[task.status];
                  const pc = priorityConfig[task.priority];
                  const StatusIcon = sc.icon;
                  return (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 + i * 0.05 }}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <StatusIcon
                            size={15}
                            className={task.status === "Completed" ? "text-green-500" : task.status === "In Progress" ? "text-amber-400" : "text-slate-300"}
                            strokeWidth={task.status === "Completed" ? 2.2 : 1.8}
                          />
                          <span className={`text-sm font-medium ${task.status === "Completed" ? "line-through text-slate-400" : "text-slate-800"}`}>
                            {task.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell text-sm text-slate-500">{task.assignee}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${pc.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${sc.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-[11px] text-slate-400 font-mono">{task.due}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
