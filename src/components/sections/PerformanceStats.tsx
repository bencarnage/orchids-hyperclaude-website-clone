"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  Zap, 
  Shield,
  Clock,
  Award,
  DollarSign
} from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useTrading } from "@/lib/trading-engine";
import { useMemo } from "react";

const INITIAL_INVESTMENT = 5000;

interface StatCard {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "primary" | "profit" | "loss" | "warning";
  trend?: "up" | "down";
  subValue?: string;
}

export default function PerformanceStats() {
  const { stats, positions } = useTrading();

  const positionsPnl = useMemo(() => {
    return positions.reduce((sum, pos) => sum + pos.pnl, 0);
  }, [positions]);

  const pnlPercent = (positionsPnl / INITIAL_INVESTMENT) * 100;

  const performanceStats: StatCard[] = [
    {
      label: "Live P&L",
      value: positionsPnl,
      prefix: positionsPnl >= 0 ? "+$" : "-$",
      icon: DollarSign,
      color: positionsPnl >= 0 ? "profit" : "loss",
      trend: positionsPnl >= 0 ? "up" : "down",
      subValue: `${pnlPercent >= 0 ? "+" : ""}${pnlPercent.toFixed(2)}% from $${INITIAL_INVESTMENT.toLocaleString()}`,
    },
    {
      label: "Sharpe Ratio",
      value: stats.sharpeRatio,
      icon: BarChart3,
      color: "primary",
      trend: "up",
      subValue: "Risk-adjusted returns",
    },
    {
      label: "Max Drawdown",
      value: stats.maxDrawdown,
      prefix: "-",
      suffix: "%",
      icon: Shield,
      color: "warning",
      subValue: "Last 30 days",
    },
    {
      label: "Best Trade",
      value: Math.abs(stats.bestTrade),
      prefix: "+$",
      icon: TrendingUp,
      color: "profit",
      subValue: "All time high",
    },
    {
      label: "Worst Trade",
      value: Math.abs(stats.worstTrade),
      prefix: "-$",
      icon: TrendingDown,
      color: "loss",
      subValue: "Risk managed",
    },
    {
      label: "Best Streak",
      value: stats.winStreak,
      icon: Award,
      color: "profit",
      subValue: "Consecutive wins",
    },
    {
      label: "Avg Win",
      value: stats.avgWin,
      prefix: "+$",
      icon: Target,
      color: "profit",
      subValue: "Per winning trade",
    },
    {
      label: "Profit Factor",
      value: stats.profitFactor,
      icon: Zap,
      color: "primary",
      trend: "up",
      subValue: "Gross profit / loss",
    },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-bold tracking-wide mb-2">
              PERFORMANCE <span className="text-primary">METRICS</span>
            </h3>
            <p className="text-muted-foreground text-sm">
              Real-time trading statistics synced with live positions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {performanceStats.map((stat, index) => (
              <StatCardComponent key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatCardComponent({ stat, index }: { stat: StatCard; index: number }) {
  const Icon = stat.icon;
  
  const colorClasses = {
    primary: {
      bg: "bg-primary/10",
      border: "border-primary/30",
      text: "text-primary",
      glow: "group-hover:shadow-[0_0_20px_rgba(0,255,213,0.2)]",
    },
    profit: {
      bg: "bg-profit/10",
      border: "border-profit/30",
      text: "text-profit",
      glow: "group-hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]",
    },
    loss: {
      bg: "bg-loss/10",
      border: "border-loss/30",
      text: "text-loss",
      glow: "group-hover:shadow-[0_0_20px_rgba(255,59,92,0.2)]",
    },
    warning: {
      bg: "bg-warning/10",
      border: "border-warning/30",
      text: "text-warning",
      glow: "group-hover:shadow-[0_0_20px_rgba(255,170,0,0.2)]",
    },
  };

  const colors = colorClasses[stat.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`group relative p-5 rounded-xl bg-surface/80 border border-border hover:border-border-bright transition-all duration-300 ${colors.glow}`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${colors.text}`} />
          </div>
          {stat.trend && (
            <div className={`flex items-center gap-1 ${stat.trend === "up" ? "text-profit" : "text-loss"}`}>
              {stat.trend === "up" ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
            </div>
          )}
        </div>

        <div className="mb-1">
          <span className={`text-2xl md:text-3xl font-bold font-mono ${colors.text}`}>
            {stat.prefix?.replace("-$", "-$").replace("+$", "+$")}
            <NumberFlow value={Math.abs(stat.value)} format={{ minimumFractionDigits: stat.suffix === "%" || stat.label.includes("Ratio") || stat.label.includes("Factor") ? 1 : 0, maximumFractionDigits: stat.label === "Live P&L" ? 2 : 1 }} />
            {stat.suffix}
          </span>
        </div>

        <p className="text-sm font-medium text-foreground mb-1">{stat.label}</p>
        {stat.subValue && (
          <p className="text-xs text-muted-foreground">{stat.subValue}</p>
        )}
      </div>
    </motion.div>
  );
}