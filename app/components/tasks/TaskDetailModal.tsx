"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  X,
  Trash2,
  AlertTriangle,
  Calendar,
  User,
  Tag,
  Flag,
  Loader2,
  Check,
  Link2,
  Sparkles,
  CircleDot,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Task, Employee } from "@/types/tasks";

/* ── Status / Priority config ────────────────────────────────────────── */

const STATUS_OPTIONS = [
  { value: "TODO", label: "To Do", dot: "bg-slate-400", bg: "bg-slate-100 text-slate-600" },
  { value: "IN_PROGRESS", label: "In Progress", dot: "bg-amber-400", bg: "bg-amber-50 text-amber-700" },
  { value: "COMPLETED", label: "Completed", dot: "bg-green-500", bg: "bg-green-50 text-green-700" },
] as const;

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low", bg: "bg-gray-100 text-gray-600" },
  { value: "MEDIUM", label: "Medium", bg: "bg-amber-100 text-amber-700" },
  { value: "HIGH", label: "High", bg: "bg-red-100 text-red-700" },
] as const;

/* ── Helpers ─────────────────────────────────────────────────────────── */

function formatDateFull(d: string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function toDateInputValue(d: string | null | undefined) {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}

/* ── Confirm Delete Dialog ───────────────────────────────────────────── */

function ConfirmDeleteDialog({
  title,
  onConfirm,
  onCancel,
}: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Delete Task</h3>
            <p className="text-xs text-slate-400">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete &ldquo;{title}&rdquo;?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Props ────────────────────────────────────────────────────────────── */

interface TaskDetailModalProps {
  open: boolean;
  task: Task | null;
  employees: Employee[];
  onClose: () => void;
  onDelete: (taskId: string) => void;
  onRefetch: () => void;
}

/* ── Component ───────────────────────────────────────────────────────── */

export default function TaskDetailModal({
  open,
  task,
  employees,
  onClose,
  onDelete,
  onRefetch,
}: TaskDetailModalProps) {
  // Editable local state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [employeeId, setEmployeeId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [skillRequired, setSkillRequired] = useState("");

  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [logging, setLogging] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Populate from task
  useEffect(() => {
    if (task && open) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setStatus(task.status);
      setPriority(task.priority);
      setEmployeeId(task.employeeId);
      setDeadline(toDateInputValue(task.deadline));
      setSkillRequired(task.skillRequired ?? "");
      setHasChanges(false);
    }
  }, [task, open]);

  if (!task) return null;

  const currentEmployee = employees.find((e) => e.id === employeeId);
  const initials = currentEmployee?.name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") ?? "";
  const currentStatus = STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0];
  const currentPriority = PRIORITY_OPTIONS.find((p) => p.value === priority) ?? PRIORITY_OPTIONS[1];

  function markChanged() {
    setHasChanges(true);
  }

  /* ── Save ───────────────────────────────────────────────────────────── */

  async function handleSave() {
    if (!task || !title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        employeeId,
        skillRequired: skillRequired.trim() || undefined,
      };
      if (deadline) {
        payload.deadline = new Date(deadline).toISOString();
      }
      await api.put(`/api/tasks/${task.id}`, payload);
      toast.success("Task updated");
      setHasChanges(false);
      onRefetch();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to update task";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  /* ── Delete ─────────────────────────────────────────────────────────── */

  function handleDelete() {
    if (!task) return;
    onDelete(task.id);
    onClose();
  }

  /* ── Chain log ──────────────────────────────────────────────────────── */

  async function logTaskToChain() {
    if (!task) return;
    const ethereum = (window as unknown as { ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    } }).ethereum;
    if (!ethereum) {
      toast.error("Please install MetaMask to verify tasks on-chain");
      return;
    }
    setLogging(true);
    try {
      const accounts = (await ethereum.request({ method: "eth_requestAccounts" })) as string[];
      const message = `TalentOS Task Verified\nTask ID: ${task.id}\nTimestamp: ${new Date().toISOString()}\nVerified by: ${accounts[0]}`;
      const signature = await ethereum.request({ method: "personal_sign", params: [message, accounts[0]] });
      await api.patch(`/api/tasks/${task.id}/txhash`, { txHash: signature });
      toast.success("Task verified on Polygon");
      onRefetch();
    } catch (err: unknown) {
      const code = (err as { code?: number })?.code;
      if (code === 4001) toast.error("Wallet connection cancelled");
      else toast.error("Failed to log task, please try again");
    } finally {
      setLogging(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Header ─────────────────────────────────────────────── */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${currentStatus.bg}`}>
                    {currentStatus.label}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">{task.id.slice(0, 8)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* ── Body (two columns) ─────────────────────────────────── */}
              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col md:flex-row">
                  {/* ── LEFT: Main content ──────────────────────────────── */}
                  <div className="flex-1 p-6 space-y-5 md:border-r md:border-slate-100">
                    {/* Title */}
                    <div>
                      <input
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); markChanged(); }}
                        className="w-full text-xl font-bold text-slate-900 bg-transparent border-none outline-none placeholder-slate-300 focus:ring-0"
                        placeholder="Task title…"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => { setDescription(e.target.value); markChanged(); }}
                        rows={8}
                        className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none leading-relaxed"
                        placeholder="Add a detailed description for this task…&#10;&#10;You can describe the requirements, acceptance criteria, implementation notes, etc."
                      />
                    </div>

                    {/* Skill Required */}
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                        Skill Required
                      </label>
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-slate-400 shrink-0" />
                        <input
                          value={skillRequired}
                          onChange={(e) => { setSkillRequired(e.target.value); markChanged(); }}
                          className="flex-1 px-3 py-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                          placeholder="e.g. React, Node.js, Design"
                        />
                      </div>
                    </div>

                    {/* Chain verification */}
                    {status === "COMPLETED" && (
                      <div className="pt-2">
                        {task.txHash ? (
                          <button
                            onClick={() =>
                              window.open(`https://amoy.polygonscan.com/tx/${task.txHash}`, "_blank")
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-700 bg-green-100 rounded-xl hover:bg-green-200 transition-colors"
                          >
                            <Check size={14} />
                            Verified on Polygon
                          </button>
                        ) : (
                          <button
                            onClick={logTaskToChain}
                            disabled={logging}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50"
                          >
                            {logging ? <Loader2 size={14} className="animate-spin" /> : <Link2 size={14} />}
                            {logging ? "Signing…" : "Log to Chain"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ── RIGHT: Metadata panel ──────────────────────────── */}
                  <div className="w-full md:w-[260px] p-6 space-y-5 bg-slate-50/50 shrink-0">
                    {/* Status */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        <CircleDot size={12} />
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); markChanged(); }}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        <Flag size={12} />
                        Priority
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => { setPriority(e.target.value); markChanged(); }}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      >
                        {PRIORITY_OPTIONS.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Assignee */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        <User size={12} />
                        Assignee
                      </label>
                      <select
                        value={employeeId}
                        onChange={(e) => { setEmployeeId(e.target.value); markChanged(); }}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      >
                        <option value="">Unassigned</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} — {emp.role}
                          </option>
                        ))}
                      </select>
                      {currentEmployee && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-700 shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-700">{currentEmployee.name}</p>
                            <p className="text-[10px] text-slate-400">{currentEmployee.role}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        <Calendar size={12} />
                        Deadline
                      </label>
                      <input
                        type="date"
                        value={deadline}
                        onChange={(e) => { setDeadline(e.target.value); markChanged(); }}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      />
                      {deadline && (
                        <p className="text-[11px] text-slate-400 mt-1">
                          {formatDateFull(deadline)}
                        </p>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="pt-3 border-t border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-400 uppercase">Created</span>
                        <span className="text-[11px] text-slate-500">
                          {formatDateFull(task.createdAt)}
                        </span>
                      </div>
                      {task.completedAt && (
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-medium text-slate-400 uppercase">Completed</span>
                          <span className="text-[11px] text-slate-500">
                            {formatDateFull(task.completedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Footer ─────────────────────────────────────────────── */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Delete confirm (sits above modal) */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <ConfirmDeleteDialog
                title={task.title}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
