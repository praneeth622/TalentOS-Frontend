"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Calendar,
  BookOpen,
  Lock,
  Wallet,
  ExternalLink,
  Eye,
  EyeOff,
  Pencil,
  X,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Copy,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { api, getStoredEmployee } from "@/lib/api";
import {
  connectWallet,
  getShortAddress,
  isMetaMaskInstalled,
  getCurrentAccount,
  addPolygonAmoyNetwork,
} from "@/lib/web3";
import type { MyProfile, MyScore } from "@/types/dashboard";

/* ── Types ──────────────────────────────────────────────────────────── */

interface SkillGap {
  missingSkills: string[];
  coveragePercent: number;
  learningPlan: string[];
}

/* ── Animation helper ───────────────────────────────────────────────── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: [0.25, 0.4, 0.25, 1] as const },
});

/* ── Card shell ─────────────────────────────────────────────────────── */

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Skeleton ───────────────────────────────────────────────────────── */

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
  );
}

/* ── Score helpers ──────────────────────────────────────────────────── */

function scoreTextColor(s: number) {
  if (s >= 70) return "text-green-600";
  if (s >= 40) return "text-amber-500";
  return "text-red-500";
}

function scoreLabel(s: number) {
  if (s >= 70) return "Excellent performance";
  if (s >= 40) return "Good progress";
  return "Needs improvement";
}

/* ── Score bar ──────────────────────────────────────────────────────── */

function ScoreBar({
  label,
  value,
  barColor,
  delay,
}: {
  label: string;
  value: number;
  barColor: string;
  delay: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className="text-xs font-bold text-slate-700">{value}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, value)}%` }}
          transition={{ duration: 0.8, delay }}
        />
      </div>
    </div>
  );
}

/* ── Password strength ──────────────────────────────────────────────── */

function getStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"] as const;
const STRENGTH_COLOR = [
  "",
  "bg-red-400",
  "bg-amber-400",
  "bg-blue-500",
  "bg-green-500",
] as const;

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score = getStrength(password);
  const color = STRENGTH_COLOR[score] ?? "bg-slate-200";

  return (
    <div className="mt-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < score ? color : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-1">{STRENGTH_LABEL[score]}</p>
    </div>
  );
}

/* ── Field error ────────────────────────────────────────────────────── */

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

/* ── Password input ─────────────────────────────────────────────────── */

function PwInput({
  id,
  placeholder,
  visible,
  onToggle,
  error,
  registration,
}: {
  id: string;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
  error?: string;
  registration: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <div className="relative">
      <Lock
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        id={id}
        {...registration}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        className={`w-full pl-10 pr-11 py-2.5 rounded-xl border bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
          error
            ? "border-red-300 focus:ring-red-400/20"
            : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
        }`}
      />
      <button
        type="button"
        onClick={onToggle}
        tabIndex={-1}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        {visible ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

/* ── Change password schema ─────────────────────────────────────────── */

const pwSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type PwForm = z.infer<typeof pwSchema>;

/* ── Coverage color helpers ─────────────────────────────────────────── */

function coverageTextColor(pct: number) {
  if (pct >= 80) return "text-green-600";
  if (pct >= 50) return "text-amber-500";
  return "text-red-500";
}

function coverageBarColor(pct: number) {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 50) return "bg-amber-400";
  return "bg-red-400";
}

/* ── Initials ───────────────────────────────────────────────────────── */

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════ */

export default function MyProfilePage() {
  const storedEmployee = getStoredEmployee();

  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [score, setScore] = useState<MyScore | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingScore, setLoadingScore] = useState(true);

  /* --- Skill Gap state (6A) --- */
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null);
  const [loadingSkillGap, setLoadingSkillGap] = useState(false);
  const [skillGapFetched, setSkillGapFetched] = useState(false);

  /* --- Skill edit state (6B) --- */
  const [editingSkills, setEditingSkills] = useState(false);
  const [localSkills, setLocalSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [savingSkills, setSavingSkills] = useState(false);
  const skillInputRef = useRef<HTMLInputElement>(null);

  /* Password form state */
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwSubmitting, setPwSubmitting] = useState(false);

  /* --- Wallet state (6C) --- */
  const [walletLoading, setWalletLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PwForm>({ resolver: zodResolver(pwSchema) });

  const newPasswordValue = watch("newPassword") ?? "";

  /* ── Fetch ─────────────────────────────────────────────────────── */

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get<{ success: true; data: MyProfile }>(
        "/api/employees/me"
      );
      setProfile(res.data.data);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  const fetchScore = useCallback(async () => {
    try {
      const res = await api.get<{ success: true; data: MyScore }>(
        "/api/employees/me/score"
      );
      setScore(res.data.data);
    } catch {
      toast.error("Failed to load score");
    } finally {
      setLoadingScore(false);
    }
  }, []);

  /**
   * Fetches AI skill gap analysis for this employee.
   * Pass refresh=true to bypass the backend cache and force a new analysis.
   */
  const fetchSkillGap = useCallback(async (refresh = false) => {
    setLoadingSkillGap(true);
    try {
      const url = refresh
        ? "/api/ai/skill-gap/me?refresh=true"
        : "/api/ai/skill-gap/me";
      const res = await api.get<{
        success: true;
        data: SkillGap;
      }>(url);
      setSkillGap(res.data.data);
      setSkillGapFetched(true);
    } catch {
      toast.error("Failed to load skill gap analysis");
    } finally {
      setLoadingSkillGap(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchScore();
    // Check if MetaMask is already connected
    getCurrentAccount().then(setCurrentAccount).catch(() => {});
  }, [fetchProfile, fetchScore]);

  // Fetch skill gap once profile has loaded (we need role for coverage label)
  useEffect(() => {
    if (profile && !skillGapFetched) {
      fetchSkillGap();
    }
  }, [profile, skillGapFetched, fetchSkillGap]);

  /* ── Skill editing (6B) ─────────────────────────────────────────── */

  function startEditSkills() {
    setLocalSkills(profile?.skills ?? []);
    setSkillInput("");
    setEditingSkills(true);
    setTimeout(() => skillInputRef.current?.focus(), 50);
  }

  function cancelEditSkills() {
    setEditingSkills(false);
    setLocalSkills([]);
    setSkillInput("");
  }

  function addSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (localSkills.map((s) => s.toLowerCase()).includes(trimmed.toLowerCase()))
      return;
    setLocalSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
    skillInputRef.current?.focus();
  }

  function removeSkill(skill: string) {
    setLocalSkills((prev) => prev.filter((s) => s !== skill));
  }

  async function saveSkills() {
    if (!profile) return;
    setSavingSkills(true);
    try {
      await api.put(`/api/employees/${profile.id}`, { skills: localSkills });
      toast.success("Skills updated");
      setEditingSkills(false);
      setSkillGapFetched(false); // invalidate skill gap cache
      fetchProfile();
    } catch {
      toast.error("Failed to update skills");
    } finally {
      setSavingSkills(false);
    }
  }

  /* ── Change password ────────────────────────────────────────────── */

  const onChangePassword = async (values: PwForm) => {
    setPwSubmitting(true);
    try {
      await api.post("/api/auth/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password updated successfully");
      reset();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Failed to update password";
      toast.error(msg);
    } finally {
      setPwSubmitting(false);
    }
  };

  /* ── Wallet handlers (6C) ───────────────────────────────────────── */

  const handleConnectWallet = async () => {
    if (!profile) return;
    setWalletLoading(true);
    try {
      // Silent-fail: user may reject network add
      try {
        await addPolygonAmoyNetwork();
      } catch {
        /* ignore */
      }

      const address = await connectWallet();
      await api.put(`/api/employees/${profile.id}`, { walletAddress: address });
      setCurrentAccount(address);
      toast.success("Wallet connected and saved");
      fetchProfile();
    } catch {
      toast.error("Failed to connect wallet");
    } finally {
      setWalletLoading(false);
    }
  };

  const handleDisconnectWallet = async () => {
    if (!profile) return;
    setWalletLoading(true);
    try {
      await api.put(`/api/employees/${profile.id}`, { walletAddress: null });
      toast.success("Wallet removed from profile");
      fetchProfile();
    } catch {
      toast.error("Failed to remove wallet");
    } finally {
      setWalletLoading(false);
    }
  };

  /* Display name from store while loading */
  const displayName = profile?.name ?? storedEmployee?.name ?? "…";
  const displayRole = profile?.role ?? storedEmployee?.role ?? "";
  const displayDept = profile?.department ?? storedEmployee?.department ?? "";

  return (
    <div className="max-w-6xl space-y-6">
      {/* ── Page header ─────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)}>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Manage your account and view performance
        </p>
      </motion.div>

      {/* ── Two-column layout ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ════════════════════════════════════
            LEFT COLUMN — 1/3
        ════════════════════════════════════ */}
        <div className="space-y-5">
          {/* ── Profile card ──────────────────────────────────── */}
          <motion.div {...fadeUp(0.05)}>
            <Card className="p-6 text-center">
              {loadingProfile ? (
                <div className="space-y-3 flex flex-col items-center">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24 rounded-full" />
                  <Skeleton className="h-3.5 w-40 mt-2" />
                </div>
              ) : (
                <>
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-2xl font-bold mx-auto mb-3">
                    {getInitials(displayName)}
                  </div>

                  <h2 className="text-xl font-bold text-slate-800 mb-1">
                    {displayName}
                  </h2>

                  {/* Role badge */}
                  <span className="inline-block bg-teal-50 text-teal-600 border border-teal-200 rounded-full px-3 py-0.5 text-sm font-medium mb-1">
                    {displayRole}
                  </span>

                  <p className="text-sm text-slate-400 mb-4">{displayDept}</p>

                  <div className="space-y-2 text-left">
                    {/* Email */}
                    <div className="flex items-center gap-2.5">
                      <Mail
                        size={14}
                        className="text-slate-400 shrink-0"
                        strokeWidth={1.8}
                      />
                      <span className="text-sm text-slate-500 truncate">
                        {profile?.email ?? storedEmployee?.email}
                      </span>
                    </div>

                    {/* Member since */}
                    {profile?.createdAt && (
                      <div className="flex items-center gap-2.5">
                        <Calendar
                          size={14}
                          className="text-slate-400 shrink-0"
                          strokeWidth={1.8}
                        />
                        <span className="text-xs text-slate-400">
                          Joined{" "}
                          {new Date(profile.createdAt).toLocaleDateString(
                            "en-IN",
                            { month: "long", year: "numeric" }
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </Card>
          </motion.div>

          {/* ── Skills card (6B) ──────────────────────────────── */}
          <motion.div {...fadeUp(0.1)} id="skills">
            <Card className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen
                    size={16}
                    className="text-teal-600"
                    strokeWidth={1.8}
                  />
                  <h3 className="font-semibold text-slate-800 text-[15px]">
                    Skills
                  </h3>
                </div>

                {/* Edit / Save / Cancel controls */}
                {!loadingProfile && (
                  <div className="flex items-center gap-1.5">
                    {editingSkills ? (
                      <>
                        <button
                          onClick={cancelEditSkills}
                          className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveSkills}
                          disabled={savingSkills}
                          className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-60 flex items-center gap-1.5"
                        >
                          {savingSkills && (
                            <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          )}
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={startEditSkills}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        title="Edit skills"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {loadingProfile ? (
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-7 w-20 rounded-full" />
                  ))}
                </div>
              ) : editingSkills ? (
                /* ── Edit mode ── */
                <div className="space-y-3">
                  {/* Chips with remove button */}
                  <div className="flex flex-wrap gap-2">
                    {localSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-xs font-semibold flex items-center gap-1.5"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    {localSkills.length === 0 && (
                      <p className="text-xs text-slate-400 italic">
                        No skills yet — add one below
                      </p>
                    )}
                  </div>

                  {/* Add skill input */}
                  <div className="flex gap-2">
                    <input
                      ref={skillInputRef}
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Add a skill..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    />
                    <button
                      onClick={addSkill}
                      className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-colors shrink-0"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              ) : /* ── View mode ── */
              profile && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No skills added yet. Click the pencil to add some.
                </p>
              )}
            </Card>
          </motion.div>

          {/* ── Wallet card (6C) ──────────────────────────────── */}
          <motion.div {...fadeUp(0.15)}>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wallet
                  size={16}
                  className="text-teal-600"
                  strokeWidth={1.8}
                />
                <h3 className="font-semibold text-slate-800 text-[15px]">
                  Web3 Wallet
                </h3>
              </div>

              {loadingProfile ? (
                <Skeleton className="h-24 w-full" />
              ) : !isMetaMaskInstalled() ? (
                /* MetaMask not installed */
                <div className="text-center py-4">
                  <p className="text-sm text-slate-500 mb-3">
                    MetaMask required for Web3 features
                  </p>
                  <a
                    href="https://metamask.io/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all"
                  >
                    <ExternalLink size={14} />
                    Install MetaMask
                  </a>
                </div>
              ) : profile?.walletAddress ? (
                /* Wallet connected */
                <div className="space-y-2">
                  {/* Connected indicator */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-semibold text-green-600">
                      Connected
                    </span>
                  </div>

                  {/* Address row */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-mono text-sm text-slate-700">
                      {getShortAddress(profile.walletAddress)}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          profile.walletAddress ?? ""
                        );
                        toast.success("Address copied");
                      }}
                      className="text-slate-400 hover:text-teal-600 transition-colors p-1"
                    >
                      <Copy size={13} />
                    </button>
                  </div>

                  {/* Network badge */}
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    Polygon Amoy Testnet
                  </span>

                  {/* Polygonscan link */}
                  <a
                    href={`https://amoy.polygonscan.com/address/${profile.walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-teal-600 hover:underline flex items-center gap-1 mt-1"
                  >
                    View on Polygonscan
                    <ExternalLink size={10} strokeWidth={2} />
                  </a>

                  {/* Disconnect */}
                  <button
                    onClick={handleDisconnectWallet}
                    disabled={walletLoading}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors mt-3 flex items-center gap-1 disabled:opacity-50"
                  >
                    <X size={11} />
                    Remove wallet from profile
                  </button>
                </div>
              ) : (
                /* MetaMask installed but not connected */
                <div className="space-y-3">
                  {currentAccount && (
                    <p className="text-xs text-slate-400">
                      Detected:{" "}
                      <span className="font-mono text-slate-600">
                        {getShortAddress(currentAccount)}
                      </span>
                    </p>
                  )}
                  <p className="text-sm text-slate-400">
                    Connect your MetaMask wallet to verify tasks on-chain.
                  </p>
                  <button
                    onClick={handleConnectWallet}
                    disabled={walletLoading}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {walletLoading ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Wallet size={15} strokeWidth={2} />
                    )}
                    {walletLoading ? "Connecting…" : "Connect MetaMask Wallet"}
                  </button>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* ════════════════════════════════════
            RIGHT COLUMN — 2/3
        ════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-5">
          {/* ── Score card ────────────────────────────────────── */}
          <motion.div {...fadeUp(0.08)}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-slate-800 text-[15px]">
                    My Productivity Score
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Weighted from task completion, deadlines &amp; priorities
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                  This cycle
                </span>
              </div>

              {loadingScore ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-20 mx-auto rounded-2xl" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ) : score ? (
                <>
                  {/* Big score */}
                  <div className="text-center mb-6">
                    <p
                      className={`text-6xl font-bold leading-none ${scoreTextColor(score.finalScore)}`}
                    >
                      <CountUp end={score.finalScore} duration={1.4} />
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                      {scoreLabel(score.finalScore)}
                    </p>
                  </div>

                  {/* Score bars */}
                  <div className="space-y-4 mb-6">
                    <ScoreBar
                      label="Completion Rate"
                      value={score.completionRate}
                      barColor="bg-blue-500"
                      delay={0.1}
                    />
                    <ScoreBar
                      label="Deadline Score"
                      value={score.deadlineScore}
                      barColor="bg-amber-400"
                      delay={0.2}
                    />
                    <ScoreBar
                      label="Priority Score"
                      value={score.priorityScore}
                      barColor="bg-teal-500"
                      delay={0.3}
                    />
                  </div>

                  {/* Breakdown grid — 5 stats */}
                  <div className="grid grid-cols-5 gap-3 pt-4 border-t border-slate-50">
                    {[
                      { label: "Total", value: score.breakdown.totalTasks },
                      {
                        label: "Completed",
                        value: score.breakdown.completedTasks,
                      },
                      { label: "On Time", value: score.breakdown.onTimeTasks },
                      {
                        label: "High Priority",
                        value: score.breakdown.highPriorityTotal,
                      },
                      {
                        label: "High Done",
                        value: score.breakdown.highPriorityCompleted,
                      },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <p className="text-lg font-bold text-slate-800">
                          {item.value}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-400 text-sm">
                    No score data yet. Complete tasks to generate your score.
                  </p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* ── Change password card ───────────────────────────── */}
          <motion.div {...fadeUp(0.13)}>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <Lock size={16} className="text-teal-600" strokeWidth={1.8} />
                <h3 className="font-semibold text-slate-800 text-[15px]">
                  Change Password
                </h3>
              </div>

              <form
                onSubmit={handleSubmit(onChangePassword)}
                noValidate
                className="space-y-4"
              >
                {/* Current password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Current Password
                  </label>
                  <PwInput
                    id="currentPassword"
                    placeholder="Your current password"
                    visible={showCurrent}
                    onToggle={() => setShowCurrent((v) => !v)}
                    error={errors.currentPassword?.message}
                    registration={register("currentPassword")}
                  />
                  <FieldError message={errors.currentPassword?.message} />
                </div>

                {/* New password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <PwInput
                    id="newPassword"
                    placeholder="Min. 8 characters"
                    visible={showNew}
                    onToggle={() => setShowNew((v) => !v)}
                    error={errors.newPassword?.message}
                    registration={register("newPassword")}
                  />
                  <PasswordStrength password={newPasswordValue} />
                  <FieldError message={errors.newPassword?.message} />
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <PwInput
                    id="confirmPassword"
                    placeholder="Repeat your new password"
                    visible={showConfirm}
                    onToggle={() => setShowConfirm((v) => !v)}
                    error={errors.confirmPassword?.message}
                    registration={register("confirmPassword")}
                  />
                  <FieldError message={errors.confirmPassword?.message} />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={pwSubmitting}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  {pwSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Lock size={14} strokeWidth={2.2} />
                  )}
                  {pwSubmitting ? "Updating…" : "Update Password"}
                </button>
              </form>
            </Card>
          </motion.div>

          {/* ── Skill Gap card (6A) ───────────────────────────── */}
         
        </div>
      </div>
    </div>
  );
}
