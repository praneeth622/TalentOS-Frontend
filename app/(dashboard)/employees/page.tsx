"use client";

import { motion } from "framer-motion";
import { Users, Search, Filter, Plus, TrendingUp, UserCheck, Clock } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.25, 0.4, 0.25, 1] },
});

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] ${className}`}>
      {children}
    </div>
  );
}

const mockEmployees = [
  { id: 1, name: "Aryan Mehta", role: "Senior Engineer", department: "Engineering", score: 94, status: "Active" },
  { id: 2, name: "Priya Sharma", role: "Product Manager", department: "Product", score: 88, status: "Active" },
  { id: 3, name: "Kiran Patel", role: "Data Analyst", department: "Analytics", score: 76, status: "Active" },
  { id: 4, name: "Sneha Nair", role: "UX Designer", department: "Design", score: 91, status: "Active" },
  { id: 5, name: "Rahul Verma", role: "Backend Engineer", department: "Engineering", score: 83, status: "Active" },
  { id: 6, name: "Divya Iyer", role: "QA Engineer", department: "Engineering", score: 79, status: "On Leave" },
];

/**
 * Employees page — team roster with performance scores.
 */
export default function EmployeesPage() {
  const avg = Math.round(mockEmployees.reduce((s, e) => s + e.score, 0) / mockEmployees.length);

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage your team and track their performance.</p>
        </div>
        <motion.button
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Employee
        </motion.button>
      </motion.div>

      {/* Stat mini-cards */}
      <motion.div {...fadeUp(0.08)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: mockEmployees.length, icon: Users, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
          { label: "Active", value: mockEmployees.filter(e => e.status === "Active").length, icon: UserCheck, iconBg: "bg-green-100", iconColor: "text-green-600" },
          { label: "On Leave", value: mockEmployees.filter(e => e.status === "On Leave").length, icon: Clock, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
          { label: "Avg Score", value: avg, icon: TrendingUp, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
        ].map((s, i) => (
          <motion.div key={s.label} {...fadeUp(0.1 + i * 0.05)}>
            <Card className="p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full ${s.iconBg} flex items-center justify-center shrink-0`}>
                <s.icon size={18} className={s.iconColor} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Search + Filter */}
      <motion.div {...fadeUp(0.2)} className="flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, role, or department…"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
        <button className="inline-flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors bg-white">
          <Filter size={14} strokeWidth={1.8} />
          Filter
        </button>
      </motion.div>

      {/* Table */}
      <motion.div {...fadeUp(0.28)}>
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">All Employees</h2>
            <span className="text-[11px] text-slate-400">{mockEmployees.length} members</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                  <th className="text-left px-6 py-3">#</th>
                  <th className="text-left px-6 py-3">Name</th>
                  <th className="text-left px-6 py-3 hidden md:table-cell">Role</th>
                  <th className="text-left px-6 py-3 hidden sm:table-cell">Department</th>
                  <th className="text-left px-6 py-3">Score</th>
                  <th className="text-left px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockEmployees.map((emp, i) => (
                  <motion.tr
                    key={emp.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs text-slate-300 font-mono">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-bold text-blue-700 shrink-0">
                          {emp.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-sm text-slate-500">{emp.role}</td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${emp.score >= 90 ? "bg-green-500" : emp.score >= 75 ? "bg-blue-500" : "bg-amber-400"}`}
                            style={{ width: `${emp.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{emp.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        emp.status === "Active" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${emp.status === "Active" ? "bg-green-500" : "bg-amber-400"}`} />
                        {emp.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
