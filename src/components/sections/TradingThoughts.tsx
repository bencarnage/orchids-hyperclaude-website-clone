"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, Terminal, Cpu, Eye, Crosshair, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTrading, ThoughtLog } from "@/lib/trading-engine";

type LogType = "SIGNAL" | "ANALYSIS" | "EXECUTE" | "MONITOR" | "CLOSE" | "ALERT";

const typeConfig: Record<LogType, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string; borderColor: string }> = {
  SIGNAL: { icon: Crosshair, color: "text-signal", bgColor: "bg-signal/10", borderColor: "border-signal/30" },
  ANALYSIS: { icon: Eye, color: "text-muted-foreground", bgColor: "bg-muted/10", borderColor: "border-muted-foreground/30" },
  EXECUTE: { icon: Cpu, color: "text-primary", bgColor: "bg-primary/10", borderColor: "border-primary/30" },
  MONITOR: { icon: TrendingUp, color: "text-warning", bgColor: "bg-warning/10", borderColor: "border-warning/30" },
  CLOSE: { icon: CheckCircle2, color: "text-profit", bgColor: "bg-profit/10", borderColor: "border-profit/30" },
  ALERT: { icon: AlertTriangle, color: "text-loss", bgColor: "bg-loss/10", borderColor: "border-loss/30" },
};

export default function TradingThoughts() {
  const { thoughts, positions, stats, currentAction } = useTrading();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thoughts]);

  const isAnalyzing = currentAction === "ANALYZING" || currentAction === "SCANNING";

  return (
    <section id="thoughts" className="py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-xl overflow-hidden border border-border bg-surface/80 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-3 bg-surface-light border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-loss/80" />
                  <span className="w-3 h-3 rounded-full bg-warning/80" />
                  <span className="w-3 h-3 rounded-full bg-profit/80" />
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="font-mono text-sm text-foreground">hyperclaude_thoughts.log</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  isAnalyzing 
                    ? "bg-primary/10 text-primary border border-primary/30" 
                    : "bg-profit/10 text-profit border border-profit/30"
                }`}>
                  <span className="relative flex h-2 w-2">
                    <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                      isAnalyzing ? "bg-primary" : "bg-profit"
                    }`} />
                    <span className={`relative inline-flex h-2 w-2 rounded-full ${
                      isAnalyzing ? "bg-primary" : "bg-profit"
                    }`} />
                  </span>
                  {currentAction}
                </div>
                <Terminal className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div
              ref={scrollRef}
              className="h-[500px] overflow-y-auto terminal-scrollbar p-4 space-y-3"
            >
              {thoughts.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-center"
                  >
                    <Brain className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">AI initializing...</p>
                  </motion.div>
                </div>
              ) : (
                <AnimatePresence>
                  {thoughts.map((log, index) => (
                    <LogEntry key={log.id} log={log} index={index} />
                  ))}
                </AnimatePresence>
              )}
              
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-2 text-muted-foreground py-2"
              >
                <span className="w-2 h-4 bg-primary animate-pulse" />
                <span className="font-mono text-sm">Processing market data...</span>
              </motion.div>
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-surface-light border-t border-border text-xs font-mono">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  Open: <span className="text-primary">{positions.length}</span>
                </span>
                <span className="text-muted-foreground">
                  Today: <span className={stats.todayPnl >= 0 ? "text-profit" : "text-loss"}>
                    {stats.todayPnl >= 0 ? "+" : ""}${stats.todayPnl.toFixed(2)}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  Trades: <span className="text-foreground">{stats.totalTrades.toLocaleString()}</span>
                </span>
                <span className="text-muted-foreground">
                  Uptime: <span className="text-profit">99.9%</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LogEntry({ log, index }: { log: ThoughtLog; index: number }) {
  const config = typeConfig[log.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.01, duration: 0.3 }}
      className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-4 hover:bg-surface-elevated/50 transition-colors`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className={`w-8 h-8 rounded-lg ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs text-muted-foreground">{log.time}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${config.bgColor} ${config.color} border ${config.borderColor}`}>
              {log.type}
            </span>
            {log.trade?.side && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                log.trade.side === "LONG" 
                  ? "bg-profit/10 text-profit border border-profit/30" 
                  : "bg-loss/10 text-loss border border-loss/30"
              }`}>
                {log.trade.side}
              </span>
            )}
            {log.trade?.leverage && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-primary/10 text-primary border border-primary/30">
                {log.trade.leverage}x
              </span>
            )}
          </div>
          
          <h4 className={`font-semibold text-sm mb-2 ${
            log.type === "CLOSE" && log.trade?.pnl && log.trade.pnl > 0 
              ? "text-profit" 
              : log.type === "CLOSE" && log.trade?.pnl && log.trade.pnl < 0
              ? "text-loss"
              : "text-foreground"
          }`}>
            {log.title}
            {log.trade?.pnl !== undefined && (
              <span className={`ml-2 ${log.trade.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                {log.trade.pnl >= 0 ? "+" : ""}${log.trade.pnl.toLocaleString()}
              </span>
            )}
          </h4>
          
          <div className="space-y-1">
            {log.content.map((line, i) => (
              <p key={i} className="font-mono text-xs text-muted-foreground leading-relaxed">
                <span className="text-primary/50 mr-2">›</span>
                {line}
              </p>
            ))}
          </div>

          {log.trade?.asset && log.type === "EXECUTE" && (
            <div className="mt-3 flex items-center gap-4 text-xs font-mono">
              <span className="text-foreground font-semibold">{log.trade.asset}</span>
              {log.trade.entry && (
                <span className="text-muted-foreground">
                  @ <span className="text-foreground">${log.trade.entry.toLocaleString()}</span>
                </span>
              )}
              {log.trade.size && (
                <span className="text-muted-foreground">
                  Size: <span className="text-foreground">{log.trade.size}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {log.trade?.pnlPercent !== undefined && log.type !== "EXECUTE" && (
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${
            log.trade.pnlPercent >= 0 
              ? "bg-profit/10 text-profit border border-profit/30" 
              : "bg-loss/10 text-loss border border-loss/30"
          }`}>
            {log.trade.pnlPercent >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span className="font-mono text-sm font-bold">
              {log.trade.pnlPercent >= 0 ? "+" : ""}{log.trade.pnlPercent.toFixed(2)}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}