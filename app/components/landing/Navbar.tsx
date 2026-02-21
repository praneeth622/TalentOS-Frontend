"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "#contact" },
];

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
          <motion.a
            href="#"
            className="text-xl font-bold tracking-tight text-slate-900"
            whileHover={{ scale: 1.02 }}
          >
            Talent<span className="text-blue-600">OS</span>
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors relative"
                whileHover="hover"
              >
                {link.label}
                <motion.span
                  className="absolute -bottom-1 left-0 h-[2px] bg-blue-600 rounded-full"
                  variants={{
                    hover: { width: "100%" },
                  }}
                  initial={{ width: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <motion.a
              href="#"
              className="text-sm text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Log in
            </motion.a>
            <motion.a
              href="#"
              className="text-sm bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-colors"
              whileHover={{ scale: 1.03, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started
            </motion.a>
          </div>

          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <motion.div
        className="fixed inset-0 z-40 bg-white md:hidden flex flex-col pt-20 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={mobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20, pointerEvents: "none" as const }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: mobileOpen ? "auto" : "none" }}
      >
        {navLinks.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            className="text-lg text-slate-800 py-3 border-b border-slate-100"
            initial={{ opacity: 0, x: -20 }}
            animate={mobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: i * 0.05 + 0.1 }}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </motion.a>
        ))}
        <motion.a
          href="#"
          className="mt-6 text-center bg-slate-900 text-white px-5 py-3 rounded-full"
          initial={{ opacity: 0 }}
          animate={mobileOpen ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 }}
        >
          Get Started
        </motion.a>
      </motion.div>
    </>
  );
}
