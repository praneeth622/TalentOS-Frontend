export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: "TODO" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  deadline?: string | null;
  completedAt?: string | null;
  txHash?: string | null;
  skillRequired?: string | null;
  employeeId: string;
  employee?: { id: string; name: string; email?: string; role: string };
  orgId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email?: string;
}

export type ColumnId = "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";
export type ColumnMap = Record<ColumnId, Task[]>;
