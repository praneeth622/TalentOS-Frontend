"use client";

import { useState, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensors,
  useSensor,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { api } from "@/lib/api";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import type { Task, ColumnId, ColumnMap } from "@/types/tasks";

/* ── Helpers ─────────────────────────────────────────────────────────── */

const COLUMN_IDS: ColumnId[] = ["ASSIGNED", "IN_PROGRESS", "COMPLETED"];

const COLUMN_LABELS: Record<ColumnId, string> = {
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

function findColumn(cols: ColumnMap, taskId: string): ColumnId | null {
  for (const col of COLUMN_IDS) {
    if (cols[col].some((t) => t.id === taskId)) return col;
  }
  return null;
}

/* ── Props ────────────────────────────────────────────────────────────── */

interface KanbanBoardProps {
  columns: ColumnMap;
  setColumns: React.Dispatch<React.SetStateAction<ColumnMap>>;
  onOpenDetail: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onRefetch: () => void;
}

/* ── Component ───────────────────────────────────────────────────────── */

export default function KanbanBoard({
  columns,
  setColumns,
  onOpenDetail,
  onDeleteTask,
  onRefetch,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Track the original column when drag starts — survives across dragOver state changes
  const dragSourceCol = useRef<ColumnId | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  /* ── Drag Start ────────────────────────────────────────────────────── */

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id as string;
    const col = findColumn(columns, id);
    if (col) {
      dragSourceCol.current = col;
      const task = columns[col].find((t) => t.id === id);
      if (task) setActiveTask(task);
    }
  }

  /* ── Drag Over (optimistic UI move) ────────────────────────────────── */

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    setColumns((prev) => {
      const sourceCol = findColumn(prev, activeId);
      const destCol = COLUMN_IDS.includes(overId as ColumnId)
        ? (overId as ColumnId)
        : findColumn(prev, overId);

      if (!sourceCol || !destCol || sourceCol === destCol) return prev;

      const sourceItems = prev[sourceCol].filter((t) => t.id !== activeId);
      const movedTask = prev[sourceCol].find((t) => t.id === activeId);
      if (!movedTask) return prev;

      const destItems = [...prev[destCol]];
      const overIndex = destItems.findIndex((t) => t.id === overId);
      const insertIndex = overIndex >= 0 ? overIndex : destItems.length;

      destItems.splice(insertIndex, 0, {
        ...movedTask,
        status: destCol as Task["status"],
      });

      return { ...prev, [sourceCol]: sourceItems, [destCol]: destItems };
    });
  }

  /* ── Drag End (API call) ───────────────────────────────────────────── */

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const originalSourceCol = dragSourceCol.current;
    setActiveTask(null);
    dragSourceCol.current = null;

    if (!over || !originalSourceCol) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find where the card is NOW (after dragOver already moved it)
    const currentCol = findColumn(columns, activeId);
    if (!currentCol) return;

    // Same-column reorder
    if (currentCol === originalSourceCol) {
      const items = columns[currentCol];
      const oldIndex = items.findIndex((t) => t.id === activeId);
      const newIndex = items.findIndex((t) => t.id === overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setColumns((prev) => ({
          ...prev,
          [currentCol]: arrayMove(prev[currentCol], oldIndex, newIndex),
        }));
      }
      return;
    }

    // Cross-column move — card was already moved by dragOver, just call API
    const task = columns[currentCol].find((t) => t.id === activeId);
    const taskTitle = task?.title ?? activeTask?.title ?? "Task";

    // Backend uses "TODO" instead of "ASSIGNED"
    const apiStatus = currentCol === "ASSIGNED" ? "TODO" : currentCol;

    try {
      await api.patch(`/api/tasks/${activeId}/status`, {
        status: apiStatus,
      });
      toast.success(`"${taskTitle}" moved to ${COLUMN_LABELS[currentCol]}`);
    } catch {
      // Revert: move task back to original column
      setColumns((prev) => {
        const movedTask = prev[currentCol].find((t) => t.id === activeId);
        if (!movedTask) return prev;
        return {
          ...prev,
          [currentCol]: prev[currentCol].filter((t) => t.id !== activeId),
          [originalSourceCol]: [
            ...prev[originalSourceCol],
            { ...movedTask, status: originalSourceCol as Task["status"] },
          ],
        };
      });
      toast.error("Failed to update task");
    }
  }

  function handleDragCancel() {
    // Revert to original position by refetching
    const originalCol = dragSourceCol.current;
    setActiveTask(null);
    dragSourceCol.current = null;
    if (originalCol) {
      onRefetch();
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-5 overflow-x-auto pb-4">
        {COLUMN_IDS.map((colId, i) => (
          <KanbanColumn
            key={colId}
            id={colId}
            tasks={columns[colId]}
            index={i}
            onOpenDetail={onOpenDetail}
            onDeleteTask={onDeleteTask}
            onRefetch={onRefetch}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <KanbanCard
            task={activeTask}
            index={0}
            onOpenDetail={() => {}}
            onDelete={() => {}}
            onRefetch={() => {}}
            overlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
