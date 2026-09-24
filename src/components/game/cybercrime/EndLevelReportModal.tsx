import React from 'react';
import { Award, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import type { SecurityReport } from '../../../types/cyber';

interface Props {
  report: SecurityReport;
  onNextLevel: () => void;
  onReplay: () => void;
  hasNextLevel?: boolean;
}

export const EndLevelReportModal: React.FC<Props> = ({
  report,
  onNextLevel,
  onReplay,
  hasNextLevel = true
}) => {
  const isPassed = report.rating !== 'F' && report.finalScore >= 500;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-4xl rounded-2xl border border-cyan-500/40 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-500/10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/20 p-2.5 text-cyan-400 border border-cyan-500/40">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">SECURITY ASSESSMENT REPORT</h2>
              <p className="text-xs text-slate-400">Post-Level Security Evaluation & CIA Radar Metrics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">FINAL SCORE RATING</span>
              <span className={`text-4xl font-extrabold font-mono ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>{report.rating}</span>
            </div>
          </div>
        </div>

        {/* Pass / Fail XP Result Banner */}
        {isPassed ? (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono text-center flex items-center justify-center gap-2 shadow-lg animate-fadeIn">
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>🎉 LEVEL PASSED! SECURITY AUDIT CLEARED — +250 XP REWARDED</span>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-bold font-mono text-center flex items-center justify-center gap-2 shadow-lg animate-fadeIn">
            <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>❌ LEVEL FAILED! Security Rating {report.rating} (Score {report.finalScore}) — 0 XP REWARDED</span>
          </div>
        )}

        {/* Score & CIA Breakdown */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <span className="text-xs font-semibold text-slate-400 block">Overall Score</span>
            <span className="text-2xl font-bold text-white font-mono">{report.finalScore} / 1000</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <span className="text-xs font-semibold text-cyan-400 block">Confidentiality</span>
            <span className="text-2xl font-bold text-cyan-300 font-mono">{report.confidentialityScore}%</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <span className="text-xs font-semibold text-emerald-400 block">Integrity</span>
            <span className="text-2xl font-bold text-emerald-300 font-mono">{report.integrityScore}%</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <span className="text-xs font-semibold text-amber-400 block">Availability</span>
            <span className="text-2xl font-bold text-amber-300 font-mono">{report.availabilityScore}%</span>
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/80 p-4">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">STRATEGIC SECOPS RECOMMENDATIONS</h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex justify-between border-t border-slate-800 pt-4">
          <button
            onClick={onReplay}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 font-bold text-white hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" /> Replay Scenario
          </button>
          
          {hasNextLevel ? (
            <button
              onClick={onNextLevel}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
            >
              Next Environment Level <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-6 py-2.5 font-bold text-slate-500 cursor-not-allowed font-mono text-xs uppercase"
            >
              <span>🔒 NEXT LEVEL COMING SOON</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
