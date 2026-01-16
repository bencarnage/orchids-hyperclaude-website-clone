"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Layers, Target, Shield, Clock, Crosshair } from "lucide-react";
import { useEffect, useState } from "react";
import { useTradingStore, formatPrice, formatDuration } from "@/lib/trading-simulation";

export default function LivePositions() {
  const { positions, marketPrices, updateMarketPrices, updatePositions } = useTradingStore();
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const priceInterval = setInterval(() => {
      updateMarketPrices();
      updatePositions();
      setLastUpdate(Date.now());
    }, 800);

    return () => clearInterval(priceInterval);
  }, [updateMarketPrices, updatePositions]);

  const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalValue = positions.reduce((sum, pos) => sum + pos.size * pos.markPrice, 0);

  return (
    <section id="positions" className="py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold tracking-wide">LIVE POSITIONS</h3>
                <p className="text-xs text-muted-foreground">{positions.length} active trade{positions.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
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
          </div>

          <div className="rounded-xl overflow-hidden border border-border bg-surface/80 backdrop-blur-sm">
            {positions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Crosshair className="w-8 h-8 mb-3 opacity-50" />
                <p className="text-sm">No active positions</p>
                <p className="text-xs mt-1">AI is scanning for opportunities...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-surface-light">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Entry</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Mark</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">PnL</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <AnimatePresence mode="popLayout">
                      {positions.map((position, index) => (
                        <PositionRow key={position.id} position={position} index={index} />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="flex items-center justify-between px-4 py-3 bg-surface-light border-t border-border">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Target className="w-3.5 h-3.5" />
                  <span>Exposure: <span className="text-foreground font-mono">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Margin: <span className="text-profit font-mono">Healthy</span></span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-profit opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-profit" />
                </span>
                <span className="font-mono">Live</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PositionRow({ position, index }: { position: ReturnType<typeof useTradingStore.getState>["positions"][0]; index: number }) {
  const isProfit = position.pnl >= 0;
  const duration = Math.floor((Date.now() - position.openTime) / 1000);
  const [flash, setFlash] = useState<"profit" | "loss" | null>(null);
  const [prevPnl, setPrevPnl] = useState(position.pnl);

  useEffect(() => {
    if (position.pnl !== prevPnl) {
      setFlash(position.pnl > prevPnl ? "profit" : "loss");
      setPrevPnl(position.pnl);
      const timer = setTimeout(() => setFlash(null), 300);
      return () => clearTimeout(timer);
    }
  }, [position.pnl, prevPnl]);

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        backgroundColor: flash === "profit" 
          ? "rgba(0, 255, 136, 0.1)" 
          : flash === "loss" 
          ? "rgba(255, 59, 92, 0.1)" 
          : "transparent"
      }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="hover:bg-surface-elevated/50 transition-colors"
    >
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            position.side === "LONG" 
              ? "bg-profit/10 border border-profit/30" 
              : "bg-loss/10 border border-loss/30"
          }`}>
            {position.side === "LONG" ? (
              <TrendingUp className="w-4 h-4 text-profit" />
            ) : (
              <TrendingDown className="w-4 h-4 text-loss" />
            )}
          </div>
          <div>
            <span className="font-mono font-semibold text-foreground">{position.asset}-PERP</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                position.side === "LONG"
                  ? "bg-profit/10 text-profit border border-profit/30"
                  : "bg-loss/10 text-loss border border-loss/30"
              }`}>
                {position.side}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
                {position.leverage}x
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        <span className="font-mono text-foreground">{position.sizeDisplay}</span>
      </td>
      <td className="px-4 py-4 text-right">
        <span className="font-mono text-muted-foreground">${formatPrice(position.entryPrice)}</span>
      </td>
      <td className="px-4 py-4 text-right">
        <motion.span
          key={position.markPrice}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className={`font-mono ${flash === "profit" ? "text-profit" : flash === "loss" ? "text-loss" : "text-foreground"}`}
        >
          ${formatPrice(position.markPrice)}
        </motion.span>
      </td>
      <td className="px-4 py-4 text-right">
        <div className="flex flex-col items-end">
          <motion.span
            key={position.pnl}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            className={`font-mono font-bold ${isProfit ? "text-profit" : "text-loss"}`}
          >
            {isProfit ? "+" : ""}${position.pnl.toFixed(2)}
          </motion.span>
          <span className={`text-xs font-mono ${isProfit ? "text-profit/70" : "text-loss/70"}`}>
            {isProfit ? "+" : ""}{position.pnlPercent.toFixed(2)}%
          </span>
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono text-sm">{formatDuration(duration)}</span>
        </div>
      </td>
    </motion.tr>
  );
}