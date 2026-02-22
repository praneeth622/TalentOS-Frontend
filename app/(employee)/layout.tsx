"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../../lib/api";
import { Toaster } from "sonner";
import { EmployeeSidebar } from "./components/EmployeeSidebar";

/** Minimal JWT payload — only the fields we inspect client-side. */
interface JwtPayloadPartial {
  employeeId?: string;
}

/**
 * Shared layout for all employee-facing pages.
 * Guards the route group: redirects to /login if unauthenticated,
 * redirects to /dashboard if the token belongs to an admin.
 */
export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      ) as JwtPayloadPartial;

      if (!payload.employeeId) {
        // Token belongs to an admin — send them to the admin dashboard
        router.replace("/dashboard");
        return;
      }
    } catch {
      router.replace("/login");
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Toaster richColors position="top-right" />

      {/* Fixed-position sidebar */}
      <EmployeeSidebar />

      {/* Content column: top bar + scrollable main */}
      <div className="flex flex-col flex-1 min-h-screen lg:ml-[220px]">
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
