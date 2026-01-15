"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, Terminal, Cpu, Eye, Crosshair, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";

type LogType = "SIGNAL" | "ANALYSIS" | "EXECUTE" | "MONITOR" | "CLOSE" | "ALERT";

interface TradingLogEntry {
  id: string;
  time: string;
  type: LogType;
  title: string;
  content: string[];
  trade?: {
    asset: string;
    side: "LONG" | "SHORT";
    entry?: number;
    exit?: number;
    size?: string;
    leverage?: number;
    pnl?: number;
    pnlPercent?: number;
  };
}

const initialLogs: TradingLogEntry[] = [
  {
    id: "1",
    time: "14:28:45",
    type: "ANALYSIS",
    title: "Scanning Market Conditions",
    content: [
      "BTC consolidating near $98,200 resistance level.",
      "Volume declining on recent candles - watching for breakout.",
      "Funding rate: -0.008% (slightly favorable for longs).",
    ],
  },
  {
    id: "2",
    time: "14:31:02",
    type: "SIGNAL",
    title: "BTC Bullish Divergence Detected",
    content: [
      "RSI showing higher lows while price makes equal lows on 4H.",
      "MACD histogram turning positive after extended bearish run.",
      "Volume profile shows strong support at $97,800 level.",
    ],
  },
  {
    id: "3",
    time: "14:32:08",
    type: "EXECUTE",
    title: "Opening LONG BTC-PERP",
    content: [
      "Entry: $98,234 | Size: 0.5 BTC | Leverage: 5x",
      "Stop Loss: $97,200 (-1.05%) | Take Profit: $101,500 (+3.3%)",
      "Risk: 1.05% of portfolio | R:R Ratio: 3.14",
    ],
    trade: {
      asset: "BTC-PERP",
      side: "LONG",
      entry: 98234,
      size: "0.5 BTC",
      leverage: 5,
    },
  },
  {
    id: "4",
    time: "14:35:22",
    type: "MONITOR",
    title: "BTC-PERP Position Update",
    content: [
      "Current: $98,456 (+0.23%) | Unrealized PnL: +$111",
      "Moving stop loss to breakeven at $98,234.",
      "Position looking healthy, maintaining current strategy.",
    ],
    trade: {
      asset: "BTC-PERP",
      side: "LONG",
      pnl: 111,
      pnlPercent: 0.23,
    },
  },
  {
    id: "5",
    time: "14:41:17",
    type: "CLOSE",
    title: "BTC-PERP Closed in Profit",
    content: [
      "Exit: $99,012 | Duration: 9m 9s",
      "Reason: Hit take profit level 1 (partial close).",
      "Adding to win streak. Looking for next opportunity.",
    ],
    trade: {
      asset: "BTC-PERP",
      side: "LONG",
      entry: 98234,
      exit: 99012,
      pnl: 389,
      pnlPercent: 0.79,
    },
  },
  {
    id: "6",
    time: "14:42:33",
    type: "SIGNAL",
    title: "ETH Bearish Setup Forming",
    content: [
      "ETH/BTC ratio breaking down from key support.",
      "4H showing lower highs pattern near $3,480 resistance.",
      "Waiting for confirmation candle before entry.",
    ],
  },
  {
    id: "7",
    time: "14:45:01",
    type: "ALERT",
    title: "High Volatility Warning",
    content: [
      "BTC volatility index spiking - caution advised.",
      "Reducing position sizing for next trades by 25%.",
      "Will reassess market conditions in 30 minutes.",
    ],
  },
];

const additionalLogs: TradingLogEntry[] = [
  {
    id: "8",
    time: "14:47:12",
    type: "EXECUTE",
    title: "Opening SHORT ETH-PERP",
    content: [
      "Entry: $3,450 | Size: 2.0 ETH | Leverage: 10x",
      "Stop Loss: $3,520 (-2.0%) | Take Profit: $3,320 (+3.8%)",
      "Bearish continuation play on ETH weakness.",
    ],
    trade: {
      asset: "ETH-PERP",
      side: "SHORT",
      entry: 3450,
      size: "2.0 ETH",
      leverage: 10,
    },
  },
  {
    id: "9",
    time: "14:49:55",
    type: "MONITOR",
    title: "ETH-PERP Position Update",
    content: [
      "Current: $3,420 (+0.87%) | Unrealized PnL: +$60",
      "Position moving in favor, tightening stop to $3,465.",
      "Target 1 at $3,380 for partial exit.",
    ],
    trade: {
      asset: "ETH-PERP",
      side: "SHORT",
      pnl: 60,
      pnlPercent: 0.87,
    },
  },
  {
    id: "10",
    time: "14:52:03",
    type: "ANALYSIS",
    title: "SOL Setup Analysis",
    content: [
      "SOL showing relative strength vs ETH.",
      "Potential long setup forming at $178 support.",
      "Adding to watchlist for next entry opportunity.",
    ],
  },
];

const typeConfig: Record<LogType, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string; borderColor: string }> = {
  SIGNAL: { icon: Crosshair, color: "text-signal", bgColor: "bg-signal/10", borderColor: "border-signal/30" },
  ANALYSIS: { icon: Eye, color: "text-muted-foreground", bgColor: "bg-muted/10", borderColor: "border-muted-foreground/30" },
  EXECUTE: { icon: Cpu, color: "text-primary", bgColor: "bg-primary/10", borderColor: "border-primary/30" },
  MONITOR: { icon: TrendingUp, color: "text-warning", bgColor: "bg-warning/10", borderColor: "border-warning/30" },
  CLOSE: { icon: CheckCircle2, color: "text-profit", bgColor: "bg-profit/10", borderColor: "border-profit/30" },
  ALERT: { icon: AlertTriangle, color: "text-loss", bgColor: "bg-loss/10", borderColor: "border-loss/30" },
};

export default function TradingThoughts() {
  const [logs, setLogs] = useState<TradingLogEntry[]>(initialLogs);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const additionalLogIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (additionalLogIndex.current < additionalLogs.length) {
        const newLog = {
          ...additionalLogs[additionalLogIndex.current],
          time: new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 8),
        };
        setLogs((prev) => [...prev, newLog]);
        additionalLogIndex.current++;
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    const analyzeInterval = setInterval(() => {
      setIsAnalyzing((prev) => !prev);
    }, 3000);
    return () => clearInterval(analyzeInterval);
  }, []);

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
                  {isAnalyzing ? "ANALYZING" : "TRADING"}
                </div>
                <Terminal className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div
              ref={scrollRef}
              className="h-[500px] overflow-y-auto terminal-scrollbar p-4 space-y-3"
            >
              <AnimatePresence>
                {logs.map((log, index) => (
                  <LogEntry key={log.id} log={log} index={index} />
                ))}
              </AnimatePresence>
              
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
                  Open: <span className="text-primary">2</span>
                </span>
                <span className="text-muted-foreground">
                  Today: <span className="text-profit">+$2,341</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  Trades: <span className="text-foreground">1,847</span>
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

function LogEntry({ log, index }: { log: TradingLogEntry; index: number }) {
  const config = typeConfig[log.type];
  const Icon = config.icon;

  const getSideColor = (side?: "LONG" | "SHORT") => {
    if (side === "LONG") return "text-profit";
    if (side === "SHORT") return "text-loss";
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
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