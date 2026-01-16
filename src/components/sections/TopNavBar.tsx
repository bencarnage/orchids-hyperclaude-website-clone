"use client";

import { motion } from "framer-motion";
import { Activity, Copy, Check } from "lucide-react";
import { useTrading } from "@/lib/trading-engine";
import { useState } from "react";
import Image from "next/image";

const navLinks = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Positions", href: "#positions" },
  { label: "Thoughts", href: "#thoughts" },
];

const CONTRACT_ADDRESS: string = "2ojHY4G3PdZP3Ez9zUA2P7JdxKPjAsPiFkmSQFhCpump";
const LOGO_URL = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/025fcd57-8db7-4d7c-a032-584873a51655/claudeperps-1768524261661.jpg?width=8000&height=8000&resize=contain";

export default function TopNavBar() {
  const { isAiActive, currentAction } = useTrading();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    if (!CONTRACT_ADDRESS) return;
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface border border-primary/30 flex items-center justify-center">
                  <Image 
                    src={LOGO_URL} 
                    alt="Claude Perps" 
                    width={40} 
                    height={40}
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <h1 className="font-display text-lg font-bold tracking-wider text-foreground">
                  CLAUDE<span className="text-primary">PERPS</span>
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
              <a
                href="https://x.com/claudeperp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-light rounded-lg transition-all duration-200 border border-transparent hover:border-border"
              >
                <span className="text-base">𝕏</span>
              </a>
              
              {CONTRACT_ADDRESS ? (
                <button
                    onClick={handleCopyAddress}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-surface-light rounded-lg transition-all duration-200 border border-border/50 hover:border-border"
                  >
                    <span>{CONTRACT_ADDRESS.slice(0, 4)}...{CONTRACT_ADDRESS.slice(-4)}</span>
                    {copied ? <Check className="w-3 h-3 text-profit" /> : <Copy className="w-3 h-3" />}
                  </button>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-muted-foreground/50 rounded-lg border border-border/30">
                  <span>CA: TBA</span>
                </div>
              )}
            </div>

            <AIStatusBadge isActive={isAiActive} action={currentAction} />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function AIStatusBadge({ isActive, action }: { isActive: boolean; action: string }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
        isActive 
          ? "bg-profit/10 border border-profit/30" 
          : "bg-muted/10 border border-muted/30"
      }`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
          isActive ? "bg-profit" : "bg-muted-foreground"
        }`} />
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
          isActive ? "bg-profit" : "bg-muted-foreground"
        }`} />
      </span>
      <span className={`text-sm font-semibold tracking-wide flex items-center gap-1.5 ${
        isActive ? "text-profit" : "text-muted-foreground"
      }`}>
        <Activity className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{action}</span>
        <span className="sm:hidden">LIVE</span>
      </span>
    </motion.div>
  );
}
