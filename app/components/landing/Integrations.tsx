"use client";

import { motion } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem } from "../ui/AnimatedSection";

const integrations = [
  {
    name: "Slack",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    ),
    color: "text-[#4A154B]",
  },
  {
    name: "Google",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    color: "text-slate-700",
  },
  {
    name: "Polygon",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M17.78 6.55c-.37-.22-.85-.22-1.23 0l-2.87 1.71-1.95 1.1-2.87 1.71c-.37.22-.85.22-1.23 0L5.2 9.64c-.37-.22-.62-.63-.62-1.08V6.03c0-.44.23-.85.62-1.08l2.43-1.4c.37-.22.85-.22 1.23 0l2.43 1.4c.37.22.62.63.62 1.08v1.71l1.95-1.13V4.87c0-.44-.23-.85-.62-1.08L9.41 1.5c-.37-.22-.85-.22-1.23 0L4.3 3.79c-.39.22-.62.63-.62 1.08v4.56c0 .44.23.85.62 1.08l3.87 2.25c.37.22.85.22 1.23 0l2.87-1.68 1.95-1.13 2.87-1.68c.37-.22.85-.22 1.23 0l2.43 1.4c.37.22.62.63.62 1.08v2.53c0 .44-.23.85-.62 1.08l-2.43 1.43c-.37.22-.85.22-1.23 0l-2.43-1.4c-.37-.22-.62-.63-.62-1.08v-1.71l-1.95 1.13v1.74c0 .44.23.85.62 1.08l3.87 2.25c.37.22.85.22 1.23 0l3.87-2.25c.37-.22.62-.63.62-1.08V9.88c0-.44-.23-.85-.62-1.08l-3.9-2.25z" fill="#8247E5"/>
      </svg>
    ),
    color: "text-[#8247E5]",
  },
  {
    name: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    color: "text-slate-900",
  },
  {
    name: "Jira",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005z" fill="#2684FF"/>
        <path d="M17.308 5.756H5.736a5.215 5.215 0 0 0 5.213 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.76a1.005 1.005 0 0 0-1.005-1.005z" fill="#2684FF" opacity="0.86"/>
        <path d="M23.044 0H11.472a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24.029 12.5V1.005A1.005 1.005 0 0 0 23.044 0z" fill="#2684FF" opacity="0.72"/>
      </svg>
    ),
    color: "text-[#2684FF]",
  },
  {
    name: "MetaMask",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M22.29 2L13.3 8.68l1.66-3.94L22.29 2z" fill="#E17726"/>
        <path d="M1.71 2l8.9 6.75-1.58-3.99L1.71 2z" fill="#E27625"/>
        <path d="M19.07 17.28l-2.39 3.66 5.11 1.41 1.47-4.98-4.19-.09z" fill="#E27625"/>
        <path d="M.76 17.37l1.46 4.98 5.1-1.41-2.38-3.66-4.18.09z" fill="#E27625"/>
        <path d="M7.07 10.53l-1.43 2.16 5.1.23-.18-5.48-3.49 3.09z" fill="#E27625"/>
        <path d="M16.93 10.53l-3.53-3.16-.12 5.55 5.08-.23-1.43-2.16z" fill="#E27625"/>
        <path d="M7.32 20.94l3.06-1.49-2.64-2.06-.42 3.55z" fill="#E27625"/>
        <path d="M13.62 19.45l3.06 1.49-.42-3.55-2.64 2.06z" fill="#E27625"/>
      </svg>
    ),
    color: "text-[#F5841F]",
  },
];

export function Integrations() {
  return (
    <section id="integrations" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-3 block">
            Integrations
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Seamlessly Connect
            <br />
            <span className="text-blue-600">Your Favorite Tools</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            TalentOS integrates with the tools you already use — from project
            management to Web3 wallets.
          </p>
        </AnimatedSection>

        <StaggerContainer
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          staggerDelay={0.06}
        >
          {integrations.map((integration) => (
            <StaggerItem key={integration.name}>
              <motion.div
                className="group bg-slate-50 hover:bg-white rounded-2xl p-6 flex flex-col items-center gap-3 border border-transparent hover:border-slate-200 transition-all duration-300 cursor-pointer"
                whileHover={{
                  y: -6,
                  boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
                }}
              >
                <motion.div
                  className={`${integration.color} transition-transform`}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                >
                  {integration.icon}
                </motion.div>
                <span className="text-sm font-medium text-slate-700">
                  {integration.name}
                </span>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
