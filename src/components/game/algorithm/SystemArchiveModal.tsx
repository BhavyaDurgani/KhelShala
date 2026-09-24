import React, { useState } from 'react';
import { BookOpen, Search, ArrowUpDown, Flame, MapPin, Key, X, CheckCircle, ExternalLink } from 'lucide-react';
import { SYSTEM_CONCEPTS_CATALOG } from '../../../data/algorithm/systemConcepts';
import type { DiscoveredConcept } from '../../../types/algorithm';

interface Props {
  unlockedConceptIds: string[];
  onClose: () => void;
}

export const SystemArchiveModal: React.FC<Props> = ({ unlockedConceptIds, onClose }) => {
  const [selectedConcept, setSelectedConcept] = useState<DiscoveredConcept>(SYSTEM_CONCEPTS_CATALOG[0]);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search': return <Search className="h-5 w-5 text-cyan-400" />;
      case 'ArrowUpDown': return <ArrowUpDown className="h-5 w-5 text-emerald-400" />;
      case 'Flame': return <Flame className="h-5 w-5 text-rose-400" />;
      case 'MapPin': return <MapPin className="h-5 w-5 text-amber-400" />;
      case 'Key': return <Key className="h-5 w-5 text-purple-400" />;
      default: return <BookOpen className="h-5 w-5 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl rounded-2xl border border-cyan-500/40 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-500/10">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/20 p-2.5 text-cyan-400 border border-cyan-500/40">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <span className="rounded bg-cyan-950 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30 font-mono">
                CITY SYSTEM ARCHIVE & KNOWLEDGE VAULT
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">Discovered Systems & Underlying DSA Concepts</h3>
            </div>
          </div>

          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Concept List Sidebar (Left) */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
              SYSTEM CONCEPTS CATALOG
            </span>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {SYSTEM_CONCEPTS_CATALOG.map((concept) => {
                const isUnlocked = unlockedConceptIds.includes(concept.id) || unlockedConceptIds.includes('all') || concept.id === 'concept_binary_search' || concept.id === 'concept_merge_sort';
                const isSelected = concept.id === selectedConcept.id;

                return (
                  <div
                    key={concept.id}
                    onClick={() => setSelectedConcept(concept)}
                    className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-slate-900 shadow-md shadow-cyan-500/10'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                          {renderIcon(concept.iconName)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-xs">{concept.title}</h4>
                          <span className="text-[10px] font-mono text-cyan-300">{concept.dsaTerm}</span>
                        </div>
                      </div>

                      {isUnlocked ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] font-bold text-slate-600 font-mono">LOCKED</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Concept Display (Right) */}
          <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-950/90 p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30 font-mono">
                  {selectedConcept.dsaTerm}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedConcept.title}</h3>
                <span className="text-[11px] text-slate-400">First Discovered in: <strong className="text-cyan-300">{selectedConcept.unlockedAt}</strong></span>
              </div>
            </div>

            {/* Concept Description */}
            <div className="space-y-3 font-mono text-xs">
              <div className="rounded-lg bg-slate-900 p-3.5 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">SYSTEM BEHAVIOR & MECHANIC</span>
                <p className="text-slate-200 leading-relaxed">{selectedConcept.description}</p>
              </div>

              <div className="rounded-lg bg-slate-900 p-3.5 border border-slate-800 space-y-1">
                <span className="text-[10px] text-cyan-400 block uppercase font-bold flex items-center gap-1">
                  <ExternalLink className="h-3.5 w-3.5" /> REAL-WORLD INFRASTRUCTURE USAGE
                </span>
                <p className="text-slate-300 leading-relaxed">{selectedConcept.realWorldExample}</p>
              </div>

              {/* Visual Simulation Display Box */}
              <div className="rounded-xl border border-cyan-500/30 bg-slate-900/60 p-4 text-center space-y-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  VISUAL PERFORMANCE CURVE
                </span>
                <div className="flex items-center justify-center gap-4 text-[11px] pt-2">
                  <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Input Load (N)</span>
                    <strong className="text-white">1,000,000 Items</strong>
                  </div>
                  <div className="text-cyan-400 font-bold">→</div>
                  <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Operations Required</span>
                    <strong className="text-emerald-400 font-mono">
                      {selectedConcept.dsaTerm.includes('O(log N)') ? '20 Steps' : selectedConcept.dsaTerm.includes('O(1)') ? '1 Step' : '1,000,000 Steps'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
