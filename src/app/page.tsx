"use client";

import NavigationSidebar from "@/components/sections/NavigationSidebar";
import Hero from "@/components/sections/Hero";
import MarketCardsList from "@/components/sections/MarketCardsList";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-background">
      <NavigationSidebar />
      <main className="flex-1 md:ml-0">
        <div className="md:hidden h-14" />
        <Hero />
        <MarketCardsList />
      </main>
    </div>
  );
}
