"use client";

import TopNavBar from "@/components/sections/TopNavBar";
import TradingHero from "@/components/sections/TradingHero";
import RecentTradesTicker from "@/components/sections/RecentTradesTicker";
import PerformanceStats from "@/components/sections/PerformanceStats";
import FooterLinks from "@/components/sections/FooterLinks";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 cyber-grid pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-primary/3 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-profit/3 blur-[150px] rounded-full pointer-events-none" />
      
      <TopNavBar />
      
      <main className="relative">
        <TradingHero />
        <RecentTradesTicker />
        <PerformanceStats />
        <FooterLinks />
      </main>
    </div>
  );
}
