import React, { useState } from 'react';
import { Sliders, Play, Cpu, X, CheckCircle, Zap, Check } from 'lucide-react';
import type { WarehouseMission, SystemStrategyChoice, ExecutionResult } from '../../../types/algorithm';

interface Props {
  mission: WarehouseMission;
  activeStrategy: SystemStrategyChoice;
  onSelectStrategy: (strategy: SystemStrategyChoice) => void;
  onRunSimulation: () => void;
  onRunScaleBenchmark: (size: number) => void;
  executionResult: ExecutionResult | null;
  onClose: () => void;
  onCompleteMission?: () => void;
}

export const OperationsConsoleModal: React.FC<Props> = ({
  mission,
  activeStrategy,
  onSelectStrategy,
  onRunSimulation,
  onRunScaleBenchmark,
  executionResult,
  onClose,
  onCompleteMission,
}) => {
  const [selectedLoadSize] = useState<number>(1000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl rounded-2xl border border-cyan-500/40 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-500/10">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/20 p-2.5 text-cyan-400 border border-cyan-500/40">
              <Sliders className="h-6 w-6" />
            </div>
            <div>
              <span className="rounded bg-cyan-950 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30 font-mono">
                CITY INFRASTRUCTURE OPERATIONS CONSOLE #04
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">{mission.title}</h3>
            </div>
          </div>

          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Strategy Selection Column (Left) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Zap className="h-4 w-4" /> SELECT SYSTEM OPERATIONAL STRATEGY
              </span>
              <span>Target Crate: #{mission.targetPackageId}</span>
            </div>

            {/* Strategy Options Cards */}
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {mission.strategies.map((strat) => {
                const isSelected = strat.id === activeStrategy.id;
                const isOptimal = strat.complexity === mission.requiredComplexity;

                return (
                  <div
                    key={strat.id}
                    onClick={() => onSelectStrategy(strat)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                      isSelected
                        ? 'border-cyan-400 bg-slate-900/90 shadow-lg shadow-cyan-500/20'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{strat.name}</h4>
                          {isOptimal && (
                            <span className="rounded bg-emerald-950 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{strat.description}</p>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                        strat.complexity === 'O(log N)' || strat.complexity === 'O(N log N)'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-950 text-amber-400 border-amber-500/30'
                      }`}>
                        {strat.complexity}
                      </span>
                    </div>

                    {/* Strategy Trade-Off Metrics */}
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-mono pt-2 border-t border-slate-800/80">
                      <div className="rounded bg-slate-950 p-1.5 border border-slate-800">
                        <span className="text-slate-400 block text-[9px]">Processing Time</span>
                        <strong className="text-cyan-300">{strat.processingTimeSec}s</strong>
                      </div>
                      <div className="rounded bg-slate-950 p-1.5 border border-slate-800">
                        <span className="text-slate-400 block text-[9px]">Worker Congestion</span>
                        <strong className={strat.workerCongestionPct > 50 ? 'text-amber-400' : 'text-emerald-400'}>
                          {strat.workerCongestionPct}%
                        </strong>
                      </div>
                      <div className="rounded bg-slate-950 p-1.5 border border-slate-800">
                        <span className="text-slate-400 block text-[9px]">Scalability</span>
                        <strong className="text-emerald-400">{strat.scalabilityRating}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Simulation Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex gap-3">
                <button
                  onClick={onRunSimulation}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all text-xs"
                >
                  <Play className="h-4.5 w-4.5 fill-current" /> SIMULATE STRATEGY & OBSERVE IN 3D
                </button>
                <button
                  onClick={() => onRunScaleBenchmark(selectedLoadSize)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/60 px-5 py-3.5 font-bold text-amber-300 hover:bg-amber-900 transition-colors text-xs"
                >
                  <Cpu className="h-4.5 w-4.5" /> STRESS TEST SCALE
                </button>
              </div>

              {executionResult && executionResult.efficiencyScore >= 80 && onCompleteMission && (
                <button
                  onClick={() => {
                    onClose();
                    onCompleteMission();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-98 transition-all text-xs"
                >
                  <Check className="h-4.5 w-4.5" /> DEPLOY SYSTEM TO PRODUCTION & COMPLETE MISSION
                </button>
              )}
            </div>
          </div>

          {/* System Performance Profiler Column (Right) */}
          <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-4 font-mono text-xs">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-2 flex justify-between items-center">
              <span>SYSTEM PERFORMANCE & IMPACT</span>
              {executionResult && (
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  executionResult.deliveryStatus === 'ON_TIME'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                }`}>
                  {executionResult.deliveryStatus}
                </span>
              )}
            </h4>

            {executionResult ? (
              <div className="space-y-3">
                {/* Efficiency Score Gauge */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase">SYSTEM EFFICIENCY RATING</span>
                  <div className={`text-3xl font-extrabold ${executionResult.efficiencyScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {executionResult.efficiencyScore}%
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${executionResult.efficiencyScore >= 80 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      style={{ width: `${executionResult.efficiencyScore}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Throughput</span>
                    <span className="font-bold text-cyan-300 text-sm">{executionResult.throughputItemsPerMin.toLocaleString()} / min</span>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Worker Congestion</span>
                    <span className={`font-bold text-sm ${executionResult.workerCongestionPct > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {executionResult.workerCongestionPct}%
                    </span>
                  </div>
                </div>

                {/* Underlying Concept Unlocked Callout */}
                <div className="rounded-lg bg-cyan-950/40 p-3 border border-cyan-500/30 space-y-1 text-[11px]">
                  <span className="text-[10px] text-cyan-400 font-bold block uppercase flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> UNDERLYING SYSTEM CONCEPT
                  </span>
                  <p className="text-white font-semibold">{executionResult.underlyingConceptDiscovered}</p>
                </div>

                {/* 3D Physical Execution Frame Trace */}
                <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800 max-h-36 overflow-y-auto space-y-1 text-[10px]">
                  <span className="text-slate-500 font-bold text-[9px] uppercase block border-b border-slate-800 pb-1">
                    LIVE PHYSICAL SIMULATION LOG
                  </span>
                  {executionResult.frames.slice(-4).map((f, i) => (
                    <div key={i} className="text-slate-300 leading-tight">
                      • {f.message}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-slate-500">
                Select a System Operational Strategy and click "SIMULATE STRATEGY" to observe physical consequences.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

