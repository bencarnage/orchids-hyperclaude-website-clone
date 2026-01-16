"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef, useMemo } from "react";
import { usePrices, simulatePriceMovement } from "./prices";

const EPOCH_START = new Date("2025-01-01T00:00:00Z").getTime();
const TIME_SLOT_MS = 5000;
const INITIAL_INVESTMENT = 5000;

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

function getSeededRandom(offset: number = 0): () => number {
  return seededRandom(getTimeSlot() + offset);
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
    totalPnl: 0,
    todayPnl: 15.2,
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
  currentAction: "TRADING",
  pnlHistory: [],
});

export function useTrading() {
  return useContext(TradingContext);
}

const TRADING_PAIRS = ["BTC", "ETH", "SOL", "AVAX", "ARB", "LINK", "DOGE", "OP", "INJ", "SUI"];

const BASE_PRICES: Record<string, number> = {
  BTC: 105000,
  ETH: 3800,
  SOL: 180,
  AVAX: 42,
  ARB: 1.2,
  LINK: 18,
  DOGE: 0.38,
  OP: 2.1,
  INJ: 28,
  SUI: 4.2,
};

function generateTimeBasedId(prefix: string, slot?: number) {
  return `${prefix}-${slot ?? getTimeSlot()}-${Math.floor(Math.random() * 1000)}`;
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

function generateInitialPnlHistory(baseValue: number): PnlDataPoint[] {
  const history: PnlDataPoint[] = [];
  const now = Date.now();
  const pointCount = 50;
  const timeSlot = Math.floor(now / 60000);
  const rand = seededRandom(timeSlot);
  
  let currentValue = baseValue * 0.98;
  
  for (let i = 0; i < pointCount; i++) {
    const progress = i / (pointCount - 1);
    const targetValue = baseValue * (0.98 + progress * 0.03); 
    const fluctuation = (rand() - 0.45) * baseValue * 0.005;
    currentValue = targetValue + fluctuation;
    
    history.push({
      timestamp: now - (pointCount - 1 - i) * 60000,
      value: Math.round(currentValue * 100) / 100,
    });
  }
  
  return history;
}

function generateHistoricalPositions(prices: Record<string, { price: number }>): Position[] {
  const currentSlot = getTimeSlot();
  const positions: Position[] = [];
  
  for (let i = 0; i < 5; i++) {
    const slotOffset = i * 3;
    const rand = seededRandom(currentSlot - slotOffset);
    
    if (rand() > 0.4) continue;
    
    const symbol = seededPickRandom(rand, TRADING_PAIRS);
    const basePrice = prices[symbol]?.price || BASE_PRICES[symbol];
    const side: "LONG" | "SHORT" = rand() > 0.5 ? "LONG" : "SHORT";
    const leverage = seededPickRandom(rand, [3, 5, 10, 15, 20]);
    const sizeUsd = seededRandomBetween(rand, 500, 2000);
    const size = sizeUsd / basePrice;
    
    const entryOffset = (rand() - 0.5) * 0.01;
    const entryPrice = basePrice * (1 + entryOffset);
    const markOffset = (rand() - 0.45) * 0.015;
    const markPrice = entryPrice * (1 + markOffset);
    
    const priceDiff = side === "LONG" 
      ? markPrice - entryPrice 
      : entryPrice - markPrice;
    const pnl = priceDiff * size * leverage;
    const pnlPercent = (priceDiff / entryPrice) * 100 * leverage;
    
    const slPercent = seededRandomBetween(rand, 0.01, 0.02);
    const tpPercent = seededRandomBetween(rand, 0.02, 0.04);
    
    const stopLoss = side === "LONG" 
      ? entryPrice * (1 - slPercent) 
      : entryPrice * (1 + slPercent);
    const takeProfit = side === "LONG" 
      ? entryPrice * (1 + tpPercent) 
      : entryPrice * (1 - tpPercent);
    
    const liqPrice = side === "LONG"
      ? entryPrice * (1 - 0.9 / leverage)
      : entryPrice * (1 + 0.9 / leverage);

    positions.push({
      id: generateTimeBasedId(`pos-${symbol}`, currentSlot - slotOffset),
      asset: `${symbol}-PERP`,
      symbol,
      side,
      size,
      sizeUsd,
      leverage,
      entryPrice,
      markPrice,
      pnl: Math.round(pnl * 100) / 100,
      pnlPercent: Math.round(pnlPercent * 100) / 100,
      liquidationPrice: liqPrice,
      openTime: Date.now() - slotOffset * TIME_SLOT_MS,
      stopLoss,
      takeProfit,
    });
  }
  
  return positions.slice(0, 3);
}

function generateHistoricalThoughts(): ThoughtLog[] {
  const currentSlot = getTimeSlot();
  const thoughts: ThoughtLog[] = [];
  const thoughtTemplates = [
    { type: "ANALYSIS" as const, title: "Market Analysis Complete", content: ["Scanning order flow patterns...", "Volatility within expected range"] },
    { type: "MONITOR" as const, title: "Position Monitoring", content: ["All positions within risk parameters", "Trailing stops adjusted"] },
    { type: "SIGNAL" as const, title: "Opportunity Detected", content: ["Momentum signal identified", "Evaluating entry conditions"] },
  ];
  
  for (let i = 4; i >= 0; i--) {
    const rand = seededRandom(currentSlot - i);
    const template = seededPickRandom(rand, thoughtTemplates);
    const time = new Date(Date.now() - i * 8000);
    
    thoughts.push({
      id: generateTimeBasedId("thought", currentSlot - i),
      time: formatTime(time),
      timestamp: time.getTime(),
      type: template.type,
      title: template.title,
      content: template.content,
    });
  }
  
  return thoughts;
}

export function TradingProvider({ children }: { children: ReactNode }) {
  const { prices } = usePrices();
  const [positions, setPositions] = useState<Position[]>([]);
  const [closedTrades, setClosedTrades] = useState<ClosedTrade[]>([]);
  const [thoughts, setThoughts] = useState<ThoughtLog[]>([]);
  const [stats, setStats] = useState<TradingStats>({
    totalPnl: 0,
    todayPnl: 15.2,
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
  const [currentAction, setCurrentAction] = useState("TRADING");
  const [pnlHistory, setPnlHistory] = useState<PnlDataPoint[]>(() => generateInitialPnlHistory(INITIAL_INVESTMENT));
  const [initialized, setInitialized] = useState(false);
  
  const pricesRef = useRef(prices);
  const positionsRef = useRef(positions);
  const lastActionSlot = useRef<number>(0);
  
  useEffect(() => {
    pricesRef.current = prices;
  }, [prices]);
  
  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  useEffect(() => {
    if (initialized || Object.keys(prices).length === 0) return;
    
    const initialPositions = generateHistoricalPositions(prices);
    const initialThoughts = generateHistoricalThoughts();
    
    setPositions(initialPositions);
    setThoughts(initialThoughts);
    setInitialized(true);
  }, [prices, initialized]);

  useEffect(() => {
    const historyInterval = setInterval(() => {
      const currentPositionsPnl = positionsRef.current.reduce((sum, pos) => sum + pos.pnl, 0);
      setPnlHistory((prev) => {
        const newHistory = [...prev, {
          timestamp: Date.now(),
          value: INITIAL_INVESTMENT + stats.todayPnl + currentPositionsPnl,
        }];
        if (newHistory.length > 60) {
          return newHistory.slice(-60);
        }
        return newHistory;
      });
    }, 5000);

    return () => clearInterval(historyInterval);
  }, [stats.todayPnl]);

  const addThought = useCallback((thought: Omit<ThoughtLog, "id" | "time" | "timestamp">) => {
    const newThought: ThoughtLog = {
      ...thought,
      id: generateTimeBasedId("thought"),
      time: formatTime(),
      timestamp: Date.now(),
    };
    setThoughts((prev) => [...prev.slice(-50), newThought]);
  }, []);

  const openPosition = useCallback((symbol: string, side: "LONG" | "SHORT", price: number, seedOffset: number = 0) => {
    const rand = getSeededRandom(seedOffset);
    const leverage = seededPickRandom(rand, [3, 5, 10, 15, 20]);
    const sizeUsd = seededRandomBetween(rand, 500, 2000);
    const size = sizeUsd / price;
    
    const slPercent = side === "LONG" ? seededRandomBetween(rand, 0.01, 0.02) : seededRandomBetween(rand, 0.01, 0.02);
    const tpPercent = seededRandomBetween(rand, 0.02, 0.04);
  
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
      id: generateTimeBasedId(`pos-${symbol}`),
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
        `Stop Loss: $${stopLoss.toLocaleString()} | Take Profit: $${takeProfit.toLocaleString()}`,
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
        id: generateTimeBasedId("close"),
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

      addThought({
        type: "CLOSE",
        title: `${position.asset} Closed at ${pnl >= 0 ? "Profit" : "Loss"}`,
        content: [
          `Exit: $${exitPrice.toLocaleString()} | PnL: ${pnl >= 0 ? "+" : ""}$${pnl.toFixed(2)}`,
          `Reason: ${reason === "TP" ? "Take Profit" : reason === "SL" ? "Stop Loss" : "Signal Close"}`,
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
          const newMark = simulatePriceMovement(currentPrice, 0.0001);
          
          const priceDiff = pos.side === "LONG" 
            ? newMark - pos.entryPrice 
            : pos.entryPrice - newMark;
          const pnl = priceDiff * pos.size * pos.leverage;
          const pnlPercent = (priceDiff / pos.entryPrice) * 100 * pos.leverage;

          if (pos.takeProfit && ((pos.side === "LONG" && newMark >= pos.takeProfit) || (pos.side === "SHORT" && newMark <= pos.takeProfit))) {
            setTimeout(() => closePosition(pos.id, "TP", pos.takeProfit!), 50);
          }
          
          if (pos.stopLoss && ((pos.side === "LONG" && newMark <= pos.stopLoss) || (pos.side === "SHORT" && newMark >= pos.stopLoss))) {
            setTimeout(() => closePosition(pos.id, "SL", pos.stopLoss!), 50);
          }

          return {
            ...pos,
            markPrice: newMark,
            pnl: Math.round(pnl * 100) / 100,
            pnlPercent: Math.round(pnlPercent * 100) / 100,
          };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [prices, closePosition]);

  useEffect(() => {
    if (Object.keys(prices).length === 0) return;

    const mainLoop = setInterval(() => {
      const currentSlot = getTimeSlot();
      if (currentSlot === lastActionSlot.current) return;
      lastActionSlot.current = currentSlot;

      const rand = seededRandom(currentSlot);
      const val = rand();

      if (positionsRef.current.length < 3 && val > 0.85) {
        const availableSymbols = TRADING_PAIRS.filter(s => pricesRef.current[s]);
        const symbol = seededPickRandom(rand, availableSymbols);
        const side = rand() > 0.5 ? "LONG" : "SHORT";
        const price = pricesRef.current[symbol].price;

        addThought({
          type: "SIGNAL",
          title: `${symbol} Opportunity Detected`,
          content: [
            `Momentum shift on ${symbol} at $${price.toLocaleString()}.`,
            `Side: ${side} | Leverage: ${Math.floor(rand() * 10 + 5)}x`,
          ],
        });

        setTimeout(() => {
          openPosition(symbol, side, price, 1);
        }, 2000);
      }

      const actions = ["TRADING", "MONITORING", "ANALYZING"];
      setCurrentAction(seededPickRandom(rand, actions));
    }, 1000);

    return () => clearInterval(mainLoop);
  }, [prices, openPosition, addThought]);

  return (
    <TradingContext.Provider value={{ positions, closedTrades, stats, thoughts, isAiActive, currentAction, pnlHistory }}>
      {children}
    </TradingContext.Provider>
  );
}
