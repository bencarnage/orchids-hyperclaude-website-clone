"use client";

import { create } from "zustand";

export interface Position {
  id: string;
  asset: string;
  side: "LONG" | "SHORT";
  size: number;
  sizeDisplay: string;
  leverage: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  liquidationPrice: number;
  openTime: number;
  stopLoss: number;
  takeProfit: number;
}

export interface ClosedTrade {
  id: string;
  asset: string;
  side: "LONG" | "SHORT";
  entryPrice: number;
  exitPrice: number;
  size: number;
  pnl: number;
  pnlPercent: number;
  duration: number;
  closedAt: number;
}

export interface ThoughtLog {
  id: string;
  time: string;
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

interface MarketPrice {
  symbol: string;
  price: number;
  change24h: number;
  volatility: number;
}

interface TradingState {
  positions: Position[];
  closedTrades: ClosedTrade[];
  thoughts: ThoughtLog[];
  marketPrices: Record<string, MarketPrice>;
  totalPnl: number;
  todayPnl: number;
  totalTrades: number;
  winRate: number;
  winStreak: number;
  isAnalyzing: boolean;
  
  updateMarketPrices: () => void;
  updatePositions: () => void;
  addThought: (thought: ThoughtLog) => void;
  openPosition: (position: Omit<Position, "id" | "pnl" | "pnlPercent" | "markPrice">) => void;
  closePosition: (positionId: string, reason: string) => void;
  setAnalyzing: (analyzing: boolean) => void;
}

const INITIAL_MARKET_PRICES: Record<string, MarketPrice> = {
  BTC: { symbol: "BTC", price: 98234, change24h: 2.3, volatility: 0.0008 },
  ETH: { symbol: "ETH", price: 3456, change24h: -1.2, volatility: 0.0012 },
  SOL: { symbol: "SOL", price: 178.5, change24h: 4.5, volatility: 0.0018 },
  AVAX: { symbol: "AVAX", price: 42.3, change24h: 1.8, volatility: 0.0015 },
  ARB: { symbol: "ARB", price: 1.23, change24h: -0.5, volatility: 0.002 },
  DOGE: { symbol: "DOGE", price: 0.324, change24h: 3.2, volatility: 0.0025 },
  LINK: { symbol: "LINK", price: 18.9, change24h: 2.1, volatility: 0.0014 },
  MATIC: { symbol: "MATIC", price: 0.89, change24h: -1.8, volatility: 0.0016 },
  OP: { symbol: "OP", price: 2.45, change24h: 1.5, volatility: 0.0018 },
  APT: { symbol: "APT", price: 12.3, change24h: 0.8, volatility: 0.0017 },
  INJ: { symbol: "INJ", price: 28.5, change24h: 5.2, volatility: 0.002 },
  SUI: { symbol: "SUI", price: 4.12, change24h: 3.8, volatility: 0.0022 },
  WIF: { symbol: "WIF", price: 2.89, change24h: -2.5, volatility: 0.003 },
  PEPE: { symbol: "PEPE", price: 0.0000234, change24h: 8.5, volatility: 0.004 },
};

const INITIAL_POSITIONS: Position[] = [
  {
    id: "pos-1",
    asset: "BTC",
    side: "LONG",
    size: 0.45,
    sizeDisplay: "0.45 BTC",
    leverage: 5,
    entryPrice: 97800,
    markPrice: 98234,
    pnl: 195.3,
    pnlPercent: 2.22,
    liquidationPrice: 82000,
    openTime: Date.now() - 1800000,
    stopLoss: 96500,
    takeProfit: 101500,
  },
  {
    id: "pos-2",
    asset: "ETH",
    side: "SHORT",
    size: 3.2,
    sizeDisplay: "3.2 ETH",
    leverage: 10,
    entryPrice: 3520,
    markPrice: 3456,
    pnl: 204.8,
    pnlPercent: 1.82,
    liquidationPrice: 3850,
    openTime: Date.now() - 720000,
    stopLoss: 3620,
    takeProfit: 3350,
  },
];

const INITIAL_CLOSED_TRADES: ClosedTrade[] = [
  { id: "ct-1", asset: "BTC", side: "LONG", entryPrice: 97200, exitPrice: 97890, size: 0.3, pnl: 389, pnlPercent: 0.71, duration: 547, closedAt: Date.now() - 120000 },
  { id: "ct-2", asset: "ETH", side: "SHORT", entryPrice: 3480, exitPrice: 3435, size: 2.0, pnl: 156, pnlPercent: 1.29, duration: 923, closedAt: Date.now() - 900000 },
  { id: "ct-3", asset: "SOL", side: "LONG", entryPrice: 176.2, exitPrice: 175.1, size: 12, pnl: -45, pnlPercent: -0.62, duration: 412, closedAt: Date.now() - 1680000 },
  { id: "ct-4", asset: "AVAX", side: "LONG", entryPrice: 41.8, exitPrice: 42.5, size: 35, pnl: 89, pnlPercent: 1.67, duration: 1834, closedAt: Date.now() - 2520000 },
  { id: "ct-5", asset: "ARB", side: "SHORT", entryPrice: 1.28, exitPrice: 1.21, size: 1200, pnl: 234, pnlPercent: 5.47, duration: 2156, closedAt: Date.now() - 3600000 },
  { id: "ct-6", asset: "DOGE", side: "LONG", entryPrice: 0.318, exitPrice: 0.315, size: 5000, pnl: -28, pnlPercent: -0.94, duration: 678, closedAt: Date.now() - 4200000 },
  { id: "ct-7", asset: "LINK", side: "LONG", entryPrice: 18.2, exitPrice: 18.9, size: 80, pnl: 167, pnlPercent: 3.85, duration: 1456, closedAt: Date.now() - 7200000 },
  { id: "ct-8", asset: "BTC", side: "SHORT", entryPrice: 98500, exitPrice: 98055, size: 0.25, pnl: 445, pnlPercent: 0.45, duration: 2890, closedAt: Date.now() - 10800000 },
];

function generateRealisticPriceChange(currentPrice: number, volatility: number): number {
  const random = Math.random();
  const direction = Math.random() > 0.5 ? 1 : -1;
  
  let magnitude: number;
  if (random < 0.7) {
    magnitude = volatility * 0.3;
  } else if (random < 0.9) {
    magnitude = volatility * 0.7;
  } else if (random < 0.98) {
    magnitude = volatility * 1.2;
  } else {
    magnitude = volatility * 2.5;
  }
  
  const trendBias = Math.sin(Date.now() / 60000) * 0.0002;
  const change = (direction * magnitude + trendBias) * currentPrice;
  
  return currentPrice + change;
}

export const useTradingStore = create<TradingState>((set, get) => ({
  positions: INITIAL_POSITIONS,
  closedTrades: INITIAL_CLOSED_TRADES,
  thoughts: [],
  marketPrices: INITIAL_MARKET_PRICES,
  totalPnl: 47832.5,
  todayPnl: 2341.2,
  totalTrades: 1847,
  winRate: 68.4,
  winStreak: 7,
  isAnalyzing: true,

  updateMarketPrices: () => {
    set((state) => {
      const newPrices = { ...state.marketPrices };
      
      Object.keys(newPrices).forEach((symbol) => {
        const market = newPrices[symbol];
        newPrices[symbol] = {
          ...market,
          price: generateRealisticPriceChange(market.price, market.volatility),
        };
      });
      
      return { marketPrices: newPrices };
    });
  },

  updatePositions: () => {
    set((state) => {
      const { marketPrices, positions } = state;
      
      const updatedPositions = positions.map((pos) => {
        const market = marketPrices[pos.asset];
        if (!market) return pos;
        
        const markPrice = market.price;
        const priceDiff = pos.side === "LONG" 
          ? markPrice - pos.entryPrice 
          : pos.entryPrice - markPrice;
        
        const notional = pos.size * pos.entryPrice;
        const pnl = priceDiff * pos.size * pos.leverage;
        const pnlPercent = (priceDiff / pos.entryPrice) * 100 * pos.leverage;
        
        return {
          ...pos,
          markPrice,
          pnl: Math.round(pnl * 100) / 100,
          pnlPercent: Math.round(pnlPercent * 100) / 100,
        };
      });
      
      const totalPositionPnl = updatedPositions.reduce((sum, p) => sum + p.pnl, 0);
      
      return { 
        positions: updatedPositions,
      };
    });
  },

  addThought: (thought) => {
    set((state) => ({
      thoughts: [...state.thoughts.slice(-50), thought],
    }));
  },

  openPosition: (position) => {
    const id = `pos-${Date.now()}`;
    const market = get().marketPrices[position.asset];
    const markPrice = market?.price || position.entryPrice;
    
    const newPosition: Position = {
      ...position,
      id,
      markPrice,
      pnl: 0,
      pnlPercent: 0,
    };
    
    set((state) => ({
      positions: [...state.positions, newPosition],
      totalTrades: state.totalTrades + 1,
    }));
    
    return newPosition;
  },

  closePosition: (positionId, reason) => {
    const state = get();
    const position = state.positions.find((p) => p.id === positionId);
    
    if (!position) return;
    
    const closedTrade: ClosedTrade = {
      id: `ct-${Date.now()}`,
      asset: position.asset,
      side: position.side,
      entryPrice: position.entryPrice,
      exitPrice: position.markPrice,
      size: position.size,
      pnl: position.pnl,
      pnlPercent: position.pnlPercent,
      duration: Math.floor((Date.now() - position.openTime) / 1000),
      closedAt: Date.now(),
    };
    
    const isWin = position.pnl > 0;
    
    set((state) => ({
      positions: state.positions.filter((p) => p.id !== positionId),
      closedTrades: [closedTrade, ...state.closedTrades].slice(0, 50),
      totalPnl: state.totalPnl + position.pnl,
      todayPnl: state.todayPnl + position.pnl,
      winStreak: isWin ? state.winStreak + 1 : 0,
      winRate: isWin 
        ? Math.min(75, state.winRate + 0.02)
        : Math.max(55, state.winRate - 0.03),
    }));
    
    return closedTrade;
  },

  setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
}));

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (price >= 1) return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 0.01) return price.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  return price.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 8 });
}