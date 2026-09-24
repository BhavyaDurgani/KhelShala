import React from 'react';
import { BookOpen, CheckCircle2, ListOrdered, ShieldCheck, X } from 'lucide-react';

interface QuickRulesModalProps {
  gameTitle: string;
  domainName: string;
  rules: string[];
  objectives: string[];
  skills: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const QuickRulesModal: React.FC<QuickRulesModalProps> = ({
  gameTitle,
  domainName,
  rules,
  objectives,
  skills,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                {domainName} GAME MANUAL
              </span>
              <h3 className="text-xl font-black text-white font-display">
                {gameTitle} — Rules & Operating Manual
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operating Rules */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center">
            <ListOrdered className="w-4 h-4 mr-1.5" />
            Step-by-Step Game Rules & Mechanics
          </h4>
          <div className="space-y-2">
            {rules.map((rule, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono flex items-start space-x-3">
                <span className="w-5 h-5 rounded-md bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center text-[11px] font-bold shrink-0">
                  {idx + 1}
                </span>
                <span className="pt-0.5">{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Target Objectives */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-teal-400 font-mono uppercase tracking-wider flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Educational Objectives & Key Concepts
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {objectives.map((obj, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="leading-normal">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Covered */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 flex items-center">
            <ShieldCheck className="w-4 h-4 text-amber-400 mr-1.5" />
            Core Skills Mastered in this Arena:
          </span>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            RESUME INTERACTIVE SIMULATION
          </button>
        </div>

      </div>
    </div>
  );
};
