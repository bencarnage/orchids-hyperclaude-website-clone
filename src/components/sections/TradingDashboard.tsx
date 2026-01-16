"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Layers, Target, Shield, Brain, Terminal, Cpu, Eye, Crosshair, CheckCircle2, AlertTriangle } from "lucide-react";
import { useTrading, ThoughtLog } from "@/lib/trading-engine";
import { formatPrice } from "@/lib/prices";
import { useEffect, useRef } from "react";

type LogType = "SIGNAL" | "ANALYSIS" | "EXECUTE" | "MONITOR" | "CLOSE" | "ALERT";

const typeConfig: Record<LogType, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string; borderColor: string }> = {
  SIGNAL: { icon: Crosshair, color: "text-signal", bgColor: "bg-signal/10", borderColor: "border-signal/30" },
  ANALYSIS: { icon: Eye, color: "text-muted-foreground", bgColor: "bg-muted/10", borderColor: "border-muted-foreground/30" },
  EXECUTE: { icon: Cpu, color: "text-primary", bgColor: "bg-primary/10", borderColor: "border-primary/30" },
  MONITOR: { icon: TrendingUp, color: "text-warning", bgColor: "bg-warning/10", borderColor: "border-warning/30" },
  CLOSE: { icon: CheckCircle2, color: "text-profit", bgColor: "bg-profit/10", borderColor: "border-profit/30" },
  ALERT: { icon: AlertTriangle, color: "text-loss", bgColor: "bg-loss/10", borderColor: "border-loss/30" },
};

export default function TradingDashboard() {
  const { positions, thoughts, stats, currentAction } = useTrading();
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalExposure = positions.reduce((sum, pos) => sum + pos.sizeUsd * pos.leverage, 0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thoughts]);

  const isAnalyzing = currentAction === "ANALYZING" || currentAction === "SCANNING";

  return (
      <section id="positions" className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                id="thoughts"
              >
              <div className="rounded-xl overflow-hidden border border-border bg-surface/80 backdrop-blur-sm h-[560px] flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-surface-light border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-loss/80" />
                      <span className="w-3 h-3 rounded-full bg-warning/80" />
                      <span className="w-3 h-3 rounded-full bg-profit/80" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-primary" />
                      <span className="font-mono text-sm text-foreground">hyperclaude.log</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
                      isAnalyzing 
                        ? "bg-primary/10 text-primary border border-primary/30" 
                        : "bg-profit/10 text-profit border border-profit/30"
                    }`}>
                      <span className="relative flex h-1.5 w-1.5">
                        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                          isAnalyzing ? "bg-primary" : "bg-profit"
                        }`} />
                        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
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
                  className="flex-1 overflow-y-auto terminal-scrollbar p-3 space-y-2"
                >
                  {thoughts.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-center"
                      >
                        <Brain className="w-10 h-10 text-primary/50 mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">Initializing...</p>
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
                    <span className="font-mono text-xs">Processing...</span>
                  </motion.div>
                </div>

                <div className="flex items-center justify-between px-3 py-2 bg-surface-light border-t border-border text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">
                      Open: <span className="text-primary">{positions.length}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Today: <span className={stats.todayPnl >= 0 ? "text-profit" : "text-loss"}>
                        {stats.todayPnl >= 0 ? "+" : ""}${stats.todayPnl.toFixed(0)}
                      </span>
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    Trades: <span className="text-foreground">{stats.totalTrades.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold tracking-wide">LIVE POSITIONS</h3>
                      <p className="text-xs text-muted-foreground">
                        {positions.length === 0 ? "Scanning..." : `${positions.length} active`}
                      </p>
                    </div>
                  </div>
                  {positions.length > 0 && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                      totalPnl >= 0 
                        ? "bg-profit/10 border border-profit/30" 
                        : "bg-loss/10 border border-loss/30"
                    }`}>
                      {totalPnl >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-profit" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-loss" />
                      )}
                      <span className={`font-mono font-bold ${totalPnl >= 0 ? "text-profit" : "text-loss"}`}>
                        {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="rounded-xl overflow-hidden border border-border bg-surface/80 backdrop-blur-sm h-[560px] flex flex-col">
                  {positions.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center p-8">
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center gap-4"
                      >
                        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                          <Target className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="text-foreground font-semibold mb-1">Analyzing Markets</p>
                          <p className="text-sm text-muted-foreground">Scanning for setups...</p>
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto terminal-scrollbar">
                        <table className="w-full">
                          <thead className="sticky top-0 bg-surface-light z-10">
                            <tr className="border-b border-border">
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Asset</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase">Size</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase">Entry</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase">Mark</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase">PnL</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50">
                            <AnimatePresence>
                              {positions.map((position, index) => (
                                <motion.tr
                                  key={position.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="hover:bg-surface-elevated/50 transition-colors"
                                >
                                  <td className="px-3 py-3">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-6 h-6 rounded flex items-center justify-center ${
                                        position.side === "LONG" 
                                          ? "bg-profit/10 border border-profit/30" 
                                          : "bg-loss/10 border border-loss/30"
                                      }`}>
                                        {position.side === "LONG" ? (
                                          <TrendingUp className="w-3 h-3 text-profit" />
                                        ) : (
                                          <TrendingDown className="w-3 h-3 text-loss" />
                                        )}
                                      </div>
                                      <div>
                                        <span className="font-mono font-semibold text-sm text-foreground">{position.symbol}</span>
                                        <div className="flex items-center gap-1 mt-0.5">
                                          <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${
                                            position.side === "LONG"
                                              ? "bg-profit/10 text-profit"
                                              : "bg-loss/10 text-loss"
                                          }`}>
                                            {position.side}
                                          </span>
                                          <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-primary/10 text-primary">
                                            {position.leverage}x
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-3 py-3 text-right">
                                    <span className="font-mono text-xs text-foreground">${position.sizeUsd.toFixed(0)}</span>
                                  </td>
                                  <td className="px-3 py-3 text-right">
                                    <span className="font-mono text-xs text-muted-foreground">${formatPrice(position.entryPrice)}</span>
                                  </td>
                                  <td className="px-3 py-3 text-right">
                                    <span className="font-mono text-xs text-foreground">${formatPrice(position.markPrice)}</span>
                                  </td>
                                  <td className="px-3 py-3 text-right">
                                    <div className="flex flex-col items-end">
                                      <span className={`font-mono text-sm font-bold ${position.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                                        {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
                                      </span>
                                      <span className={`text-[10px] font-mono ${position.pnl >= 0 ? "text-profit/70" : "text-loss/70"}`}>
                                        {position.pnl >= 0 ? "+" : ""}{position.pnlPercent.toFixed(1)}%
                                      </span>
                                    </div>
                                  </td>
                                </motion.tr>
                              ))}
                            </AnimatePresence>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="flex items-center justify-between px-3 py-2 bg-surface-light border-t border-border text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            Exp: <span className="text-foreground font-mono">${totalExposure.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            <span className="text-profit font-mono">OK</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-profit opacity-75 animate-ping" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-profit" />
                          </span>
                          <span className="text-muted-foreground font-mono">Live</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
          </div>
        </div>
      </section>
        </div>
      </div>
    </section>
  );
}

function LogEntry({ log, index }: { log: ThoughtLog; index: number }) {
  const config = typeConfig[log.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ delay: index * 0.01, duration: 0.2 }}
      className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-3 hover:bg-surface-elevated/50 transition-colors`}
    >
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0">
          <div className={`w-6 h-6 rounded ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
            <Icon className={`w-3 h-3 ${config.color}`} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-muted-foreground">{log.time}</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider ${config.bgColor} ${config.color} border ${config.borderColor}`}>
              {log.type}
            </span>
            {log.trade?.side && (
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                log.trade.side === "LONG" 
                  ? "bg-profit/10 text-profit border border-profit/30" 
                  : "bg-loss/10 text-loss border border-loss/30"
              }`}>
                {log.trade.side}
              </span>
            )}
          </div>
          
          <h4 className={`font-semibold text-xs mb-1 ${
            log.type === "CLOSE" && log.trade?.pnl && log.trade.pnl > 0 
              ? "text-profit" 
              : log.type === "CLOSE" && log.trade?.pnl && log.trade.pnl < 0
              ? "text-loss"
              : "text-foreground"
          }`}>
            {log.title}
            {log.trade?.pnl !== undefined && (
              <span className={`ml-2 ${log.trade.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                {log.trade.pnl >= 0 ? "+" : ""}${log.trade.pnl.toFixed(0)}
              </span>
            )}
          </h4>
          
          <div className="space-y-0.5">
            {log.content.slice(0, 2).map((line, i) => (
              <p key={i} className="font-mono text-[10px] text-muted-foreground leading-relaxed truncate">
                <span className="text-primary/50 mr-1">›</span>
                {line}
              </p>
            ))}
          </div>
        </div>

        {log.trade?.pnlPercent !== undefined && log.type === "CLOSE" && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${
            log.trade.pnlPercent >= 0 
              ? "bg-profit/10 text-profit border border-profit/30" 
              : "bg-loss/10 text-loss border border-loss/30"
          }`}>
            {log.trade.pnlPercent >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span className="font-mono text-xs font-bold">
              {log.trade.pnlPercent >= 0 ? "+" : ""}{log.trade.pnlPercent.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}