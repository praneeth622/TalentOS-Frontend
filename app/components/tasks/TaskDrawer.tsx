"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { X, Sparkles, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { Task, Employee } from "@/types/tasks";

/* ── Zod schema ──────────────────────────────────────────────────────── */

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  employeeId: z.string().min(1, "Please assign an employee"),
  skillRequired: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  deadline: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

/* ── Props ────────────────────────────────────────────────────────────── */

interface TaskDrawerProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employees: Employee[];
  task?: Task | null;
}

/* ── Component ───────────────────────────────────────────────────────── */

export default function TaskDrawer({
  open,
  onClose,
  onSuccess,
  employees,
  task,
}: TaskDrawerProps) {
  const isEdit = !!task;
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    name: string;
    reason: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      employeeId: "",
      skillRequired: "",
      priority: "MEDIUM",
      deadline: "",
    },
  });

  const titleValue = watch("title");
  const skillValue = watch("skillRequired");

  // Reset form when drawer opens/closes or task changes
  useEffect(() => {
    if (open) {
      setAiSuggestion(null);
      if (task) {
        reset({
          title: task.title,
          description: task.description ?? "",
          employeeId: task.employeeId,
          skillRequired: task.skillRequired ?? "",
          priority: task.priority,
          deadline: task.deadline
            ? new Date(task.deadline).toISOString().split("T")[0]
            : "",
        });
      } else {
        reset({
          title: "",
          description: "",
          employeeId: "",
          skillRequired: "",
          priority: "MEDIUM",
          deadline: "",
        });
      }
    }
  }, [open, task, reset]);

  /* ── AI Smart Assign ───────────────────────────────────────────────── */

  async function handleAiSuggest() {
    if ((titleValue?.length ?? 0) < 3) return;

    setAiLoading(true);
    setAiSuggestion(null);
    try {
      const res = await api.post<{
        success: boolean;
        data: { recommendedEmployee: string; reason: string };
      }>("/api/ai/smart-assign", {
        taskTitle: titleValue,
        skillRequired: skillValue?.trim() || "General",
      });

      const { recommendedEmployee, reason } = res.data.data;

      // Find matching employee and auto-select
      const match = employees.find(
        (e) => e.name.toLowerCase() === recommendedEmployee.toLowerCase(),
      );
      if (match) {
        setValue("employeeId", match.id);
      }

      setAiSuggestion({ name: recommendedEmployee, reason });
    } catch {
      toast.error("AI suggestion failed, please assign manually");
    } finally {
      setAiLoading(false);
    }
  }

  /* ── Submit ────────────────────────────────────────────────────────── */

  const onSubmit = async (data: TaskFormValues) => {
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        title: data.title,
        employeeId: data.employeeId,
        priority: data.priority,
      };
      if (data.description) payload.description = data.description;
      if (data.skillRequired) payload.skillRequired = data.skillRequired;
      if (data.deadline) payload.deadline = new Date(data.deadline).toISOString();

      if (isEdit && task) {
        await api.put(`/api/tasks/${task.id}`, payload);
        toast.success("Task updated");
      } else {
        await api.post("/api/tasks", payload);
        toast.success("Task added");
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[480px] bg-white shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                {isEdit ? "Edit Task" : "Add Task"}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto p-6 space-y-5"
            >
              {/* Title */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("title")}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  placeholder="e.g. Build user authentication"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
                  placeholder="Optional task description…"
                />
              </div>

              {/* Skill Required */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Skill Required
                </label>
                <input
                  {...register("skillRequired")}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  placeholder="e.g. React, Node.js, Design"
                />
              </div>

              {/* Assign To */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Assign To <span className="text-red-400">*</span>
                </label>
                <select
                  {...register("employeeId")}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                >
                  <option value="">Select employee…</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} — {emp.role}
                    </option>
                  ))}
                </select>
                {errors.employeeId && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.employeeId.message}
                  </p>
                )}
              </div>

              {/* AI Smart Assign */}
              <div>
                <button
                  type="button"
                  onClick={handleAiSuggest}
                  disabled={aiLoading || (titleValue?.length ?? 0) < 3}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {aiLoading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Sparkles size={13} />
                  )}
                  {aiLoading ? "Suggesting…" : "AI Suggest"}
                </button>

                {/* AI suggestion chip */}
                <AnimatePresence>
                  {aiSuggestion && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-2 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full"
                    >
                      <Sparkles size={11} />
                      <span>AI suggests: {aiSuggestion.name}</span>
                      <span
                        className="text-[10px] text-indigo-400 max-w-[180px] truncate"
                        title={aiSuggestion.reason}
                      >
                        — {aiSuggestion.reason}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAiSuggestion(null)}
                        className="hover:text-indigo-900 transition-colors ml-1"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Priority
                </label>
                <select
                  {...register("priority")}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              {/* Deadline */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Deadline
                </label>
                <input
                  {...register("deadline")}
                  type="date"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {submitting
                  ? isEdit
                    ? "Saving…"
                    : "Adding…"
                  : isEdit
                    ? "Save Changes"
                    : "Add Task"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
