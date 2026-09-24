import React from 'react';
import { ShieldAlert, X } from 'lucide-react';
import type { CyberAttack } from '../../../types/cyber';
import { INCIDENT_ACTIONS } from '../../../data/cyber/incidentActions';

interface Props {
  attack: CyberAttack;
  budget: number;
  onExecuteAction: (actionId: string) => void;
  onClose: () => void;
}

export const IncidentResponseModal: React.FC<Props> = ({
  attack,
  budget,
  onExecuteAction,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-rose-500/50 bg-slate-900/95 p-6 shadow-2xl shadow-rose-500/20">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-rose-500/20 p-2.5 text-rose-500 animate-pulse border border-rose-500/40">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <div>
              <span className="rounded bg-rose-950 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/30">
                CRISIS DETECTED - IR PHASE
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{attack.name}</h3>
              <p className="text-xs text-slate-400">
                Severity: <span className="font-bold text-rose-400">{attack.severity}</span> | Target Sector ID: <span className="font-mono text-cyan-400">{attack.targetSectorId}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Buttons Catalog */}
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">CHOOSE TACTICAL RESPONSE ACTION</h4>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {INCIDENT_ACTIONS.map(action => {
              const canAfford = budget >= action.cost;

              return (
                <div
                  key={action.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <h5 className="font-bold text-white text-sm">{action.name}</h5>
                    <span className="font-mono text-xs font-bold text-cyan-400">${action.cost}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">{action.description}</p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-900 text-[11px]">
                    <span className="text-slate-400">Containment: <strong className="text-emerald-400">+{Math.round(action.spreadReduction * 100)}%</strong></span>

                    <button
                      disabled={!canAfford}
                      onClick={() => onExecuteAction(action.id)}
                      className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
                        canAfford
                          ? 'bg-rose-500 text-slate-950 hover:bg-rose-400 shadow-md shadow-rose-500/20'
                          : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      Execute Response
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
