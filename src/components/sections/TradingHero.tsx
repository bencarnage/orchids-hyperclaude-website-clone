"use client";

import { motion } from "framer-motion";
import { TrendingUp, Trophy, Flame, BarChart3, Clock } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";

const stats = [
  { label: "Today", value: 2341.2, prefix: "+$", suffix: "", color: "profit" },
  { label: "24H Volume", value: 1.2, prefix: "$", suffix: "M", color: "primary" },
  { label: "Win Rate", value: 68.4, prefix: "", suffix: "%", color: "profit" },
  { label: "Total Trades", value: 1847, prefix: "", suffix: "", color: "primary" },
  { label: "Win Streak", value: 7, prefix: "", suffix: "", color: "warning", icon: Flame },
];

export default function TradingHero() {
  const [totalPnl, setTotalPnl] = useState(0);
  const [pnlPercent, setPnlPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTotalPnl(47832.5);
      setPnlPercent(234.5);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
          <div className="relative p-8 md:p-12 rounded-2xl bg-surface/50 border border-border backdrop-blur-sm">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-profit/5 via-transparent to-primary/5" />
            </div>
            
            <div className="relative text-center mb-8">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4 text-profit" />
                Total Profit & Loss
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl md:text-7xl font-display font-bold text-profit text-glow-profit">
                  +$<NumberFlow value={totalPnl} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
                </span>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-profit/80 mt-2 font-mono"
              >
                +<NumberFlow value={pnlPercent} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} />% all time
              </motion.p>
            </div>

            <MiniEquityCurve />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
              {stats.map((stat, index) => (
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
                      stat.color === "warning" ? "text-warning" : "text-primary"
                    }`}>
                      {stat.prefix}<NumberFlow value={stat.value} />{stat.suffix}
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
          <StatBadge icon={Trophy} label="Rank" value="#12" color="warning" />
          <StatBadge icon={BarChart3} label="Sharpe" value="2.4" color="primary" />
        </motion.div>
      </div>
    </section>
  );
}

function MiniEquityCurve() {
  const points = [
    0, 5, 3, 8, 12, 10, 15, 18, 16, 22, 25, 23, 28, 32, 30, 35, 40, 38, 
    42, 48, 45, 52, 58, 55, 62, 68, 72, 70, 78, 85, 82, 90, 95, 100
  ];
  
  const width = 100;
  const height = 40;
  const maxVal = Math.max(...points);
  
  const pathData = points
    .map((val, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - (val / maxVal) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaPath = pathData + ` L ${width} ${height} L 0 ${height} Z`;

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
            <stop offset="0%" stopColor="rgba(0, 255, 136, 0.3)" />
            <stop offset="100%" stopColor="rgba(0, 255, 136, 0)" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill="url(#curveGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
        <motion.path
          d={pathData}
          fill="none"
          stroke="#00ff88"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.4, duration: 1.5, ease: "easeOut" }}
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