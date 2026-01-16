"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Layers, Target, Shield } from "lucide-react";
import { useTrading } from "@/lib/trading-engine";
import { usePrices, formatPrice } from "@/lib/prices";

export default function LivePositions() {
  const { positions } = useTrading();
  const { prices, isLoading } = usePrices();

  const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalExposure = positions.reduce((sum, pos) => sum + pos.sizeUsd * pos.leverage, 0);

  if (isLoading && positions.length === 0) {
    return (
      <section id="positions" className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-xl overflow-hidden border border-border bg-surface/80 backdrop-blur-sm p-8">
              <div className="flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-muted-foreground font-mono text-sm">Loading live prices...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
                <p className="text-xs text-muted-foreground">
                  {positions.length === 0 ? "Scanning for opportunities..." : `${positions.length} active trade${positions.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            {positions.length > 0 && (
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
            )}
          </div>

          <div className="rounded-xl overflow-hidden border border-border bg-surface/80 backdrop-blur-sm">
            {positions.length === 0 ? (
              <div className="p-12 text-center">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold mb-1">Analyzing Markets</p>
                    <p className="text-sm text-muted-foreground">AI is scanning for high-probability setups...</p>
                  </div>
                </motion.div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-surface-light">
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Side</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Entry</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Mark</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">PnL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      <AnimatePresence>
                        {positions.map((position, index) => (
                          <PositionRow key={position.id} position={position} index={index} />
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
                
                <div className="flex items-center justify-between px-4 py-3 bg-surface-light border-t border-border">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Target className="w-3.5 h-3.5" />
                      <span>Exposure: <span className="text-foreground font-mono">${totalExposure.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Margin: <span className="text-profit font-mono">Healthy</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-profit opacity-75 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-profit" />
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      Live prices from CoinGecko
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PositionRow({ position, index }: { position: { id: string; asset: string; symbol: string; side: "LONG" | "SHORT"; size: number; sizeUsd: number; leverage: number; entryPrice: number; markPrice: number; pnl: number; pnlPercent: number }; index: number }) {
  const isProfit = position.pnl >= 0;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
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
            <span className="font-mono font-semibold text-foreground">{position.asset}</span>
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
      <td className="px-4 py-4">
        <span className={`font-semibold ${position.side === "LONG" ? "text-profit" : "text-loss"}`}>
          {position.side}
        </span>
      </td>
      <td className="px-4 py-4 text-right">
        <div>
          <span className="font-mono text-foreground">{position.size.toFixed(4)} {position.symbol}</span>
          <p className="text-xs text-muted-foreground font-mono">${position.sizeUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        <span className="font-mono text-muted-foreground">${formatPrice(position.entryPrice)}</span>
      </td>
      <td className="px-4 py-4 text-right">
        <motion.span
          key={position.markPrice}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="font-mono text-foreground"
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
    </motion.tr>
  );
}