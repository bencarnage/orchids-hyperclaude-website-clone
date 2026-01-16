"use client";

import { ReactNode } from "react";
import { PriceProvider } from "@/lib/prices";
import { TradingProvider } from "@/lib/trading-engine";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PriceProvider>
      <TradingProvider>{children}</TradingProvider>
    </PriceProvider>
  );
}