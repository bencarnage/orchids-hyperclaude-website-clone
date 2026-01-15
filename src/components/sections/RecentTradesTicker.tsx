"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

interface RecentTrade {
  id: string;
  asset: string;
  side: "LONG" | "SHORT";
  pnl: number;
  pnlPercent: number;
  time: string;
}

const recentTrades: RecentTrade[] = [
  { id: "1", asset: "BTC", side: "LONG", pnl: 389, pnlPercent: 0.79, time: "2m ago" },
  { id: "2", asset: "ETH", side: "SHORT", pnl: 156, pnlPercent: 1.2, time: "15m ago" },
  { id: "3", asset: "SOL", side: "LONG", pnl: -45, pnlPercent: -0.8, time: "28m ago" },
  { id: "4", asset: "AVAX", side: "LONG", pnl: 89, pnlPercent: 0.45, time: "42m ago" },
  { id: "5", asset: "ARB", side: "SHORT", pnl: 234, pnlPercent: 2.1, time: "1h ago" },
  { id: "6", asset: "DOGE", side: "LONG", pnl: -28, pnlPercent: -0.5, time: "1h ago" },
  { id: "7", asset: "LINK", side: "LONG", pnl: 167, pnlPercent: 1.8, time: "2h ago" },
  { id: "8", asset: "BTC", side: "SHORT", pnl: 445, pnlPercent: 0.9, time: "3h ago" },
  { id: "9", asset: "ETH", side: "LONG", pnl: 312, pnlPercent: 1.5, time: "4h ago" },
  { id: "10", asset: "MATIC", side: "SHORT", pnl: -67, pnlPercent: -1.2, time: "5h ago" },
];

export default function RecentTradesTicker() {
  const duplicatedTrades = [...recentTrades, ...recentTrades];

  return (
    <section className="py-6 overflow-hidden border-y border-border/50 bg-surface/30">
      <div className="flex items-center">
        <div className="flex-shrink-0 px-4 md:px-6 border-r border-border/50">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
              Recent Trades
            </span>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex gap-6 animate-ticker hover:pause"
            style={{ width: "max-content" }}
          >
            {duplicatedTrades.map((trade, index) => (
              <TradeItem key={`${trade.id}-${index}`} trade={trade} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TradeItem({ trade }: { trade: RecentTrade }) {
  const isProfit = trade.pnl >= 0;

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-surface-light/50 border border-border/30 hover:border-border transition-colors">
      <div className={`w-6 h-6 rounded flex items-center justify-center ${
        isProfit ? "bg-profit/10" : "bg-loss/10"
      }`}>
        {isProfit ? (
          <TrendingUp className="w-3.5 h-3.5 text-profit" />
        ) : (
          <TrendingDown className="w-3.5 h-3.5 text-loss" />
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <span className="font-mono font-semibold text-sm text-foreground">{trade.asset}</span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
          trade.side === "LONG"
            ? "bg-profit/10 text-profit"
            : "bg-loss/10 text-loss"
        }`}>
          {trade.side}
        </span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <span className={`font-mono font-bold text-sm ${isProfit ? "text-profit" : "text-loss"}`}>
          {isProfit ? "+" : ""}${Math.abs(trade.pnl)}
        </span>
        <span className={`font-mono text-xs ${isProfit ? "text-profit/60" : "text-loss/60"}`}>
          ({isProfit ? "+" : ""}{trade.pnlPercent}%)
        </span>
      </div>
      
      <span className="text-xs text-muted-foreground">{trade.time}</span>
    </div>
  );
}