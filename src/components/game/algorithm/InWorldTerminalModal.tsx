import React from 'react';
import { Terminal, Play, Cpu, X, Code } from 'lucide-react';
import type { ExecutionResult, WarehouseMission } from '../../../types/algorithm';

interface Props {
  mission: WarehouseMission;
  userCode: string;
  setUserCode: (code: string) => void;
  onRunAlgorithm: () => void;
  onRunScaleTest: () => void;
  executionResult: ExecutionResult | null;
  onClose: () => void;
}

export const InWorldTerminalModal: React.FC<Props> = ({
  mission,
  userCode,
  setUserCode,
  onRunAlgorithm,
  onRunScaleTest,
  executionResult,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl rounded-2xl border border-cyan-500/40 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-500/10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/20 p-2.5 text-cyan-400 border border-cyan-500/40">
              <Terminal className="h-6 w-6" />
            </div>
            <div>
              <span className="rounded bg-cyan-950 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30 font-mono">
                CONTROL ROOM TERMINAL #04
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">{mission.title}</h3>
            </div>
          </div>

          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Code Editor Column */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Code className="h-4 w-4" /> ALGORITHM EDITOR
                </span>
                {(() => {
                  if (executionResult?.error) {
                    return (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-red-950 text-red-400 border-red-500/40">
                        EXECUTION ERROR
                      </span>
                    );
                  }
                  const isBinary = executionResult?.timeComplexity === 'O(log N)';
                  return (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isBinary ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' : 'bg-amber-950 text-amber-400 border-amber-500/40'}`}>
                      {isBinary ? 'DETECTED: BINARY SEARCH O(log N)' : 'DETECTED: LINEAR SEARCH O(N)'}
                    </span>
                  );
                })()}
              </div>
              <span>Target: Package #{mission.targetPackageId}</span>
            </div>

            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              rows={12}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-cyan-300 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              placeholder="// Write algorithm code here..."
            />

            <div className="flex gap-3">
              <button
                onClick={onRunAlgorithm}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all text-xs"
              >
                <Play className="h-4 w-4 fill-current" /> RUN & VISUALIZE IN 3D
              </button>
              <button
                onClick={onRunScaleTest}
                className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/60 px-5 py-3 font-bold text-amber-300 hover:bg-amber-900 transition-colors text-xs"
              >
                <Cpu className="h-4 w-4" /> TEST STRESS SCALE (1M)
              </button>
            </div>
          </div>

          {/* Profiler & Output Column */}
          <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-4 font-mono text-xs">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-2 flex justify-between items-center">
              <span>BIG-O PROFILER & EXECUTION LOGS</span>
              {executionResult && (
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${executionResult.error ? 'bg-red-950 text-red-400 border border-red-500/40' : 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'}`}>
                  {executionResult.error ? 'ERROR' : 'READY'}
                </span>
              )}
            </h4>

            {executionResult ? (
              <div className="space-y-3">
                {executionResult.error ? (
                  <div className="rounded-xl border border-red-500/50 bg-red-950/40 p-3.5 space-y-2 text-red-200">
                    <div className="font-bold text-red-400 text-xs flex items-center gap-1.5">
                      ⚠️ CODE EXECUTION FAILED
                    </div>
                    <div className="font-mono text-[11px] text-red-300 bg-red-950/80 p-2.5 rounded-lg border border-red-500/30 overflow-x-auto whitespace-pre-wrap">
                      {executionResult.error}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Time Complexity</span>
                        <span className={`font-bold font-mono text-sm ${executionResult.timeComplexity === 'O(log N)' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {executionResult.timeComplexity}
                        </span>
                      </div>
                      <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Execution Time</span>
                        <span className="font-bold text-cyan-300 text-sm">{executionResult.executionTimeMs} ms</span>
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-900 p-3 border border-slate-800 space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Steps:</span>
                        <span className="text-white font-bold">{executionResult.totalSteps}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Target Index:</span>
                        <span className="text-emerald-400 font-bold">
                          {executionResult.foundIndex >= 0 ? `Index ${executionResult.foundIndex}` : 'NOT FOUND'}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800 max-h-36 overflow-y-auto space-y-1 text-[10px]">
                  {executionResult.frames.slice(-4).map((f, i) => (
                    <div key={i} className={`leading-tight ${f.message.includes('ERROR') ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                      • {f.message}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-slate-500">
                Click "RUN & VISUALIZE IN 3D" to profile algorithm time complexity.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
