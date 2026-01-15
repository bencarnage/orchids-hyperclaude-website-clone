"use client";

import React, { useState } from "react";
import { Search, Check } from "lucide-react";

/**
 * MarketFilters Component
 * 
 * Clones the filtering interface for the prediction markets.
 * Includes tabs for "All Markets", "Open", "Completed" and a search bar.
 * Follows the clean, light-themed aesthetic with specific active states.
 */

const MarketFilters = () => {
  const [activeTab, setActiveTab] = useState("Open");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { name: "All Markets" },
    { name: "Open", hasDot: true },
    { name: "Completed", icon: Check },
  ];

  return (
    <div className="container mx-auto px-4 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left side: Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/50 backdrop-blur-sm border border-border rounded-xl">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            const Icon = tab.icon;

            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2
                  ${
                    isActive
                      ? "bg-[#0D0D0C] text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                  }
                `}
              >
                {/* Active Dot for 'Open' */}
                {tab.hasDot && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-emerald-500"}`} />
                )}
                
                {/* Icon for 'Completed' */}
                {Icon && (
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-muted-foreground"}`} />
                )}
                
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Right side: Search Input */}
        <div className="relative w-full md:w-64 group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-border rounded-xl py-2 pl-10 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default MarketFilters;