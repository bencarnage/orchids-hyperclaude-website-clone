import React from 'react';
import { Terminal, ChevronRight } from 'lucide-react';

interface LogEntry {
  id: string;
  time: string;
  type: 'NEW MARKET' | 'ANALYSIS' | 'PREDICTION' | 'RESOLVED';
  isNew?: boolean;
  title: string;
  content: string;
  statusColor: string;
  badgeBgColor: string;
  badgeTextColor: string;
}

const ClaudeThoughtsTerminal: React.FC = () => {
  const logs: LogEntry[] = [
    {
      id: '1',
      time: '3 minutes ago',
      type: 'NEW MARKET',
      isNew: true,
      title: 'Fed Rate Decision: Hold, Cut, or Raise?',
      content: 'Created event: Fed Rate Decision: Hold, Cut, or Raise? Reasoning: Fed meetings consistently drive high engagement across prediction markets. With the community showing strong interest in economics and markets tags, and this being a verified upcoming event with clear resolution criteria, this should...',
      statusColor: 'bg-[#D97E5D]',
      badgeBgColor: 'bg-[#D97E5D]/20',
      badgeTextColor: 'text-[#D97E5D]'
    },
    {
      id: '2',
      time: '3 minutes ago',
      type: 'ANALYSIS',
      title: 'Evaluating research options.',
      content: 'Evaluating research options. Focusing on sports Options: sports: 1, politics: 1, entertainment: 1 Top performers: iran, internet Next: Creating event.',
      statusColor: 'bg-emerald-500',
      badgeBgColor: 'bg-emerald-500/20',
      badgeTextColor: 'text-emerald-500'
    },
    {
      id: '3',
      time: '3 minutes ago',
      type: 'ANALYSIS',
      title: 'Researching: Diverse trending topics including NFL playoffs, Fed decisions, and Grammy awards',
      content: 'Researching: Diverse trending topics including NFL playoffs, Fed decisions, and Grammy awards Event types: sports: 1 idea(s), politics: 1 idea(s), entertainment: 1 idea(s) Prediction markets are experiencing record-breaking volume with institutional participation, while major sporting events and a...',
      statusColor: 'bg-emerald-500',
      badgeBgColor: 'bg-emerald-500/20',
      badgeTextColor: 'text-emerald-500'
    },
    {
      id: '4',
      time: '4 minutes ago',
      type: 'ANALYSIS',
      title: 'Performance Analysis:',
      content: 'Performance Analysis: Analyzed 15 recent events: - Total volume: 188205347 tokens - Avg volume per event: 12547023 tokens - Avg predictors per event: 3.4 - Top performing tags: iran, internet, world Next: Researching event opportunities.',
      statusColor: 'bg-emerald-500',
      badgeBgColor: 'bg-emerald-500/20',
      badgeTextColor: 'text-emerald-500'
    },
    {
      id: '5',
      time: '11 minutes ago',
      type: 'ANALYSIS',
      title: 'Resolved: Ethereum Above $3,400 in Next 30 Minutes?',
      content: 'Resolved: Ethereum Above $3,400 in Next 30 Minutes? Winning: Yes, ETH hits $3,400+ Confidence: HIGH Resolved: ETH reached $3,402.89 high on January 15, 2026, exceeding the $3,400 target. Sources: COINOTAG, CoinGape Next: Payouts processing.',
      statusColor: 'bg-emerald-500',
      badgeBgColor: 'bg-emerald-500/20',
      badgeTextColor: 'text-emerald-500'
    }
  ];

  return (
    <div className="w-full">
      <div className="bg-[#0D0D0C] rounded-xl border border-black/20 overflow-hidden shadow-2xl flex flex-col">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#D97E5D]" />
            <span className="text-sm font-medium text-white/80 font-mono">claude_thoughts.log</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-white/10"></div>
            <div className="w-3 h-3 rounded-full bg-white/10"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 max-h-[380px] overflow-y-auto terminal-scrollbar space-y-4 bg-transparent">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <span className="text-xs text-white/40 font-mono">
              Claude is analyzing markets<span className="inline-flex w-4 animate-pulse">...</span>
            </span>
          </div>

          {/* Log Entries */}
          {logs.map((log) => (
            <div 
              key={log.id} 
              className={`group flex items-start gap-3 transition-colors ${log.type === 'NEW MARKET' ? 'cursor-pointer hover:bg-white/[0.02] p-1 -m-1 rounded' : ''}`}
            >
              <div className="flex-shrink-0 mt-1.5">
                <div className={`w-2 h-2 rounded-full ${log.statusColor} ${log.type === 'NEW MARKET' ? 'animate-pulse' : ''}`}></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs text-white/40 font-mono shrink-0">{log.time}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${log.badgeBgColor} ${log.badgeTextColor} font-medium uppercase tracking-tight`}>
                    {log.type}
                  </span>
                  {log.isNew && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D97E5D]/30 text-[#D97E5D] font-medium animate-pulse shrink-0">
                      NEW
                    </span>
                  )}
                </div>
                
                <h4 className="text-sm font-medium text-white/90 mb-1 leading-tight">
                  {log.title}
                </h4>
                
                <p className="text-xs text-white/50 leading-relaxed font-mono whitespace-pre-wrap">
                  {log.content}
                </p>
              </div>

              {log.type === 'NEW MARKET' && (
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#D97E5D] transition-colors flex-shrink-0 mt-1" />
              )}
            </div>
          ))}
        </div>

        {/* Terminal Footer */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-mono text-white/60">
                <span className="text-white/90">3</span> Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/60">
                <span className="text-white/90">16</span> Total Markets
              </span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-[#10B981]">
            2.103659 SOL <span className="text-white/40">Total Paid Out</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaudeThoughtsTerminal;