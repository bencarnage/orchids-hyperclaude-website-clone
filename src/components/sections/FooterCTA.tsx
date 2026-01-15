import React from 'react';

/**
 * FooterCTA Component
 * 
 * Clones the call-to-action footer section with a soft beige background, 
 * the "Ready to make predictions?" heading, and the prominent "Connect Wallet" button.
 * 
 * Design Details:
 * - Background: Soft off-white/beige (#FBF9F6 as per Design System)
 * - Container: Centered max-width with subtle rounded corners and soft border.
 * - Typography: Inter (Sans), bold heading (700 weights).
 * - Primary Action: "Connect Wallet" button in brand terracotta (#D97E5D).
 */
export default function FooterCTA() {
  return (
    <section className="w-full px-4 py-12 md:py-16 bg-[#FBF9F6]">
      <div className="container mx-auto">
        <div 
          className="max-w-4xl mx-auto rounded-[24px] border border-black/5 bg-[#F7F3EE] p-10 md:p-14 text-center shadow-sm"
          style={{
            // Matches the visual "soft beige/terracotta light" variant seen in screenshots
            backgroundColor: 'rgba(217, 126, 93, 0.05)',
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0D0D0C] tracking-tight">
              Ready to make predictions?
            </h2>
            
            <p className="text-sm md:text-base text-[#6B7280] max-w-lg leading-relaxed">
              Connect your wallet to start participating in prediction markets and earn rewards.
            </p>

            <div className="mt-4">
              <button 
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#D97E5D] hover:bg-[#C46B4D] text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <div className="flex items-center gap-2">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="lucide lucide-wallet"
                  >
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                  </svg>
                  <span>Connect Wallet</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Secondary footer marker (as seen in screenshots "Showing all 3 markets") */}
        <div className="mt-8 text-center">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.1em] text-[#6B7280]/60 font-medium">
            Showing all 3 markets
          </p>
        </div>
      </div>
    </section>
  );
}