"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  BarChart2, 
  ScrollText, 
  BookOpen, 
  HelpCircle, 
  Users, 
  Wallet,
  Menu,
  X as CloseIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const NavigationSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { icon: TrendingUp, label: "Markets", href: "/", active: true },
    { icon: BarChart2, label: "Statistics", href: "/statistics" },
    { icon: ScrollText, label: "Ledger", href: "/ledger" },
    { icon: BookOpen, label: "Whitepaper", href: "/whitepaper" },
    { icon: HelpCircle, label: "FAQ", href: "/faq" },
  ];

  const socialItems = [
    { 
      label: "X (Twitter)", 
      href: "https://x.com/ClaudePredicts", 
      icon: () => (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    { 
      label: "Community", 
      href: "https://x.com/i/communities/2011537945644450190", 
      icon: Users 
    },
  ];

  return (
    <>
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-50 bg-[#0D0D0C] text-white transition-all duration-300 ease-out flex flex-col border-r border-white/5",
          isExpanded ? "w-60" : "w-16"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo Section */}
        <div className="p-3 border-b border-white/10 h-14 flex items-center">
          <a className="flex items-center gap-3 group w-full" href="/">
            <div className="h-8 w-8 rounded-lg bg-[#D97E5D] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
              <AsteriskIcon className="h-4 w-4 text-white" />
            </div>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
              )}
            >
              <span className="font-bold text-sm whitespace-nowrap tracking-tight">
                Claude Predicts
              </span>
            </div>
          </a>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto terminal-scrollbar">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                item.active 
                  ? "bg-[#D97E5D] text-white" 
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300",
                  isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
                )}
              >
                {item.label}
              </span>
              {!isExpanded && !item.active && (
                 <div className="absolute left-14 bg-[#1A1A1A] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10">
                   {item.label}
                 </div>
              )}
            </a>
          ))}
        </nav>

        {/* Bottom Utility & Socials */}
        <div className="p-2 space-y-1">
          {socialItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 group relative"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300",
                  isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
                )}
              >
                {item.label}
              </span>
              {!isExpanded && (
                <div className="absolute left-14 bg-[#1A1A1A] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10">
                  {item.label}
                </div>
              )}
            </a>
          ))}

          <button className="w-full relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 bg-[#D97E5D] text-white hover:brightness-110 group mt-2">
            <Wallet className="h-5 w-5 flex-shrink-0" />
            <span
              className={cn(
                "text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300",
                isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
              )}
            >
              Connect Wallet
            </span>
            {!isExpanded && (
              <div className="absolute left-14 bg-[#D97E5D] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                Connect Wallet
              </div>
            )}
          </button>

          <div className="border-t border-white/10 my-2"></div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full h-10 rounded-lg flex items-center justify-center transition-colors text-white/60 hover:text-white hover:bg-white/10"
          >
            {isExpanded ? <CloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </aside>

      {/* Spacer for desktop to avoid content overlap */}
      <div className="hidden md:block transition-all duration-300 flex-shrink-0 w-16"></div>
      
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-[60] h-14 bg-[#FBF9F6]/95 backdrop-blur border-b border-[#E5E7EB] flex items-center justify-between px-4">
        <button className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors">
          <Menu className="h-5 w-5 text-[#0D0D0C]" />
        </button>
        <a className="flex items-center gap-2" href="/">
          <div className="h-5 w-5 text-primary flex items-center justify-center">
             <AsteriskIcon className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
          </div>
          <span className="font-semibold text-[#0D0D0C] text-sm">Claude Predicts</span>
        </a>
        <button className="inline-flex items-center justify-center rounded-md bg-[#D97E5D] text-white shadow-sm hover:brightness-95 h-9 w-9">
          <Wallet className="h-4 w-4" />
        </button>
      </header>
    </>
  );
};

/* Custom Asterisk Icon matching the Claude branding style */
const AsteriskIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L14.4 9.6H22L15.8 14.1L18.2 21.7L12 17.1L5.8 21.7L8.2 14.1L2 9.6H9.6L12 2Z" />
  </svg>
);

export default NavigationSidebar;