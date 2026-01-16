"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, Terminal, Cpu, Eye, Crosshair, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTradingStore, formatPrice, type ThoughtLog } from "@/lib/trading-simulation";

type LogType = ThoughtLog["type"];

const typeConfig: Record<LogType, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string; borderColor: string }> = {
  SIGNAL: { icon: Crosshair, color: "text-signal", bgColor: "bg-signal/10", borderColor: "border-signal/30" },
  ANALYSIS: { icon: Eye, color: "text-muted-foreground", bgColor: "bg-muted/10", borderColor: "border-muted-foreground/30" },
  EXECUTE: { icon: Cpu, color: "text-primary", bgColor: "bg-primary/10", borderColor: "border-primary/30" },
  MONITOR: { icon: TrendingUp, color: "text-warning", bgColor: "bg-warning/10", borderColor: "border-warning/30" },
  CLOSE: { icon: CheckCircle2, color: "text-profit", bgColor: "bg-profit/10", borderColor: "border-profit/30" },
  ALERT: { icon: AlertTriangle, color: "text-loss", bgColor: "bg-loss/10", borderColor: "border-loss/30" },
};

const ANALYSIS_TEMPLATES = [
  { title: "Scanning Market Microstructure", content: ["Analyzing order flow imbalances across major pairs.", "CVD showing aggressive buying on {asset}.", "Checking funding rates and open interest delta."] },
  { title: "Volatility Analysis Complete", content: ["ATR expanding on {asset} - increased position sizing.", "Bollinger Band squeeze detected on 15m timeframe.", "IV rank at 65th percentile - favorable for momentum plays."] },
  { title: "Correlation Check", content: ["BTC dominance declining - altcoin rotation likely.", "{asset} showing negative correlation with DXY.", "Cross-asset momentum confirms directional bias."] },
  { title: "Liquidity Heatmap Analysis", content: ["Major liquidation cluster at ${price} on {asset}.", "Stop hunt probability: 72% within next 4 hours.", "Smart money accumulation detected in {asset}."] },
  { title: "Technical Pattern Recognition", content: ["{asset} forming ascending triangle on 4H.", "Volume profile shows high-value node at ${price}.", "RSI divergence aligning with structure break."] },
];

const SIGNAL_TEMPLATES = [
  { title: "{asset} Bullish Setup Confirmed", content: ["Multiple timeframe confluence detected.", "Order flow turning aggressively bid.", "Risk/reward ratio: 3.2 - executing entry."] },
  { title: "{asset} Bearish Divergence Signal", content: ["Price making higher highs, RSI making lower highs.", "Funding rate extremely positive - shorts favored.", "Preparing short entry with tight invalidation."] },
  { title: "Breakout Signal: {asset}", content: ["Clean break above ${price} resistance.", "Volume surge 340% above 20-period average.", "Momentum confirmation on multiple indicators."] },
  { title: "{asset} Mean Reversion Setup", content: ["Price extended 2.4 standard deviations from VWAP.", "Historical win rate for this setup: 71%.", "Scaling into position with 3 entries."] },
];

const MONITOR_TEMPLATES = [
  { title: "{asset} Position Update", content: ["Unrealized PnL: {pnl} ({pnlPercent}%)", "Moving stop to breakeven after {percent}% move.", "Target 1 approaching - preparing partial exit."] },
  { title: "Risk Management Adjustment", content: ["Trailing stop activated on {asset} position.", "Reduced exposure by 25% at ${price}.", "Remaining position running with free risk."] },
  { title: "{asset} Holding Through Consolidation", content: ["Price action choppy but structure intact.", "No change to stop loss or targets.", "Patience - thesis remains valid."] },
];

const CLOSE_TEMPLATES = [
  { title: "{asset} Closed in Profit", content: ["Exit at ${price} | Duration: {duration}", "Take profit hit - clean execution.", "Win streak continues. Looking for next setup."] },
  { title: "{asset} Position Stopped Out", content: ["Stop loss triggered at ${price}.", "Loss contained within risk parameters.", "Re-evaluating market structure."] },
  { title: "{asset} Partial Exit Executed", content: ["Took {percent}% off at ${price}.", "Locking in {pnl} profit.", "Runner position targeting ${target}."] },
];

const ALERT_TEMPLATES = [
  { title: "High Volatility Warning", content: ["Sudden price movement detected across majors.", "Reducing position sizing by 30%.", "Monitoring for cascade liquidations."] },
  { title: "Correlation Breakdown Alert", content: ["BTC/ETH correlation dropping rapidly.", "Unusual market structure - increasing caution.", "Tightening stops on all positions."] },
  { title: "Funding Rate Extreme", content: ["{asset} funding at +0.12% - overleveraged longs.", "Potential short squeeze or flush incoming.", "Adjusting strategy accordingly."] },
];

function getRandomTemplate(templates: typeof ANALYSIS_TEMPLATES) {
  return templates[Math.floor(Math.random() * templates.length)];
}

function fillTemplate(template: { title: string; content: string[] }, data: Record<string, string | number>): { title: string; content: string[] } {
  let title = template.title;
  const content = template.content.map(line => {
    let result = line;
    Object.entries(data).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    });
    return result;
  });
  
  Object.entries(data).forEach(([key, value]) => {
    title = title.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  });
  
  return { title, content };
}

export default function TradingThoughts() {
  const { positions, marketPrices, closedTrades, addThought, thoughts, openPosition, closePosition, todayPnl, totalTrades } = useTradingStore();
  const [localLogs, setLocalLogs] = useState<ThoughtLog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const lastActionRef = useRef<number>(Date.now());

  const generateThought = useCallback(() => {
    const assets = ["BTC", "ETH", "SOL", "AVAX", "ARB", "LINK", "OP", "INJ", "SUI"];
    const randomAsset = assets[Math.floor(Math.random() * assets.length)];
    const market = marketPrices[randomAsset];
    const price = market?.price || 1000;
    
    const random = Math.random();
    let type: LogType;
    let template: { title: string; content: string[] };
    let trade: ThoughtLog["trade"] | undefined;

    if (random < 0.35) {
      type = "ANALYSIS";
      template = fillTemplate(getRandomTemplate(ANALYSIS_TEMPLATES), {
        asset: randomAsset,
        price: formatPrice(price),
      });
    } else if (random < 0.55) {
      type = "SIGNAL";
      template = fillTemplate(getRandomTemplate(SIGNAL_TEMPLATES), {
        asset: randomAsset,
        price: formatPrice(price),
      });
    } else if (random < 0.75 && positions.length > 0) {
      type = "MONITOR";
      const pos = positions[Math.floor(Math.random() * positions.length)];
      template = fillTemplate(getRandomTemplate(MONITOR_TEMPLATES), {
        asset: pos.asset,
        pnl: `${pos.pnl >= 0 ? '+' : ''}$${pos.pnl.toFixed(2)}`,
        pnlPercent: pos.pnlPercent.toFixed(2),
        price: formatPrice(pos.markPrice),
        percent: Math.abs(pos.pnlPercent).toFixed(1),
      });
      trade = {
        asset: pos.asset,
        side: pos.side,
        pnl: pos.pnl,
        pnlPercent: pos.pnlPercent,
      };
    } else if (random < 0.85) {
      type = "ALERT";
      template = fillTemplate(getRandomTemplate(ALERT_TEMPLATES), {
        asset: randomAsset,
      });
    } else if (random < 0.92 && positions.length < 4) {
      type = "EXECUTE";
      const side = Math.random() > 0.5 ? "LONG" : "SHORT";
      const leverage = [3, 5, 7, 10][Math.floor(Math.random() * 4)];
      const sizeMultiplier = randomAsset === "BTC" ? 0.1 : randomAsset === "ETH" ? 1 : 10;
      const size = Math.round((0.2 + Math.random() * 0.8) * sizeMultiplier * 100) / 100;
      
      template = {
        title: `Opening ${side} ${randomAsset}-PERP`,
        content: [
          `Entry: $${formatPrice(price)} | Size: ${size} ${randomAsset} | Leverage: ${leverage}x`,
          `Stop Loss: $${formatPrice(price * (side === "LONG" ? 0.98 : 1.02))} | Take Profit: $${formatPrice(price * (side === "LONG" ? 1.03 : 0.97))}`,
          `Risk: ${(1 + Math.random()).toFixed(2)}% of portfolio | R:R Ratio: ${(2 + Math.random() * 2).toFixed(2)}`,
        ],
      };
      trade = {
        asset: `${randomAsset}-PERP`,
        side,
        entry: price,
        size: `${size} ${randomAsset}`,
        leverage,
      };
      
      openPosition({
        asset: randomAsset,
        side,
        size,
        sizeDisplay: `${size} ${randomAsset}`,
        leverage,
        entryPrice: price,
        liquidationPrice: price * (side === "LONG" ? 0.8 : 1.2),
        openTime: Date.now(),
        stopLoss: price * (side === "LONG" ? 0.98 : 1.02),
        takeProfit: price * (side === "LONG" ? 1.03 : 0.97),
      });
    } else if (positions.length > 0 && Math.random() > 0.5) {
      type = "CLOSE";
      const pos = positions[Math.floor(Math.random() * positions.length)];
      const isProfit = pos.pnl > 0;
      
      template = fillTemplate({
        title: `${pos.asset} ${isProfit ? 'Closed in Profit' : 'Position Stopped Out'}`,
        content: isProfit 
          ? [`Exit at $${formatPrice(pos.markPrice)} | Duration: {duration}`, "Take profit hit - clean execution.", `PnL: +$${pos.pnl.toFixed(2)} (+${pos.pnlPercent.toFixed(2)}%)`]
          : [`Stop loss triggered at $${formatPrice(pos.markPrice)}.`, "Loss contained within risk parameters.", "Re-evaluating market structure."],
      }, {
        duration: `${Math.floor((Date.now() - pos.openTime) / 60000)}m ${Math.floor(((Date.now() - pos.openTime) / 1000) % 60)}s`,
      });
      
      trade = {
        asset: pos.asset,
        side: pos.side,
        entry: pos.entryPrice,
        exit: pos.markPrice,
        pnl: pos.pnl,
        pnlPercent: pos.pnlPercent,
      };
      
      closePosition(pos.id, isProfit ? "take_profit" : "stop_loss");
    } else {
      type = "ANALYSIS";
      template = fillTemplate(getRandomTemplate(ANALYSIS_TEMPLATES), {
        asset: randomAsset,
        price: formatPrice(price),
      });
    }

    const now = new Date();
    const thought: ThoughtLog = {
      id: `thought-${Date.now()}-${Math.random()}`,
      time: now.toLocaleTimeString("en-US", { hour12: false }).slice(0, 8),
      type,
      title: template.title,
      content: template.content,
      trade,
    };

    setLocalLogs((prev) => [...prev.slice(-30), thought]);
    addThought(thought);
    lastActionRef.current = Date.now();
  }, [positions, marketPrices, addThought, openPosition, closePosition]);

  useEffect(() => {
    const baseInterval = 4000 + Math.random() * 3000;
    
    const interval = setInterval(() => {
      generateThought();
    }, baseInterval);

    for (let i = 0; i < 5; i++) {
      setTimeout(() => generateThought(), i * 800);
    }

    return () => clearInterval(interval);
  }, [generateThought]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localLogs]);

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
                {localLogs.map((log, index) => (
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
                  Open: <span className="text-primary">{positions.length}</span>
                </span>
                <span className="text-muted-foreground">
                  Today: <span className={todayPnl >= 0 ? "text-profit" : "text-loss"}>{todayPnl >= 0 ? "+" : ""}${todayPnl.toFixed(0)}</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  Trades: <span className="text-foreground">{totalTrades.toLocaleString()}</span>
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
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-4 hover:bg-surface-elevated/50 transition-colors`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className={`w-8 h-8 rounded-lg ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
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
            {log.trade?.pnl !== undefined && log.type === "CLOSE" && (
              <span className={`ml-2 ${log.trade.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                {log.trade.pnl >= 0 ? "+" : ""}${log.trade.pnl.toFixed(2)}
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
            <div className="mt-3 flex items-center gap-4 text-xs font-mono flex-wrap">
              <span className="text-foreground font-semibold">{log.trade.asset}</span>
              {log.trade.entry && (
                <span className="text-muted-foreground">
                  @ <span className="text-foreground">${formatPrice(log.trade.entry)}</span>
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

        {log.trade?.pnlPercent !== undefined && log.type === "MONITOR" && (
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