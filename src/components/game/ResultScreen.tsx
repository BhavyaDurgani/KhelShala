import React from 'react';
import { Trophy, Zap, ShieldCheck, ArrowRight, RotateCcw, LayoutDashboard, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResultScreenProps {
  score: number;
  xpEarned: number;
  level: number;
  accuracy: number;
  threatsNeutralized: number;
  timeSpent: string;
  gameTitle: string;
  onPlayAgain: () => void;
  onNextLevel?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  xpEarned,
  level,
  accuracy,
  threatsNeutralized,
  timeSpent,
  gameTitle,
  onPlayAgain,
  onNextLevel
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/85 backdrop-blur-xl animate-fade-in">
      <div className="bg-bg-card border border-brand-primary/40 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl shadow-brand-primary/20 space-y-6 relative overflow-hidden">
        
        {/* Glow backdrop behind title */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/40 mb-1">
            <Trophy className="w-8 h-8 animate-bounce" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            MISSION COMPLETE 🎉
          </h2>
          <p className="text-xs text-brand-secondary font-semibold uppercase tracking-wider">
            {gameTitle} • Level {level} Survived
          </p>
        </div>

        {/* Primary Rewards Highlight */}
        <div className="grid grid-cols-2 gap-3 bg-bg-surface/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center space-x-3 p-3 bg-slate-900/80 rounded-lg border border-brand-primary/30">
            <div className="p-2 rounded-lg bg-brand-primary/20 text-brand-primary">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">XP Earned</div>
              <div className="text-lg font-black text-white">+{xpEarned} XP</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-slate-900/80 rounded-lg border border-brand-secondary/30">
            <div className="p-2 rounded-lg bg-brand-secondary/20 text-brand-secondary">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Final Score</div>
              <div className="text-lg font-black text-white">{score}</div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-bg-surface border border-slate-800">
            <div className="text-slate-400 text-[10px]">Defense Accuracy</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">{accuracy}%</div>
          </div>
          <div className="p-2.5 rounded-lg bg-bg-surface border border-slate-800">
            <div className="text-slate-400 text-[10px]">Threats Blocked</div>
            <div className="text-sm font-bold text-brand-secondary mt-0.5">{threatsNeutralized}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-bg-surface border border-slate-800">
            <div className="text-slate-400 text-[10px]">Time Elapsed</div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">{timeSpent}</div>
          </div>
        </div>

        {/* Skill Improvements */}
        <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs font-bold text-slate-300 flex items-center">
            <ShieldCheck className="w-4 h-4 text-brand-success mr-1.5" />
            Skills Improved
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="px-2.5 py-1 rounded bg-brand-primary/15 text-brand-primary border border-brand-primary/30 font-semibold">
              Threat Detection ↑
            </span>
            <span className="px-2.5 py-1 rounded bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/30 font-semibold">
              Resource Allocation ↑
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
              Decision Speed ↑
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay Wave</span>
          </button>

          {onNextLevel ? (
            <button
              onClick={onNextLevel}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 hover:from-brand-primary/90 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-brand-primary/30"
            >
              <span>Next Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              to="/dashboard"
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white text-xs font-bold transition-all shadow-lg shadow-brand-primary/30"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          )}
        </div>

      </div>
    </div>
  );
};
