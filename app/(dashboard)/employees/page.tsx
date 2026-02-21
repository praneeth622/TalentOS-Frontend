"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import axios from "axios";
import {
  Users,
  Search,
  Plus,
  UserCheck,
  Clock,
  X,
  Pencil,
  Trash2,
  AlertTriangle,
  RefreshCw,
  UserPlus,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Upload,
  Loader2,
  Download,
} from "lucide-react";
import { api, getToken } from "@/lib/api";
import { exportEmployeesCSV } from "@/lib/export";

/* ── Types ───────────────────────────────────────────────────────────── */

interface Employee {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  department: string;
  skills: string[];
  walletAddress?: string;
  status?: string;
}

interface EmployeeScore {
  finalScore: number;
  completionRate: number;
  deadlineScore: number;
  priorityScore: number;
}

interface ExtractionResult {
  name?: string;
  role?: string;
  summary?: string;
  skills: string[];
}

/* ── Zod schema ──────────────────────────────────────────────────────── */

const employeeSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  walletAddress: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

/* ── Animation helpers ───────────────────────────────────────────────── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.25, 0.4, 0.25, 1] as const },
});

/* ── Card shell ──────────────────────────────────────────────────────── */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] ${className}`}>
      {children}
    </div>
  );
}

/* ── Skeleton ────────────────────────────────────────────────────────── */

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />;
}

/* ── Score bar helpers ───────────────────────────────────────────────── */

function scoreBarColor(score: number): string {
  if (score >= 90) return "bg-green-500";
  if (score >= 75) return "bg-blue-500";
  return "bg-amber-400";
}

/* ── Avatar ──────────────────────────────────────────────────────────── */

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
      {initials}
    </div>
  );
}

/* ── Productivity Score ──────────────────────────────────────────────── */

function ProductivityScore({ employeeId }: { employeeId: string }) {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    api
      .get<{ success: boolean; data: EmployeeScore }>(`/api/employees/${employeeId}/score`)
      .then((r) => setScore(r.data.data.finalScore))
      .catch(() => setScore(null))
      .finally(() => setLoading(false));
  }, [employeeId]);

  if (loading) return <Skeleton className="h-1.5 w-full" />;
  if (score === null) return <span className="text-[11px] text-slate-300">N/A</span>;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${scoreBarColor(score)}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
      <span className="text-xs font-bold text-slate-700 w-7 text-right">{score}</span>
    </div>
  );
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

/* ── Resume Upload Component ─────────────────────────────────────────── */

type UploadState = "idle" | "selected" | "loading" | "success" | "error";

const PROGRESS_STEPS = [
  { icon: "📄", text: "Reading PDF…" },
  { icon: "🤖", text: "Analyzing with Gemini AI…" },
];

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Maps HTTP status codes and error messages from the extract-skills
 * endpoint to human-readable strings shown in the UI.
 */
function resolveExtractionError(err: unknown): string {
  const status = (err as { response?: { status?: number } })?.response?.status;
  if (status === 413) return "File is too large. Please use a PDF under 5 MB.";
  if (status === 400) {
    const msg =
      (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "";
    if (msg.toLowerCase().includes("scan"))
      return "This PDF appears to be scanned. Please use a text-based PDF.";
    return "Only PDF files are accepted.";
  }
  return "AI extraction failed. You can still add skills manually.";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ResumeUploadProps {
  /** Called when the user clicks "Add N Skills to Profile" */
  onSkillsMerge: (skills: string[]) => void;
  /** Called when user accepts a name/role suggestion */
  onSuggestionAccept: (field: "name" | "role", value: string) => void;
  /** Current form values — used to decide whether to show suggestions */
  currentName: string;
  currentRole: string;
  /** Lets the parent lock all other form fields during extraction */
  onLoadingChange: (loading: boolean) => void;
}

function ResumeUpload({
  onSkillsMerge,
  onSuggestionAccept,
  currentName,
  currentRole,
  onLoadingChange,
}: ResumeUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [progressStep, setProgressStep] = useState(0);
  /* Tracks which extracted skills are checked (all checked by default) */
  const [checkedSkills, setCheckedSkills] = useState<Set<string>>(new Set());

  const inputRef = useRef<HTMLInputElement>(null);

  /* ── File validation ─────────────────────────────────────────────── */

  const acceptFile = (f: File) => {
    if (f.type !== "application/pdf") {
      toast.error("Only PDF files are accepted.");
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      toast.error("File is too large. Max size is 5 MB.");
      return;
    }
    setFile(f);
    setUploadState("selected");
  };

  /* ── Drag handlers ───────────────────────────────────────────────── */

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) acceptFile(dropped);
  };

  /* ── Extract skills ──────────────────────────────────────────────── */

  const extract = async () => {
    if (!file) return;

    setUploadState("loading");
    setProgressStep(0);
    onLoadingChange(true);

    /* Fake step 1 after 500 ms, then stay on step 2 until API responds */
    const stepTimer = setTimeout(() => setProgressStep(1), 500);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const token = getToken();
      const response = await axios.post<{ success: boolean; data: ExtractionResult }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/extract-skills`,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const data = response.data.data;
      setResult(data);
      /* All skills checked by default */
      setCheckedSkills(new Set(data.skills));
      setUploadState("success");
    } catch (err) {
      setErrorMsg(resolveExtractionError(err));
      setUploadState("error");
    } finally {
      clearTimeout(stepTimer);
      onLoadingChange(false);
    }
  };

  /* ── Toggle skill checkbox ───────────────────────────────────────── */

  const toggleSkill = (skill: string) => {
    setCheckedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      return next;
    });
  };

  /* ── Merge skills into form ──────────────────────────────────────── */

  const handleAddSkills = () => {
    const selected = [...checkedSkills];
    onSkillsMerge(selected);
    toast.success(`✨ ${selected.length} skill${selected.length !== 1 ? "s" : ""} added to profile`);
    /* Collapse the results card but keep the file row */
    setUploadState("selected");
    setResult(null);
  };

  /* ── Reset ───────────────────────────────────────────────────────── */

  const reset = () => {
    setFile(null);
    setResult(null);
    setErrorMsg("");
    setCheckedSkills(new Set());
    setUploadState("idle");
    onLoadingChange(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  /* ── Render ──────────────────────────────────────────────────────── */

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-700 block">
        Resume / CV{" "}
        <span className="text-xs font-normal text-slate-400">(optional)</span>
      </label>

      <AnimatePresence mode="wait">
        {/* ── IDLE — drop zone ─────────────────────────────────────── */}
        {uploadState === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={`relative flex flex-col items-center justify-center gap-2 py-8 px-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors select-none ${
                isDragOver
                  ? "bg-blue-50 border-blue-400"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80"
              }`}
              animate={isDragOver ? { scale: 1.01 } : { scale: 1 }}
              transition={{ duration: 0.15 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) acceptFile(f);
                }}
              />

              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isDragOver ? "bg-blue-100" : "bg-slate-100"
                }`}
              >
                {isDragOver ? (
                  <Upload size={20} className="text-blue-600" strokeWidth={1.8} />
                ) : (
                  <FileText size={20} className="text-slate-500" strokeWidth={1.8} />
                )}
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-slate-700">
                  {isDragOver ? "Drop to upload" : "Drop PDF resume here"}
                </p>
                {!isDragOver && (
                  <p className="text-xs text-slate-400 mt-0.5">or click to browse</p>
                )}
                <p className="text-xs text-slate-400 mt-1">PDF only · Max 5 MB</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── SELECTED — file preview + extract button ──────────────── */}
        {(uploadState === "selected" || uploadState === "success") && file && (
          <motion.div
            key="selected"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* File row */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-blue-100 bg-blue-50">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <FileText size={16} className="text-blue-600" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                <p className="text-[11px] text-slate-400">{formatBytes(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            {/* Extract button — hide after results shown */}
            {uploadState === "selected" && (
              <motion.button
                type="button"
                onClick={extract}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles size={15} strokeWidth={1.8} />
                Extract Skills from Resume
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ── LOADING — progress steps ──────────────────────────────── */}
        {uploadState === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-blue-100 bg-blue-50 p-5"
          >
            {/* Animated file row */}
            <div className="flex items-center gap-3 mb-4 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <FileText size={16} className="text-blue-400" strokeWidth={1.8} />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-blue-200 rounded-full w-3/4" />
                <div className="h-2 bg-blue-100 rounded-full w-1/3" />
              </div>
            </div>

            {/* Progress steps */}
            <div className="space-y-2">
              {PROGRESS_STEPS.map((step, i) => (
                <AnimatePresence key={i}>
                  {progressStep >= i && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-2.5"
                    >
                      <span className="text-base leading-none">{step.icon}</span>
                      <span className="text-xs font-medium text-slate-600">{step.text}</span>
                      {i === progressStep && (
                        <Loader2
                          size={13}
                          className="ml-auto text-blue-500 animate-spin shrink-0"
                        />
                      )}
                      {i < progressStep && (
                        <CheckCircle2
                          size={13}
                          className="ml-auto text-green-500 shrink-0"
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── ERROR ────────────────────────────────────────────────── */}
        {uploadState === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-red-100 bg-red-50 p-4"
          >
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" strokeWidth={1.8} />
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
            <button
              type="button"
              onClick={() => setUploadState("selected")}
              className="text-xs font-semibold text-red-600 hover:text-red-700 underline underline-offset-2"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SUCCESS — results card ────────────────────────────────────── */}
      <AnimatePresence>
        {uploadState === "success" && result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-green-100 bg-green-50 p-4 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600 shrink-0" strokeWidth={2} />
              <p className="text-sm font-semibold text-green-700">Skills extracted successfully!</p>
            </div>

            {/* Suggestions — name */}
            {result.name && !currentName.trim() && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500">Suggested name:</span>
                <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                  {result.name}
                </span>
                <button
                  type="button"
                  onClick={() => onSuggestionAccept("name", result.name!)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                >
                  Use this
                </button>
              </div>
            )}

            {/* Suggestions — role */}
            {result.role && !currentRole.trim() && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500">Suggested role:</span>
                <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                  {result.role}
                </span>
                <button
                  type="button"
                  onClick={() => onSuggestionAccept("role", result.role!)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                >
                  Use this
                </button>
              </div>
            )}

            {/* Summary */}
            {result.summary && (
              <p className="text-[11px] text-slate-500 leading-relaxed italic border-l-2 border-slate-200 pl-3">
                {result.summary}
              </p>
            )}

            {/* Skills with checkboxes */}
            {result.skills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  Skills found ({result.skills.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.skills.map((skill) => {
                    const checked = checkedSkills.has(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                          checked
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-white text-slate-400 border-slate-200 line-through"
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                            checked ? "bg-green-500 border-green-500" : "border-slate-300"
                          }`}
                        >
                          {checked && (
                            <svg viewBox="0 0 10 8" className="w-2 h-2 fill-white">
                              <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add skills button */}
            <motion.button
              type="button"
              onClick={handleAddSkills}
              disabled={checkedSkills.size === 0}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: checkedSkills.size > 0 ? 1.01 : 1 }}
              whileTap={{ scale: checkedSkills.size > 0 ? 0.98 : 1 }}
            >
              <Sparkles size={14} strokeWidth={1.8} />
              Add {checkedSkills.size} Skill{checkedSkills.size !== 1 ? "s" : ""} to Profile
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Employee Drawer ──────────────────────────────────────────────────── */

function EmployeeDrawer({
  open,
  onClose,
  onSuccess,
  employee,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee?: Employee | null;
}) {
  const isEdit = !!employee;
  const [skills, setSkills] = useState<string[]>(employee?.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee
      ? {
          name: employee.name,
          email: employee.email,
          role: employee.role,
          department: employee.department,
          walletAddress: employee.walletAddress ?? "",
        }
      : { name: "", email: "", role: "", department: "", walletAddress: "" },
  });

  const watchedName = watch("name");
  const watchedRole = watch("role");

  /* Reset form when drawer reopens */
  useEffect(() => {
    if (open) {
      reset(
        employee
          ? {
              name: employee.name,
              email: employee.email,
              role: employee.role,
              department: employee.department,
              walletAddress: employee.walletAddress ?? "",
            }
          : { name: "", email: "", role: "", department: "", walletAddress: "" },
      );
      setSkills(employee?.skills ?? []);
      setSkillInput("");
      setExtracting(false);
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

  /**
   * Merges extracted skills from PDF into the current skills list,
   * deduplicating case-insensitively.
   */
  const handleSkillsMerge = (extracted: string[]) => {
    setSkills((prev) => {
      const existing = new Set(prev.map((s) => s.toLowerCase()));
      const newSkills = extracted.filter((s) => !existing.has(s.toLowerCase()));
      return [...prev, ...newSkills];
    });
  };

  /**
   * Accepts a name or role suggestion from the AI extraction results
   * and writes it into the corresponding form field.
   */
  const handleSuggestionAccept = (field: "name" | "role", value: string) => {
    setValue(field, value, { shouldValidate: true });
  };

  const onSubmit = async (data: EmployeeFormValues) => {
    setSubmitting(true);
    try {
      const payload = { ...data, skills };
      if (isEdit) {
        await api.put(`/api/employees/${employee.id || employee._id}`, payload);
        toast.success("Employee updated");
      } else {
        await api.post("/api/employees", payload);
        toast.success("Employee added");
      }
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

  const isLocked = submitting || extracting;

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
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {isEdit ? "Edit Employee" : "Add Employee"}
                </h2>
                {!isEdit && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload a PDF to auto-fill skills with AI
                  </p>
                )}
              </div>
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
              {/* ── Resume upload — only on Add, not Edit ───────────── */}
              {!isEdit && (
                <ResumeUpload
                  onSkillsMerge={handleSkillsMerge}
                  onSuggestionAccept={handleSuggestionAccept}
                  currentName={watchedName ?? ""}
                  currentRole={watchedRole ?? ""}
                  onLoadingChange={setExtracting}
                />
              )}

              {/* Divider shown when upload section is visible */}
              {!isEdit && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                    Employee details
                  </span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>
              )}

              {/* Full Name */}
              <fieldset disabled={isLocked} className="contents">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("name")}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="john@company.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Role <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("role")}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Senior Engineer"
                  />
                  {errors.role && (
                    <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Department <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("department")}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Engineering"
                  />
                  {errors.department && (
                    <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>
                  )}
                </div>

                {/* Skills tag input */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Skills
                  </label>

                  {/* Tag chips */}
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      <AnimatePresence>
                        {skills.map((skill) => (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ duration: 0.15 }}
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
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    onBlur={addSkill}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Type a skill and press Enter or comma"
                    disabled={isLocked}
                  />
                </div>

                {/* Wallet address */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Wallet Address
                  </label>
                  <input
                    {...register("walletAddress")}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-mono disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="0x..."
                  />
                </div>
              </fieldset>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLocked}
                className="w-full py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={15} className="animate-spin" />}
                {submitting
                  ? isEdit
                    ? "Updating…"
                    : "Adding…"
                  : isEdit
                    ? "Update Employee"
                    : "Add Employee"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Employee Card ───────────────────────────────────────────────────── */

function EmployeeCard({
  employee,
  index,
  onEdit,
  onDelete,
  onClick,
}: {
  employee: Employee;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  const empId = employee.id || employee._id || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card className="p-5 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-shadow cursor-pointer group">
        <div onClick={onClick}>
          {/* Top row: avatar + actions */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar name={employee.name} />
              <div>
                <h3 className="text-sm font-semibold text-slate-800">{employee.name}</h3>
                <p className="text-xs text-slate-400">{employee.role}</p>
              </div>
            </div>
            <div
              className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onEdit}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                title="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={onDelete}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Department badge */}
          <div className="mb-3">
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              {employee.department}
            </span>
          </div>

          {/* Skills (first 3) */}
          {employee.skills && employee.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {employee.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {employee.skills.length > 3 && (
                <span className="text-[10px] font-medium text-slate-400">
                  +{employee.skills.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Productivity score */}
        <div className="pt-3 border-t border-slate-50">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
            Productivity
          </p>
          <ProductivityScore employeeId={empId} />
        </div>
      </Card>
    </motion.div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────── */

export default function EmployeesPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const fetchEmployees = useCallback(() => {
    setLoading(true);
    setError(false);
    api
      .get<{ success: boolean; data: Employee[] }>("/api/employees")
      .then((r) => setEmployees(r.data.data))
      .catch(() => {
        setError(true);
        toast.error("Failed to load employees");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filtered = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q),
    );
  }, [employees, search]);

  const totalCount = employees.length;
  const activeCount = employees.filter((e) => !e.status || e.status === "Active").length;
  const onLeaveCount = employees.filter((e) => e.status === "On Leave").length;

  const handleAdd = () => {
    setEditingEmployee(null);
    setDrawerOpen(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setDrawerOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;
    const id = deletingEmployee.id || deletingEmployee._id;
    try {
      await api.delete(`/api/employees/${id}`);
      setEmployees((prev) => prev.filter((e) => (e.id || e._id) !== id));
      toast.success(`${deletingEmployee.name} removed`);
    } catch {
      toast.error("Failed to delete employee");
    }
    setDeletingEmployee(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <motion.div
        {...fadeUp(0)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
            {!loading && (
              <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                {totalCount}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage your team and track their performance.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <motion.button
            onClick={() => {
              toast("Downloading team data…");
              exportEmployeesCSV(employees);
            }}
            disabled={employees.length === 0}
            className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download size={15} strokeWidth={2} />
            Export CSV
          </motion.button>
          <motion.button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Employee
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div {...fadeUp(0.08)} className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total", value: totalCount, icon: Users, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
          { label: "Active", value: activeCount, icon: UserCheck, iconBg: "bg-green-100", iconColor: "text-green-600" },
          { label: "On Leave", value: onLeaveCount, icon: Clock, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
        ].map((s, i) => (
          <motion.div key={s.label} {...fadeUp(0.1 + i * 0.05)}>
            <Card className="p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full ${s.iconBg} flex items-center justify-center shrink-0`}>
                <s.icon size={18} className={s.iconColor} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{loading ? "–" : s.value}</p>
                <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div {...fadeUp(0.2)}>
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, role, or department…"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-24 rounded-full" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-1.5 w-full mt-2" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <motion.div {...fadeUp(0.2)}>
          <Card className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Failed to load employees</h3>
            <p className="text-xs text-slate-400 mb-4">Something went wrong. Please try again.</p>
            <button
              onClick={fetchEmployees}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </Card>
        </motion.div>
      ) : employees.length === 0 ? (
        <motion.div {...fadeUp(0.2)}>
          <Card className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Users size={26} className="text-slate-300" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">No team members yet</h3>
            <p className="text-xs text-slate-400 mb-5">
              Get started by adding your first employee.
            </p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors"
            >
              <UserPlus size={15} />
              Add your first employee
            </button>
          </Card>
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div {...fadeUp(0.2)}>
          <Card className="p-12 flex flex-col items-center justify-center text-center">
            <Search size={24} className="text-slate-200 mb-3" />
            <h3 className="text-sm font-semibold text-slate-800 mb-1">No results found</h3>
            <p className="text-xs text-slate-400">Try adjusting your search query.</p>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((emp, i) => (
            <EmployeeCard
              key={emp.id || emp._id}
              employee={emp}
              index={i}
              onEdit={() => handleEdit(emp)}
              onDelete={() => setDeletingEmployee(emp)}
              onClick={() => router.push(`/employees/${emp.id || emp._id}`)}
            />
          ))}
        </div>
      )}

      {/* Drawer */}
      <EmployeeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSuccess={fetchEmployees}
        employee={editingEmployee}
      />

      {/* Delete confirm */}
      <AnimatePresence>
        {deletingEmployee && (
          <ConfirmDialog
            name={deletingEmployee.name}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeletingEmployee(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
