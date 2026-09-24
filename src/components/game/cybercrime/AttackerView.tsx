import React from 'react';
import { Skull, Play, Zap, ShieldAlert, CheckCircle2, Lock, Activity } from 'lucide-react';
import type { AttackGraph } from '../../../types/cyber';

interface Props {
  attackGraph: AttackGraph;
  onLaunchAttackWave: () => void;
  onExecuteNode: (nodeId: string) => void;
  personaName: string;
}

export const AttackerView: React.FC<Props> = ({
  attackGraph,
  onLaunchAttackWave,
  onExecuteNode,
  personaName,
}) => {
  return (
    <div className="space-y-4">
      {/* Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-rose-900/50 bg-slate-900/80 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Skull className="h-5 w-5 text-rose-500 animate-pulse" />
            <h3 className="font-bold text-white text-base">REAL-TIME ATTACK GRAPH & KILL-CHAIN COMBAT</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Persona: <span className="text-rose-400 font-semibold">{personaName}</span> | Objective Node: <span className="text-rose-300 font-mono font-bold">{attackGraph.objectiveNodeId}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 animate-spin text-cyan-400" /> AI DEFENDER ONLINE
          </span>

          <button
            onClick={onLaunchAttackWave}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-5 py-2.5 font-bold text-white shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 text-xs"
          >
            <Play className="h-4 w-4 fill-current" /> AUTO-EXECUTE AI WAVE
          </button>
        </div>
      </div>

      {/* Interactive Kill-Chain Attack Nodes Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {attackGraph.nodes.map((node) => {
          const isBlocked = node.status === 'BLOCKED';
          const isAvailable = node.status === 'AVAILABLE';
          const isExecuted = node.status === 'EXECUTED';

          return (
            <div
              key={node.id}
              className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-300 ${
                isBlocked
                  ? 'border-emerald-500/50 bg-emerald-950/20 opacity-80'
                  : isExecuted
                  ? 'border-rose-500 bg-rose-950/40 shadow-lg shadow-rose-500/20'
                  : isAvailable
                  ? 'border-cyan-400 bg-slate-900/90 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/40'
                  : 'border-slate-800 bg-slate-900/50 opacity-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300 uppercase font-mono">
                    {node.phase}
                  </span>
                  <span className={`text-[10px] font-bold uppercase ${
                    isBlocked ? 'text-emerald-400 flex items-center gap-1' :
                    isExecuted ? 'text-rose-400 flex items-center gap-1' :
                    isAvailable ? 'text-cyan-400 animate-pulse' : 'text-slate-500'
                  }`}>
                    {isBlocked && <ShieldAlert className="h-3 w-3" />}
                    {isExecuted && <CheckCircle2 className="h-3 w-3" />}
                    {node.status}
                  </span>
                </div>

                <h4 className="mt-2 font-bold text-white text-xs leading-snug">{node.name}</h4>
                <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">{node.description}</p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="space-y-1 rounded bg-slate-950/80 p-2 text-[10px] border border-slate-800/80">
                  <div className="flex justify-between text-slate-400">
                    <span>Success Rate:</span>
                    <span className="font-bold text-emerald-400">{Math.round(node.successProb * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Detection Risk:</span>
                    <span className="font-bold text-rose-400">{Math.round(node.detectionProb * 100)}%</span>
                  </div>
                </div>

                {isAvailable ? (
                  <button
                    onClick={() => onExecuteNode(node.id)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-1.5 font-bold text-slate-950 text-xs shadow-md shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Zap className="h-3.5 w-3.5 fill-current" /> EXECUTE EXPLOIT
                  </button>
                ) : isBlocked ? (
                  <div className="text-center text-[10px] font-bold text-emerald-400 bg-emerald-950/60 py-1 rounded border border-emerald-500/30">
                    BLOCKED BY AI DEFENDER
                  </div>
                ) : isExecuted ? (
                  <div className="text-center text-[10px] font-bold text-rose-400 bg-rose-950/60 py-1 rounded border border-rose-500/30">
                    EXPLOIT EXECUTED
                  </div>
                ) : (
                  <div className="text-center text-[10px] font-bold text-slate-500 bg-slate-950 py-1 rounded border border-slate-800 flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" /> LOCKED (PREREQS)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
