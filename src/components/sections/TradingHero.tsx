"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Target, Brain, Terminal, Cpu, Eye, Crosshair, CheckCircle2, AlertTriangle, Layers, Shield, Flame, Trophy, BarChart3 } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useTrading, ThoughtLog, PnlDataPoint } from "@/lib/trading-engine";
import { formatPrice } from "@/lib/prices";
import { useEffect, useRef, useMemo } from "react";

type LogType = "SIGNAL" | "ANALYSIS" | "EXECUTE" | "MONITOR" | "CLOSE" | "ALERT";

const typeConfig: Record<LogType, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string; borderColor: string }> = {
  SIGNAL: { icon: Crosshair, color: "text-signal", bgColor: "bg-signal/10", borderColor: "border-signal/30" },
  ANALYSIS: { icon: Eye, color: "text-muted-foreground", bgColor: "bg-muted/10", borderColor: "border-muted-foreground/30" },
  EXECUTE: { icon: Cpu, color: "text-primary", bgColor: "bg-primary/10", borderColor: "border-primary/30" },
  MONITOR: { icon: TrendingUp, color: "text-warning", bgColor: "bg-warning/10", borderColor: "border-warning/30" },
  CLOSE: { icon: CheckCircle2, color: "text-profit", bgColor: "bg-profit/10", borderColor: "border-profit/30" },
  ALERT: { icon: AlertTriangle, color: "text-loss", bgColor: "bg-loss/10", borderColor: "border-loss/30" },
};

const INITIAL_INVESTMENT = 5000;

export default function TradingHero() {
  const { positions, thoughts, stats, currentAction, pnlHistory } = useTrading();
  const scrollRef = useRef<HTMLDivElement>(null);

  const positionsPnl = useMemo(() => positions.reduce((sum, pos) => sum + pos.pnl, 0), [positions]);
  const totalExposure = useMemo(() => positions.reduce((sum, pos) => sum + pos.sizeUsd * pos.leverage, 0), [positions]);

  const currentValue = INITIAL_INVESTMENT + stats.todayPnl + positionsPnl;
  const totalGain = stats.todayPnl + positionsPnl;
  const pnlPercent = (totalGain / INITIAL_INVESTMENT) * 100;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thoughts]);

  const isAnalyzing = currentAction === "ANALYZING" || currentAction === "SCANNING";

  return (
    <section id="dashboard" className="relative pt-24 pb-8 overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-profit/5 blur-[100px] rounded-full" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
            <span className="text-foreground">WATCH </span>
            <span className="text-primary text-glow-primary">CLAUDE PERPS</span>
            <span className="text-foreground"> TRADE</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time AI-powered perpetual futures trading
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="max-w-[1400px] mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Live Positions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-3"
            >
              <div className="rounded-xl overflow-hidden border border-border bg-surface/80 backdrop-blur-sm h-[420px] flex flex-col">
                <div className="flex items-center justify-between px-3 py-2.5 bg-surface-light border-b border-border">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    <span className="font-display text-xs font-bold tracking-wide">POSITIONS</span>
                  </div>
                  {positions.length > 0 && (
                    <span className={`font-mono text-xs font-bold ${positionsPnl >= 0 ? "text-profit" : "text-loss"}`}>
                      {positionsPnl >= 0 ? "+" : ""}${positionsPnl.toFixed(0)}
                    </span>
                  )}
                </div>

                {positions.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center p-4">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex flex-col items-center gap-2"
                    >
                      <Target className="w-8 h-8 text-primary/50" />
                      <p className="text-xs text-muted-foreground">Scanning...</p>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto terminal-scrollbar p-2 space-y-2">
                    <AnimatePresence>
                      {positions.map((position) => (
                        <motion.div
                          key={position.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="rounded-lg border border-border/50 bg-surface-light/50 p-2.5"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-5 h-5 rounded flex items-center justify-center ${
                                position.side === "LONG" 
                                  ? "bg-profit/10 border border-profit/30" 
                                  : "bg-loss/10 border border-loss/30"
                              }`}>
                                {position.side === "LONG" ? (
                                  <TrendingUp className="w-2.5 h-2.5 text-profit" />
                                ) : (
                                  <TrendingDown className="w-2.5 h-2.5 text-loss" />
                                )}
                              </div>
                              <span className="font-mono font-semibold text-xs">{position.symbol}</span>
                              <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-primary/10 text-primary">
                                {position.leverage}x
                              </span>
                            </div>
                            <span className={`font-mono text-xs font-bold ${position.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                              {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(0)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>Entry: ${formatPrice(position.entryPrice)}</span>
                            <span>Mark: ${formatPrice(position.markPrice)}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                <div className="flex items-center justify-between px-2.5 py-2 bg-surface-light border-t border-border text-[10px]">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Target className="w-2.5 h-2.5" />
                    ${totalExposure.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-profit opacity-75 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-profit" />
                    </span>
                    <span className="text-muted-foreground font-mono">Live</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Center: Live P&L */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-6"
            >
              <div className={`relative rounded-xl overflow-hidden border backdrop-blur-sm h-[420px] flex flex-col ${
                totalGain >= 0 ? "border-profit/30 bg-surface/80" : "border-loss/30 bg-surface/80"
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  totalGain >= 0 
                    ? "from-profit/5 via-transparent to-primary/3" 
                    : "from-loss/5 via-transparent to-primary/3"
                }`} />
                
                <div className="relative flex-1 flex flex-col justify-center p-6">
                  <div className="text-center mb-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5">
                      <TrendingUp className={`w-3 h-3 ${totalGain >= 0 ? "text-profit" : "text-loss"}`} />
                      Total Live P&L
                    </p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className={`text-5xl md:text-6xl font-display font-bold ${
                        totalGain >= 0 ? "text-profit text-glow-profit" : "text-loss text-glow-loss"
                      }`}>
                        {totalGain >= 0 ? "+" : ""}$<NumberFlow value={totalGain} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
                      </span>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className={`text-sm mt-1 font-mono ${totalGain >= 0 ? "text-profit/80" : "text-loss/80"}`}
                    >
                      {totalGain >= 0 ? "+" : ""}<NumberFlow value={pnlPercent} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />%
                      <span className="text-muted-foreground ml-2 text-xs">
                        (${currentValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} from $5,000)
                      </span>
                    </motion.p>
                  </div>

                  <MiniEquityCurve pnlHistory={pnlHistory} totalValue={currentValue} />

                  <div className="grid grid-cols-5 gap-2 mt-4">
                    <StatCard label="Today" value={stats.todayPnl} prefix="$" isProfit={stats.todayPnl >= 0} />
                    <StatCard label="Win Rate" value={stats.winRate} suffix="%" isProfit />
                    <StatCard label="Trades" value={stats.totalTrades} />
                    <StatCard label="Streak" value={stats.winStreak} icon={Flame} />
                    <StatCard label="Sharpe" value={stats.sharpeRatio} />
                  </div>
                </div>

                <div className="relative flex items-center justify-center gap-6 px-4 py-2.5 bg-surface-light/50 border-t border-border/50 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-warning" />
                    <span className="text-muted-foreground">Open:</span>
                    <span className="font-mono font-bold text-foreground">{positions.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-profit" />
                    <span className="text-muted-foreground">Risk:</span>
                    <span className="font-mono font-bold text-profit">OK</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-primary" />
                    <span className="text-muted-foreground">Vol:</span>
                    <span className="font-mono font-bold text-foreground">${(stats.volume24h / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: HyperClaude Logs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="lg:col-span-3"
              id="thoughts"
            >
              <div className="rounded-xl overflow-hidden border border-border bg-surface/80 backdrop-blur-sm h-[420px] flex flex-col">
                <div className="flex items-center justify-between px-3 py-2.5 bg-surface-light border-b border-border">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="font-mono text-xs text-foreground">claude.log</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
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
                </div>

                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto terminal-scrollbar p-2 space-y-1.5"
                >
                  {thoughts.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-center"
                      >
                        <Brain className="w-8 h-8 text-primary/50 mx-auto mb-2" />
                        <p className="text-muted-foreground text-xs">Initializing...</p>
                      </motion.div>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {thoughts.map((log) => (
                        <LogEntry key={log.id} log={log} />
                      ))}
                    </AnimatePresence>
                  )}
                  
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-1.5 text-muted-foreground py-1"
                  >
                    <span className="w-1.5 h-3 bg-primary animate-pulse" />
                    <span className="font-mono text-[10px]">Processing...</span>
                  </motion.div>
                </div>

                <div className="flex items-center justify-between px-2.5 py-2 bg-surface-light border-t border-border text-[10px] font-mono">
                  <span className="text-muted-foreground">
                    Today: <span className={stats.todayPnl >= 0 ? "text-profit" : "text-loss"}>
                      {stats.todayPnl >= 0 ? "+" : ""}${stats.todayPnl.toFixed(0)}
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    #{stats.totalTrades.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({ 
  label, 
  value, 
  prefix = "", 
  suffix = "", 
  isProfit,
  icon: Icon
}: { 
  label: string; 
  value: number; 
  prefix?: string; 
  suffix?: string;
  isProfit?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="text-center p-2 rounded-lg bg-surface-light/30 border border-border/30">
      <div className="flex items-center justify-center gap-1 mb-0.5">
        {Icon && <Icon className="w-3 h-3 text-warning" />}
        <span className={`text-sm font-bold font-mono ${
          isProfit !== undefined 
            ? (isProfit ? "text-profit" : "text-loss") 
            : "text-foreground"
        }`}>
          {prefix}{typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}{suffix}
        </span>
      </div>
      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  );
}

function MiniEquityCurve({ pnlHistory, totalValue }: { pnlHistory: PnlDataPoint[]; totalValue: number }) {
  const { pathData, areaPath, isProfit } = useMemo(() => {
    const historyWithCurrent = [...pnlHistory];
    if (historyWithCurrent.length > 0) {
      historyWithCurrent[historyWithCurrent.length - 1] = {
        ...historyWithCurrent[historyWithCurrent.length - 1],
        value: totalValue,
      };
    }

    if (historyWithCurrent.length < 2) {
      return { pathData: "", areaPath: "", isProfit: true };
    }

    const values = historyWithCurrent.map(p => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || 1;
    const minV = min - padding;
    const maxV = max + padding;
    
    const w = 100;
    const h = 30;
    
    const path = historyWithCurrent
      .map((point, i) => {
        const x = (i / (historyWithCurrent.length - 1)) * w;
        const y = h - ((point.value - minV) / (maxV - minV)) * h;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    const area = path + ` L ${w} ${h} L 0 ${h} Z`;
    const lastValue = historyWithCurrent[historyWithCurrent.length - 1]?.value || 0;
    
    return { 
      pathData: path, 
      areaPath: area, 
      isProfit: lastValue >= INITIAL_INVESTMENT,
    };
  }, [pnlHistory, totalValue]);

  const color = isProfit ? "#00ff88" : "#ff3b5c";
  const colorRgba = isProfit ? "rgba(0, 255, 136, 0.2)" : "rgba(255, 59, 92, 0.2)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="relative h-12 w-full"
    >
      <svg
        viewBox="0 0 100 30"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorRgba} />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#curveGradient)" />
        <path d={pathData} fill="none" stroke={color} strokeWidth="0.5" />
      </svg>
    </motion.div>
  );
}

function LogEntry({ log }: { log: ThoughtLog }) {
  const config = typeConfig[log.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 5 }}
      transition={{ duration: 0.15 }}
      className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-2 hover:bg-surface-elevated/50 transition-colors`}
    >
      <div className="flex items-start gap-1.5">
        <div className={`w-5 h-5 rounded ${config.bgColor} border ${config.borderColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-2.5 h-2.5 ${config.color}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-mono text-[9px] text-muted-foreground">{log.time}</span>
            <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${config.bgColor} ${config.color}`}>
              {log.type}
            </span>
          </div>
          
          <h4 className={`font-semibold text-[10px] leading-tight ${
            log.type === "CLOSE" && log.trade?.pnl && log.trade.pnl > 0 
              ? "text-profit" 
              : log.type === "CLOSE" && log.trade?.pnl && log.trade.pnl < 0
              ? "text-loss"
              : "text-foreground"
          }`}>
            {log.title}
            {log.trade?.pnl !== undefined && (
              <span className={`ml-1 ${log.trade.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                {log.trade.pnl >= 0 ? "+" : ""}${log.trade.pnl.toFixed(0)}
              </span>
            )}
          </h4>
          
          <p className="font-mono text-[9px] text-muted-foreground leading-tight truncate">
            {log.content[0]}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
