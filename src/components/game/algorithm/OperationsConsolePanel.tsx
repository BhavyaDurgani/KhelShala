import React from 'react';
import { Sliders, Play, Cpu, Zap, CheckCircle, Check, XCircle } from 'lucide-react';
import type { WarehouseMission, SystemStrategyChoice, ExecutionResult } from '../../../types/algorithm';

interface Props {
  mission: WarehouseMission;
  activeStrategy: SystemStrategyChoice;
  onSelectStrategy: (strategy: SystemStrategyChoice) => void;
  onRunSimulation: () => void;
  onRunScaleBenchmark: (size: number) => void;
  executionResult: ExecutionResult | null;
  onCompleteMission?: () => void;
}

export const OperationsConsolePanel: React.FC<Props> = ({
  mission,
  activeStrategy,
  onSelectStrategy,
  onRunSimulation,
  onRunScaleBenchmark,
  executionResult,
  onCompleteMission,
}) => {
  const isEvaluated = executionResult !== null && executionResult.algorithmName === activeStrategy.name;
  const isCorrect = isEvaluated && executionResult.efficiencyScore >= 80;

  return (
    <div className="w-full rounded-2xl border border-cyan-500/40 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-500/10">
      {/* Console Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-500/20 p-2 text-cyan-400 border border-cyan-500/40">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30 font-mono">
              SYSTEM INFRASTRUCTURE CONSOLE
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">{mission.title}</h3>
          </div>
        </div>

        <div className="text-right font-mono text-xs text-slate-400">
          <span>Target Cargo Crate: </span>
          <strong className="text-cyan-300">#{mission.targetPackageId}</strong>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* System Performance & Telemetry Profiler Column (Left - 5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 font-mono text-xs">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-2 flex justify-between items-center">
            <span>SYSTEM EVALUATION & IMPACT</span>
            {isEvaluated && executionResult && (
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                isCorrect
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-950 text-rose-400 border border-rose-500/30'
              }`}>
                {isCorrect ? 'PASS: ON TIME' : 'FAIL: BOTTLENECK'}
              </span>
            )}
          </h4>

          {isEvaluated && executionResult ? (
            <div className="space-y-3">
              {/* Submission Evaluation Banner (RIGHT vs WRONG) */}
              <div className={`rounded-xl border p-3.5 space-y-1.5 text-center ${
                isCorrect
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                  : 'border-rose-500/40 bg-rose-950/40 text-rose-300'
              }`}>
                <div className="flex items-center justify-center gap-2 font-bold text-sm">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <span>CORRECT STRATEGY! SYSTEM OPTIMIZED</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-rose-400" />
                      <span>SUB-OPTIMAL STRATEGY! BOTTLENECK DETECTED</span>
                    </>
                  )}
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {isCorrect
                    ? 'Excellent choice! Your system strategy restored 100% throughput and prevented delivery truck delays.'
                    : `This strategy resulted in an efficiency rating of only ${executionResult.efficiencyScore}%. Throughput is bottlenecked at ${executionResult.throughputItemsPerMin.toLocaleString()} items/min. Try another strategy!`}
                </p>
              </div>

              {/* Efficiency Score Gauge */}
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-center space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">EVALUATED SYSTEM EFFICIENCY</span>
                <div className={`text-2xl font-extrabold ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {executionResult.efficiencyScore}%
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${isCorrect ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    style={{ width: `${executionResult.efficiencyScore}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Throughput</span>
                  <span className="font-bold text-cyan-300 text-xs">{executionResult.throughputItemsPerMin.toLocaleString()} / min</span>
                </div>
                <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Worker Congestion</span>
                  <span className={`font-bold text-xs ${executionResult.workerCongestionPct > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {executionResult.workerCongestionPct}%
                  </span>
                </div>
              </div>

              {/* Revealed Concept Callout */}
              <div className="rounded-lg bg-cyan-950/40 p-2.5 border border-cyan-500/30 space-y-1 text-[11px]">
                <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> REVEALED COMPUTATIONAL CONCEPT
                </span>
                <p className="text-white font-semibold">{executionResult.underlyingConceptDiscovered}</p>
              </div>

              {/* Simulation Trace */}
              <div className="rounded-lg bg-slate-900/60 p-2 border border-slate-800 max-h-28 overflow-y-auto space-y-1 text-[10px]">
                <span className="text-slate-500 font-bold text-[9px] uppercase block border-b border-slate-800 pb-1">
                  PHYSICAL SIMULATION LOG
                </span>
                {executionResult.frames.slice(-3).map((f, i) => (
                  <div key={i} className="text-slate-300 leading-tight">
                    • {f.message}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-slate-400 space-y-2">
              <div className="rounded-full bg-slate-900 p-3 w-12 h-12 mx-auto flex items-center justify-center border border-slate-800 text-cyan-400">
                <Sliders className="h-6 w-6" />
              </div>
              <h5 className="font-bold text-white text-xs">SYSTEM AWAITING SUBMISSION</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Analyze the physical descriptions and trade-off metrics on the right, select a strategy, and click <strong>"SUBMIT STRATEGY & EVALUATE IN 3D"</strong> to test whether your solution passes or fails!
              </p>
            </div>
          )}
        </div>

        {/* Strategy Selection Column (Right - 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Zap className="h-4 w-4" /> SELECT SYSTEM OPERATIONAL STRATEGY
            </span>
            <span className="text-[10px] text-slate-500">Analyze trade-offs & submit to test in 3D</span>
          </div>

          {/* Strategy Options Cards */}
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {mission.strategies.map((strat) => {
              const isSelected = strat.id === activeStrategy.id;
              const hasBeenEvaluated = isEvaluated && isSelected;

              return (
                <div
                  key={strat.id}
                  onClick={() => onSelectStrategy(strat)}
                  className={`cursor-pointer rounded-xl border p-3.5 transition-all duration-200 ${
                    isSelected
                      ? 'border-cyan-400 bg-slate-900/90 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{strat.name}</h4>
                        {/* Reveal badge ONLY after submission evaluation */}
                        {hasBeenEvaluated && executionResult && (
                          <span className={`rounded px-2 py-0.5 text-[9px] font-bold border ${
                            isCorrect
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-950 text-rose-400 border-rose-500/30'
                          }`}>
                            {isCorrect ? 'OPTIMAL MATCH' : 'SUB-OPTIMAL'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{strat.description}</p>
                    </div>

                    {/* Reveal Big-O complexity ONLY after submission evaluation */}
                    {hasBeenEvaluated && executionResult ? (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-950 text-amber-400 border-amber-500/30'
                      }`}>
                        {strat.complexity}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono border border-slate-800 bg-slate-950 text-slate-500 shrink-0">
                        UNTESTED
                      </span>
                    )}
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

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex gap-3">
              <button
                onClick={onRunSimulation}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-98 transition-all text-xs"
              >
                <Play className="h-4 w-4 fill-current" /> SUBMIT STRATEGY & EVALUATE IN 3D
              </button>
              <button
                onClick={() => onRunScaleBenchmark(1000000)}
                className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/60 px-4 py-3.5 font-bold text-amber-300 hover:bg-amber-900 transition-colors text-xs"
              >
                <Cpu className="h-4 w-4" /> STRESS TEST SCALE
              </button>
            </div>

            {isCorrect && onCompleteMission && (
              <button
                onClick={onCompleteMission}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-98 transition-all text-xs animate-pulse"
              >
                <Check className="h-4 w-4" /> DEPLOY SYSTEM TO PRODUCTION & COMPLETE MISSION
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

