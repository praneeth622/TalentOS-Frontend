"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/*
 * Hash links use /#section so they resolve correctly from any page
 * (/about, /pricing, etc.) — not just the landing page root.
 */
const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
];

const MotionLink = motion.create(Link);

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
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
            {navLinks.map((link) => (
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
            ))}
          </div>

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
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
        {navLinks.map((link, i) => (
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
        ))}

        <div className="mt-4 space-y-3">
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
        </div>
      </motion.div>
    </>
  );
}
