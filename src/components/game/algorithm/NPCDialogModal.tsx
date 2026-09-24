import React from 'react';
import { X, Bot, UserCheck, Compass, Lightbulb } from 'lucide-react';
import { useAlgorithmStore } from '../../../store/useAlgorithmStore';

interface Props {
  npcKey: 'marcus' | 'sophia';
  onClose: () => void;
}

export const NPCDialogModal: React.FC<Props> = ({
  npcKey,
  onClose,
}) => {
  const store = useAlgorithmStore();

  const isAria = npcKey === 'sophia';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-3xl rounded-2xl border border-cyan-500/40 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl border ${isAria ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'bg-amber-500/20 text-amber-400 border-amber-500/40'}`}>
              {isAria ? <Bot className="h-10 w-10 animate-pulse" /> : <UserCheck className="h-10 w-10" />}
            </div>
            <div>
              <span className={`rounded px-2.5 py-0.5 text-[10px] font-bold uppercase font-mono border ${isAria ? 'bg-cyan-950 text-cyan-400 border-cyan-500/30' : 'bg-amber-950 text-amber-400 border-amber-500/30'}`}>
                {isAria ? 'ARIA — AUTONOMOUS SYSTEM AI' : 'WAREHOUSE OPERATIONAL SUPERVISOR'}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {isAria ? 'ARIA Systems Intelligence' : 'Supervisor Marcus'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAria ? 'Autonomous Resource & Intelligence Assistant' : 'Warehouse Logistics & Fleet Manager'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
            "{isAria
              ? "Systems Architect, I am ARIA. I continuously monitor city infrastructure bottlenecks. I guide system optimization through physical discovery."
              : "Welcome to Warehouse #04! We're experiencing a major throughput bottleneck. Trucks are leaving late, and cargo is piling up!"
            }"
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Compass className="h-4 w-4" /> ARIA SYSTEM ADVICE & OBSERVATIONS
            </h4>

            {store.ariaAdvice.map((advice) => (
              <div
                key={advice.tier}
                className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 font-mono text-[11px] flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-400" /> {advice.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{advice.type}</span>
                </div>
                <p className="text-slate-300 leading-relaxed pt-1 font-sans">{advice.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
