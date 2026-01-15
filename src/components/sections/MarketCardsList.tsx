import React from 'react';
import { TrendingUp, Coins, Clock, ChevronRight, Search, CheckCircle2 } from 'lucide-react';

interface Outcome {
  label: string;
  percentage: number;
  tokens: string;
}

interface MarketCardProps {
  title: string;
  tags: string[];
  status: 'Open' | 'Resolved' | 'Closed';
  volume: string;
  pool: string;
  closesAt: string;
  outcomes: Outcome[];
  extraOutcomes?: string;
}

const MarketCard: React.FC<MarketCardProps> = ({
  title,
  tags,
  status,
  volume,
  pool,
  closesAt,
  outcomes,
  extraOutcomes,
}) => {
  return (
    <div className="bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden mb-4">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Content Left */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md bg-secondary text-muted-foreground text-[12px] font-medium border border-border/50"
                >
                  {tag}
                </span>
              ))}
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[12px] font-medium border border-emerald-100 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                {status}
              </span>
            </div>
            
            <h3 className="text-[18px] font-semibold text-foreground mb-6 tracking-tight leading-snug">
              {title}
            </h3>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground/60" />
                <span className="text-[14px]">
                  <span className="font-semibold text-foreground">{volume}</span> volume
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-muted-foreground/60" />
                <span className="text-[14px]">
                  <span className="font-semibold text-foreground">{pool}</span> SOL pool
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground/60" />
                <span className="text-[14px]">{closesAt}</span>
              </div>
            </div>
          </div>

          {/* Outcomes Right */}
          <div className="flex flex-col items-end gap-3 min-w-[280px]">
            <div className="flex gap-2 w-full lg:w-auto">
              {outcomes.map((outcome, idx) => (
                <div 
                  key={idx}
                  className="flex-1 lg:flex-none lg:w-32 p-3 bg-secondary rounded-lg border border-border flex flex-col items-start gap-1"
                >
                  <span className="text-[11px] font-medium text-muted-foreground line-clamp-1">
                    {outcome.label}
                  </span>
                  <div className="text-[18px] font-bold text-foreground">
                    {outcome.percentage}%
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                    {outcome.tokens} tokens
                  </span>
                </div>
              ))}
            </div>
            {extraOutcomes && (
              <span className="text-[12px] text-muted-foreground font-medium pr-2">
                {extraOutcomes}
              </span>
            )}
            <a 
              href="#" 
              className="mt-2 text-primary hover:text-primary/80 text-[14px] font-semibold flex items-center gap-1.5 transition-colors group"
            >
              View <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketCardsList: React.FC = () => {
  const markets: MarketCardProps[] = [
    {
      title: "Fed Rate Decision: Hold, Cut, or Raise?",
      tags: ["economics", "politics"],
      status: "Open",
      volume: "0.00",
      pool: "0.000000",
      closesAt: "Closes Jan 28",
      outcomes: [
        { label: "Rate increase (+...", percentage: 0, tokens: "0.00" },
        { label: "Rate decrease (...", percentage: 0, tokens: "0.00" },
      ],
      extraOutcomes: "+1 more outcome",
    },
    {
      title: "Avalanche Above $15.00 in Next 45 Minutes?",
      tags: ["crypto", "price"],
      status: "Open",
      volume: "5.25M",
      pool: "0.049333",
      closesAt: "Closes soon",
      outcomes: [
        { label: "No, stays below ...", percentage: 100, tokens: "5.25M" },
        { label: "Yes, AVAX hits $1...", percentage: 0, tokens: "0.00" },
      ],
    },
    {
      title: "Celtics vs Heat - Who Wins Tonight?",
      tags: ["prediction", "sports"],
      status: "Open",
      volume: "4.89M",
      pool: "0.150354",
      closesAt: "Closes soon",
      outcomes: [
        { label: "Heat win", percentage: 99, tokens: "4.82M" },
        { label: "Celtics win", percentage: 1, tokens: "71.39K" },
      ],
    },
  ];

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 px-1">
          <div className="flex items-center gap-1.5 bg-white border border-border p-1 rounded-xl shadow-sm">
            <button className="px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg">
              All Markets
            </button>
            <button className="px-5 py-2 text-sm font-semibold text-white bg-foreground rounded-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Open
            </button>
            <button className="px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </button>
          </div>

          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Market Feed */}
        <div className="space-y-4 px-1">
          {markets.map((market, index) => (
            <MarketCard key={index} {...market} />
          ))}
        </div>

        {/* List Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-muted-foreground/70">
            Showing all 3 markets
          </p>
        </div>

        {/* Wallet CTA */}
        <div className="mt-12 p-8 lg:p-12 rounded-3xl bg-[#F3EFEC] border border-border/10 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[100px] pointer-events-none rounded-full" />
          <div className="relative z-10 max-w-lg mx-auto">
            <h2 className="text-[24px] font-bold text-foreground mb-3">
              Ready to make predictions?
            </h2>
            <p className="text-muted-foreground mb-8 text-[15px] leading-relaxed">
              Connect your wallet to start participating in prediction markets and earn rewards.
            </p>
            <button className="px-8 py-3.5 bg-[#D97E5D] hover:bg-[#C46B4D] text-white font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98]">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketCardsList;