import React, { useState } from 'react';
import { Terminal, Play, X, Code, AlertTriangle } from 'lucide-react';
import type { CyberScriptResult } from '../../../engine/cyber/cyberRunner';
import { CYBER_CODE_TEMPLATES } from '../../../data/cyber/cyberCodeTemplates';

interface Props {
  userCode: string;
  setUserCode: (code: string) => void;
  onRunScript: () => void;
  executionResult: CyberScriptResult | null;
  onClose: () => void;
}

export const CyberTerminalModal: React.FC<Props> = ({
  userCode,
  setUserCode,
  onRunScript,
  executionResult,
  onClose,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(CYBER_CODE_TEMPLATES[0].id);

  const handleSelectTemplate = (id: string) => {
    const tmpl = CYBER_CODE_TEMPLATES.find(t => t.id === id);
    if (tmpl) {
      setSelectedTemplateId(id);
      setUserCode(tmpl.starterCode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl rounded-2xl border border-rose-500/50 bg-slate-900/95 p-6 shadow-2xl shadow-rose-500/20">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-rose-500/20 p-2.5 text-rose-400 border border-rose-500/40">
              <Terminal className="h-6 w-6" />
            </div>
            <div>
              <span className="rounded bg-rose-950 px-2.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/30 font-mono">
                CYBER SECURITY CODE TERMINAL #01
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">Real-Time Threat Mitigation Engine</h3>
            </div>
          </div>

          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Code Editor Column */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Code className="h-4 w-4" /> CYBER SCRIPT EDITOR
                </span>
                {(() => {
                  if (executionResult?.error) {
                    return (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-red-950 text-red-400 border-red-500/40">
                        EXECUTION ERROR
                      </span>
                    );
                  }
                  return (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-emerald-950 text-emerald-400 border-emerald-500/40">
                      {executionResult?.detectedRuleType || 'READY FOR REAL-TIME CODE'}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Template Buttons */}
            <div className="flex gap-2">
              {CYBER_CODE_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTemplate(t.id)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold border transition-colors ${
                    selectedTemplateId === t.id
                      ? 'bg-rose-500 text-slate-950 border-rose-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {t.title}
                </button>
              ))}
            </div>

            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              rows={12}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-rose-300 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
              placeholder="// Write cyber defense script here..."
            />

            <button
              onClick={onRunScript}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 py-3 font-bold text-slate-950 shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all text-xs"
            >
              <Play className="h-4 w-4 fill-current" /> EXECUTE LIVE DEFENSE SCRIPT IN REAL TIME
            </button>
          </div>

          {/* Profiler & Packet Telemetry Column */}
          <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-4 font-mono text-xs">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-2 flex justify-between items-center">
              <span>REAL-TIME THREAT TELEMETRY</span>
              {executionResult && (
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${executionResult.error ? 'bg-red-950 text-red-400 border border-red-500/40' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'}`}>
                  {executionResult.error ? 'ERROR' : 'SIMULATED'}
                </span>
              )}
            </h4>

            {executionResult ? (
              <div className="space-y-3">
                {executionResult.error ? (
                  <div className="rounded-xl border border-red-500/50 bg-red-950/40 p-3.5 space-y-2 text-red-200">
                    <div className="font-bold text-red-400 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> CODE EXECUTION FAILED
                    </div>
                    <div className="font-mono text-[11px] text-red-300 bg-red-950/80 p-2.5 rounded-lg border border-red-500/30 overflow-x-auto whitespace-pre-wrap">
                      {executionResult.error}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Threats Neutered</span>
                        <span className="font-bold text-emerald-400 text-sm">
                          {executionResult.threatsBlocked} / 5 ({executionResult.riskReductionPct}%)
                        </span>
                      </div>
                      <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">False Positives</span>
                        <span className={`font-bold text-sm ${executionResult.falsePositives > 0 ? 'text-amber-400' : 'text-cyan-400'}`}>
                          {executionResult.falsePositives} Packets
                        </span>
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-900 p-3 border border-slate-800 space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Packets Processed:</span>
                        <span className="text-white font-bold">{executionResult.totalPacketsProcessed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Execution Latency:</span>
                        <span className="text-cyan-300 font-bold">{executionResult.executionTimeMs} ms</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Packet Trace Feed */}
                <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800 max-h-44 overflow-y-auto space-y-1.5 text-[10px]">
                  <span className="text-slate-500 font-bold text-[9px] uppercase block border-b border-slate-800 pb-1">
                    REAL-TIME PACKET TRACE STREAM
                  </span>
                  {executionResult.frames.map((f, i) => (
                    <div
                      key={i}
                      className={`leading-tight flex items-start gap-1.5 ${
                        f.message.includes('ERROR') ? 'text-red-400 font-bold' :
                        f.message.includes('BLOCKED THREAT') ? 'text-emerald-400 font-semibold' :
                        f.message.includes('FALSE POSITIVE') ? 'text-amber-300' :
                        f.message.includes('BREACH MISSED') ? 'text-rose-400 font-bold' :
                        'text-slate-400'
                      }`}
                    >
                      <span>•</span>
                      <span>{f.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-slate-500">
                Click "EXECUTE LIVE DEFENSE SCRIPT" to test real-time code execution against attack vectors.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
