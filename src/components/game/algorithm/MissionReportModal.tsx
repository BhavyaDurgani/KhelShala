import React from 'react';
import { Award, CheckCircle, XCircle, ArrowRight, RefreshCw, BookOpen } from 'lucide-react';
import type { AlgorithmReport } from '../../../types/algorithm';

interface Props {
  report: AlgorithmReport;
  onNextMission: () => void;
  onReplay: () => void;
  hasNextMission?: boolean;
}

export const MissionReportModal: React.FC<Props> = ({
  report,
  onNextMission,
  onReplay,
  hasNextMission = true,
}) => {
  const isPassed = report.efficiencyScore >= 60 && report.xpEarned > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-2xl rounded-2xl border border-emerald-500/50 bg-slate-900/95 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/20 p-2.5 text-emerald-400 border border-emerald-500/40">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <span className={`rounded px-2.5 py-0.5 text-[10px] font-bold border uppercase font-mono ${
                isPassed ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' : 'bg-rose-950 text-rose-400 border-rose-500/30'
              }`}>
                {isPassed ? 'SYSTEM OPTIMIZATION COMPLETE' : 'SYSTEM OPTIMIZATION FAILED'}
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">System Performance Assessment</h3>
            </div>
          </div>
          {isPassed ? (
            <span className="rounded-full bg-emerald-950 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/40 font-mono flex items-center gap-1.5 shadow-md">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              🎉 +{report.xpEarned} XP REWARDED
            </span>
          ) : (
            <span className="rounded-full bg-rose-950 px-3.5 py-1 text-xs font-bold text-rose-400 border border-rose-500/40 font-mono flex items-center gap-1.5 shadow-md">
              <XCircle className="h-3.5 w-3.5 text-rose-400" />
              ❌ LEVEL FAILED — 0 XP REWARDED
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-4 font-mono text-xs">
          {/* Efficiency & Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Efficiency Rating</span>
              <span className="text-xl font-extrabold text-emerald-400">{report.efficiencyScore}%</span>
            </div>
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Time Improvement</span>
              <span className="text-xl font-bold text-cyan-300">0.02s</span>
              <span className="text-[9px] text-slate-500 block">Was: 8.70s</span>
            </div>
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Items Scaled</span>
              <span className="text-xl font-bold text-white">1,000,000</span>
            </div>
          </div>

          {/* Concept Discovered Banner */}
          {report.conceptDiscovered && (
            <div className="rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/90 via-slate-900 to-slate-900 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" /> CONCEPT DISCOVERED
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {report.conceptDiscovered.dsaTerm}
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">{report.conceptDiscovered.title}</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                {report.conceptDiscovered.description}
              </p>
            </div>
          )}

          {/* Recommendations / System Notes */}
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">SYSTEM ARCHITECT NOTES</span>
            {report.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2 text-slate-300 text-xs font-sans">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onReplay}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-bold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> Re-Simulate
            </button>
            {hasNextMission ? (
              <button
                onClick={onNextMission}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <span>NEXT INFRASTRUCTURE MISSION</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                disabled
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 py-3 font-bold text-slate-500 cursor-not-allowed uppercase"
              >
                <span>🔒 NEXT LEVEL COMING SOON</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
