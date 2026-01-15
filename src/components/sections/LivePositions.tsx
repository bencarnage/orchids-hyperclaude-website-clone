"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Layers, Target, Shield } from "lucide-react";
import { useState, useEffect } from "react";

interface Position {
  id: string;
  asset: string;
  side: "LONG" | "SHORT";
  size: string;
  leverage: number;
  entry: number;
  mark: number;
  pnl: number;
  pnlPercent: number;
  liquidation: number;
}

const initialPositions: Position[] = [
  {
    id: "1",
    asset: "BTC-PERP",
    side: "LONG",
    size: "0.5 BTC",
    leverage: 5,
    entry: 97800,
    mark: 98234,
    pnl: 217,
    pnlPercent: 2.22,
    liquidation: 82000,
  },
  {
    id: "2",
    asset: "ETH-PERP",
    side: "SHORT",
    size: "2.0 ETH",
    leverage: 10,
    entry: 3450,
    mark: 3420,
    pnl: 60,
    pnlPercent: 0.87,
    liquidation: 3800,
  },
];

export default function LivePositions() {
  const [positions, setPositions] = useState<Position[]>(initialPositions);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((pos) => {
          const change = (Math.random() - 0.5) * 0.002;
          const newMark = pos.mark * (1 + change);
          const priceDiff = pos.side === "LONG" 
            ? newMark - pos.entry 
            : pos.entry - newMark;
          const notional = pos.side === "LONG"
            ? parseFloat(pos.size) * pos.entry
            : parseFloat(pos.size) * pos.entry;
          const newPnl = priceDiff * parseFloat(pos.size) * pos.leverage;
          const newPnlPercent = (priceDiff / pos.entry) * 100 * pos.leverage;
          
          return {
            ...pos,
            mark: Math.round(newMark * 100) / 100,
            pnl: Math.round(newPnl * 100) / 100,
            pnlPercent: Math.round(newPnlPercent * 100) / 100,
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalValue = positions.reduce((sum, pos) => sum + parseFloat(pos.size) * pos.mark, 0);

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
                <p className="text-xs text-muted-foreground">{positions.length} active trades</p>
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
                  {positions.map((position, index) => (
                    <PositionRow key={position.id} position={position} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
            
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
              <span className="text-xs text-muted-foreground font-mono">
                Updated live
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PositionRow({ position, index }: { position: Position; index: number }) {
  const isProfit = position.pnl >= 0;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
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
        <span className="font-mono text-foreground">{position.size}</span>
      </td>
      <td className="px-4 py-4 text-right">
        <span className="font-mono text-muted-foreground">${position.entry.toLocaleString()}</span>
      </td>
      <td className="px-4 py-4 text-right">
        <motion.span
          key={position.mark}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="font-mono text-foreground"
        >
          ${position.mark.toLocaleString()}
        </motion.span>
      </td>
      <td className="px-4 py-4 text-right">
        <div className="flex flex-col items-end">
          <motion.span
            key={position.pnl}
            initial={{ scale: 1.1 }}
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