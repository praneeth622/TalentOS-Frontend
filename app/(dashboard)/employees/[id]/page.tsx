"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  X,
  ClipboardList,
  Link2,
} from "lucide-react";
import { api } from "@/lib/api";

/* ── Types ───────────────────────────────────────────────────────────── */

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  deadline: string | null;
  completedAt: string | null;
  createdAt?: string;
  txHash?: string | null;
}

interface Employee {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  department: string;
  skills: string[];
  walletAddress?: string | null;
  tasks: Task[];
}

interface ScoreData {
  finalScore: number;
  completionRate: number;
  deadlineScore: number;
  priorityScore: number;
  breakdown: {
    totalTasks: number;
    completedTasks: number;
    onTimeTasks: number;
    highPriorityCompleted: number;
    highPriorityTotal: number;
  };
  insight?: string;
}

/* ── Zod schema (same as employees list page) ────────────────────────── */

const employeeSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  walletAddress: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

/* ── Constants ───────────────────────────────────────────────────────── */

const ROLE_SKILLS: Record<string, string[]> = {
  Engineer: ["JavaScript", "React", "Node.js", "Git", "SQL", "TypeScript"],
  Designer: ["Figma", "CSS", "UI/UX", "Prototyping", "Wireframing"],
  Manager: ["Communication", "Planning", "Leadership", "Reporting", "Strategy"],
};

const DEFAULT_SKILLS = ["Communication", "Documentation"];

/* ── Animation helpers ───────────────────────────────────────────────── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.4, delay, ease: [0.25, 0.4, 0.25, 1] as const },
});

/* ── Shared UI ───────────────────────────────────────────────────────── */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] ${className}`}>
      {children}
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />;
}

/* ── Score helpers ────────────────────────────────────────────────────── */

function scoreColor(score: number) {
  if (score > 70) return { fill: "#22c55e", text: "text-green-600", bg: "bg-green-500" };
  if (score >= 40) return { fill: "#f59e0b", text: "text-amber-600", bg: "bg-amber-500" };
  return { fill: "#ef4444", text: "text-red-500", bg: "bg-red-500" };
}

/* ── Status / Priority helpers ───────────────────────────────────────── */

const STATUS_STYLE: Record<string, string> = {
  TODO: "bg-slate-100 text-slate-500",
  ASSIGNED: "bg-blue-50 text-blue-600",
  IN_PROGRESS: "bg-amber-50 text-amber-600",
  COMPLETED: "bg-green-50 text-green-600",
  CANCELLED: "bg-red-50 text-red-500",
};

const PRIORITY_STYLE: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-500",
  MEDIUM: "bg-blue-50 text-blue-600",
  HIGH: "bg-orange-50 text-orange-600",
  URGENT: "bg-red-50 text-red-600",
};

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ── Wallet address shortener ────────────────────────────────────────── */

function shortAddress(addr: string) {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/* ── Confirm Delete Dialog ───────────────────────────────────────────── */

function ConfirmDialog({
  name,
  onConfirm,
  onCancel,
}: {
  name: string;
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
            <h3 className="text-sm font-semibold text-slate-900">Delete Employee</h3>
            <p className="text-xs text-slate-400">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to remove <span className="font-semibold">{name}</span> from your
          team?
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

/* ── Edit Drawer ─────────────────────────────────────────────────────── */

function EditDrawer({
  open,
  onClose,
  onSuccess,
  employee,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee: Employee;
}) {
  const [skills, setSkills] = useState<string[]>(employee.skills);
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      walletAddress: employee.walletAddress ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        walletAddress: employee.walletAddress ?? "",
      });
      setSkills(employee.skills);
      setSkillInput("");
    }
  }, [open, employee, reset]);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const onSubmit = async (data: EmployeeFormValues) => {
    setSubmitting(true);
    try {
      await api.put(`/api/employees/${employee.id || employee._id}`, {
        ...data,
        skills,
      });
      toast.success("Employee updated");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Edit Employee</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
              {(
                [
                  { name: "name" as const, label: "Full Name", placeholder: "John Doe", type: "text" },
                  { name: "email" as const, label: "Email", placeholder: "john@company.com", type: "email" },
                  { name: "role" as const, label: "Role", placeholder: "Senior Engineer", type: "text" },
                  { name: "department" as const, label: "Department", placeholder: "Engineering", type: "text" },
                ]
              ).map((field) => (
                <div key={field.name}>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    {field.label} <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register(field.name)}
                    type={field.type}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder={field.placeholder}
                  />
                  {errors[field.name] && (
                    <p className="text-xs text-red-500 mt-1">{errors[field.name]?.message}</p>
                  )}
                </div>
              ))}

              {/* Skills */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-blue-900 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  placeholder="Type a skill and press Enter"
                />
              </div>

              {/* Wallet */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Wallet Address
                </label>
                <input
                  {...register("walletAddress")}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-mono text-xs"
                  placeholder="0x..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Updating…" : "Update Employee"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Radial Score Chart ──────────────────────────────────────────────── */

function RadialScore({ score }: { score: number }) {
  const color = scoreColor(score);
  const data = [{ name: "Score", value: score, fill: color.fill }];

  return (
    <div className="relative w-40 h-40 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="75%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          data={data}
          barSize={10}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            cornerRadius={5}
            background={{ fill: "#f1f5f9" }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${color.text}`}>{score}</span>
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          Score
        </span>
      </div>
    </div>
  );
}

/* ── Progress Bar ────────────────────────────────────────────────────── */

function MetricBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className="text-xs font-bold text-slate-700">
          {value.toFixed(1)}/{max}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7 }}
        />
      </div>
    </div>
  );
}

/* ── Skill Gaps ──────────────────────────────────────────────────────── */

function getRequiredSkills(role: string): string[] {
  const roleKey = Object.keys(ROLE_SKILLS).find((k) =>
    role.toLowerCase().includes(k.toLowerCase()),
  );
  return roleKey ? ROLE_SKILLS[roleKey] : DEFAULT_SKILLS;
}

/* ── Main Page ───────────────────────────────────────────────────────── */

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [score, setScore] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scoreLoading, setScoreLoading] = useState(true);
  const [error, setError] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchEmployee = useCallback(() => {
    setLoading(true);
    setError(false);
    api
      .get<{ success: boolean; data: Employee }>(`/api/employees/${id}`)
      .then((r) => setEmployee(r.data.data))
      .catch(() => {
        setError(true);
        toast.error("Failed to load employee");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const fetchScore = useCallback(() => {
    setScoreLoading(true);
    api
      .get<{ success: boolean; data: ScoreData }>(`/api/employees/${id}/score`)
      .then((r) => setScore(r.data.data))
      .catch(() => setScore(null))
      .finally(() => setScoreLoading(false));
  }, [id]);

  useEffect(() => {
    fetchEmployee();
    fetchScore();
  }, [fetchEmployee, fetchScore]);

  const handleDelete = async () => {
    if (!employee) return;
    try {
      await api.delete(`/api/employees/${employee.id || employee._id}`);
      toast.success(`${employee.name} removed`);
      router.push("/employees");
    } catch {
      toast.error("Failed to delete employee");
    }
    setShowDeleteConfirm(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditSuccess = () => {
    fetchEmployee();
    fetchScore();
  };

  // ── Loading state
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Card className="p-8">
          <div className="flex items-center gap-5">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-6 space-y-4">
            <Skeleton className="h-40 w-40 rounded-full mx-auto" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </Card>
          <Card className="p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ── Error state
  if (error || !employee) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            Failed to load employee
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            The employee may have been removed or you may not have access.
          </p>
          <button
            onClick={() => router.push("/employees")}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Employees
          </button>
        </Card>
      </div>
    );
  }

  const empId = employee.id || employee._id || "";
  const initials = employee.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const requiredSkills = getRequiredSkills(employee.role);
  const currentSkillsLower = employee.skills.map((s) => s.toLowerCase());
  const skillGaps = requiredSkills.filter(
    (s) => !currentSkillsLower.includes(s.toLowerCase()),
  );
  const sortedTasks = [...employee.tasks].sort(
    (a, b) =>
      new Date(b.createdAt ?? b.deadline ?? 0).getTime() -
      new Date(a.createdAt ?? a.deadline ?? 0).getTime(),
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <motion.div {...fadeUp(0)}>
        <button
          onClick={() => router.push("/employees")}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
        >
          <ArrowLeft size={16} />
          Back to Employees
        </button>
      </motion.div>

      {/* ── HEADER CARD ─────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.05)}>
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Large avatar */}
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700 shrink-0">
              {initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-900">{employee.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                  {employee.role}
                </span>
                <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                  {employee.department}
                </span>
                {employee.walletAddress && (
                  <button
                    onClick={() => handleCopy(employee.walletAddress!)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full hover:bg-purple-100 transition-colors"
                  >
                    <Link2 size={11} />
                    {shortAddress(employee.walletAddress)}
                    {copied ? (
                      <Check size={11} className="text-green-500" />
                    ) : (
                      <Copy size={11} />
                    )}
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1.5">{employee.email}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ── SCORE + SKILLS ROW ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Productivity Score Card */}
        <motion.div {...fadeUp(0.12)}>
          <Card className="p-6 h-full">
            <h2 className="text-[15px] font-semibold text-slate-800 mb-5">
              Productivity Score
            </h2>

            {scoreLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-40 w-40 rounded-full mx-auto" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
              </div>
            ) : score ? (
              <>
                <RadialScore score={score.finalScore} />

                <div className="space-y-4 mt-6">
                  <MetricBar
                    label="Completion Rate"
                    value={score.completionRate}
                    max={40}
                    color="bg-blue-500"
                  />
                  <MetricBar
                    label="Deadline Adherence"
                    value={score.deadlineScore}
                    max={35}
                    color="bg-green-500"
                  />
                  <MetricBar
                    label="Priority Score"
                    value={score.priorityScore}
                    max={25}
                    color="bg-amber-500"
                  />
                </div>

                {/* AI Insight */}
                {score.insight && (
                  <div className="mt-5 p-3.5 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {score.insight}
                    </p>
                  </div>
                )}

                {/* Powered by badge */}
                <div className="flex items-center justify-end gap-1.5 mt-4">
                  <Sparkles size={11} className="text-blue-500" />
                  <span className="text-[10px] text-slate-400 font-medium">
                    Powered by Gemini
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <ClipboardList size={28} className="text-slate-200" />
                <p className="text-sm text-slate-400">No score data available</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Skills Card */}
        <motion.div {...fadeUp(0.16)}>
          <Card className="p-6 h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
              {/* Current Skills */}
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800 mb-4">
                  Current Skills
                </h2>
                {employee.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No skills added</p>
                )}
              </div>

              {/* Skill Gaps */}
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800 mb-4">
                  Skill Gaps
                </h2>
                {skillGaps.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skillGaps.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-medium bg-red-50 text-red-600 px-2.5 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No skill gaps detected</p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ── TASK HISTORY TABLE ──────────────────────────────────────── */}
      <motion.div {...fadeUp(0.22)}>
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-slate-800">Task History</h2>
            <span className="text-[11px] text-slate-400">
              {employee.tasks.length} task{employee.tasks.length !== 1 ? "s" : ""}
            </span>
          </div>

          {sortedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-2">
              <ClipboardList size={28} className="text-slate-200" />
              <p className="text-sm text-slate-400">No tasks assigned yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                    <th className="text-left px-6 py-3">Title</th>
                    <th className="text-left px-6 py-3">Priority</th>
                    <th className="text-left px-6 py-3">Status</th>
                    <th className="text-left px-6 py-3 hidden sm:table-cell">Deadline</th>
                    <th className="text-left px-6 py-3 hidden md:table-cell">Completed</th>
                    <th className="text-left px-6 py-3 hidden lg:table-cell">Chain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sortedTasks.map((task, i) => (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 + i * 0.03 }}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-800">
                          {task.title}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${PRIORITY_STYLE[task.priority] ?? PRIORITY_STYLE.MEDIUM}`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_STYLE[task.status] ?? STATUS_STYLE.TODO}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              task.status === "COMPLETED"
                                ? "bg-green-500"
                                : task.status === "IN_PROGRESS"
                                  ? "bg-amber-400"
                                  : task.status === "ASSIGNED"
                                    ? "bg-blue-500"
                                    : "bg-slate-400"
                            }`}
                          />
                          {task.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell text-sm text-slate-500">
                        {formatDate(task.deadline)}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-sm text-slate-500">
                        {formatDate(task.completedAt)}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        {task.txHash ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            ⛓ Verified
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-300">—</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── DRAWER + DIALOG ─────────────────────────────────────────── */}
      <EditDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSuccess={handleEditSuccess}
        employee={employee}
      />

      <AnimatePresence>
        {showDeleteConfirm && (
          <ConfirmDialog
            name={employee.name}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
