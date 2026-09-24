import React, { useState } from 'react';
import { Shield, Skull, Zap, UserCheck, CheckCircle2, ArrowRight, Bot } from 'lucide-react';
import type { CharacterOperative, GameRole } from '../../../types/cyber';
import { DEFENDER_OPERATIVES, ATTACKER_PERSONAS } from '../../../data/cyber/characters';

interface Props {
  role: GameRole;
  setRole: (role: GameRole) => void;
  selectedOperative: CharacterOperative;
  onSelect: (character: CharacterOperative) => void;
  onConfirm: () => void;
}

export const CharacterSelectModal: React.FC<Props> = ({
  role,
  setRole,
  selectedOperative,
  onSelect,
  onConfirm,
}) => {
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Role Choice, Step 2: Operative Choice

  const roster = role === 'DEFENDER' ? DEFENDER_OPERATIVES : ATTACKER_PERSONAS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-lg p-4 select-none">
      <div className="w-full max-w-5xl rounded-3xl border border-cyan-500/40 bg-slate-900/95 p-8 shadow-2xl shadow-cyan-500/10">
        
        {/* Step Indicator Header */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="rounded-full bg-cyan-950 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/30">
              PRE-GAME TACTICAL SETUP • STEP {step} OF 2
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              {step === 1 ? 'CHOOSE YOUR PLAYING ROLE' : `SELECT YOUR ${role === 'DEFENDER' ? 'DEFENDER OPERATIVE' : 'ATTACKER PERSONA'}`}
            </h2>
          </div>

          <div className="flex gap-2 text-xs font-bold font-mono">
            <span className={`px-3 py-1.5 rounded-lg border ${step === 1 ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
              1. ROLE
            </span>
            <span className={`px-3 py-1.5 rounded-lg border ${step === 2 ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
              2. OPERATIVE
            </span>
          </div>
        </div>

        {/* STEP 1: PRE-GAME ROLE SELECTION */}
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-sm text-slate-300">
              Select your strategic role before the match begins. Choosing a role automatically configures the **Adaptive AI** as your real-time opponent.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* DEFENDER CARD */}
              <div
                onClick={() => {
                  setRole('DEFENDER');
                  onSelect(DEFENDER_OPERATIVES[0]);
                }}
                className={`group cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
                  role === 'DEFENDER'
                    ? 'border-cyan-400 bg-gradient-to-b from-cyan-950/60 to-slate-900 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-400/50 scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-cyan-500/20 p-3 text-cyan-400 border border-cyan-500/30">
                    <Shield className="h-8 w-8" />
                  </div>
                  <span className="rounded-full bg-rose-950/80 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/30 flex items-center gap-1">
                    <Bot className="h-3.5 w-3.5" /> OPPONENT: AI ATTACKER
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                  PLAY AS DEFENDER
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Protect organizational infrastructure under a fixed security budget. Deploy 16+ controls (Firewalls, MFA, EDR, Backups), manage risk ($), and execute Incident Response against an adaptive AI attacker.
                </p>

                <div className="mt-4 rounded-xl bg-slate-950/80 p-3 text-xs text-cyan-300 font-mono border border-slate-800">
                  ✔ Objective: Minimize Risk & Maintain CIA Equilibrium
                </div>
              </div>

              {/* ATTACKER CARD */}
              <div
                onClick={() => {
                  setRole('ATTACKER');
                  onSelect(ATTACKER_PERSONAS[0]);
                }}
                className={`group cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
                  role === 'ATTACKER'
                    ? 'border-rose-500 bg-gradient-to-b from-rose-950/60 to-slate-900 shadow-xl shadow-rose-500/20 ring-2 ring-rose-500/50 scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-rose-500/20 p-3 text-rose-500 border border-rose-500/30">
                    <Skull className="h-8 w-8" />
                  </div>
                  <span className="rounded-full bg-cyan-950/80 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                    <Bot className="h-3.5 w-3.5" /> OPPONENT: AI DEFENDER
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-extrabold text-white group-hover:text-rose-400 transition-colors">
                  PLAY AS ATTACKER
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Infiltrate target networks by navigating interactive attack kill-chains (Recon → Initial Access → PrivEsc → Exfiltration). Outsmart a real-time AI Defender that deploys counter-firewalls and host isolation.
                </p>

                <div className="mt-4 rounded-xl bg-slate-950/80 p-3 text-xs text-rose-300 font-mono border border-slate-800">
                  ✔ Objective: Breach Target Objective Node & Exfiltrate
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
              >
                NEXT: CHOOSE OPERATIVE <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: OPERATIVE SELECTION */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300">
                Playing as <span className="font-bold text-white uppercase">{role}</span> (Opponent: <span className="font-bold text-cyan-400">{role === 'DEFENDER' ? 'AI Attacker' : 'AI Defender'}</span>). Select your operative avatar:
              </p>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                ← Change Role Selection
              </button>
            </div>

            {/* Character Cards Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {roster.map(char => {
                const isSelected = selectedOperative.id === char.id;
                return (
                  <div
                    key={char.id}
                    onClick={() => onSelect(char)}
                    className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                      isSelected
                        ? 'border-cyan-400 bg-slate-800/90 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400/50'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute right-3 top-3 rounded-full bg-cyan-500 p-1 text-slate-950">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <img
                        src={char.avatar}
                        alt={char.name}
                        className="h-16 w-16 rounded-full object-cover border-2 border-cyan-500/40 shadow-md"
                      />
                      <div>
                        <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors text-sm">{char.name}</h3>
                        <p className="text-[11px] text-cyan-400/90 font-medium">{char.title}</p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-400 line-clamp-2">{char.bio}</p>

                    <div className="mt-4 space-y-2 rounded-xl bg-slate-950/70 p-3 text-xs border border-slate-800/80">
                      <div>
                        <span className="font-semibold text-cyan-300 flex items-center gap-1">
                          <UserCheck className="h-3.5 w-3.5" /> Perk: {char.passivePerkName}
                        </span>
                        <p className="text-slate-400 mt-0.5 text-[11px]">{char.passivePerkDesc}</p>
                      </div>
                      <div className="pt-1 border-t border-slate-800">
                        <span className="font-semibold text-emerald-400 flex items-center gap-1">
                          <Zap className="h-3.5 w-3.5" /> Ability: {char.tacticalAbilityName}
                        </span>
                        <p className="text-slate-400 mt-0.5 text-[11px]">{char.tacticalAbilityDesc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                onClick={() => setStep(1)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 font-bold text-slate-300 hover:bg-slate-700 transition-colors text-xs"
              >
                Back to Role Selection
              </button>
              <button
                onClick={onConfirm}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
              >
                CONFIRM & LAUNCH GAME <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
