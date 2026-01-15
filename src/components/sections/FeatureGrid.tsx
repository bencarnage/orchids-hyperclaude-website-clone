import React from 'react';
import { Brain, Target, Coins } from 'lucide-react';

/**
 * FeatureGrid Component
 * Clones the grid of three glassmorphic feature cards positioned under the hero text.
 * Styled to match the light theme with white icons and translucent backgrounds on the terracotta header.
 */
const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-4 h-4 text-white" />,
      title: "AI Creates Markets",
      description: "Claude AI runs 24/7, analyzing trends and creating high-quality prediction markets automatically.",
    },
    {
      icon: <Target className="w-4 h-4 text-white" />,
      title: "You Predict",
      description: "Browse AI-created markets and stake your tokens on outcomes you believe in. No risk, you never lose your tokens.",
    },
    {
      icon: <Coins className="w-4 h-4 text-white" />,
      title: "Earn Rewards",
      description: "When you're correct, you earn rewards from the payout pool. The more you stake correctly, the more you earn.",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4 max-w-3xl mt-8">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 transition-all hover:bg-white/15"
          style={{
            // Matches computed styles for translucent cards on the primary gradient background
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            borderRadius: '0.5rem',
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex-shrink-0">
              {feature.icon}
            </div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              {feature.title}
            </h3>
          </div>
          <p className="text-[11px] md:text-xs text-white/70 leading-tight">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FeatureGrid;