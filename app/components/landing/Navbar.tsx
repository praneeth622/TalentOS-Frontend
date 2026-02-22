"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, LayoutDashboard, Code2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getToken, getStoredRole } from "@/lib/api";

/*
 * Hash links use /#section so they resolve correctly from any page
 * (/about, /pricing, etc.) — not just the landing page root.
 */
const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "API Docs", href: "https://talentos-api.praneethd.xyz/", external: true },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

const MotionLink = motion.create(Link);

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<"admin" | "employee" | null>(null);

  useEffect(() => {
    const token = getToken();
    const r = getStoredRole();
    setIsLoggedIn(!!token);
    setRole(r);
  }, []);

  const dashboardHref = role === "employee" ? "/employee-dashboard" : "/dashboard";
  const dashboardLabel = role === "employee" ? "My Dashboard" : "Dashboard";

  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const blur = useTransform(scrollY, [0, 100], [0, 12]);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: useTransform(bgOpacity, (v) => `rgba(255,255,255,${v * 0.85})`),
          backdropFilter: useTransform(blur, (v) => `blur(${v}px)`),
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <MotionLink
            href="/"
            className="text-xl font-bold tracking-tight text-slate-900"
            whileHover={{ scale: 1.02 }}
          >
            Talent<span className="text-blue-600">OS</span>
          </MotionLink>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.external ? (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors relative flex items-center gap-1 font-medium"
                  whileHover="hover"
                >
                  <Code2 size={13} />
                  {link.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[2px] bg-blue-600 rounded-full"
                    variants={{ hover: { width: "100%" } }}
                    initial={{ width: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ) : (
                <MotionLink
                  key={link.label}
                  href={link.href}
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors relative"
                  whileHover="hover"
                >
                  {link.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[2px] bg-blue-600 rounded-full"
                    variants={{ hover: { width: "100%" } }}
                    initial={{ width: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </MotionLink>
              )
            )}
          </div>

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <MotionLink
                href={dashboardHref}
                className="text-sm bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                whileHover={{ scale: 1.03, boxShadow: "0 4px 20px rgba(37,99,235,0.35)" }}
                whileTap={{ scale: 0.97 }}
              >
                <LayoutDashboard size={16} strokeWidth={2} />
                {dashboardLabel}
              </MotionLink>
            ) : (
              <>
                <MotionLink
                  href="/login"
                  className="text-sm text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Log in
                </MotionLink>
                <MotionLink
                  href="/register"
                  className="text-sm bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-colors"
                  whileHover={{ scale: 1.03, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Get Started
                </MotionLink>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <motion.div
        className="fixed inset-0 z-40 bg-white md:hidden flex flex-col pt-20 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={
          mobileOpen
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: -20, pointerEvents: "none" as const }
        }
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: mobileOpen ? "auto" : "none" }}
      >
        {navLinks.map((link, i) =>
          link.external ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-lg text-blue-600 py-3 border-b border-slate-100 font-medium"
              onClick={() => setMobileOpen(false)}
            >
              <motion.span
                className="flex items-center gap-1.5"
                initial={{ opacity: 0, x: -20 }}
                animate={mobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 + 0.1 }}
              >
                <Code2 size={16} />
                {link.label}
              </motion.span>
            </a>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              className="text-lg text-slate-800 py-3 border-b border-slate-100"
              onClick={() => setMobileOpen(false)}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, x: -20 }}
                animate={mobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 + 0.1 }}
              >
                {link.label}
              </motion.span>
            </Link>
          )
        )}

        <div className="mt-4 space-y-3">
          {isLoggedIn ? (
            <Link
              href={dashboardHref}
              className="flex items-center justify-center gap-2 border border-blue-200 bg-blue-50 text-blue-700 px-5 py-3 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <LayoutDashboard size={18} strokeWidth={2} />
              {dashboardLabel}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="block text-center border border-slate-200 text-slate-800 px-5 py-3 rounded-full text-sm font-medium hover:bg-slate-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="block text-center bg-slate-900 text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
