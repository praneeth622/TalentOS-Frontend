"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Code2, Copy, Check, Shield, Zap, Terminal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const API_DOCS_URL = "https://talentos-api.praneethd.xyz/";

const endpoints = [
  {
    method: "POST",
    path: "/auth/register",
    description: "Register a new organization",
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    badgeBg: "bg-emerald-50 border-emerald-200",
  },
  {
    method: "POST",
    path: "/auth/employee-login",
    description: "Employee login with credentials",
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    badgeBg: "bg-emerald-50 border-emerald-200",
  },
  {
    method: "GET",
    path: "/employees",
    description: "List all org employees",
    color: "bg-blue-500",
    textColor: "text-blue-600",
    badgeBg: "bg-blue-50 border-blue-200",
  },
  {
    method: "POST",
    path: "/tasks",
    description: "Create and assign a task",
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    badgeBg: "bg-emerald-50 border-emerald-200",
  },
  {
    method: "GET",
    path: "/ai/skill-gap/me",
    description: "Personal AI skill gap analysis",
    color: "bg-blue-500",
    textColor: "text-blue-600",
    badgeBg: "bg-blue-50 border-blue-200",
  },
  {
    method: "POST",
    path: "/ai/smart-assign",
    description: "Smart task assignment recommendation",
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    badgeBg: "bg-emerald-50 border-emerald-200",
  },
];

const highlights = [
  {
    icon: Shield,
    title: "JWT Secured",
    description: "All endpoints protected with HS256 tokens. Dual-role auth for Admin and Employee.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Zap,
    title: "Consistent Responses",
    description: "Every response follows { success, data, message } — no surprises, ever.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Terminal,
    title: "Interactive Playground",
    description: "Try every endpoint live in the browser with real-time request/response inspection.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

const CURL_SNIPPET = `curl -X POST https://talentos-backend.onrender.com/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{ "email": "admin@acme.com", "password": "••••••••" }'`;

/** Animated copy button for the code snippet */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/10"
      aria-label="Copy code"
    >
      {copied ? (
        <>
          <Check size={12} className="text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={12} />
          Copy
        </>
      )}
    </button>
  );
}

export function ApiDocs() {
  return (
    <section id="api-docs" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-5"
          >
            <Code2 size={14} className="text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">REST API</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight"
          >
            Explore the{" "}
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TalentOS API
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Fully documented REST API with 25+ endpoints covering auth, employees, tasks,
            dashboard stats, and AI intelligence. Try it live in the interactive playground.
          </motion.p>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left — endpoint list */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">
              Key Endpoints
            </h3>
            <div className="space-y-3">
              {endpoints.map((ep, i) => (
                <motion.a
                  key={ep.path}
                  href={API_DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide border ${ep.badgeBg} ${ep.textColor}`}
                    >
                      {ep.method}
                    </span>
                    <code className="text-sm font-mono text-slate-700">{ep.path}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 hidden sm:block">{ep.description}</span>
                    <ArrowUpRight
                      size={14}
                      className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0"
                    />
                  </div>
                </motion.a>
              ))}
            </div>

            {/* View all link */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-5"
            >
              <Link
                href={API_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
              >
                View all 25+ endpoints in the docs
                <ArrowUpRight
                  size={15}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — code + highlights */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            {/* Code block */}
            <div className="rounded-2xl overflow-hidden shadow-lg shadow-slate-200/60 border border-slate-200">
              {/* Terminal header */}
              <div className="bg-slate-900 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs text-slate-500 font-mono">terminal</span>
                </div>
                <CopyButton text={CURL_SNIPPET} />
              </div>
              {/* Code */}
              <div className="bg-[#0d1117] px-5 py-5 overflow-x-auto">
                <pre className="text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-wrap break-all">
                  <span className="text-slate-500"># Authenticate as Admin</span>{"\n"}
                  <span className="text-green-400">curl</span>
                  <span className="text-blue-400"> -X POST</span>
                  {" "}
                  <span className="text-yellow-300">https://talentos-backend.onrender.com/api/auth/login</span>{" \\"}
                  {"\n  "}
                  <span className="text-blue-400">-H</span>
                  {' "Content-Type: application/json" \\'}
                  {"\n  "}
                  <span className="text-blue-400">-d</span>
                  {" '"}
                  <span className="text-orange-300">{"{"} "email": "admin@acme.com", "password": "••••••••" {"}"}</span>
                  {"'"}
                </pre>

                {/* Response preview */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <span className="text-xs text-slate-600 font-mono">// 200 OK</span>
                  <pre className="text-xs font-mono text-slate-400 mt-1.5 leading-relaxed">
{`{
  `}<span className="text-blue-400">"success"</span>{`: `}<span className="text-green-400">true</span>{`,
  `}<span className="text-blue-400">"data"</span>{`: {
    `}<span className="text-blue-400">"token"</span>{`: `}<span className="text-yellow-300">"eyJhbGci..."</span>{`,
    `}<span className="text-blue-400">"org"</span>{`: { `}<span className="text-blue-400">"id"</span>{`: `}<span className="text-yellow-300">"cm5abc..."</span>{`, `}<span className="text-blue-400">"name"</span>{`: `}<span className="text-yellow-300">"Acme Corp"</span>{` }
  }
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="grid gap-3">
              {highlights.map((h, i) => (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors"
                >
                  <div className={`w-9 h-9 ${h.bg} rounded-lg flex items-center justify-center shrink-0`}>
                    <h.icon size={17} className={h.color} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-0.5">{h.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{h.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 rounded-2xl bg-linear-to-r from-slate-900 via-blue-950 to-slate-900 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl" />

          <div className="relative z-10 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
              <BookOpen size={18} className="text-blue-400" />
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                Interactive API Docs
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              Built with Apidog · Powered by OpenAPI 3.0
            </h3>
            <p className="text-slate-400 text-sm max-w-md">
              Run any request directly from the browser. Inspect headers, response schemas, and
              authentication flows — all in one place.
            </p>
          </div>

          <motion.a
            href={API_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 flex items-center gap-2 bg-white text-slate-900 px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-blue-50 transition-colors shrink-0 shadow-lg cursor-pointer"
            whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(59,130,246,0.3)" }}
            whileTap={{ scale: 0.97 }}
          >
            <Code2 size={15} />
            Open API Docs
            <ArrowUpRight size={14} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
