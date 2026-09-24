import React, { useState } from 'react';
import { Bot, ChevronDown } from 'lucide-react';
import type { MentorHint } from '../../../types/cyber';

interface Props {
  activeHints: MentorHint[];
  onRequestHint: (tier: number) => void;
  budget: number;
}

export const AIMentorChatbot: React.FC<Props> = ({
  activeHints,
  onRequestHint,
  budget,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-bold text-slate-950 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 border border-cyan-300/40"
        >
          <Bot className="h-5 w-5" />
          <span>AI CYBER MENTOR</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      ) : (
        <div className="w-96 rounded-2xl border border-cyan-500/40 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-cyan-400" />
              <h4 className="font-bold text-white text-sm">SOCRATIC AI MENTOR</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Progressive Socratic hints analyze current level context, active attacks, and risk trade-offs without spoiling answers.
          </p>

          {/* Active Hints History */}
          <div className="mt-3 max-h-60 space-y-2 overflow-y-auto pr-1">
            {activeHints.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-center text-xs text-slate-500">
                No hints requested yet. Request Tier 1 hint below.
              </div>
            ) : (
              activeHints.map((hint, i) => (
                <div key={i} className="rounded-xl border border-cyan-500/30 bg-slate-900/80 p-3 text-xs">
                  <span className="font-bold text-cyan-400">Tier {hint.tier}: {hint.prompt}</span>
                  <p className="mt-1 text-slate-200">{hint.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Request Hint Actions */}
          <div className="mt-4 border-t border-slate-800 pt-3 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">REQUEST PROGRESSIVE HINT</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[1, 2, 3].map(tier => {
                const cost = tier === 1 ? 50 : tier === 2 ? 100 : 150;
                const canAfford = budget >= cost;

                return (
                  <button
                    key={tier}
                    disabled={!canAfford}
                    onClick={() => onRequestHint(tier)}
                    className={`rounded-lg p-2 text-center text-[10px] font-bold transition-all border ${
                      canAfford
                        ? 'border-cyan-500/40 bg-slate-900 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950'
                        : 'border-slate-800 bg-slate-950 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    Tier {tier} (${cost})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
