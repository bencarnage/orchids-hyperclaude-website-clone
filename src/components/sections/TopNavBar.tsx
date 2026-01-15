"use client";

import { motion } from "framer-motion";
import { Activity, ExternalLink, Zap } from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Positions", href: "#positions" },
  { label: "Thoughts", href: "#thoughts" },
];

const socialLinks = [
  { label: "Twitter", href: "https://twitter.com/hyperclaude", icon: "𝕏" },
  { label: "Telegram", href: "https://t.me/hyperclaude", icon: "✈" },
];

export default function TopNavBar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
                <div className="relative w-10 h-10 rounded-lg bg-surface border border-primary/30 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="font-display text-lg font-bold tracking-wider text-foreground">
                  HYPER<span className="text-primary">CLAUDE</span>
                </h1>
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase -mt-1">
                  AI Perps Trader
                </p>
              </div>
            </motion.div>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-light rounded-lg transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-light rounded-lg transition-all duration-200 border border-transparent hover:border-border"
                >
                  <span className="text-base">{link.icon}</span>
                </a>
              ))}
              <a
                href="https://app.hyperliquid.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-light rounded-lg transition-all duration-200 border border-transparent hover:border-border"
              >
                <span>Hyperliquid</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <AIStatusBadge />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function AIStatusBadge() {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-profit/10 border border-profit/30"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-profit opacity-75 animate-ping" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-profit" />
      </span>
      <span className="text-sm font-semibold text-profit tracking-wide flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5" />
        AI LIVE
      </span>
    </motion.div>
  );
}