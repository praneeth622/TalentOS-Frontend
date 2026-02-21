"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { toast, Toaster } from "sonner";
import { api, getToken } from "../../lib/api";
import { AuthLeft } from "../components/auth/AuthLeft";

/* ── Validation schema ───────────────────────────────────────────── */

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

/* ── Field wrapper ───────────────────────────────────────────────── */

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

/* ── Page ─────────────────────────────────────────────────────────── */

export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Redirect if already authenticated */
  useEffect(() => {
    if (getToken()) router.replace("/dashboard");
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  /**
   * Submits credentials to the auth API, persists token + org, then
   * redirects to the dashboard on success.
   */
  const onSubmit = async (values: LoginForm) => {
    setLoading(true);
    try {
      const res = await api.post<{
        success: true;
        data: {
          token: string;
          organization: { id: string; name: string; email: string };
        };
      }>(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, values);

      const { token, organization } = res.data.data;
      localStorage.setItem("talentos_token", token);
      localStorage.setItem("talentos_org", JSON.stringify(organization));
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "Invalid credentials. Please check your email and password.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />

      <main className="min-h-screen flex">
        {/* ── Left panel (desktop only) ───────────────────────────── */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[55%]">
          <AuthLeft />
        </div>

        {/* ── Right: form card ────────────────────────────────────── */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 bg-slate-50 relative overflow-hidden">
          {/* Subtle background blobs (mobile visible too) */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-purple-100/40 blur-3xl pointer-events-none" />

          <motion.div
            className="w-full max-w-md relative z-10"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* Mobile-only logo */}
            <div className="lg:hidden text-center mb-8">
              <span className="text-2xl font-bold text-slate-900">
                Talent<span className="text-blue-600">OS</span>
              </span>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 px-8 py-9">
              {/* Heading */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-1.5">
                  Welcome back
                </h1>
                <p className="text-slate-500 text-sm">
                  Sign in to your organization
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="org@company.com"
                      autoComplete="email"
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.email
                          ? "border-red-300 focus:ring-red-400/30"
                          : "border-slate-200 focus:border-blue-400 focus:ring-blue-400/30"
                      }`}
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
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      {...register("password")}
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-11 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.password
                          ? "border-red-300 focus:ring-red-400/30"
                          : "border-slate-200 focus:border-blue-400 focus:ring-blue-400/30"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <FieldError message={errors.password?.message} />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 disabled:opacity-60 transition-all mt-2"
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign in
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Footer link */}
              <p className="text-center text-sm text-slate-500 mt-7">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Register your org
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
