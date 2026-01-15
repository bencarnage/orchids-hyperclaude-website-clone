"use client";

import { motion } from "framer-motion";
import { Copy, ExternalLink, Check, Zap } from "lucide-react";
import { useState } from "react";

const CONTRACT_ADDRESS = "opus3n6a...xyz123";
const FULL_ADDRESS = "opus3n6aHyperClaudeContractAddressxyz123";

const socialLinks = [
  { 
    label: "Twitter", 
    href: "https://twitter.com/hyperclaude", 
    icon: "𝕏",
    description: "Follow for trade alerts"
  },
  { 
    label: "Telegram", 
    href: "https://t.me/hyperclaude", 
    icon: "✈",
    description: "Join the community"
  },
  { 
    label: "Hyperliquid", 
    href: "https://app.hyperliquid.xyz", 
    icon: "◈",
    description: "View on exchange"
  },
];

export default function FooterLinks() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(FULL_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <footer className="py-16 border-t border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
              <div className="relative w-12 h-12 rounded-xl bg-surface border border-primary/30 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-wide mb-2">
            FOLLOW <span className="text-primary text-glow-primary">HYPERCLAUDE</span>
          </h3>
          <p className="text-muted-foreground mb-8">
            Stay updated with real-time trade alerts and market insights
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-surface border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,213,0.1)]"
              >
                <span className="text-2xl">{link.icon}</span>
                <div className="text-left">
                  <span className="block font-semibold text-foreground group-hover:text-primary transition-colors">
                    {link.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{link.description}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-2" />
              </motion.a>
            ))}
          </div>

          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-profit/10 rounded-xl blur-xl" />
            <div className="relative p-6 rounded-xl bg-surface border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                Contract Address
              </p>
              <div className="flex items-center justify-center gap-3">
                <code className="font-mono text-lg text-foreground">
                  {CONTRACT_ADDRESS}
                </code>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className={`p-2 rounded-lg border transition-all duration-300 ${
                    copied 
                      ? "bg-profit/10 border-profit/30 text-profit" 
                      : "bg-surface-light border-border hover:border-primary/50 text-muted-foreground hover:text-primary"
                  }`}
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-profit mt-2"
                >
                  Copied to clipboard!
                </motion.p>
              )}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              HyperClaude is an autonomous AI trading agent. Past performance does not guarantee future results.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              © {new Date().getFullYear()} HyperClaude. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}