"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { useTradingStore, formatTimeAgo } from "@/lib/trading-simulation";
import { useEffect, useState } from "react";

export default function RecentTradesTicker() {
  const { closedTrades } = useTradingStore();
  const [displayTrades, setDisplayTrades] = useState(closedTrades);

  useEffect(() => {
    setDisplayTrades(closedTrades.slice(0, 15));
  }, [closedTrades]);

  const duplicatedTrades = [...displayTrades, ...displayTrades];

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
            className="flex gap-6 animate-ticker hover:[animation-play-state:paused]"
            style={{ width: "max-content" }}
          >
            <AnimatePresence mode="popLayout">
              {duplicatedTrades.map((trade, index) => (
                <TradeItem key={`${trade.id}-${index}`} trade={trade} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TradeItem({ trade }: { trade: ReturnType<typeof useTradingStore.getState>["closedTrades"][0] }) {
  const isProfit = trade.pnl >= 0;
  const timeAgo = formatTimeAgo(trade.closedAt);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-surface-light/50 border border-border/30 hover:border-border transition-colors"
    >
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
          {isProfit ? "+" : "-"}${Math.abs(trade.pnl).toFixed(0)}
        </span>
        <span className={`font-mono text-xs ${isProfit ? "text-profit/60" : "text-loss/60"}`}>
          ({isProfit ? "+" : ""}{trade.pnlPercent.toFixed(1)}%)
        </span>
      </div>
      
      <span className="text-xs text-muted-foreground">{timeAgo}</span>
    </motion.div>
  );
}