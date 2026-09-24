import React, { useEffect } from 'react';
import { Cpu, CheckCircle, Flame, X } from 'lucide-react';
import type { ScaleBenchmarkResult, ComplexityTier } from '../../../types/algorithm';
import { soundEngine } from '../../../engine/common/soundEngine';

interface Props {
  timeComplexity: ComplexityTier;
  selectedInputSize: number;
  scaleResult: ScaleBenchmarkResult | null;
  onRunBenchmark: (size: number) => void;
  onClose: () => void;
}

export const ScaleTestModal: React.FC<Props> = ({
  timeComplexity,
  selectedInputSize,
  scaleResult,
  onRunBenchmark,
  onClose,
}) => {
  useEffect(() => {
    if (scaleResult?.status === 'OVERLOAD') {
      soundEngine.playSystemOverloadAlarm();
    }
  }, [scaleResult]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-amber-500/50 bg-slate-900/95 p-6 shadow-2xl shadow-amber-500/10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/20 p-2.5 text-amber-400 border border-amber-500/40">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <span className="rounded bg-amber-950 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30 font-mono">
                BIG-O SCALABILITY STRESS-TEST BENCHMARK
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Scale Benchmark Engine</h3>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input Size Selectors */}
        <div className="mt-5 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">SELECT WAREHOUSE INPUT LOAD TIER</span>
          <div className="grid grid-cols-4 gap-2">
            {[10, 1000, 100000, 1000000].map(size => (
              <button
                key={size}
                onClick={() => onRunBenchmark(size)}
                className={`rounded-xl p-3 text-center text-xs font-bold font-mono transition-all border ${
                  selectedInputSize === size
                    ? 'border-amber-400 bg-amber-950/80 text-amber-300 shadow-md shadow-amber-500/20'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {size.toLocaleString()} Items
              </button>
            ))}
          </div>
        </div>

        {/* Benchmark Result Alert Box */}
        {scaleResult && (
          <div className={`mt-6 rounded-xl border p-5 transition-all ${
            scaleResult.status === 'OVERLOAD'
              ? 'border-rose-500/60 bg-rose-950/40 animate-pulse'
              : 'border-emerald-500/60 bg-emerald-950/40'
          }`}>
            <div className="flex items-start gap-3">
              {scaleResult.status === 'OVERLOAD' ? (
                <Flame className="h-8 w-8 text-rose-500 shrink-0" />
              ) : (
                <CheckCircle className="h-8 w-8 text-emerald-400 shrink-0" />
              )}
              <div className="space-y-1">
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase font-mono ${
                  scaleResult.status === 'OVERLOAD' ? 'bg-rose-900 text-rose-300' : 'bg-emerald-900 text-emerald-300'
                }`}>
                  {scaleResult.status}
                </span>
                <h4 className="font-bold text-white text-sm">{scaleResult.message}</h4>
                <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-xs pt-2 border-t border-slate-800/60">
                  <div>Complexity: <strong className="text-amber-300">{timeComplexity}</strong></div>
                  <div>Operations: <strong className="text-cyan-300">{scaleResult.stepsCount.toLocaleString()}</strong></div>
                  <div>Time: <strong className="text-emerald-300">{scaleResult.executionTimeMs}ms</strong></div>
                </div>

                <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-amber-500/30 text-[11px] font-mono text-amber-200 space-y-1 font-sans">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                    💡 WHY DID {timeComplexity} PERFORM LIKE THIS AT SCALE?
                  </div>
                  {timeComplexity === 'O(N^2)' ? (
                    <p className="leading-relaxed text-slate-300">
                      The selected strategy relies on <strong>Pairwise Sequential Swaps O(N²)</strong> (Bubble Sort). At <strong className="text-white">1,000,000 items</strong>, quadratic scaling generates <strong>1,000,000,000,000 operations</strong>, freezing conveyor belts! Switch to <strong>Priority Divide-and-Conquer Partitioning O(N log N)</strong> to restore smooth flow.
                    </p>
                  ) : timeComplexity === 'O(N)' ? (
                    <p className="leading-relaxed text-slate-300">
                      The selected strategy uses <strong>Manual Sequential Inspection O(N)</strong> (checking crates one-by-one). Checking 1,000,000 crates takes 8,700 seconds, missing truck departure deadlines! Switch to <strong>Binary Half-Interval Elimination O(log N)</strong> to clear 1,000,000 items in under 20 steps.
                    </p>
                  ) : timeComplexity === 'O(N log N)' ? (
                    <p className="text-emerald-300 leading-relaxed font-sans">
                      🏆 OPTIMAL SORTING ARCHITECTURE DETECTED! Your Divide-and-Conquer Merge/Quick Sort O(N log N) strategy partitions and routes 1,000,000 cargo crates effortlessly with zero conveyor belt jams!
                    </p>
                  ) : (
                    <p className="text-emerald-300 leading-relaxed font-sans">
                      🏆 OPTIMAL SEARCH ARCHITECTURE DETECTED! Your Binary Search O(log N) strategy eliminates half the warehouse at every step, locating crate targets across 1,000,000 items in just 0.02ms!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
