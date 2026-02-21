/* ── CSV Export Utilities ─────────────────────────────────────────────── */

interface EmployeeExport {
  name: string;
  email: string;
  role: string;
  department: string;
  skills: string[];
  walletAddress?: string;
  createdAt?: string;
}

interface TaskExport {
  title: string;
  priority: string;
  status: string;
  deadline?: string | null;
  completedAt?: string | null;
  txHash?: string | null;
  employee?: { name: string } | null;
}

export function exportEmployeesCSV(employees: EmployeeExport[]) {
  const headers = [
    "Name",
    "Email",
    "Role",
    "Department",
    "Skills",
    "Wallet Address",
    "Joined Date",
  ];

  const rows = employees.map((emp) => [
    emp.name,
    emp.email,
    emp.role,
    emp.department,
    emp.skills.join("; "),
    emp.walletAddress || "",
    emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : "",
  ]);

  downloadCSV([headers, ...rows], `talentos-team-${getDateStr()}.csv`);
}

export function exportTasksCSV(tasks: TaskExport[]) {
  const headers = [
    "Title",
    "Assigned To",
    "Priority",
    "Status",
    "Deadline",
    "Completed Date",
    "Verified On Chain",
  ];

  const rows = tasks.map((task) => [
    task.title,
    task.employee?.name || "",
    task.priority,
    task.status,
    task.deadline ? new Date(task.deadline).toLocaleDateString() : "",
    task.completedAt ? new Date(task.completedAt).toLocaleDateString() : "",
    task.txHash ? "Yes" : "No",
  ]);

  downloadCSV([headers, ...rows], `talentos-tasks-${getDateStr()}.csv`);
}

function downloadCSV(data: string[][], filename: string) {
  const csv = data
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getDateStr() {
  return new Date().toISOString().split("T")[0];
}
