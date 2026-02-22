"use client";

import { motion } from "framer-motion";
import { Twitter, Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Integrations", href: "/#integrations" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "/#contact" },
  ],
  Resources: [
    { label: "Documentation", href: "https://talentos-api.praneethd.xyz/" },
    { label: "API Reference", href: "https://talentos-api.praneethd.xyz/" },
    { label: "Support", href: "/#contact" },
    { label: "Status", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socials = [
  { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-500" },
  { name: "GitHub", icon: Github, href: "#", color: "hover:text-slate-900" },
  { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-700" },
  { name: "Email", icon: Mail, href: "#", color: "hover:text-purple-600" },
];

export function Footer() {
  return (
    <footer className="bg-linear-to-b from-white to-slate-50 border-t border-slate-100 pt-20 pb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
          className="w-full h-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Newsletter section */}
        <motion.div
          className="mb-16 bg-linear-to-br from-slate-900 to-slate-800 rounded-3xl p-10 relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-slate-400">
                Get the latest product updates and insights delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
              />
              <motion.button
                type="button"
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-500 transition-colors whitespace-nowrap cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            className="col-span-2 md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
          <Link
            href="/"
            className="text-2xl font-bold text-slate-900 inline-block mb-4 hover:opacity-80 transition-opacity cursor-pointer"
          >
            Talent<span className="text-blue-600">OS</span>
          </Link>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              AI-native workforce intelligence platform empowering modern teams
              to reach their full potential.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className={`w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer ${social.color} transition-colors`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links], catIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
            >
              <h4 className="text-sm font-bold text-slate-900 mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link, idx) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: catIdx * 0.1 + idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1 group cursor-pointer"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} TalentOS. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-400">Made with ❤️ for teams</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

