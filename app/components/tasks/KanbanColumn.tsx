"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";
import KanbanCard from "./KanbanCard";
import type { Task, ColumnId } from "@/types/tasks";

/* ── Column config ───────────────────────────────────────────────────── */

const COLUMN_CONFIG: Record<
  ColumnId,
  { title: string; border: string; dotBg: string; badgeBg: string; badgeText: string }
> = {
  ASSIGNED: {
    title: "Assigned",
    border: "border-t-blue-500",
    dotBg: "bg-blue-500",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
  },
  IN_PROGRESS: {
    title: "In Progress",
    border: "border-t-amber-500",
    dotBg: "bg-amber-500",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
  },
  COMPLETED: {
    title: "Completed",
    border: "border-t-green-500",
    dotBg: "bg-green-500",
    badgeBg: "bg-green-100",
    badgeText: "text-green-700",
  },
};

/* ── Props ────────────────────────────────────────────────────────────── */

interface KanbanColumnProps {
  id: ColumnId;
  tasks: Task[];
  index: number;
  onOpenDetail: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onRefetch: () => void;
}

/* ── Component ───────────────────────────────────────────────────────── */

export default function KanbanColumn({
  id,
  tasks,
  index,
  onOpenDetail,
  onDeleteTask,
  onRefetch,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const config = COLUMN_CONFIG[id];
  const taskIds = tasks.map((t) => t.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      className="flex-1 min-w-[280px]"
    >
      {/* Column header */}
      <div className="flex items-center gap-2.5 mb-3 px-1">
        <div className={`w-2.5 h-2.5 rounded-full ${config.dotBg}`} />
        <h3 className="text-sm font-semibold text-slate-700">{config.title}</h3>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${config.badgeBg} ${config.badgeText}`}
        >
          {tasks.length}
        </span>
      </div>

      {/* Column body */}
      <div
        ref={setNodeRef}
        className={`
          min-h-[500px] rounded-xl
          bg-gray-50 border ${config.border} border-t-[3px]
          border-gray-200
          p-3 flex flex-col gap-3
          transition-all duration-200
          ${isOver ? "ring-2 ring-indigo-400/50 bg-indigo-50/30" : ""}
        `}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-12 gap-2">
              <ClipboardList size={24} className="text-gray-300" />
              <p className="text-xs text-gray-400 font-medium">No tasks</p>
            </div>
          ) : (
            tasks.map((task, i) => (
              <KanbanCard
                key={task.id}
                task={task}
                index={i}
                onOpenDetail={onOpenDetail}
                onDelete={onDeleteTask}
                onRefetch={onRefetch}
              />
            ))
          )}
        </SortableContext>
      </div>
    </motion.div>
  );
}
