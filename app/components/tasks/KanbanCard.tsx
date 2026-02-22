"use client";

import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import type { Task } from "@/types/tasks";
import { LogToChainButton } from "@/app/components/web3/LogToChainButton";

/* ── Priority badge config ───────────────────────────────────────────── */

const PRIORITY_STYLE: Record<string, string> = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-gray-100 text-gray-600",
};

/* ── Helpers ─────────────────────────────────────────────────────────── */

function formatDate(d: string | null | undefined) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function isOverdue(deadline: string | null | undefined, status: string) {
  if (!deadline || status === "COMPLETED") return false;
  return new Date(deadline) < new Date();
}

/* ── Kebab Menu ──────────────────────────────────────────────────────── */

function KebabMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <MoreHorizontal size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 z-30 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 overflow-hidden"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onEdit();
              }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Pencil size={13} />
              Edit task
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onDelete();
              }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} />
              Delete task
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
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
          Are you sure you want to delete{" "}
          <span className="font-semibold">&ldquo;{title}&rdquo;</span>?
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

interface KanbanCardProps {
  task: Task;
  index: number;
  onOpenDetail: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onRefetch: () => void;
  overlay?: boolean;
}

/* ── Component ───────────────────────────────────────────────────────── */

export default function KanbanCard({
  task,
  index,
  onOpenDetail,
  onDelete,
  onRefetch,
  overlay = false,
}: KanbanCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const overdue = isOverdue(task.deadline, task.status);

  function handleDelete() {
    setShowConfirm(true);
  }

  function confirmDelete() {
    onDelete(task.id);
    setShowConfirm(false);
  }

  const cardClasses = `
    bg-white rounded-xl border border-gray-200
    p-4 shadow-sm
    cursor-grab active:cursor-grabbing
    transition-all duration-200
    ${isDragging ? "opacity-40" : ""}
    ${overlay ? "rotate-1 scale-[1.02] shadow-xl" : ""}
  `;

  const initials = task.employee?.name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <>
      <motion.div
        ref={!overlay ? setNodeRef : undefined}
        style={!overlay ? style : undefined}
        {...(!overlay ? attributes : {})}
        {...(!overlay ? listeners : {})}
        initial={!overlay ? { opacity: 0, y: 10 } : false}
        animate={!overlay ? { opacity: 1, y: 0 } : undefined}
        transition={!overlay ? { delay: index * 0.05 } : undefined}
        layout={!overlay}
        className={cardClasses}
        onClick={() => { if (!overlay && !isDragging) onOpenDetail(task); }}
      >
        {/* Top row: priority + kebab */}
        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_STYLE[task.priority] ?? PRIORITY_STYLE.MEDIUM}`}
          >
            {task.priority}
          </span>
          <div onClick={(e) => e.stopPropagation()}>
            <KebabMenu
              onEdit={() => onOpenDetail(task)}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-slate-800 mt-2 line-clamp-2 leading-snug">
          {task.title}
        </p>

        {/* Assignee */}
        {task.employee && (
          <div className="flex items-center gap-2 mt-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-700 shrink-0">
              {initials}
            </div>
            <span className="text-xs text-slate-500 truncate">
              {task.employee.name}
            </span>
          </div>
        )}

        {/* Deadline */}
        {task.deadline && (
          <div className="flex items-center gap-1.5 mt-2.5">
            <Calendar size={11} className={overdue ? "text-red-500" : "text-slate-400"} />
            <span className={`text-[11px] font-medium ${overdue ? "text-red-500" : "text-slate-400"}`}>
              {formatDate(task.deadline)}
            </span>
            {overdue && (
              <span className="text-[9px] font-semibold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full ml-1">
                Overdue
              </span>
            )}
          </div>
        )}

        {/* Bottom: Chain verification */}
        {task.status === "COMPLETED" && (
          <div onClick={(e) => e.stopPropagation()}>
            <LogToChainButton
              taskId={task.id}
              taskTitle={task.title}
              txHash={task.txHash}
              onVerified={onRefetch}
            />
          </div>
        )}
      </motion.div>

      {/* Delete confirm */}
      <AnimatePresence>
        {showConfirm && (
          <ConfirmDeleteDialog
            title={task.title}
            onConfirm={confirmDelete}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
