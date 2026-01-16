"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  lastUpdate: number;
}

interface PriceContextType {
  prices: Record<string, CryptoPrice>;
  isLoading: boolean;
  error: string | null;
}

const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  AVAX: "avalanche-2",
  ARB: "arbitrum",
  DOGE: "dogecoin",
  LINK: "chainlink",
  MATIC: "matic-network",
  OP: "optimism",
  APT: "aptos",
  SUI: "sui",
  INJ: "injective-protocol",
  TIA: "celestia",
  SEI: "sei-network",
  NEAR: "near",
  ATOM: "cosmos",
  DOT: "polkadot",
  ADA: "cardano",
  XRP: "ripple",
  BNB: "binancecoin",
};

const PriceContext = createContext<PriceContextType>({
  prices: {},
  isLoading: true,
  error: null,
});

export function usePrices() {
  return useContext(PriceContext);
}

export function PriceProvider({ children }: { children: ReactNode }) {
  const [prices, setPrices] = useState<Record<string, CryptoPrice>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const ids = Object.values(COINGECKO_IDS).join(",");
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_high=true&include_24hr_low=true`,
        { next: { revalidate: 30 } }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch prices");
      }

      const data = await response.json();
      const newPrices: Record<string, CryptoPrice> = {};

      for (const [symbol, geckoId] of Object.entries(COINGECKO_IDS)) {
        const priceData = data[geckoId];
        if (priceData) {
          newPrices[symbol] = {
            symbol,
            name: geckoId,
            price: priceData.usd || 0,
            change24h: priceData.usd_24h_change || 0,
            high24h: priceData.usd_24h_high || priceData.usd,
            low24h: priceData.usd_24h_low || priceData.usd,
            lastUpdate: Date.now(),
          };
        }
      }

      setPrices(newPrices);
      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.error("Price fetch error:", err);
      setError("Failed to fetch live prices");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return (
    <PriceContext.Provider value={{ prices, isLoading, error }}>
      {children}
    </PriceContext.Provider>
  );
}

export function simulatePriceMovement(basePrice: number, volatility: number = 0.0002): number {
  const change = (Math.random() - 0.5) * 2 * volatility;
  return basePrice * (1 + change);
}

export function formatPrice(price: number): string {
  if (price >= 10000) return price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (price >= 100) return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  return price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

export function formatPnL(pnl: number): string {
  const prefix = pnl >= 0 ? "+" : "";
  return `${prefix}$${Math.abs(pnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercent(percent: number): string {
  const prefix = percent >= 0 ? "+" : "";
  return `${prefix}${percent.toFixed(2)}%`;
}