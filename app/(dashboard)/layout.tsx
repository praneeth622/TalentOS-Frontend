"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Sparkles,
  LogOut,
  Menu,
  X,
  Wallet,
  HelpCircle,
  Brain,
} from "lucide-react";
import { Toaster } from "sonner";
import { clearAuth, getStoredOrg, getToken } from "../../lib/api";

/* ── Nav structure (Logip-style grouped sections) ─────────────────── */

const mainNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Employees", icon: Users, href: "/employees" },
  { label: "Tasks", icon: CheckSquare, href: "/tasks" },
];

const intelligenceNav = [
  { label: "AI Insights", icon: Sparkles, href: "/ai-insights" },
];

/* ── Helpers ──────────────────────────────────────────────────────── */

/**
 * Returns two-letter initials from a name string.
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Truncates an Ethereum address to "0x1234…5678" format.
 */
function formatAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/* ── Nav item component ───────────────────────────────────────────── */

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
            ? "border-blue-600 bg-blue-50 text-slate-900 font-semibold"
            : "border-transparent text-slate-500 font-medium hover:text-slate-800 hover:bg-slate-50 hover:border-slate-200"
        }`}
      >
        <Icon
          size={17}
          className={active ? "text-blue-600" : "text-slate-400"}
          strokeWidth={active ? 2.2 : 1.8}
        />
        {label}
      </div>
    </Link>
  );
}

/* ── Sidebar ──────────────────────────────────────────────────────── */

interface SidebarProps {
  org: { id: string; name: string; email: string } | null;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

function Sidebar({ org, open, onClose, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Brain size={16} className="text-white" strokeWidth={2.2} />
          </div>
          <span className="font-bold text-slate-900 text-[17px] tracking-tight">
            Talent<span className="text-blue-600">OS</span>
          </span>

          {/* Mobile close */}
          <button
            className="ml-auto lg:hidden p-1 text-slate-400 hover:text-slate-700"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mx-4 mb-4" />

        {/* Main nav */}
        <div className="mb-5">
          <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Main Menu
          </p>
          {mainNav.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={isActive(item.href)}
              onClick={onClose}
            />
          ))}
        </div>

        {/* Intelligence nav */}
        <div className="mb-4">
          <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Intelligence
          </p>
          {intelligenceNav.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={isActive(item.href)}
              onClick={onClose}
            />
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* AI promo card (like Logip's "Upgrade to Pro") */}
        <div className="mx-4 mb-4 p-4 bg-blue-50 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-blue-600" />
            <p className="text-xs font-bold text-blue-700">Powered by Gemini</p>
          </div>
          <p className="text-[11px] text-blue-600/80 leading-relaxed mb-3">
            Get AI-generated workforce insights refreshed daily.
          </p>
          <Link
            href="/ai-insights"
            onClick={onClose}
            className="block text-center bg-blue-600 text-white text-xs font-semibold py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            View Insights
          </Link>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mx-4 mb-3" />

        {/* Bottom links */}
        <div className="px-2 pb-3 space-y-0.5">
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-500 font-medium hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <HelpCircle size={16} className="text-slate-400" strokeWidth={1.8} />
            Help & Support
          </Link>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-500 font-medium hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} className="text-slate-400" strokeWidth={1.8} />
            Log out
          </button>
        </div>

        {/* Org card at very bottom */}
        {org && (
          <div className="mx-3 mb-4 p-3 flex items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
              {getInitials(org.name)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{org.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{org.email}</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

/* ── Top bar ──────────────────────────────────────────────────────── */

interface TopBarProps {
  org: { id: string; name: string; email: string } | null;
  wallet: string | null;
  onToggleSidebar: () => void;
  onConnectWallet: () => void;
}

function TopBar({ org, wallet, onToggleSidebar, onConnectWallet }: TopBarProps) {
  const pathname = usePathname();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  /* Only show greeting on the dashboard route */
  const showGreeting = pathname === "/dashboard";

  return (
    <header className="h-16 flex items-center gap-4 px-6 bg-white border-b border-slate-100 shrink-0">
      {/* Mobile hamburger */}
      <button
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        onClick={onToggleSidebar}
      >
        <Menu size={20} />
      </button>

      {/* Greeting or page title */}
      {showGreeting && org ? (
        <div className="hidden sm:block">
          <h1 className="text-base font-semibold text-slate-900">
            {getGreeting()}, {org.name} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">{today}</p>
        </div>
      ) : null}

      <div className="ml-auto flex items-center gap-2.5">
        {/* Wallet button */}
        <motion.button
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border ${
            wallet
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
          onClick={!wallet ? onConnectWallet : undefined}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Wallet size={14} />
          {wallet ? formatAddress(wallet) : "Connect Wallet"}
        </motion.button>

        {/* Org avatar */}
        {org && (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getInitials(org.name)}
          </div>
        )}
      </div>
    </header>
  );
}

/* ── Layout ───────────────────────────────────────────────────────── */

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wallet, setWallet] = useState<string | null>(null);
  const [org, setOrg] = useState<{ id: string; name: string; email: string } | null>(null);

  /* Auth guard */
  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setOrg(getStoredOrg());

    /* Clear any lingering dark mode from previous sessions */
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("talentos_dark");

    const savedWallet = localStorage.getItem("talentos_wallet");
    if (savedWallet) setWallet(savedWallet);

    setReady(true);
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem("talentos_wallet");
    router.replace("/login");
  };

  const handleConnectWallet = async () => {
    if (typeof window === "undefined") return;
    const ethereum = (window as unknown as { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum;

    if (!ethereum) {
      alert("MetaMask is not installed.");
      return;
    }

    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      setWallet(address);
      localStorage.setItem("talentos_wallet", address);
    } catch {
      /* User rejected */
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA]">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F4F6FA]">
      <Toaster richColors position="top-right" />

      <Sidebar
        org={org}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex flex-col flex-1 min-h-screen lg:ml-[220px]">
        <TopBar
          org={org}
          wallet={wallet}
          onToggleSidebar={() => setSidebarOpen(true)}
          onConnectWallet={handleConnectWallet}
        />

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
