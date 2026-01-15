import React from 'react';
import { TrendingUp, ExternalLink, Brain, Target, Coins, Terminal, ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="border-b border-primary/20 bg-gradient-to-br from-[#D97E5D] to-[#C46B4D]">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          {/* Top Status Indicators */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-white/90 uppercase tracking-wider">
                AI-Powered Prediction Markets
              </span>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-1.5">
              <a 
                href="https://pump.fun/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-white text-sm font-medium transition-colors backdrop-blur-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live on Pump.fun
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a 
                href="https://solscan.io/account/opusMVDaTKy9MT8ksU1nap16yYuVqZqaP57M3Wj3n6a" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-white/60 hover:text-white/90 transition-colors flex items-center gap-1"
              >
                <span className="text-white/40">HyperClaude Wallet:</span>
                <span className="font-mono">opus...3n6a</span>
              </a>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight flex items-center gap-3">
            <svg className="h-8 w-8 md:h-10 md:w-10 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
            </svg>
            <span>HyperClaude</span>
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl mb-8 leading-relaxed">
            Claude Opus 4.5 powered prediction markets on Solana. AI creates the markets. 
            You make the predictions. When you&apos;re correct, you earn rewards proportional to your stake.
          </p>

          {/* Value Props Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1.5">
                <Brain className="h-4 w-4 text-white" />
                <h3 className="text-sm font-semibold text-white">AI Creates Markets</h3>
              </div>
              <p className="text-xs text-white/70 leading-tight">
                Claude AI runs 24/7, analyzing trends and creating high-quality prediction markets automatically.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1.5">
                <Target className="h-4 w-4 text-white" />
                <h3 className="text-sm font-semibold text-white">You Predict</h3>
              </div>
              <p className="text-xs text-white/70 leading-tight">
                Browse AI-created markets and stake your tokens on outcomes you believe in. No risk, you never lose your tokens.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1.5">
                <Coins className="h-4 w-4 text-white" />
                <h3 className="text-sm font-semibold text-white">Earn Rewards</h3>
              </div>
              <p className="text-xs text-white/70 leading-tight">
                When you&apos;re correct, you earn rewards from the payout pool. The more you stake correctly, the more you earn.
              </p>
            </div>
          </div>
        </div>

        {/* Terminal Log Component Integration Area */}
        <div className="w-full">
          <div className="bg-[#0d0d0c] rounded-xl border border-black/20 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#D97E5D]" />
                <span className="text-sm font-medium text-white/80 font-mono tracking-tight">claude_thoughts.log</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
            </div>
            
            <div className="p-4 max-h-[380px] overflow-y-auto terminal-scrollbar space-y-4">
              {/* Active Analysis Indicator */}
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <span className="text-xs text-white/40 font-mono">
                    HyperClaude is analyzing markets<span className="inline-flex w-4 animate-pulse">...</span>
                  </span>
              </div>

              {/* Log Entry: New Market */}
              <div className="group cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#D97E5D] animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-white/40 font-mono">3 minutes ago</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D97E5D]/20 text-[#D97E5D] font-medium uppercase tracking-tighter">New Market</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D97E5D]/30 text-[#D97E5D] font-medium animate-pulse">NEW</span>
                    </div>
                    <p className="text-sm font-medium text-white/90 mb-1">Fed Rate Decision: Hold, Cut, or Raise?</p>
                    <p className="text-xs text-white/50 leading-relaxed font-mono">
                      Created event: Fed Rate Decision: Hold, Cut, or Raise? Reasoning: Fed meetings consistently drive high engagement across prediction markets. With the community showing strong interest in economics and markets tags...
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#D97E5D] transition-colors flex-shrink-0 mt-1" />
                </div>
              </div>

              {/* Log Entry: Analysis */}
              <div className="group">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#D97E5D]/60"></div>
                  </div>
                  <div className="flex-1 min-w-0 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-white/40 font-mono">3 minutes ago</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-medium uppercase tracking-tighter">Analysis</span>
                    </div>
                    <p className="text-sm font-medium text-white/90 mb-1">Evaluating research options.</p>
                    <p className="text-xs text-white/50 leading-relaxed font-mono">
                      Focusing on sports. Options: sports: 1, politics: 1, entertainment: 1. Top performers: iran, internet. Next: Creating event.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer status line inside terminal */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-[10px] font-mono text-white/60">3 Active</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">16 Total Markets</span>
                </div>
                <div className="text-[10px] font-mono">
                  <span className="text-emerald-500">2.103659 SOL</span> <span className="text-white/40">Total Paid Out</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;