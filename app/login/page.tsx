"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Building2,
  UserCircle,
  Zap,
  CheckCircle,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { api, getToken } from "../../lib/api";

/* ── Types ─────────────────────────────────────────────────────────── */

type ActiveTab = "admin" | "employee";

/** Minimal decoded JWT payload — only what we inspect client-side. */
interface JwtPayloadPartial {
  employeeId?: string;
}

/* ── Schema ─────────────────────────────────────────────────────────── */

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type LoginForm = z.infer<typeof loginSchema>;

/* ── Field error ────────────────────────────────────────────────────── */

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <AlertCircle size={12} />
      {message}
    </motion.p>
  );
}

/* ── Left decorative panel ──────────────────────────────────────────── */

const features = [
  "AI-powered productivity scoring",
  "Real-time task management",
  "Web3 workforce verification",
] as const;

function LeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 flex-col bg-slate-900 relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full px-10 py-12">
        {/* Logo mark */}
        <div className="flex items-center gap-3 mb-auto">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-teal-500 to-blue-600 flex items-center justify-center shrink-0">
            <Zap size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">
            Talent<span className="text-teal-400">OS</span>
          </span>
        </div>

        {/* Main copy */}
        <div className="mb-auto">
          <h2 className="text-white text-3xl font-bold leading-tight mb-3">
            Manage your workforce
            <br />
            with AI intelligence
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            Unified platform for HR teams and employees
          </p>

          {/* Feature bullets */}
          <div className="space-y-3">
            {features.map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                <span className="text-slate-300 text-sm">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Register CTA */}
        <p className="text-slate-500 text-xs mt-10">
          New organization?{" "}
          <Link
            href="/register"
            className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
          >
            Create an account →
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────── */

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>("admin");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Auth guard — redirect already-authenticated users */
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      ) as JwtPayloadPartial;
      router.replace(payload.employeeId ? "/employee-dashboard" : "/dashboard");
    } catch {
      router.replace("/dashboard");
    }
  }, [router]);

  /* Reset password visibility when switching tabs */
  const handleTabSwitch = (tab: ActiveTab) => {
    setActiveTab(tab);
    setShowPw(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  /* Reset form when switching tabs */
  useEffect(() => {
    reset();
  }, [activeTab, reset]);

  /* ── Submit ─────────────────────────────────────────────────────── */

  /**
   * Routes to admin or employee endpoint based on active tab.
   * Persists auth data to localStorage and redirects on success.
   */
  const onSubmit = async (values: LoginForm) => {
    setLoading(true);
    try {
      if (activeTab === "admin") {
        const res = await api.post<{
          success: true;
          data: {
            token: string;
            organization: { id: string; name: string; email: string };
          };
        }>("/api/auth/login", values);

        const { token, organization } = res.data.data;
        localStorage.setItem("talentos_token", token);
        localStorage.setItem("talentos_org", JSON.stringify(organization));
        localStorage.setItem("talentos_role", "admin");
        router.push("/dashboard");
      } else {
        const res = await api.post<{
          success: true;
          data: {
            token: string;
            employee: {
              id: string;
              name: string;
              email: string;
              role: string;
              department: string;
            };
          };
        }>("/api/auth/employee-login", values);

        const { token, employee } = res.data.data;
        localStorage.setItem("talentos_token", token);
        localStorage.setItem("talentos_role", "employee");
        localStorage.setItem(
          "talentos_employee",
          JSON.stringify({
            id: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.role,
            department: employee.department,
          })
        );
        router.push("/employee-dashboard");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Invalid credentials. Please check your email and password.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Derived styles per tab ─────────────────────────────────────── */

  const isAdmin = activeTab === "admin";
  const accent = isAdmin ? "blue" : "teal";

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-2.5 rounded-xl border bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
      hasError
        ? "border-red-300 focus:ring-red-400/20"
        : isAdmin
        ? "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
        : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
    }`;

  const submitClass = isAdmin
    ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 hover:shadow-blue-600/30"
    : "bg-teal-600 hover:bg-teal-700 shadow-teal-600/20 hover:shadow-teal-600/30";

  return (
    <>
      <Toaster richColors position="top-right" />

      <main className="min-h-screen flex">
        {/* ── Left panel ──────────────────────────────────────────── */}
        <LeftPanel />

        {/* ── Right: form ─────────────────────────────────────────── */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 bg-white relative overflow-hidden">
          {/* Subtle bg blobs */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-teal-50 blur-3xl pointer-events-none opacity-70" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-blue-50 blur-3xl pointer-events-none opacity-70" />

          <motion.div
            className="w-full max-w-[400px] relative z-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2.5 justify-center mb-8">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                <Zap size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-slate-900">
                Talent<span className="text-teal-600">OS</span>
              </span>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">

              {/* ── Tabs ──────────────────────────────────────────── */}
              <div className="flex border-b border-slate-100">
                {(["admin", "employee"] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  const tabAccent = tab === "admin" ? "blue" : "teal";
                  return (
                    <button
                      key={tab}
                      onClick={() => handleTabSwitch(tab)}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 ${
                        isActive
                          ? tab === "admin"
                            ? "border-blue-600 text-blue-600 bg-blue-50/60"
                            : "border-teal-600 text-teal-600 bg-teal-50/60"
                          : "border-transparent text-slate-400 hover:text-slate-600 bg-white"
                      }`}
                    >
                      {tab === "admin" ? (
                        <Building2 size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                      ) : (
                        <UserCircle size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                      )}
                      {tab === "admin" ? "Organization" : "Employee"}
                      {isActive && (
                        <motion.div
                          layoutId="tab-indicator"
                          className={`w-1.5 h-1.5 rounded-full ${
                            tabAccent === "blue" ? "bg-blue-600" : "bg-teal-600"
                          }`}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── Form area ─────────────────────────────────────── */}
              <div className="px-7 py-7">
                {/* Heading */}
                <div className="mb-6">
                  <h1 className="text-xl font-bold text-slate-900 mb-1">
                    {isAdmin ? "Welcome back" : "Employee sign in"}
                  </h1>
                  <p className="text-slate-400 text-sm">
                    {isAdmin
                      ? "Sign in to your organization dashboard"
                      : "Access your tasks and performance data"}
                  </p>
                </div>

                {/* Animated form content */}
                <AnimatePresence mode="wait">
                  <motion.form
                    key={activeTab}
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="space-y-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <Mail
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <input
                          {...register("email")}
                          type="email"
                          placeholder={
                            isAdmin ? "org@company.com" : "you@company.com"
                          }
                          autoComplete="email"
                          className={`${inputClass(!!errors.email)} pl-10`}
                        />
                      </div>
                      <FieldError message={errors.email?.message} />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <input
                          {...register("password")}
                          type={showPw ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          className={`${inputClass(!!errors.password)} pl-10 pr-11`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          tabIndex={-1}
                        >
                          {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      <FieldError message={errors.password?.message} />
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 ${submitClass}`}
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle size={15} strokeWidth={2.2} />
                          {isAdmin
                            ? "Sign In to Organization"
                            : "Sign In as Employee"}
                        </>
                      )}
                    </button>
                  </motion.form>
                </AnimatePresence>

                {/* Footer */}
                <p className="text-center text-xs text-slate-400 mt-6">
                  {isAdmin ? (
                    <>
                      No account?{" "}
                      <Link
                        href="/register"
                        className={`font-semibold transition-colors ${
                          isAdmin
                            ? "text-blue-600 hover:text-blue-700"
                            : "text-teal-600 hover:text-teal-700"
                        }`}
                      >
                        Register your organization
                      </Link>
                    </>
                  ) : (
                    <span className="text-slate-400">
                      Credentials are sent to your email by your admin
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Powered by note */}
            <p className="text-center text-[11px] text-slate-400 mt-5">
              Powered by{" "}
              <span className={`font-semibold ${isAdmin ? "text-blue-500" : "text-teal-500"}`}>
                Gemini AI
              </span>{" "}
              ·{" "}
              <span className="text-slate-300">
                TalentOS &copy; {new Date().getFullYear()}
              </span>
            </p>
          </motion.div>
        </div>
      </main>
    </>
  );
}
