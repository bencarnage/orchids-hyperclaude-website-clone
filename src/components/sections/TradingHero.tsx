"use client";

import { motion } from "framer-motion";
import { TrendingUp, Trophy, Flame, BarChart3, Clock } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useTrading, PnlDataPoint } from "@/lib/trading-engine";
import { useMemo } from "react";

const INITIAL_INVESTMENT = 5000;

export default function TradingHero() {
  const { stats, positions, pnlHistory } = useTrading();

  const positionsPnl = useMemo(() => {
    return positions.reduce((sum, pos) => sum + pos.pnl, 0);
  }, [positions]);

  const currentValue = INITIAL_INVESTMENT + positionsPnl;
  const pnlPercent = (positionsPnl / INITIAL_INVESTMENT) * 100;

  const heroStats = [
    { label: "Today", value: stats.todayPnl, prefix: stats.todayPnl >= 0 ? "+$" : "-$", suffix: "", color: stats.todayPnl >= 0 ? "profit" : "loss" },
    { label: "24H Volume", value: stats.volume24h / 1000, prefix: "$", suffix: "K", color: "primary" },
    { label: "Win Rate", value: stats.winRate, prefix: "", suffix: "%", color: "profit" },
    { label: "Total Trades", value: stats.totalTrades, prefix: "", suffix: "", color: "primary" },
    { label: "Win Streak", value: stats.currentStreak, prefix: "", suffix: "", color: "warning", icon: Flame },
  ];

  return (
    <section id="dashboard" className="relative pt-24 pb-8 overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-profit/5 blur-[100px] rounded-full" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border mb-6"
          >
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Trading on</span>
            <span className="text-sm font-semibold text-primary">Hyperliquid</span>
          </motion.div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="text-foreground">WATCH </span>
            <span className="text-primary text-glow-primary">HYPERCLAUDE</span>
            <span className="text-foreground"> TRADE</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time AI-powered perpetual futures trading. No emotions. Pure alpha.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className={`relative p-8 md:p-12 rounded-2xl bg-surface/50 border backdrop-blur-sm ${
            positionsPnl >= 0 ? "border-profit/20" : "border-loss/20"
          }`}>
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${
                positionsPnl >= 0 
                  ? "from-profit/5 via-transparent to-primary/5" 
                  : "from-loss/5 via-transparent to-primary/5"
              }`} />
            </div>
            
            <div className="relative text-center mb-8">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                <TrendingUp className={`w-4 h-4 ${positionsPnl >= 0 ? "text-profit" : "text-loss"}`} />
                Live P&L (from ${INITIAL_INVESTMENT.toLocaleString()} initial)
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className={`text-5xl md:text-7xl font-display font-bold ${
                  positionsPnl >= 0 ? "text-profit text-glow-profit" : "text-loss text-glow-loss"
                }`}>
                  {positionsPnl >= 0 ? "+" : ""}$<NumberFlow value={positionsPnl} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
                </span>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`text-lg mt-2 font-mono ${positionsPnl >= 0 ? "text-profit/80" : "text-loss/80"}`}
              >
                {positionsPnl >= 0 ? "+" : ""}<NumberFlow value={pnlPercent} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />%
                <span className="text-muted-foreground ml-2">
                  (${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total)
                </span>
              </motion.p>
            </div>

            <MiniEquityCurve pnlHistory={pnlHistory} currentPnl={positionsPnl} />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
              {heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="text-center p-4 rounded-xl bg-surface-light/50 border border-border/50"
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    {stat.icon && <stat.icon className="w-4 h-4 text-warning" />}
                    <span className={`text-xl md:text-2xl font-bold font-mono ${
                      stat.color === "profit" ? "text-profit" : 
                      stat.color === "loss" ? "text-loss" :
                      stat.color === "warning" ? "text-warning" : "text-primary"
                    }`}>
                      {stat.prefix}<NumberFlow value={Math.abs(stat.value)} format={{ minimumFractionDigits: stat.suffix === "K" ? 0 : 0, maximumFractionDigits: stat.suffix === "K" ? 0 : 1 }} />{stat.suffix}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-8 mt-8"
        >
          <StatBadge icon={Trophy} label="Positions" value={positions.length.toString()} color="warning" />
          <StatBadge icon={BarChart3} label="Sharpe" value={stats.sharpeRatio.toFixed(1)} color="primary" />
        </motion.div>
      </div>
    </section>
  );
}

function MiniEquityCurve({ pnlHistory, currentPnl }: { pnlHistory: PnlDataPoint[]; currentPnl: number }) {
  const { pathData, areaPath, isProfit } = useMemo(() => {
    const historyWithCurrent = [...pnlHistory];
    if (historyWithCurrent.length > 0) {
      historyWithCurrent[historyWithCurrent.length - 1] = {
        ...historyWithCurrent[historyWithCurrent.length - 1],
        value: INITIAL_INVESTMENT + currentPnl,
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
    const h = 40;
    
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
  }, [pnlHistory, currentPnl]);

  const color = isProfit ? "#00ff88" : "#ff3b5c";
  const colorRgba = isProfit ? "rgba(0, 255, 136, 0.3)" : "rgba(255, 59, 92, 0.3)";
  const width = 100;
  const height = 40;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="relative h-16 w-full"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorRgba} />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </linearGradient>
        </defs>
        <path
          d={areaPath}
          fill="url(#curveGradient)"
        />
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
        />
      </svg>
    </motion.div>
  );
}

function StatBadge({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: "primary" | "profit" | "warning";
}) {
  const colorClasses = {
    primary: "text-primary border-primary/30 bg-primary/10",
    profit: "text-profit border-profit/30 bg-profit/10",
    warning: "text-warning border-warning/30 bg-warning/10",
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${colorClasses[color]}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-bold font-mono">{value}</span>
    </div>
  );
}

const INITIAL_INVESTMENT = 5000;