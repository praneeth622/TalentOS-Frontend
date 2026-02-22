"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  User,
  BookOpen,
  LogOut,
  Brain,
  X,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clearAuth, getStoredEmployee } from "../../../lib/api";

/* ── Nav items ────────────────────────────────────────────────────── */

const navItems = [
  { label: "Dashboard", href: "/employee-dashboard", icon: LayoutDashboard },
  { label: "My Tasks", href: "/my-tasks", icon: ClipboardList },
  { label: "My Profile", href: "/my-profile", icon: User },
  { label: "Skill Gap", href: "/skill-gap", icon: BookOpen },
] as const;

/* ── Helpers ──────────────────────────────────────────────────────── */

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/* ── Nav item ─────────────────────────────────────────────────────── */

interface NavItemProps {
  label: string;
  href: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}

function NavItem({ label, href, icon: Icon, active, onClick }: NavItemProps) {
  return (
    <Link href={href} onClick={onClick}>
      <div
        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 border-l-[3px] ${
          active
            ? "border-teal-600 bg-teal-50 text-slate-900 font-semibold"
            : "border-transparent text-slate-500 font-medium hover:text-slate-800 hover:bg-slate-50 hover:border-slate-200"
        }`}
      >
        <Icon
          size={17}
          className={active ? "text-teal-600" : "text-slate-400"}
          strokeWidth={active ? 2.2 : 1.8}
        />
        {label}
      </div>
    </Link>
  );
}

/* ── Main sidebar ─────────────────────────────────────────────────── */

/**
 * Employee sidebar — fixed left panel with navigation and logout.
 * Teal colour scheme to distinguish from the admin (blue) sidebar.
 * Manages its own mobile open/close state.
 */
export function EmployeeSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const employee = getStoredEmployee();

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/employee-dashboard" && href !== "/my-profile" && pathname.startsWith(href));

  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  };

  return (
    <>
      {/* Mobile hamburger — shown in the content area top-left */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow border border-slate-100 text-slate-500 hover:text-slate-900"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-[220px] flex flex-col bg-white border-r border-slate-100
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ transition: "transform 0.25s ease" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-[18px]">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shrink-0">
            <Brain size={16} className="text-white" strokeWidth={2.2} />
          </div>
          <span className="font-bold text-slate-900 text-[17px] tracking-tight">
            Talent<span className="text-teal-600">OS</span>
          </span>

          {/* Mobile close */}
          <button
            className="ml-auto lg:hidden p-1 text-slate-400 hover:text-slate-700"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mx-4 mb-4" />

        {/* Employee portal badge */}
        <div className="mx-4 mb-4 px-3 py-1.5 bg-teal-50 rounded-lg">
          <p className="text-[10px] font-bold text-teal-700 uppercase tracking-widest">
            Employee Portal
          </p>
        </div>

        {/* Nav items */}
        <div className="mb-4">
          <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Navigation
          </p>
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={isActive(item.href)}
              onClick={() => setOpen(false)}
            />
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Divider */}
        <div className="h-px bg-slate-100 mx-4 mb-3" />

        {/* Logout */}
        <div className="px-2 pb-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-500 font-medium hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} className="text-slate-400" strokeWidth={1.8} />
            Log out
          </button>
        </div>

        {/* Employee identity card at very bottom */}
        {employee && (
          <div className="mx-3 mb-4 p-3 flex items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold shrink-0">
              {getInitials(employee.name)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {employee.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {employee.role}
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
