"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from "react";
import { usePrices, simulatePriceMovement } from "./prices";

const EPOCH_START = new Date("2025-01-01T00:00:00Z").getTime();
const TIME_SLOT_MS = 5000;

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function getTimeSlot(): number {
  return Math.floor((Date.now() - EPOCH_START) / TIME_SLOT_MS);
}

function getSeededRandom(): () => number {
  return seededRandom(getTimeSlot());
}

export interface Position {
  id: string;
  asset: string;
  symbol: string;
  side: "LONG" | "SHORT";
  size: number;
  sizeUsd: number;
  leverage: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  liquidationPrice: number;
  openTime: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface ClosedTrade {
  id: string;
  asset: string;
  symbol: string;
  side: "LONG" | "SHORT";
  size: number;
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  pnlPercent: number;
  openTime: number;
  closeTime: number;
  duration: number;
  reason: "TP" | "SL" | "MANUAL" | "SIGNAL";
}

export interface TradingStats {
  totalPnl: number;
  todayPnl: number;
  winRate: number;
  totalTrades: number;
  winStreak: number;
  currentStreak: number;
  bestTrade: number;
  worstTrade: number;
  avgWin: number;
  avgLoss: number;
  sharpeRatio: number;
  maxDrawdown: number;
  profitFactor: number;
  volume24h: number;
}

export interface PnlDataPoint {
  timestamp: number;
  value: number;
}

export interface ThoughtLog {
  id: string;
  time: string;
  timestamp: number;
  type: "SIGNAL" | "ANALYSIS" | "EXECUTE" | "MONITOR" | "CLOSE" | "ALERT";
  title: string;
  content: string[];
  trade?: {
    asset: string;
    side: "LONG" | "SHORT";
    entry?: number;
    exit?: number;
    size?: string;
    leverage?: number;
    pnl?: number;
    pnlPercent?: number;
  };
}

interface TradingContextType {
  positions: Position[];
  closedTrades: ClosedTrade[];
  stats: TradingStats;
  thoughts: ThoughtLog[];
  isAiActive: boolean;
  currentAction: string;
  pnlHistory: PnlDataPoint[];
}

const TradingContext = createContext<TradingContextType>({
  positions: [],
  closedTrades: [],
  stats: {
    totalPnl: 5000,
    todayPnl: 234.5,
    winRate: 68.4,
    totalTrades: 1847,
    winStreak: 12,
    currentStreak: 7,
    bestTrade: 420,
    worstTrade: -89,
    avgWin: 45,
    avgLoss: -22,
    sharpeRatio: 2.4,
    maxDrawdown: 8.3,
    profitFactor: 2.8,
    volume24h: 120000,
  },
  thoughts: [],
  isAiActive: true,
  currentAction: "ANALYZING",
  pnlHistory: [],
});

export function useTrading() {
  return useContext(TradingContext);
}

const TRADING_PAIRS = ["BTC", "ETH", "SOL", "AVAX", "ARB", "LINK", "DOGE", "OP", "INJ", "SUI"];

function generateId(rand: () => number) {
  return rand().toString(36).substring(2, 15);
}

function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString("en-US", { hour12: false }).slice(0, 8);
}

function seededRandomBetween(rand: () => number, min: number, max: number): number {
  return rand() * (max - min) + min;
}

function seededPickRandom<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateInitialPnlHistory(basePnl: number): PnlDataPoint[] {
  const history: PnlDataPoint[] = [];
  const now = Date.now();
  const pointCount = 50;
  let currentValue = basePnl * 0.4;
  const rand = seededRandom(Math.floor(now / 60000));
  
  for (let i = 0; i < pointCount; i++) {
    const progress = i / (pointCount - 1);
    const targetValue = basePnl * (0.4 + progress * 0.6);
    const fluctuation = (rand() - 0.45) * basePnl * 0.08;
    currentValue = targetValue + fluctuation;
    currentValue = Math.max(currentValue, basePnl * 0.2);
    
    history.push({
      timestamp: now - (pointCount - 1 - i) * 60000,
      value: Math.round(currentValue * 100) / 100,
    });
  }
  
  return history;
}

export function TradingProvider({ children }: { children: ReactNode }) {
  const { prices } = usePrices();
  const [positions, setPositions] = useState<Position[]>([]);
  const [closedTrades, setClosedTrades] = useState<ClosedTrade[]>([]);
  const [thoughts, setThoughts] = useState<ThoughtLog[]>([]);
  const [stats, setStats] = useState<TradingStats>({
    totalPnl: 5000,
    todayPnl: 234.5,
    winRate: 68.4,
    totalTrades: 1847,
    winStreak: 12,
    currentStreak: 7,
    bestTrade: 420,
    worstTrade: -89,
    avgWin: 45,
    avgLoss: -22,
    sharpeRatio: 2.4,
    maxDrawdown: 8.3,
    profitFactor: 2.8,
    volume24h: 120000,
  });
  const [isAiActive] = useState(true);
  const [currentAction, setCurrentAction] = useState("ANALYZING");
  const [pnlHistory, setPnlHistory] = useState<PnlDataPoint[]>(() => generateInitialPnlHistory(5000));
  
  const pricesRef = useRef(prices);
  const positionsRef = useRef(positions);
  
  useEffect(() => {
    pricesRef.current = prices;
  }, [prices]);
  
  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  useEffect(() => {
    const historyInterval = setInterval(() => {
      const currentPnl = positionsRef.current.reduce((sum, pos) => sum + pos.pnl, 0);
      setPnlHistory((prev) => {
        const newHistory = [...prev, {
          timestamp: Date.now(),
          value: 5000 + currentPnl,
        }];
        if (newHistory.length > 60) {
          return newHistory.slice(-60);
        }
        return newHistory;
      });
    }, 5000);

    return () => clearInterval(historyInterval);
  }, []);

  const addThought = useCallback((thought: Omit<ThoughtLog, "id" | "time" | "timestamp">) => {
    const newThought: ThoughtLog = {
      ...thought,
      id: generateId(),
      time: formatTime(),
      timestamp: Date.now(),
    };
    setThoughts((prev) => [...prev.slice(-50), newThought]);
  }, []);

  const openPosition = useCallback((symbol: string, side: "LONG" | "SHORT", price: number) => {
    const leverage = pickRandom([3, 5, 10, 15, 20]);
    const sizeUsd = randomBetween(500, 5000);
    const size = sizeUsd / price;
    
    const slPercent = side === "LONG" ? randomBetween(0.01, 0.03) : randomBetween(0.01, 0.03);
    const tpPercent = randomBetween(0.02, 0.06);
    
    const stopLoss = side === "LONG" 
      ? price * (1 - slPercent) 
      : price * (1 + slPercent);
    const takeProfit = side === "LONG" 
      ? price * (1 + tpPercent) 
      : price * (1 - tpPercent);
    
    const liqPrice = side === "LONG"
      ? price * (1 - 0.9 / leverage)
      : price * (1 + 0.9 / leverage);

    const newPosition: Position = {
      id: generateId(),
      asset: `${symbol}-PERP`,
      symbol,
      side,
      size,
      sizeUsd,
      leverage,
      entryPrice: price,
      markPrice: price,
      pnl: 0,
      pnlPercent: 0,
      liquidationPrice: liqPrice,
      openTime: Date.now(),
      stopLoss,
      takeProfit,
    };

    setPositions((prev) => [...prev, newPosition]);

    addThought({
      type: "EXECUTE",
      title: `Opening ${side} ${symbol}-PERP`,
      content: [
        `Entry: $${price.toLocaleString()} | Size: ${size.toFixed(4)} ${symbol} | Leverage: ${leverage}x`,
        `Stop Loss: $${stopLoss.toLocaleString()} (${(slPercent * 100).toFixed(1)}%) | Take Profit: $${takeProfit.toLocaleString()} (+${(tpPercent * 100).toFixed(1)}%)`,
        `Risk: ${(slPercent * leverage * 100).toFixed(1)}% of position | R:R Ratio: ${(tpPercent / slPercent).toFixed(2)}`,
      ],
      trade: {
        asset: `${symbol}-PERP`,
        side,
        entry: price,
        size: `${size.toFixed(4)} ${symbol}`,
        leverage,
      },
    });

    return newPosition;
  }, [addThought]);

  const closePosition = useCallback((positionId: string, reason: "TP" | "SL" | "MANUAL" | "SIGNAL", exitPrice: number) => {
    setPositions((prev) => {
      const position = prev.find((p) => p.id === positionId);
      if (!position) return prev;

      const priceDiff = position.side === "LONG" 
        ? exitPrice - position.entryPrice 
        : position.entryPrice - exitPrice;
      const pnl = priceDiff * position.size * position.leverage;
      const pnlPercent = (priceDiff / position.entryPrice) * 100 * position.leverage;

      const closedTrade: ClosedTrade = {
        id: generateId(),
        asset: position.asset,
        symbol: position.symbol,
        side: position.side,
        size: position.size,
        leverage: position.leverage,
        entryPrice: position.entryPrice,
        exitPrice,
        pnl,
        pnlPercent,
        openTime: position.openTime,
        closeTime: Date.now(),
        duration: Date.now() - position.openTime,
        reason,
      };

      setClosedTrades((trades) => [...trades.slice(-100), closedTrade]);

      const reasonText = {
        TP: "Take profit triggered",
        SL: "Stop loss triggered",
        MANUAL: "Manual close",
        SIGNAL: "Signal reversal detected",
      };

      addThought({
        type: "CLOSE",
        title: `${position.asset} Closed ${pnl >= 0 ? "in Profit" : "at Loss"}`,
        content: [
          `Exit: $${exitPrice.toLocaleString()} | Duration: ${Math.round((Date.now() - position.openTime) / 1000 / 60)}m`,
          `Reason: ${reasonText[reason]}`,
          pnl >= 0 ? "Adding to win streak. Looking for next opportunity." : "Loss contained within risk parameters.",
        ],
        trade: {
          asset: position.asset,
          side: position.side,
          entry: position.entryPrice,
          exit: exitPrice,
          pnl: Math.round(pnl * 100) / 100,
          pnlPercent: Math.round(pnlPercent * 100) / 100,
        },
      });

      setStats((s) => ({
        ...s,
        totalPnl: s.totalPnl + pnl,
        todayPnl: s.todayPnl + pnl,
        totalTrades: s.totalTrades + 1,
        currentStreak: pnl >= 0 ? s.currentStreak + 1 : 0,
        winStreak: pnl >= 0 ? Math.max(s.winStreak, s.currentStreak + 1) : s.winStreak,
        bestTrade: Math.max(s.bestTrade, pnl),
        worstTrade: Math.min(s.worstTrade, pnl),
        volume24h: s.volume24h + position.sizeUsd * position.leverage,
      }));

      return prev.filter((p) => p.id !== positionId);
    });
  }, [addThought]);

  useEffect(() => {
    if (Object.keys(prices).length === 0) return;

    const interval = setInterval(() => {
      setPositions((prev) => {
        return prev.map((pos) => {
          const currentPrice = pricesRef.current[pos.symbol]?.price || pos.markPrice;
          const newMark = simulatePriceMovement(currentPrice, 0.0003);
          
          const priceDiff = pos.side === "LONG" 
            ? newMark - pos.entryPrice 
            : pos.entryPrice - newMark;
          const pnl = priceDiff * pos.size * pos.leverage;
          const pnlPercent = (priceDiff / pos.entryPrice) * 100 * pos.leverage;

          if (pos.takeProfit && ((pos.side === "LONG" && newMark >= pos.takeProfit) || (pos.side === "SHORT" && newMark <= pos.takeProfit))) {
            setTimeout(() => closePosition(pos.id, "TP", pos.takeProfit!), 100);
          }
          
          if (pos.stopLoss && ((pos.side === "LONG" && newMark <= pos.stopLoss) || (pos.side === "SHORT" && newMark >= pos.stopLoss))) {
            setTimeout(() => closePosition(pos.id, "SL", pos.stopLoss!), 100);
          }

          return {
            ...pos,
            markPrice: newMark,
            pnl: Math.round(pnl * 100) / 100,
            pnlPercent: Math.round(pnlPercent * 100) / 100,
          };
        });
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [prices, closePosition]);

  useEffect(() => {
    if (Object.keys(prices).length === 0) return;

    const availableSymbols = TRADING_PAIRS.filter(s => prices[s]);
    if (availableSymbols.length === 0) return;

    if (positions.length === 0) {
      const symbol1 = pickRandom(availableSymbols);
      const symbol2 = pickRandom(availableSymbols.filter(s => s !== symbol1));
      
      if (prices[symbol1]) {
        setTimeout(() => {
          addThought({
            type: "ANALYSIS",
            title: "Scanning Market Conditions",
            content: [
              `${symbol1} showing strong momentum on 4H timeframe.`,
              "Volume profile indicates accumulation phase.",
              "Funding rate neutral - no directional bias from leverage.",
            ],
          });
        }, 1000);

        setTimeout(() => {
          addThought({
            type: "SIGNAL",
            title: `${symbol1} Bullish Setup Detected`,
            content: [
              "RSI showing higher lows while price consolidates.",
              "MACD histogram turning positive after extended bearish run.",
              `Key support held at $${(prices[symbol1].price * 0.98).toLocaleString()}.`,
            ],
          });
        }, 3000);

        setTimeout(() => {
          openPosition(symbol1, "LONG", prices[symbol1].price);
        }, 5000);
      }

      if (prices[symbol2]) {
        setTimeout(() => {
          addThought({
            type: "SIGNAL",
            title: `${symbol2} Bearish Divergence Forming`,
            content: [
              `${symbol2}/BTC ratio breaking down from key support.`,
              "4H showing lower highs pattern near resistance.",
              "Waiting for confirmation before entry.",
            ],
          });
        }, 8000);

        setTimeout(() => {
          openPosition(symbol2, "SHORT", prices[symbol2].price);
        }, 10000);
      }
    }
  }, [prices, positions.length, addThought, openPosition]);

  useEffect(() => {
    if (Object.keys(prices).length === 0) return;

    const actionInterval = setInterval(() => {
      const actions = ["ANALYZING", "SCANNING", "MONITORING", "CALCULATING", "TRADING"];
      setCurrentAction(pickRandom(actions));
    }, 4000);

    const analysisInterval = setInterval(() => {
      const availableSymbols = TRADING_PAIRS.filter(s => pricesRef.current[s]);
      if (availableSymbols.length === 0) return;

      const symbol = pickRandom(availableSymbols);
      const price = pricesRef.current[symbol]?.price;
      if (!price) return;

      const analysisTypes = [
        {
          type: "ANALYSIS" as const,
          title: `${symbol} Market Structure Analysis`,
          content: [
            `Current price: $${price.toLocaleString()} - ${randomBetween(-2, 2) > 0 ? "above" : "below"} 20 EMA.`,
            `Volume: ${randomBetween(80, 150).toFixed(0)}% of 24h average.`,
            `Volatility index: ${randomBetween(20, 80).toFixed(1)} - ${randomBetween(0, 1) > 0.5 ? "elevated" : "normal"} conditions.`,
          ],
        },
        {
          type: "MONITOR" as const,
          title: "Portfolio Risk Assessment",
          content: [
            `Open positions: ${positionsRef.current.length} | Total exposure: $${positionsRef.current.reduce((a, p) => a + p.sizeUsd * p.leverage, 0).toLocaleString()}`,
            `Current drawdown: ${randomBetween(0, 5).toFixed(2)}% | Max allowed: 10%`,
            "Risk parameters within acceptable bounds.",
          ],
        },
        {
          type: "ANALYSIS" as const,
          title: "Funding Rate Scan",
          content: [
            `BTC funding: ${(randomBetween(-0.02, 0.02)).toFixed(4)}% - ${randomBetween(0, 1) > 0.5 ? "longs paying shorts" : "shorts paying longs"}`,
            `ETH funding: ${(randomBetween(-0.02, 0.02)).toFixed(4)}%`,
            "No significant funding arbitrage opportunities detected.",
          ],
        },
      ];

      addThought(pickRandom(analysisTypes));
    }, 15000);

    const tradeInterval = setInterval(() => {
      if (positionsRef.current.length >= 4) return;
      if (Math.random() > 0.3) return;

      const availableSymbols = TRADING_PAIRS.filter(
        s => pricesRef.current[s] && !positionsRef.current.find(p => p.symbol === s)
      );
      if (availableSymbols.length === 0) return;

      const symbol = pickRandom(availableSymbols);
      const price = pricesRef.current[symbol]?.price;
      if (!price) return;

      const side = Math.random() > 0.5 ? "LONG" : "SHORT";

      addThought({
        type: "SIGNAL",
        title: `${symbol} ${side === "LONG" ? "Bullish" : "Bearish"} Setup Detected`,
        content: [
          side === "LONG" 
            ? `Price breaking above ${randomBetween(1, 3).toFixed(0)}H resistance at $${(price * 0.99).toLocaleString()}.`
            : `Price rejected at ${randomBetween(1, 3).toFixed(0)}H resistance near $${(price * 1.01).toLocaleString()}.`,
          `Volume surge: ${randomBetween(150, 300).toFixed(0)}% above average.`,
          `Momentum indicators ${side === "LONG" ? "turning bullish" : "showing weakness"}.`,
        ],
      });

      setTimeout(() => {
        openPosition(symbol, side, price);
      }, 2000);
    }, 25000);

    return () => {
      clearInterval(actionInterval);
      clearInterval(analysisInterval);
      clearInterval(tradeInterval);
    };
  }, [prices, addThought, openPosition]);

  return (
    <TradingContext.Provider value={{ positions, closedTrades, stats, thoughts, isAiActive, currentAction, pnlHistory }}>
      {children}
    </TradingContext.Provider>
  );
}