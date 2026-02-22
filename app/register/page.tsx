"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Building2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { api, getToken } from "../../lib/api";
import { AuthLeft } from "../components/auth/AuthLeft";

/* ── Validation schema ───────────────────────────────────────────── */

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Organization name must be at least 2 characters")
      .max(80, "Name is too long"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

/* ── Field error ─────────────────────────────────────────────────── */

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

export default function RegisterPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Redirect if already authenticated */
  useEffect(() => {
    if (getToken()) router.replace("/dashboard");
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  /**
   * Submits registration form to the API, persists auth data, and
   * redirects to the dashboard on success.
   */
  const onSubmit = async (values: RegisterForm) => {
    setLoading(true);
    try {
      const res = await api.post<{
        success: true;
        data: {
          token: string;
          organization: { id: string; name: string; email: string };
        };
      }>(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      const { token, organization } = res.data.data;
      localStorage.setItem("talentos_token", token);
      localStorage.setItem("talentos_org", JSON.stringify(organization));
      localStorage.setItem("talentos_role", "admin");

      toast.success(`Welcome to TalentOS, ${organization.name}!`);
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "Registration failed. Please try again.";
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
          {/* Subtle background blobs */}
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
                  Create your account
                </h1>
                <p className="text-slate-500 text-sm">
                  Set up your TalentOS organization
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* Organization Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Organization Name
                  </label>
                  <div className="relative">
                    <Building2
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Acme Corp"
                      autoComplete="organization"
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.name
                          ? "border-red-300 focus:ring-red-400/30"
                          : "border-slate-200 focus:border-blue-400 focus:ring-blue-400/30"
                      }`}
                    />
                  </div>
                  <FieldError message={errors.name?.message} />
                </div>

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
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      {...register("confirmPassword")}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-11 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.confirmPassword
                          ? "border-red-300 focus:ring-red-400/30"
                          : "border-slate-200 focus:border-blue-400 focus:ring-blue-400/30"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <FieldError message={errors.confirmPassword?.message} />
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
                      Create account
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Terms note */}
              <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed">
                By registering you agree to our{" "}
                <a href="#" className="underline hover:text-slate-600 transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-slate-600 transition-colors">
                  Privacy Policy
                </a>
              </p>

              {/* Footer link */}
              <p className="text-center text-sm text-slate-500 mt-6">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
