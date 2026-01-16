"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { useTrading, ClosedTrade } from "@/lib/trading-engine";
import { useMemo } from "react";

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function RecentTradesTicker() {
  const { closedTrades } = useTrading();

  const displayTrades = useMemo(() => {
    const trades = closedTrades.length > 0 
      ? closedTrades.slice(-20).reverse()
      : generatePlaceholderTrades();
    
    return [...trades, ...trades];
  }, [closedTrades]);

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
            {displayTrades.map((trade, index) => (
              <TradeItem key={`${trade.id}-${index}`} trade={trade} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TradeItem({ trade }: { trade: ClosedTrade }) {
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
        <span className="font-mono font-semibold text-sm text-foreground">{trade.symbol}</span>
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
          {isProfit ? "+" : "-"}${Math.abs(trade.pnl).toFixed(0)}
        </span>
        <span className={`font-mono text-xs ${isProfit ? "text-profit/60" : "text-loss/60"}`}>
          ({isProfit ? "+" : ""}{trade.pnlPercent.toFixed(1)}%)
        </span>
      </div>
      
      <span className="text-xs text-muted-foreground">{formatTimeAgo(trade.closeTime)}</span>
    </div>
  );
}

function generatePlaceholderTrades(): ClosedTrade[] {
  const symbols = ["BTC", "ETH", "SOL", "AVAX", "ARB", "LINK", "DOGE", "OP"];
  const now = Date.now();
  
  return [
    { id: "p1", asset: "BTC-PERP", symbol: "BTC", side: "LONG", size: 0.05, leverage: 10, entryPrice: 97500, exitPrice: 98200, pnl: 350, pnlPercent: 7.2, openTime: now - 3600000, closeTime: now - 120000, duration: 3480000, reason: "TP" },
    { id: "p2", asset: "ETH-PERP", symbol: "ETH", side: "SHORT", size: 1.5, leverage: 5, entryPrice: 3480, exitPrice: 3420, pnl: 180, pnlPercent: 1.7, openTime: now - 7200000, closeTime: now - 900000, duration: 6300000, reason: "TP" },
    { id: "p3", asset: "SOL-PERP", symbol: "SOL", side: "LONG", size: 10, leverage: 15, entryPrice: 178, exitPrice: 175, pnl: -67, pnlPercent: -2.5, openTime: now - 5400000, closeTime: now - 1800000, duration: 3600000, reason: "SL" },
    { id: "p4", asset: "ARB-PERP", symbol: "ARB", side: "LONG", size: 500, leverage: 10, entryPrice: 1.85, exitPrice: 1.92, pnl: 189, pnlPercent: 3.8, openTime: now - 9000000, closeTime: now - 2700000, duration: 6300000, reason: "TP" },
    { id: "p5", asset: "AVAX-PERP", symbol: "AVAX", side: "SHORT", size: 15, leverage: 8, entryPrice: 42.5, exitPrice: 41.8, pnl: 84, pnlPercent: 1.3, openTime: now - 10800000, closeTime: now - 3600000, duration: 7200000, reason: "TP" },
    { id: "p6", asset: "LINK-PERP", symbol: "LINK", side: "LONG", size: 50, leverage: 5, entryPrice: 18.2, exitPrice: 18.8, pnl: 165, pnlPercent: 1.6, openTime: now - 14400000, closeTime: now - 5400000, duration: 9000000, reason: "TP" },
    { id: "p7", asset: "DOGE-PERP", symbol: "DOGE", side: "LONG", size: 5000, leverage: 20, entryPrice: 0.32, exitPrice: 0.318, pnl: -32, pnlPercent: -1.25, openTime: now - 18000000, closeTime: now - 7200000, duration: 10800000, reason: "SL" },
    { id: "p8", asset: "OP-PERP", symbol: "OP", side: "SHORT", size: 200, leverage: 10, entryPrice: 3.45, exitPrice: 3.38, pnl: 140, pnlPercent: 2.0, openTime: now - 21600000, closeTime: now - 10800000, duration: 10800000, reason: "TP" },
  ];
}